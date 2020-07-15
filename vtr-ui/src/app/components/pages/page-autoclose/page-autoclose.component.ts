import { GamingAutoCloseService } from './../../../services/gaming/gaming-autoclose/gaming-autoclose.service';
import { Component, OnInit } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { isUndefined } from 'util';
import { AutoCloseStatus } from 'src/app/data-models/gaming/autoclose/autoclose-status.model';
import { AutoCloseNeedToAsk } from 'src/app/data-models/gaming/autoclose/autoclose-need-to-ask.model';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
	selector: 'vtr-page-autoclose',
	templateUrl: './page-autoclose.component.html',
	styleUrls: [ './page-autoclose.component.scss' ]
})
export class PageAutocloseComponent implements OnInit {
	public showTurnOnModal = false;
	public showAppsModal = false;
	public autoCloseAppList: any;
	private cmsSubscription: Subscription;

	// Toggle status
	isOnline = true;
	toggleStatus: boolean = this.gamingAutoCloseService.getAutoCloseStatusCache() || false;
	needToAsk: any;
	getNeedStatus: boolean;
	autoCloseStatusObj: AutoCloseStatus = new AutoCloseStatus();
	needToAskStatusObj: AutoCloseNeedToAsk = new AutoCloseNeedToAsk();

	// CMS Content block
	cardContentPositionC: any = {};
	cardContentPositionF: any = {};
	backId = 'vtr-gaming-autoclose-btn-back';
	dynamic_metricsItem: any = 'autoclose_cms_inner_content';

	constructor(
		private cmsService: CMSService,
		private gamingAutoCloseService: GamingAutoCloseService,
		private commonService: CommonService,
		private loggerService: LoggerService,
		private translate: TranslateService,
		public deviceService: DeviceService,
	) {
		this.fetchCMSArticles();
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
			this.fetchCMSArticles();
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
		this.hiddenScroll(true);
		this.showAppsModal = true;
	}

	modalCloseAddApps(action: boolean) {
		this.showAppsModal = action;
		this.hiddenScroll(false);
	}

	hiddenScroll(action: boolean) {
		const selectorVtr = (document.getElementsByClassName('vtr-app')[0] as HTMLElement);
		selectorVtr.style.overflowY = 'auto';
		if (action) {
			selectorVtr.style.overflowY = 'hidden';
			selectorVtr.style.overflowX = 'hidden';
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
					this.loggerService.info('page-autoclose.component.refreshAutoCloseList', 'get Auto close List--->' + appList.processList);
					this.loggerService.info('page-autoclose.component.refreshAutoCloseList', 'Total Auto close List Apps--->' + appList.processList.length);
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
					} else {
						this.loggerService.error('Got failure from JS Bridge while adding apps to AutoClose', addApp);
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
		this.isOnline = this.commonService.isOnline;
		const queryOptions = {
			Page: 'auto-close'
		};
		this.cmsSubscription = this.cmsService.fetchCMSContent(queryOptions).subscribe((response: any) => {
			const cardContentPositionC = this.cmsService.getOneCMSContent(
				response,
				'half-width-title-description-link-image',
				'position-C'
			)[0];
			if (cardContentPositionC) {
				this.cardContentPositionC = cardContentPositionC;
			}
			const cardContentPositionF = this.cmsService.getOneCMSContent(
				response,
				'inner-page-right-side-article-image-background',
				'position-F'
			)[0];
			if (cardContentPositionF) {
				this.cardContentPositionF = cardContentPositionF;
				if (this.cardContentPositionF.BrandName) {
					this.cardContentPositionF.BrandName = this.cardContentPositionF.BrandName.split('|')[0];
				}
			}
		});

		if (!this.isOnline) {
			this.cardContentPositionC = {
				FeatureImage: 'assets/cms-cache/GamingPosC.jpg'
			};

			this.cardContentPositionF = {
				FeatureImage: 'assets/cms-cache/autoclose_offline.jpg'
			};
		}
	}

	async getAutoCloseStatus() {
		try {
			this.needToAsk = this.gamingAutoCloseService.getNeedToAskStatusCache();
			this.toggleStatus = await this.gamingAutoCloseService.getAutoCloseStatus();
			this.gamingAutoCloseService.setAutoCloseStatusCache(this.toggleStatus);
		} catch (err) {
			this.loggerService.error('page-autoclose.component.getAutoCloseStatus', 'ERROR in getAutoCloseStatus()-->' + err);
		}
	}

	ngOnDestroy() {
		if(this.cmsSubscription) this.cmsSubscription.unsubscribe();
	}
}
