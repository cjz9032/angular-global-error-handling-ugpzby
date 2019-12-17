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
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
	selector: 'vtr-page-networkboost',
	templateUrl: './page-networkboost.component.html',
	styleUrls: [ './page-networkboost.component.scss' ]
})
export class PageNetworkboostComponent implements OnInit {
	public showTurnOnModal = false;
	public showAppsModal = false;
	changeListNum = 0;
	appsCount = 0;
	toggleStatus: boolean = this.commonService.getLocalStorageValue(LocalStorageKey.NetworkBoostStatus) || false;
	needToAsk: any;
	autoCloseStatusObj: any = {};
	needToAskStatusObj: any = {};
	isOnline = true;
	// CMS Content block
	cardContentPositionC: any = {};
	cardContentPositionF: any = {};
	dynamic_metricsItem: any = 'networkboost_cms_inner_content';
	backId = 'vtr-gaming-networkboost-btn-back';

	constructor(
		private cmsService: CMSService,
		private networkBoostService: NetworkBoostService,
		private commonService: CommonService,
		private upeService: UPEService,
		private loggerService: LoggerService,
		private hypService: HypothesisService,
		private translate: TranslateService,
		public deviceService: DeviceService
	) {
		this.fetchCMSArticles();
		// VAN-5872, server switch feature on language change
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.fetchCMSArticles();
		});
		this.isOnline = this.commonService.isOnline;
	}

	ngOnInit() {
		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
		// AutoClose Init
		// this.toggleStatus = this.commonService.getLocalStorageValue();
		this.getNetworkBoostStatus();
		const queryOptions = {
			Page: 'network-boost'
		};

		this.cmsService.fetchCMSContent(queryOptions).subscribe((response: any) => {
			const cardContentPositionF = this.cmsService.getOneCMSContent(
				response,
				'half-width-top-image-title-link',
				'position-F'
			)[0];
			if (cardContentPositionF) {
				this.cardContentPositionF = cardContentPositionF;
			}

			const cardContentPositionC = this.cmsService.getOneCMSContent(
				response,
				'half-width-title-description-link-image',
				'position-C'
			)[0];
			if (cardContentPositionC) {
				this.cardContentPositionC = cardContentPositionC;
				if (this.cardContentPositionC.BrandName) {
					this.cardContentPositionC.BrandName = this.cardContentPositionC.BrandName.split('|')[0];
				}
			}
		});
	}
	async openTargetModal() {
		try {
			this.needToAsk = this.networkBoostService.getNeedToAsk();
			this.needToAsk = this.needToAsk === undefined || isNaN(this.needToAsk) ? 0 : this.needToAsk;
			console.log('NEED TO ASK FROM LOCAL =>', this.needToAsk, this.needToAsk === 1, this.needToAsk === 2);
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
			(notification.type === NetworkStatus.Offline || notification.type === NetworkStatus.Online)
		) {
			this.isOnline = notification.payload.isOnline;
			this.fetchCMSArticles();
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
			await this.networkBoostService.setNetworkBoostStatus(event.switchValue);
			if (!this.toggleStatus) {
				if (this.commonService.getLocalStorageValue(LocalStorageKey.NetworkBoosNeedToAskPopup) === 2) {
					this.commonService.setLocalStorageValue(LocalStorageKey.NetworkBoosNeedToAskPopup, 1);
				}
			}
			this.commonService.setLocalStorageValue(LocalStorageKey.NetworkBoostStatus, this.toggleStatus);
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
			this.commonService.setLocalStorageValue(LocalStorageKey.NetworkBoostStatus, this.toggleStatus);
		} catch (err) {
			console.log(`ERROR in setNetworkBoostStatus()`, err);
		}
	}

	hiddenScroll(action: boolean) {
		if (action) {
			(document.getElementsByClassName('vtr-app')[0] as HTMLElement).style.overflow = 'hidden';
		} else {
			(document.getElementsByClassName('vtr-app')[0] as HTMLElement).style.overflow = '';
		}
	}

	// Get the CMS content for the container card
	fetchCMSArticles() {
		this.isOnline = this.commonService.isOnline;
		const queryOptions = {
			Page: 'dashboard',
			Lang: 'en',
			GEO: 'US',
			OEM: 'Lenovo',
			OS: 'Windows',
			Brand: 'idea'
		};
		this.cmsService.fetchCMSContent(queryOptions).subscribe((response: any) => {
			const cardContentPositionF = this.cmsService.getOneCMSContent(
				response,
				'half-width-top-image-title-link',
				'position-F'
			)[0];
			if (cardContentPositionF) {
				this.cardContentPositionF = cardContentPositionF;
			}

			const cardContentPositionC = this.cmsService.getOneCMSContent(
				response,
				'half-width-title-description-link-image',
				'position-C'
			)[0];
			if (cardContentPositionC) {
				this.cardContentPositionC = cardContentPositionC;
				if (this.cardContentPositionC.BrandName) {
					this.cardContentPositionC.BrandName = this.cardContentPositionC.BrandName.split('|')[0];
				}
			}
		});

		if (!this.isOnline) {
			this.cardContentPositionF = {
				FeatureImage: './../../../../assets/cms-cache/content-card-4x4-support.jpg'
			};

			this.cardContentPositionC = {
				FeatureImage: './../../../../assets/cms-cache/Security4x3-zone2.jpg'
			};
		}
	}
}
