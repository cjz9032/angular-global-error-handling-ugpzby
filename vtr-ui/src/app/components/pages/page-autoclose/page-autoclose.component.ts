import { position } from './../page-privacy/common/components/tooltip/tooltip.component';
import { GamingAutoCloseService } from './../../../services/gaming/gaming-autoclose/gaming-autoclose.service';
import { Component, OnInit } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { isUndefined } from 'util';
import { AutoCloseStatus } from 'src/app/data-models/gaming/autoclose/autoclose-status.model';
import { AutoCloseNeedToAsk } from 'src/app/data-models/gaming/autoclose/autoclose-need-to-ask.model';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { UPEService } from 'src/app/services/upe/upe.service';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
	selector: 'vtr-page-autoclose',
	templateUrl: './page-autoclose.component.html',
	styleUrls: [ './page-autoclose.component.scss' ]
})
export class PageAutocloseComponent implements OnInit {
	public showTurnOnModal = false;
	public showAppsModal = false;
	public autoCloseAppList: any;
	// Toggle status
	isOnline = true;
	toggleStatus: boolean = this.gamingAutoCloseService.getAutoCloseStatusCache() || false;
	needToAsk: any;
	getNeedStatus: boolean;
	autoCloseStatusObj: AutoCloseStatus = new AutoCloseStatus();
	needToAskStatusObj: AutoCloseNeedToAsk = new AutoCloseNeedToAsk();

	// CMS Content block
	cardContentPositionB: any = {};
	cardContentPositionF: any = {};
	cardContentPositionBCms: any = {};
	cardContentPositionFCms: any = {};
	dynamic_metricsItem: any = 'autoclose_cms_inner_content';

	upeRequestResult = {
		positionB: true,
		positionF: true
	};

	cmsRequestResult = {
		positionB: true,
		positionF: true
	};

	tileSource = {
		positionB: 'CMS',
		positionF: 'CMS'
	};
	backId = 'vtr-gaming-autoclose-btn-back';

	constructor(
		private cmsService: CMSService,
		private gamingAutoCloseService: GamingAutoCloseService,
		private commonService: CommonService,
		private titleService: Title,
		public dashboardService: DashboardService,
		private upeService: UPEService,
		private loggerService: LoggerService,
		private hypService: HypothesisService,
		private translate: TranslateService,
		public deviceService: DeviceService
	) {
		this.setPreviousContent();
		this.fetchCMSArticles();
		// VAN-5872, server switch feature on language change
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.fetchCMSArticles();
		});
		this.isOnline = this.commonService.isOnline;
	}

	ngOnInit() {
		// AutoClose Init
		this.getAutoCloseStatus();
		this.refreshAutoCloseList();
		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}

	private onNotification(notification: AppNotification) {
		if (
			notification &&
			(notification.type === NetworkStatus.Offline || notification.type === NetworkStatus.Online)
		) {
			this.isOnline = notification.payload.isOnline;
		}
		if (this.isOnline === undefined) {
			this.isOnline = true;
		}
	}

	openTargetModal() {
		try {
			this.needToAsk = this.gamingAutoCloseService.getNeedToAskStatusCache();
			this.needToAsk = this.needToAsk === undefined || isNaN(this.needToAsk) ? false : this.needToAsk;
			this.gamingAutoCloseService.setNeedToAskStatusCache(this.needToAsk);
			this.hiddenScroll(true);
			if (this.toggleStatus || this.needToAsk) {
				this.showAppsModal = true;
			} else {
				this.showTurnOnModal = true;
			}
		} catch (error) {
			return undefined;
		}
	}

	doNotShowAction(status: any) {
		try {
			this.getNeedStatus = status;
			this.gamingAutoCloseService.setNeedToAskStatusCache(this.getNeedStatus);
		} catch (error) {}
	}

	initTurnOnAction() {
		this.needToAsk = this.getNeedStatus;
		this.gamingAutoCloseService.setNeedToAskStatusCache(this.needToAsk);
		this.setAutoCloseStatus(true);
		this.showAppsModal = true;
		this.hiddenScroll(true);
	}

	initNotNowAction(notNowStatus: boolean) {
		this.needToAsk = this.getNeedStatus;
		this.gamingAutoCloseService.setNeedToAskStatusCache(this.needToAsk);
		this.showAppsModal = true;
		this.hiddenScroll(true);
	}

	modalCloseTurnOn(action: boolean) {
		this.showTurnOnModal = action;
		this.hiddenScroll(false);
		this.showAppsModal = true;
	}

	modalCloseAddApps(action: boolean) {
		this.showAppsModal = action;
		this.hiddenScroll(false);
	}

	hiddenScroll(action: boolean) {
		if (action) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}

	toggleAutoClose(event: any) {
		this.setAutoCloseStatus(event.switchValue);
	}

	setAutoCloseStatus(status: boolean) {
		this.gamingAutoCloseService.setAutoCloseStatus(status).then((response: boolean) => {
			if (response) {
				this.gamingAutoCloseService.setAutoCloseStatusCache(status);
				this.toggleStatus = status;
			}
		});
	}

	public refreshAutoCloseList() {
		this.autoCloseAppList = this.gamingAutoCloseService.getAutoCloseListCache();
		try {
			this.gamingAutoCloseService.getAppsAutoCloseList().then((appList: any) => {
				if (!isUndefined(appList.processList)) {
					this.autoCloseAppList = appList.processList;
					this.gamingAutoCloseService.setAutoCloseListCache(appList.processList);
					console.log('get Auto close List', appList.processList);
					console.log('Total Auto close List Apps', appList.processList.length);
				}
			});
		} catch (error) {
			return undefined;
		}
	}

	public addAppDataToList(event: any) {
		if (event.checked) {
			const addApp = event.app;
			try {
				this.gamingAutoCloseService.addAppsAutoCloseList(addApp).then((success: any) => {
					if (success) {
						this.refreshAutoCloseList();
						this.gamingAutoCloseService.setAutoCloseListCache(this.autoCloseAppList);
					}
				});
			} catch (error) {}
		} else {
			const remApp = event.app;
			this.gamingAutoCloseService.delAppsAutoCloseList(remApp).then((response: boolean) => {
				if (response) {
					this.refreshAutoCloseList();
					this.gamingAutoCloseService.setAutoCloseListCache(this.autoCloseAppList);
				}
			});
		}
	}

	async deleteAppFromList(appData: any) {
		try {
			// this.autoCloseAppList.splice(appData.index, 1);
			await this.gamingAutoCloseService.delAppsAutoCloseList(appData.name).then((response: boolean) => {
				if (response) {
					this.refreshAutoCloseList();
					this.gamingAutoCloseService.setAutoCloseListCache(this.autoCloseAppList);
				}
			});
		} catch (err) {}
	}

	// Get the CMS content for the container card
	fetchCMSArticles() {
		this.upeRequestResult = {
			positionB: true,
			positionF: true
		};

		this.cmsRequestResult = {
			positionB: false,
			positionF: false
		};
		this.isOnline = this.commonService.isOnline;
		const queryOptions = {
			Page: 'dashboard'
		};
		this.getTileSource().then(() => {
			this.cmsService.fetchCMSContent(queryOptions).subscribe((response: any) => {
				const cardContentPositionF = this.cmsService.getOneCMSContent(
					response,
					'half-width-top-image-title-link',
					'position-F'
				)[0];
				if (cardContentPositionF) {
					this.cardContentPositionFCms = cardContentPositionF;
					this.cardContentPositionFCms.DataSource = 'cms';
					if (!this.upeRequestResult.positionF || this.tileSource.positionF === 'CMS') {
						this.cardContentPositionF = this.cardContentPositionFCms;
						this.gamingAutoCloseService.cardContentPositionF = this.cardContentPositionFCms;
					}
				}

				const cardContentPositionB = this.cmsService.getOneCMSContent(
					response,
					'half-width-title-description-link-image',
					'position-B'
				)[0];
				if (cardContentPositionB) {
					cardContentPositionB.DataSource = 'cms';
					this.cardContentPositionBCms = cardContentPositionB;
					if (this.cardContentPositionBCms.BrandName) {
						this.cardContentPositionBCms.BrandName = this.cardContentPositionBCms.BrandName.split('|')[0];
					}
					this.cmsRequestResult.positionB = true;
					if (!this.upeRequestResult.positionB || this.tileSource.positionB === 'CMS') {
						this.cardContentPositionB = this.cardContentPositionBCms;
						this.gamingAutoCloseService.cardContentPositionB = this.cardContentPositionBCms;
					}
				}
			});

			if (this.tileSource.positionB === 'UPE') {
				const upeParam = { position: 'position-B' };
				this.upeService.fetchUPEContent(upeParam).subscribe(
					(upeResp) => {
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
							this.cardContentPositionB.DataSource = 'upe';
							this.gamingAutoCloseService.cardContentPositionB = this.cardContentPositionB;
							this.upeRequestResult.positionB = true;
						}
					},
					(err) => {
						this.loggerService.info(`Cause by error: ${err}, position-B load CMS content.`);
						this.upeRequestResult.positionB = false;
						if (this.cmsRequestResult.positionB) {
							this.cardContentPositionB = this.cardContentPositionBCms;
							this.gamingAutoCloseService.cardContentPositionB = this.cardContentPositionBCms;
						}
					}
				);
			}

			if (this.tileSource.positionF === 'UPE') {
				const upeParam = { position: 'position-F' };
				this.upeService.fetchUPEContent(upeParam).subscribe(
					(upeResp) => {
						const cardContentPositionF = this.upeService.getOneUPEContent(
							upeResp,
							'half-width-top-image-title-link',
							'position-F'
						)[0];
						if (cardContentPositionF) {
							this.cardContentPositionF = cardContentPositionF;
							this.cardContentPositionF.DataSource = 'upe';
							this.gamingAutoCloseService.cardContentPositionF = this.cardContentPositionF;
							this.upeRequestResult.positionF = true;
						}
					},
					(err) => {
						this.loggerService.info(`Cause by error: ${err}, position-F load CMS content.`);
						this.upeRequestResult.positionF = false;
						if (this.cmsRequestResult.positionF) {
							this.cardContentPositionF = this.cardContentPositionFCms;
							this.gamingAutoCloseService.cardContentPositionF = this.cardContentPositionFCms;
						}
					}
				);
			}
		});
	}

	private getTileSource() {
		return new Promise((resolve) => {
			this.hypService.getAllSettings().then(
				(hyp: any) => {
					if (hyp) {
						this.tileSource.positionB = hyp.TileBSource === 'UPE' ? 'UPE' : 'CMS';
						this.tileSource.positionF = hyp.TileFSource === 'UPE' ? 'UPE' : 'CMS';
					}
					resolve();
				},
				() => {
					resolve();
					console.log('get tile source failed.');
				}
			);
		});
	}

	private setPreviousContent() {
		this.cardContentPositionF = this.gamingAutoCloseService.cardContentPositionF;
		this.cardContentPositionB = this.gamingAutoCloseService.cardContentPositionB;
	}

	async getAutoCloseStatus() {
		try {
			this.needToAsk = this.gamingAutoCloseService.getNeedToAskStatusCache();
			this.toggleStatus = await this.gamingAutoCloseService.getAutoCloseStatus();
			this.gamingAutoCloseService.setAutoCloseStatusCache(this.toggleStatus);
		} catch (err) {
			console.log(`ERROR in getAutoCloseStatus()`, err);
		}
	}
}
