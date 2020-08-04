import { Subscription } from 'rxjs/internal/Subscription';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { AppNotification } from './../../../data-models/common/app-notification.model';
import { CommonService } from './../../../services/common/common.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { NetworkBoostService } from 'src/app/services/gaming/gaming-networkboost/networkboost.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { UPEService } from 'src/app/services/upe/upe.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { GamingQuickSettingToolbarService } from 'src/app/services/gaming/gaming-quick-setting-toolbar/gaming-quick-setting-toolbar.service';
import { EventTypes } from '@lenovo/tan-client-bridge';

@Component({
	selector: 'vtr-page-networkboost',
	templateUrl: './page-networkboost.component.html',
	styleUrls: ['./page-networkboost.component.scss']
})
export class PageNetworkboostComponent implements OnInit, OnDestroy {
	public showTurnOnModal = false;
	public showAppsModal = false;
	public networkBoostEvent:any;
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
	notificationSubscrition: Subscription;
	fetchSubscrition: Subscription;
	fetchCacheSubscrition: Subscription;

	constructor(
		private cmsService: CMSService,
		private networkBoostService: NetworkBoostService,
		private commonService: CommonService,
		// private upeService: UPEService,
		private loggerService: LoggerService,
		// private hypService: HypothesisService,
		// private translate: TranslateService,
		// public deviceService: DeviceService,
		private shellServices: VantageShellService,
		private gamingQuickSettingToolbarService: GamingQuickSettingToolbarService,
		private ngZone: NgZone,
	) {
		this.fetchCMSArticles();
		this.isOnline = this.commonService.isOnline;
	}

	ngOnInit() {
		this.notificationSubscrition = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
		// AutoClose Init
		// this.toggleStatus = this.commonService.getLocalStorageValue();
		this.getNetworkBoostStatus();
		this.networkBoostRegisterEvent();
		const queryOptions = {
			Page: 'network-boost'
		};

		this.fetchCacheSubscrition = this.cmsService.fetchCMSContent(queryOptions).subscribe((response: any) => {
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

	ngOnDestroy() {
		
		if(this.notificationSubscrition) {
			this.notificationSubscrition.unsubscribe();
		}

		if(this.fetchCacheSubscrition) {
			this.fetchCacheSubscrition.unsubscribe();
		}

		if(this.fetchSubscrition) {
			this.fetchSubscrition.unsubscribe();
		}

		this.gamingQuickSettingToolbarService.unregisterEvent('NetworkBoost');
		this.shellServices.unRegisterEvent(EventTypes.gamingQuickSettingsNetworkBoostStatusChangedEvent, this.networkBoostEvent);
	}

	async openTargetModal() {
		try {
			this.needToAsk = this.networkBoostService.getNeedToAsk();
			this.needToAsk = this.needToAsk === undefined || isNaN(this.needToAsk) ? 0 : this.needToAsk;
			this.loggerService.info('page-networkboost.component.openTargetModal', 'NEED TO ASK FROM LOCAL --->' + this.needToAsk);
			this.loggerService.info('page-networkboost.component.openTargetModal', 'TOGGLE STATUS --->' + this.toggleStatus);
			if (this.toggleStatus || this.needToAsk === 1 || this.needToAsk === 2) {
				this.showAppsModal = true;
			} else {
				this.showTurnOnModal = true;
			}
			this.hiddenScroll(true);
		} catch (error) {
			this.loggerService.error('page-networkboost.component.openTargetModal', 'ERROR in openTargetModal()-->' + error);
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
		this.hiddenScroll(true);
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
			this.loggerService.error('page-networkboost.component.setNetworkBoostStatus', 'ERROR in setNetworkBoostStatus()-->' + err);
		}
	}

	async setAksAgain(status: boolean) {
		try {
			this.networkBoostService.setNeedToAsk(status);
		} catch (error) {
			this.loggerService.error('page-networkboost.component.setAksAgain', 'ERROR in setAksAgain()-->' + error);
		}
	}

	async getNetworkBoostStatus() {
		try {
			this.toggleStatus = await this.networkBoostService.getNetworkBoostStatus();
			this.commonService.setLocalStorageValue(LocalStorageKey.NetworkBoostStatus, this.toggleStatus);
		} catch (err) {
			this.loggerService.error('page-networkboost.component.getNetworkBoostStatus', 'ERROR in setNetworkBoostStatus()-->' + err);
		}
	}

	hiddenScroll(action: boolean) {
		const selectorVtr = (document.getElementsByClassName('vtr-app')[0] as HTMLElement);
		selectorVtr.style.overflowY = 'auto';
		if (action) {
			selectorVtr.style.overflowY = 'hidden';
			selectorVtr.style.overflowX = 'hidden';
		}
	}

	// Get the CMS content for the container card
	fetchCMSArticles() {
		this.isOnline = this.commonService.isOnline;
		const queryOptions = {
			Page: 'network-boost'
		};
		this.fetchSubscrition = this.cmsService.fetchCMSContent(queryOptions).subscribe((response: any) => {
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
				FeatureImage: 'assets/cms-cache/network_boost_offline.jpg'
			};
		}
	}

	// version:3.3.3 quick setting toolbar& toast
	networkBoostRegisterEvent () {
		this.networkBoostEvent = this.onGamingQuickSettingsNetworkBoostStatusChangedEvent.bind(this);
		this.gamingQuickSettingToolbarService.registerEvent('NetworkBoost');
		this.shellServices.registerEvent(
			EventTypes.gamingQuickSettingsNetworkBoostStatusChangedEvent,
			this.networkBoostEvent
		);
	}

	onGamingQuickSettingsNetworkBoostStatusChangedEvent(status:any) {
		this.ngZone.run(() => {
			status = status ===1 ? true : false;
			this.loggerService.info(`Widget-LegionEdge-onGamingQuickSettingsNetworkBoostStatusChangedEvent: call back from ${this.toggleStatus} to ${status}`);
			if (status !== undefined && this.toggleStatus !== status) {
				this.toggleStatus = status;
				this.commonService.setLocalStorageValue(LocalStorageKey.NetworkBoostStatus, status);
			}
		});
	}
}
