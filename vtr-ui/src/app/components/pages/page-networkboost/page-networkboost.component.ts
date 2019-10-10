import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { AppNotification } from './../../../data-models/common/app-notification.model';
import { CommonService } from './../../../services/common/common.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { Component, OnInit } from '@angular/core';
import { NetworkBoostService } from 'src/app/services/gaming/gaming-networkboost/networkboost.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { UPEService } from 'src/app/services/upe/upe.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';

@Component({
	selector: 'vtr-page-networkboost',
	templateUrl: './page-networkboost.component.html',
	styleUrls: ['./page-networkboost.component.scss']
})
export class PageNetworkboostComponent implements OnInit {

	public showTurnOnModal = false;
	public showAppsModal = false;
	changeListNum = 0;
	appsCount = 0;
	toggleStatus: boolean =
		this.commonService.getLocalStorageValue(
			LocalStorageKey.NetworkBoostStatus
		) || false;
	needToAsk: any;
	autoCloseStatusObj: any = {};
	needToAskStatusObj: any = {};
	isOnline = true;
	// CMS Content block
	cardContentPositionA: any = {};
	cardContentPositionB: any = {};
	cardContentPositionBCms: any = {};
	private isUPEFailed = false;
	private isCmsLoaded = false;
	backId = 'vtr-gaming-networkboost-btn-back';

	constructor(
		private cmsService: CMSService,
		private networkBoostService: NetworkBoostService,
		private commonService: CommonService,
		private upeService: UPEService, private loggerService: LoggerService,
		private hypService: HypothesisService, private translate: TranslateService
	) {
		this.isUPEFailed = false;  // init UPE request status
		this.isCmsLoaded = false;
		this.setPreviousContent();
		this.fetchCMSArticles();
		// VAN-5872, server switch feature on language change
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.fetchCMSArticles();
		});
		this.isOnline = this.commonService.isOnline;
	}

	ngOnInit() {
		this.commonService.notification.subscribe(
			(notification: AppNotification) => {
				this.onNotification(notification);
			}
		);
		// AutoClose Init
		// this.toggleStatus = this.commonService.getLocalStorageValue();
		this.getNetworkBoostStatus();
	}

	async openTargetModal() {
		try {
			this.needToAsk = this.networkBoostService.getNeedToAsk();
			this.needToAsk =
				this.needToAsk === undefined || isNaN(this.needToAsk)
					? 0
					: this.needToAsk;
			console.log(
				'NEED TO ASK FROM LOCAL =>',
				this.needToAsk,
				this.needToAsk === 1,
				this.needToAsk === 2
			);
			console.log('TOGGLE STATUS =>', this.toggleStatus);
			if (this.toggleStatus) {
				this.showAppsModal = true;
			} else if (this.needToAsk === 1 || this.needToAsk === 2) {
				if (this.needToAsk === 2) {
					this.setNetworkBoostStatus({ switchValue: true });
				}
				this.showAppsModal = true;
			} else {
				this.showTurnOnModal = true;
			}
			this.hiddenScroll(true);
		} catch (error) {
			console.log(`ERROR in openTargetModal() `, error);
		}
	}
	private onNotification(notification: AppNotification) {
		if (
			notification &&
			(notification.type === NetworkStatus.Offline ||
				notification.type === NetworkStatus.Online)
		) {
			this.isOnline = notification.payload.isOnline;
		}
		if (this.isOnline === undefined) {
			this.isOnline = true;
		}
	}

	doNotShowAction(status: boolean) {
		this.needToAsk = status;
	}

	initTurnOnAction(event: any) {
		this.showTurnOnModal = false;
		this.setAksAgain(event.askAgainStatus);
		this.setNetworkBoostStatus({ switchValue: true });
		this.showAppsModal = true;
		this.hiddenScroll(true);
	}

	initNotNowAction(event) {
		this.setAksAgain(event.askAgainStatus);
		this.showTurnOnModal = false;
		this.showAppsModal = true;
		this.changeListNum += 1;
		this.hiddenScroll(true);
	}

	modalCloseTurnOn(action: boolean) {
		this.showTurnOnModal = action;
		if (!this.showTurnOnModal) {
			this.changeListNum += 1;
		}
		this.hiddenScroll(false);
	}

	modalCloseAddApps(action: boolean) {
		this.showAppsModal = action;
		this.hiddenScroll(false);
		if (!this.showAppsModal) {
			this.changeListNum += 1;
		}
	}

	async setNetworkBoostStatus(event: any) {
		try {
			this.toggleStatus = event.switchValue;
			await this.networkBoostService.setNetworkBoostStatus(
				event.switchValue
			);
			if (!this.toggleStatus) {
				if (this.commonService.getLocalStorageValue(LocalStorageKey.NetworkBoosNeedToAskPopup) === 2) {
					this.commonService.setLocalStorageValue(LocalStorageKey.NetworkBoosNeedToAskPopup, 1);
				}
			}
			this.commonService.setLocalStorageValue(
				LocalStorageKey.NetworkBoostStatus,
				this.toggleStatus
			);
		} catch (err) {
			console.log(`ERROR in setNetworkBoostStatus()`, err);
		}
	}

	async setAksAgain(status: boolean) {
		try {
			this.networkBoostService.setNeedToAsk(status);
		} catch (error) {
			console.error(`ERROR in setAksAgain()`, error);
		}
	}

	async getNetworkBoostStatus() {
		try {
			this.toggleStatus = await this.networkBoostService.getNetworkBoostStatus();
			this.commonService.setLocalStorageValue(
				LocalStorageKey.NetworkBoostStatus,
				this.toggleStatus
			);
		} catch (err) {
			console.log(`ERROR in setNetworkBoostStatus()`, err);
		}
	}

	hiddenScroll(action: boolean) {
		if (action) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}

	// Get the CMS content for the container card
	fetchCMSArticles() {
		this.isOnline = this.commonService.isOnline;
		const queryOptions = {
			Page: 'dashboard'
		};
		this.getTileBSource().then((source) => {
			this.cmsService.fetchCMSContent(queryOptions).subscribe((response: any) => {
				const cardContentPositionA = this.cmsService.getOneCMSContent(
					response,
					'half-width-top-image-title-link',
					'position-F'
				)[0];
				if (cardContentPositionA) {
					this.cardContentPositionA = cardContentPositionA;
					this.networkBoostService.cardContentPositionA = this.cardContentPositionA;
				}

				const cardContentPositionB = this.cmsService.getOneCMSContent(
					response,
					'half-width-title-description-link-image',
					'position-B'
				)[0];
				if (cardContentPositionB) {
					if (this.cardContentPositionB.BrandName) {
						this.cardContentPositionB.BrandName = this.cardContentPositionB.BrandName.split(
							'|'
						)[0];
					}
					cardContentPositionB.DataSource = 'cms';

					this.cardContentPositionBCms = cardContentPositionB;
					this.isCmsLoaded = true;
					if (this.isUPEFailed || source === 'CMS') {
						this.cardContentPositionB = this.cardContentPositionBCms;
						this.networkBoostService.cardContentPositionB = this.cardContentPositionBCms;
					}
				}
			});
			if (source === 'UPE') {
				const upeParam = {
					position: 'position-B'
				};
				this.upeService.fetchUPEContent(upeParam).subscribe((upeResp) => {
					const cardContentPositionB = this.upeService.getOneUPEContent(
						upeResp,
						'half-width-title-description-link-image',
						'position-B'
					)[0];
					if (cardContentPositionB) {
						this.cardContentPositionB = cardContentPositionB;
						if (this.cardContentPositionB.BrandName) {
							this.cardContentPositionB.BrandName = this.cardContentPositionB.BrandName.split('|')[0];
						}
						cardContentPositionB.DataSource = 'upe';
						this.networkBoostService.cardContentPositionB = cardContentPositionB;
						this.isUPEFailed = false;
					}
				}, (err) => {
					this.loggerService.info(`Cause by error: ${err}, position-B load CMS content.`);
					this.isUPEFailed = true;
					if (this.isCmsLoaded) {
						this.cardContentPositionB = this.cardContentPositionBCms;
						this.networkBoostService.cardContentPositionB = this.cardContentPositionBCms;
					}
				});
			}
		});
	}

	private getTileBSource() {
		return new Promise((resolve) => {
			this.hypService.getFeatureSetting('TileBSource').then((source) => {
				if (source === 'UPE') {
					resolve('UPE');
				} else {
					resolve('CMS');
				}
			}, () => {
				resolve('CMS');
			});
		});
	}

	private setPreviousContent() {
		this.cardContentPositionA = this.networkBoostService.cardContentPositionA;
		this.cardContentPositionB = this.networkBoostService.cardContentPositionB;
	}

}
