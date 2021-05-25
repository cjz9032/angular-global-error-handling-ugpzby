import { IframeRenderer } from 'src/app/services/iframe-renderer/iframe-renderer.service';
import { Component, OnInit, DoCheck, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { MockService } from '../../../services/mock/mock.service';
import { QaService } from '../../../services/qa/qa.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { SecurityAdvisor } from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { UserService } from '../../../services/user/user.service';
import { TranslateService } from '@ngx-translate/core';
import { GamingAllCapabilitiesService } from 'src/app/services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { Title } from '@angular/platform-browser';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { Subscription } from 'rxjs';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { GAMING_DATA } from './../../../../testing/gaming-data';
import { PerformanceNotifications } from 'src/app/enums/performance-notifications.enum';
import { Gaming } from 'src/app/enums/gaming.enum';
import { CardOverlayTheme } from 'src/app/services/card/card.service';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';

@Component({
	selector: 'vtr-page-device-gaming',
	templateUrl: './page-device-gaming.component.html',
	styleUrls: ['./page-device-gaming.component.scss'],
})
export class PageDeviceGamingComponent implements OnInit, DoCheck, AfterViewInit, OnDestroy {
	public isOnline = true;
	public submit = 'Submit';
	public feedbackButtonText = this.submit;
	public securityAdvisor: SecurityAdvisor;
	public cardContentPositionD: FeatureContent[] = [];
	public CardOverlayTheme = CardOverlayTheme;
	// Version 3.2 lite gaming
	public liteGaming = false;
	public desktopType = false;

	private protocolAction: any;
	private translateSubscription: Subscription;
	private notificationSubscription: Subscription;
	private cmsSubscription: Subscription;
	// Version 3.7 app search for gaming
	public featureName: string;
	private thermalModeFlag = false;
	private actionSubscription: Subscription;

	constructor(
		private iframeRenderer: IframeRenderer,
		private router: Router,
		public dashboardService: DashboardService,
		public mockService: MockService,
		public qaService: QaService,
		private commonService: CommonService,
		private localCacheService: LocalCacheService,
		private configService: ConfigService,
		public deviceService: DeviceService,
		private cmsService: CMSService,
		private systemUpdateService: SystemUpdateService,
		public userService: UserService,
		private translate: TranslateService,
		private loggerService: LoggerService,
		private activatedRoute: ActivatedRoute,
		private dialogService: DialogService,
		private gamingAllCapabilitiesService: GamingAllCapabilitiesService,
		vantageShellService: VantageShellService,
		private titleService: Title,
		private location: Location
	) {
		this.securityAdvisor = vantageShellService.getSecurityAdvisor();
		// TODO Lite Gaming
		this.desktopType = this.localCacheService.getLocalCacheValue(LocalStorageKey.desktopType);
		this.liteGaming = this.gamingAllCapabilitiesService.getCapabilityFromCache(
			LocalStorageKey.liteGaming
		);
	}

	ngOnInit() {
		this.isOnline = this.commonService.isOnline;

		if (!this.gamingAllCapabilitiesService.isGetCapabilitiesAready) {
			this.gamingAllCapabilitiesService
				.getCapabilities()
				.then((response) => {
					this.gamingAllCapabilitiesService.setCapabilityValuesGlobally(response);
					// TODO Lite Gaming
					this.desktopType = response.desktopType;
					this.liteGaming = response.liteGaming;
					// Version 3.7 app search for gaming
					this.launchProtocol();
				})
				.catch((err) => { });
		} else {
			// Version 3.8 protocol: ensure that update the desktopType and liteGaming value
			this.desktopType = this.localCacheService.getLocalCacheValue(LocalStorageKey.desktopType);
			this.liteGaming = this.gamingAllCapabilitiesService.getCapabilityFromCache(LocalStorageKey.liteGaming);
		}

		this.dashboardService.setDefaultCMSContent();
		this.getPreviousContent();
		this.fetchCmsContents();

		this.notificationSubscription = this.commonService.notification.subscribe(
			(notification: AppNotification) => {
				this.onNotification(notification);
			}
		);
		// Version 3.7 app search for gaming
		if (this.gamingAllCapabilitiesService.isGetCapabilitiesAready) {
			this.launchProtocol();
		}
		setTimeout(() => {
			if (!this.actionSubscription) {
				this.launchProtocol();
			}
		}, 2000);
	}

	ngAfterViewInit(): void {
		this.commonService.markPerformanceNode('device-gaming');
		this.commonService.sendNotification(PerformanceNotifications.firstPageInitialized, 'device-gaming');
		this.iframeRenderer.preloadSubApp();
	}

	ngOnDestroy() {
		if (this.translateSubscription) {
			this.translateSubscription.unsubscribe();
		}
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		if (this.cmsSubscription) {
			this.cmsSubscription.unsubscribe();
		}
		if (this.actionSubscription) {
			this.actionSubscription.unsubscribe();
		}
	}

	ngDoCheck(): void {
		const lastAction = this.protocolAction;
		this.protocolAction = this.activatedRoute.snapshot.queryParams.action;
		if (this.protocolAction && lastAction !== this.protocolAction) {
			if (this.protocolAction.toLowerCase() === 'lenovoid') {
				setTimeout(() => this.dialogService.openLenovoIdDialog());
			} else if (this.protocolAction.toLowerCase() === 'modernpreload') {
				setTimeout(() => this.dialogService.openModernPreloadModal());
			}
		}
	}

	private selectOverlayTheme(record) {
		let overlayTheme;
		if (record) {
			if (record.Parameters && record.Parameters.length > 0) {
				const theme = record.Parameters.find((item) => item.Key === 'OverlayTheme');
				if (theme) {
					overlayTheme = theme.Value;
				} else {
					overlayTheme = record.OverlayTheme;
				}
			} else {
				overlayTheme = record.OverlayTheme;
			}
		}
		return overlayTheme;
	}

	fetchCmsContents(lang?: string) {
		const callCmsStartTime: any = new Date();
		const queryOptions = GAMING_DATA.buildPage('dashboard');
		if (this.isOnline) {
			if (this.dashboardService.onlineCardContent.positionD?.length > 0) {
				this.cardContentPositionD = this.dashboardService.onlineCardContent.positionD;
			}
		}
		this.cmsSubscription = this.cmsService.fetchCMSContent(queryOptions).subscribe(
			(response: any) => {
				const callCmsEndTime: any = new Date();
				const callCmsUsedTime = callCmsEndTime - callCmsStartTime;
				if (response && response.length > 0) {
					if (!Boolean(this.dashboardService.onlineCardContent.positionD?.length > 0)) {
						const positionDContents = this.cmsService.getOneCMSContent(
							response,
							'full-width-title-image-background',
							'position-D'
						);
						if (positionDContents && positionDContents.length > 0) {
							this.cardContentPositionD = positionDContents.map((record) => {
								const overlayTheme = this.selectOverlayTheme(record);
								return {
									Id: record.Id,
									Title: record.Title,
									Description: record.Description,
									FeatureImage: record.FeatureImage,
									ActionLink: record.ActionLink,
									ActionType: record.ActionType,
									OverlayTheme: overlayTheme ? overlayTheme : '',
									DataSource: record.DataSource,
								};
							});
							this.dashboardService.onlineCardContent.positionD = this.cardContentPositionD;
						}
					} else {
						this.cardContentPositionD = this.dashboardService.onlineCardContent.positionD;
					}
				} else {
					const msg = `Performance: Dashboard gaming page not have this language contents, ${callCmsUsedTime}ms`;
					this.loggerService.info(msg);
					this.fetchCmsContents('en');
				}
			},
			(error) => { }
		);
	}

	onConnectivityClick($event: any) { }

	getPreviousContent() {
		this.cardContentPositionD = this.dashboardService.offlineCardContent.positionD;
	}

	onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					if (!this.isOnline) {
						this.getPreviousContent();
					} else {
						this.fetchCmsContents();
					}
					break;
				default:
					break;
			}
		}
	}

	// Version 3.7 app search for gaming
	private launchProtocol() {
		this.actionSubscription = this.activatedRoute.queryParamMap.subscribe(
			(params: ParamMap) => {
				if (!params.has('action')) {
					return;
				}

				if (this.activatedRoute.snapshot.queryParams.action.toLowerCase() === 'thermalmode') {
					setTimeout(() => {
						this.thermalModeFlag = true;
						this.gamingAllCapabilitiesService.sendGamingThermalModeNotification(Gaming.GamingThermalMode, true);
					}, 200);
				}
			}
		);
	}

	public thermalModeDialogMonitorChange(event) {
		if (!event && this.thermalModeFlag) {
			this.location.go('/device-gaming');
			this.thermalModeFlag = false;
		}
	}
}
