import { Component, OnInit, DoCheck, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MockService } from '../../../services/mock/mock.service';
import { QaService } from '../../../services/qa/qa.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
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

@Component({
	selector: 'vtr-page-device-gaming',
	templateUrl: './page-device-gaming.component.html',
	styleUrls: ['./page-device-gaming.component.scss'],
	providers: [NgbModalConfig, NgbModal],
})
export class PageDeviceGamingComponent implements OnInit, DoCheck, OnDestroy {
	public static allCapablitiyFlag = false;
	submit = 'Submit';
	feedbackButtonText = this.submit;
	securityAdvisor: SecurityAdvisor;
	public isOnline = true;
	private protocolAction: any;
	cardContentPositionD: any = {};
	// TODO Lite Gaming
	public liteGaming = false;
	public desktopType = false;
	private translateSubscription: Subscription;
	private notificationSubscription: Subscription;
	private cmsSubscription: Subscription;

	constructor(
		private router: Router,
		public dashboardService: DashboardService,
		public mockService: MockService,
		public qaService: QaService,
		private modalService: NgbModal,
		config: NgbModalConfig,
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
		private titleService: Title
	) {
		config.backdrop = 'static';
		config.keyboard = false;
		this.securityAdvisor = vantageShellService.getSecurityAdvisor();
		// TODO Lite Gaming
		this.desktopType = this.localCacheService.getLocalCacheValue(LocalStorageKey.desktopType);
		this.liteGaming = this.gamingAllCapabilitiesService.getCapabilityFromCache(
			LocalStorageKey.liteGaming
		);
	}

	ngOnInit() {
		this.isOnline = this.commonService.isOnline;

		if (!PageDeviceGamingComponent.allCapablitiyFlag) {
			this.gamingAllCapabilitiesService
				.getCapabilities()
				.then((response) => {
					this.gamingAllCapabilitiesService.setCapabilityValuesGlobally(response);
					PageDeviceGamingComponent.allCapablitiyFlag = true;
					// TODO Lite Gaming
					this.desktopType = response.desktopType;
					this.liteGaming = response.liteGaming;
					// this.desktopType = this.gamingAllCapabilitiesService.getCapabilityFromCache(LocalStorageKey.desktopType);
					// this.liteGaming = this.gamingAllCapabilitiesService.getCapabilityFromCache(LocalStorageKey.liteGaming);
				})
				.catch((err) => {});
		}
		this.translateSubscription = this.translate
			.stream([
				'dashboard.offlineInfo.welcomeToVantage',
				'common.menu.support',
				'settings.settings',
				'dashboard.offlineInfo.systemHealth',
				'common.securityAdvisor.wifi',
				'systemUpdates.title',
				'systemUpdates.readMore',
			])
			.subscribe((result) => {
				this.dashboardService.translateString = result;
				this.dashboardService.setDefaultCMSContent();
				this.getPreviousContent();
				this.fetchCmsContents();
			});

		this.notificationSubscription = this.commonService.notification.subscribe(
			(notification: AppNotification) => {
				this.onNotification(notification);
			}
		);
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

	fetchCmsContents(lang?: string) {
		const callCmsStartTime: any = new Date();
		const queryOptions: any = {
			Page: 'dashboard',
		};
		if (this.isOnline) {
			if (this.dashboardService.onlineCardContent.positionD) {
				this.cardContentPositionD = this.dashboardService.onlineCardContent.positionD;
			}
		}
		this.cmsSubscription = this.cmsService.fetchCMSContent(queryOptions).subscribe(
			(response: any) => {
				const callCmsEndTime: any = new Date();
				const callCmsUsedTime = callCmsEndTime - callCmsStartTime;
				if (response && response.length > 0) {
					if (!this.dashboardService.onlineCardContent.positionD) {
						const cardContentPositionD = this.cmsService.getOneCMSContent(
							response,
							'full-width-title-image-background',
							'position-D'
						)[0];
						if (cardContentPositionD) {
							this.cardContentPositionD = cardContentPositionD;
							this.dashboardService.onlineCardContent.positionD = cardContentPositionD;
						}
					} else {
						this.cardContentPositionD = this.dashboardService.onlineCardContent.positionD;
					}
				} else {
					const msg = `Performance: Dashboard page not have this language contents, ${callCmsUsedTime}ms`;
					this.loggerService.info(msg);
					this.fetchCmsContents('en');
				}
			},
			(error) => {}
		);
	}

	public onConnectivityClick($event: any) {}

	private getPreviousContent() {
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
}
