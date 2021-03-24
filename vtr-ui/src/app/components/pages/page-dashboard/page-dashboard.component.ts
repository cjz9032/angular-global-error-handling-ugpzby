import { AfterViewInit, Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import map from 'lodash/map';
import sample from 'lodash/sample';
import trim from 'lodash/trim';
import { isEmpty, toLower } from 'lodash';
import { Subscription } from 'rxjs/internal/Subscription';
import { SecurityAdvisor } from '@lenovo/tan-client-bridge';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';
import { Status } from 'src/app/data-models/widgets/status.model';
import { ContentActionType, ContentSource } from 'src/app/enums/content.enum';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { SelfSelectEvent } from 'src/app/enums/self-select.enum';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { FormatLocaleDatePipe } from 'src/app/pipe/format-locale-date/format-locale-date.pipe';
import { AdPolicyService } from 'src/app/services/ad-policy/ad-policy.service';
import { AndroidService } from 'src/app/services/android/android.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { DccService } from 'src/app/services/dcc/dcc.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { PageName } from 'src/app/services/metric/page-name.const';
import {
	SegmentConst,
	SegmentConstHelper,
	SelfSelectService,
} from 'src/app/services/self-select/self-select.service';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { UserService } from 'src/app/services/user/user.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { WarrantyService } from 'src/app/services/warranty/warranty.service';
import { QaService } from '../../../services/qa/qa.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { ContentCacheService } from 'src/app/services/content-cache/content-cache.service';
import { AntivirusService } from 'src/app/services/security/antivirus.service';
import { WindowsHelloService } from 'src/app/services/security/windowsHello.service';
import { LandingView } from 'src/app/data-models/security-advisor/widegt-security-landing/landing-view.model';
import { DashboardStateCardData } from './material-state-card-container/material-state-card-container.component';
import {
	SecurityFeature,
	securityStatus,
	getSecurityLevel,
} from 'src/app/data-models/security-advisor/security-status';
import { PerformanceNotifications } from 'src/app/enums/performance-notifications.enum';
import { WarrantyData, WarrantyStatusEnum } from 'src/app/data-models/warranty/warranty.model';

interface IConfigItem {
	cardId: string;
	displayContent: any;
	template: string;
	positionParam: string;
	tileSource: string;
	cmsContent: any;
	upeContent: any;
}

@Component({
	selector: 'vtr-page-dashboard',
	templateUrl: './page-dashboard.component.html',
	styleUrls: ['./page-dashboard.component.scss'],
})
export class PageDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
	actionSubscription: Subscription;

	offlineConnection = 'offline-connection';
	public systemStatus: Status[] = [];
	public isOnline = true;
	public isShowStateCard: boolean;
	public brand;

	public isWarrantyVisible = false;
	public showQuickSettings = true;
	public hideTitle = false;
	private subscription: Subscription;
	private langChangeSubscription: Subscription;
	private translateSubscription: Subscription;
	translate1Subscription: Subscription;
	translate2Subscription: Subscription;
	translate3Subscription: Subscription;
	translate4Subscription: Subscription;
	translate5Subscription: Subscription;
	translate6Subscription: Subscription;
	translate7Subscription: Subscription;
	translate8Subscription: Subscription;
	translate9Subscription: Subscription;
	translate10Subscription: Subscription;
	translate11Subscription: Subscription;
	translate12Subscription: Subscription;
	translate13Subscription: Subscription;
	translate14Subscription: Subscription;

	supportDatas = {
		documentation: [
			{
				icon: ['fal', 'book'],
				title: 'support.documentation.listUserGuide',
				clickItem: 'userGuide',
				metricsItem: 'Documentation.UserGuideButton',
				metricsEvent: 'FeatureClick',
				metricsParent: 'Dashboard',
			},
		],
		needHelp: [],
		quicklinks: [],
	};

	heroBannerDemoItems = [];
	canShowDccDemo$: Promise<boolean>;

	private pageTypeOfDashboard = 'dashboard';
	private positionOfWelcomeText = 'welcome-text';

	contentCards = {
		positionA: {
			displayContent: [],
			template: 'home-page-hero-banner',
			cardId: 'positionA',
			positionParam: 'position-A',
			tileSource: 'CMS',
			cmsContent: undefined,
			upeContent: undefined,
		},
		positionB: {
			displayContent: new FeatureContent(),
			template: 'half-width-title-description-link-image',
			cardId: 'positionB',
			positionParam: 'position-B',
			tileSource: 'CMS',
			cmsContent: undefined,
			upeContent: undefined,
		},
		positionC: {
			displayContent: new FeatureContent(),
			template: 'half-width-title-description-link-image',
			cardId: 'positionC',
			positionParam: 'position-C',
			tileSource: 'CMS',
			cmsContent: undefined,
			upeContent: undefined,
		},
		positionD: {
			displayContent: new FeatureContent(),
			template: 'full-width-title-image-background',
			cardId: 'positionD',
			positionParam: 'position-D',
			tileSource: 'CMS',
			cmsContent: undefined,
			upeContent: undefined,
		},
		positionE: {
			displayContent: new FeatureContent(),
			template: 'half-width-top-image-title-link',
			cardId: 'positionE',
			positionParam: 'position-E',
			tileSource: 'CMS',
			cmsContent: undefined,
			upeContent: undefined,
		},
		positionF: {
			displayContent: new FeatureContent(),
			template: 'half-width-top-image-title-link',
			cardId: 'positionF',
			positionParam: 'position-F',
			tileSource: 'CMS',
			cmsContent: undefined,
			upeContent: undefined,
		},
	};
	showSecurityStatusCard: boolean;
	positionCData: DashboardStateCardData[] = [
		{
			title: 'common.securityAdvisor.title',
			summary: 'dashboard.securityStatus.loadingDesc',
			linkText: 'common.menu.security.sub1',
			metricsItem: 'loading',
			linkPath: 'security/mysecurity',
			isActionLink: false,
		},
		{
			title: 'common.securityAdvisor.title',
			summary: 'dashboard.securityStatus.noProtectionDesc',
			linkText: 'common.ui.improveNow',
			linkPath: 'security/anti-virus',
			metricsItem: 'no protection',
			statusText: 'security.landing.noProtection',
			isActionLink: false,
		},
		{
			title: 'common.securityAdvisor.title',
			summary: 'dashboard.securityStatus.basicDesc',
			linkText: 'common.ui.improveNow',
			linkPath: 'security/mysecurity',
			params: 'basic',
			metricsItem: 'basic',
			statusText: 'security.landing.basic',
			isActionLink: false,
		},
		{
			title: 'common.securityAdvisor.title',
			summary: 'dashboard.securityStatus.intermediateDesc',
			linkText: 'common.menu.security.sub1',
			linkPath: 'security/mysecurity',
			params: 'intermediate',
			metricsItem: 'intermediate',
			statusText: 'security.landing.intermediate',
			isActionLink: false,
		},
		{
			title: 'common.securityAdvisor.title',
			summary: 'dashboard.securityStatus.advancedDesc',
			linkText: 'common.menu.security.sub1',
			linkPath: 'security/mysecurity',
			params: 'advanced',
			metricsItem: 'advanced',
			statusText: 'security.landing.advanced',
			isActionLink: false,
		},
	];
	securityInfo: LandingView = {
		status: undefined,
		percent: 0,
		fullyProtected: false,
		statusText: '',
	};
	securityLevel: any;
	private saFeatureSupport: SecurityFeature = {
		pluginSupport: false,
		pwdSupport: false,
		vpnSupport: false,
		fingerprintSupport: false,
	};
	private haveOwnList = {
		passwordManager: false,
		wifiSecurity: false,
		vpn: false,
	};
	private securityAdvisor: SecurityAdvisor;
	private getSecurityInfoTimeout: ReturnType<typeof setTimeout>;

	positionBData: DashboardStateCardData = {
		title: 'System Information',
		summary: 'Your device is in good condition',
		linkText: 'My Device',
		linkPath: 'device',
		state: 1,
		metricsItem: 'good-condition',
		statusText: 'GOOD CONDITION',
		isActionLink: false,
	};
	getPbSubscription: Subscription;
	showDeviceAndSecurityTimer: any;

	securityAdvisorHandler = () => {
		clearTimeout(this.getSecurityInfoTimeout);
		this.getSecurityInfoTimeout = setTimeout(() => {
			this.securityLevel = getSecurityLevel(
				this.securityAdvisor,
				undefined,
				this.haveOwnList,
				this.saFeatureSupport,
				this.localCacheService
			);
			this.setSecurityInfo(this.securityLevel.landingStatus);
		}, 1000);
	};

	constructor(
		private router: Router,
		public dashboardService: DashboardService,
		public qaService: QaService,
		public commonService: CommonService,
		private formatLocaleDate: FormatLocaleDatePipe,
		public deviceService: DeviceService,
		private systemUpdateService: SystemUpdateService,
		public userService: UserService,
		private translate: TranslateService,
		private vantageShellService: VantageShellService,
		public androidService: AndroidService,
		private activatedRoute: ActivatedRoute,
		private dialogService: DialogService,
		private logger: LoggerService,
		private hypService: HypothesisService,
		public warrantyService: WarrantyService,
		private adPolicyService: AdPolicyService,
		public dccService: DccService,
		private selfselectService: SelfSelectService,
		private feedbackService: FeedbackService,
		private localInfoService: LocalInfoService,
		private localCacheService: LocalCacheService,
		private metricsService: MetricService,
		private contentLocalCache: ContentCacheService,
		private windowsHelloService: WindowsHelloService
	) { }

	ngOnInit() {
		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
		this.refreshSA();
		this.isOnline = this.commonService.isOnline;
		this.deviceService.getMachineInfo().then(() => {
			this.setDefaultSystemStatus();
			if (this.dashboardService.isShellAvailable) {
				this.logger.info('PageDashboardComponent.getSystemInfo');
				this.getSystemInfo();
			}
		});
		this.brand = this.localCacheService.getLocalCacheValue(LocalStorageKey.MachineType, -1);
		this.qaService.setCurrentLangTranslations();
		this.dashboardService.isDashboardDisplayed = true;
		this.commonService.setSessionStorageValue(SessionStorageKey.DashboardInDashboardPage, true);
		this.subscription = this.commonService.notification.subscribe(
			(notification: AppNotification) => {
				this.onNotification(notification);
			}
		);

		this.dashboardService.setDefaultCMSContent();
		this.getOfflineContent();
		this.getDeviceCardInfo().finally(() => {
			this.getCachedContent();
		});

		this.getSecurityCardInfo();
		this.getSelfSelectStatus();
		this.canShowDccDemo$ = this.dccService.canShowDccDemo();
		this.launchProtocol();
		this.getUsageType();
	}

	@HostListener('window: focus')
	onFocus(): void {
		this.refreshSA();
	}

	private getUsageType() {
		this.selfselectService.getSegment().then((segment) => {
			this.hideTitle = segment === SegmentConst.Commercial || segment === SegmentConst.SMB;
		});
	}

	private launchProtocol() {
		this.actionSubscription = this.activatedRoute.queryParamMap.subscribe(
			(params: ParamMap) => {
				if (!params.has('action')) {
					return;
				}

				if (
					this.activatedRoute.snapshot.queryParams.action.toLowerCase() === 'lenovoid' &&
					!this.userService.auth
				) {
					const shellVersion = this.commonService.getShellVersion();
					if (this.commonService.compareVersion(shellVersion, '10.2001.9') >= 0) {
						// New shell use await to sync with UI, launch LID immediately
						setTimeout(() => this.dialogService.openLenovoIdDialog(), 0);
					} else {
						// Delay 2 seconds then launch LID, this is workarround for old shell sync issue with UI,
						//  UI will possibly become blank in case of protocol launch
						setTimeout(() => this.dialogService.openLenovoIdDialog(), 2000);
					}
				} else if (
					this.activatedRoute.snapshot.queryParams.action.toLowerCase() ===
					'modernpreload'
				) {
					setTimeout(() => this.dialogService.openModernPreloadModal(), 0);
				}
			}
		);
	}

	ngOnDestroy() {
		this.metricsService.deactivateScrollCounter(PageName.Dashboard);

		this.dashboardService.isDashboardDisplayed = false;
		this.dashboardService.canShowDeviceAndSecurityCard = false;
		if (this.showDeviceAndSecurityTimer) {
			clearTimeout(this.showDeviceAndSecurityTimer);
		}
		this.commonService.setSessionStorageValue(
			SessionStorageKey.DashboardInDashboardPage,
			false
		);
		if (this.subscription) {
			this.subscription.unsubscribe();
		}

		if (this.langChangeSubscription) {
			this.langChangeSubscription.unsubscribe();
		}
		if (this.translateSubscription) {
			this.translateSubscription.unsubscribe();
		}
		if (this.translate1Subscription) {
			this.translate1Subscription.unsubscribe();
		}
		if (this.translate2Subscription) {
			this.translate2Subscription.unsubscribe();
		}
		if (this.translate3Subscription) {
			this.translate3Subscription.unsubscribe();
		}
		if (this.translate4Subscription) {
			this.translate4Subscription.unsubscribe();
		}
		if (this.translate5Subscription) {
			this.translate5Subscription.unsubscribe();
		}
		if (this.translate6Subscription) {
			this.translate6Subscription.unsubscribe();
		}
		if (this.translate7Subscription) {
			this.translate7Subscription.unsubscribe();
		}
		if (this.translate8Subscription) {
			this.translate8Subscription.unsubscribe();
		}
		if (this.translate9Subscription) {
			this.translate9Subscription.unsubscribe();
		}
		if (this.translate10Subscription) {
			this.translate10Subscription.unsubscribe();
		}
		if (this.translate11Subscription) {
			this.translate11Subscription.unsubscribe();
		}
		if (this.translate12Subscription) {
			this.translate12Subscription.unsubscribe();
		}
		if (this.translate13Subscription) {
			this.translate13Subscription.unsubscribe();
		}
		if (this.translate14Subscription) {
			this.translate14Subscription.unsubscribe();
		}
		if (this.securityAdvisor) {
			this.securityAdvisor.off('*', this.securityAdvisorHandler);
		}

		if (this.actionSubscription) {
			this.actionSubscription.unsubscribe();
		}

		this.getPbSubscription?.unsubscribe();
	}

	private async getDeviceCardInfo() {
		const hypHidePosBStateCard = await this.hypService.getFeatureSetting('HideSpecialCardOnPositionB')
			.then((result) => result === 'true')
			.catch(() => false);
		if (!hypHidePosBStateCard) {
			this.isShowStateCard = this.dashboardService.canShowDeviceAndSecurityCard && await this.dashboardService.isPositionBShowDeviceState();
		}
		if (this.isShowStateCard) {
			this.getPbSubscription = this.dashboardService.getPositionBData().subscribe((data) => {
				this.positionBData = data;
			});
			this.checkDeviceAndSecurityTimer();
		}
	}

	private async getCachedContent() {
		this.getTileSource().then(() => {
			this.contentLocalCache
				.getCachedContents(this.pageTypeOfDashboard, this.contentCards, this.isOnline)
				.then((result) => {
					if (!result) {
						return;
					}
					if (this.isOnline) {
						Object.keys(this.contentCards).forEach((cardId) => {
							if (result[cardId]
								&& !isEmpty(result[cardId])) {
								this.contentCards[cardId].displayContent = result[cardId];
							}
						});
					}
					this.setWelcomeTextTitle(result[this.positionOfWelcomeText]);
				});
		});

		this.dccService.canShowDccDemo().then((show) => {
			if (show) {
				this.getHeroBannerDemoItems();
			}
		});
	}

	private setWelcomeTextTitle(welcomeTextContent: any) {
		if (welcomeTextContent && welcomeTextContent.Title) {
			this.localInfoService.getLocalInfo().then(async (localInfo: any) => {
				if (
					SegmentConstHelper.includedInCommonConsumer(localInfo.Segment) ||
					SegmentConst.SMB === localInfo.Segment
				) {
					const titles = map(welcomeTextContent.Title.split('|||'), trim);
					if (!this.dashboardService.welcomeText) {
						this.dashboardService.welcomeText = sample(titles);
					}
				}
			});
		}
	}

	getHeroBannerDemoItems() {
		this.heroBannerDemoItems = [
			{
				albumId: 1,
				id: '',
				source: 'VANTAGE',
				title: 'Lenovo exclusive offer of Adobe designer suite',
				url: 'assets/images/dcc/hero-banner-dcc.jpg',
				ActionLink: 'dcc-demo',
				ActionType: ContentActionType.Internal,
				DataSource: ContentSource.Local,
			},
		];
	}

	cmsHeroBannerChanged(bannerItems1, bannerItems2) {
		let result = false;
		if ((bannerItems1 && !bannerItems2) || (!bannerItems1 && bannerItems2)) {
			result = true;
		} else if (bannerItems1 && bannerItems2) {
			if (bannerItems1.length !== bannerItems2.length) {
				result = true;
			} else {
				for (let i = 0; i < bannerItems1.length; i++) {
					if (
						(bannerItems1[i] && !bannerItems2[i]) ||
						(!bannerItems1[i] && bannerItems2[i])
					) {
						result = true;
						break;
					} else if (
						bannerItems1[i] &&
						bannerItems2[i] &&
						JSON.stringify(bannerItems2[i]) !== JSON.stringify(bannerItems1[i])
					) {
						result = true;
						break;
					}
				}
			}
		}
		return result;
	}

	private async getTileSource() {
		const allPositions = [
			'positionA',
			'positionB',
			'positionC',
			'positionD',
			'positionE',
			'positionF',
		];
		let upePositions = [];

		try {
			const hyp = (await this.hypService.getAllSettings()) as any;
			if (hyp.TileSource && hyp.TileSource === 'UPE_*') {
				// 1. TileSource like UPE_*

				upePositions = allPositions;
			} else if (hyp.TileSource && hyp.TileSource.startsWith('UPE')) {
				const tileSource = hyp.TileSource.toUpperCase();
				upePositions = allPositions.filter((position) => {
					const lastLetter = position.substr(-1, 1);
					return tileSource.indexOf(`_${lastLetter}`) !== -1; // 2. TileSource like UPE_A_B_C_X
				});
			} else if (hyp.TileBSource === 'UPE') {
				// 3. TileSource like empty/null/unknown value, check TileBSource for compatible

				upePositions.push('positionB');
			} // else do nothing
		} catch (ex) {
			this.logger.info(`get tile source failed.${ex.message}`);
		}

		allPositions.forEach((position) => {
			this.contentCards[position].tileSource = 'CMS';
		});

		upePositions.forEach((position) => {
			this.contentCards[position].tileSource = 'UPE';
		});
	}

	private getOfflineContent() {
		Object.keys(this.contentCards).forEach((cardId) => {
			// 'positionA', 'positionB'...'positionF'
			this.contentCards[cardId].displayContent = this.dashboardService.offlineCardContent[
				cardId
			];
		});
	}

	private setDefaultSystemStatus() {
		const memory = new Status();
		memory.status = 4;
		memory.id = 'memory';
		memory.metricsItemName = 'Memory';

		this.translate1Subscription = this.translate
			.stream('dashboard.systemStatus.memory.title')
			.subscribe((value) => {
				memory.title = value;
			});

		this.translate2Subscription = this.translate
			.stream('dashboard.systemStatus.memory.detail.notFound')
			.subscribe((value) => {
				memory.detail = value;
			});

		memory.path = 'ms-settings:about';
		memory.asLink = false;
		memory.isSystemLink = true;
		memory.type = 'system';
		this.systemStatus[0] = memory;

		const disk = new Status();
		disk.status = 4;
		disk.id = 'disk';
		disk.metricsItemName = 'Disk Space';

		this.translate3Subscription = this.translate
			.stream('dashboard.systemStatus.diskSpace.title')
			.subscribe((value) => {
				disk.title = value;
			});

		this.translate4Subscription = this.translate
			.stream('dashboard.systemStatus.diskSpace.detail.notFound')
			.subscribe((value) => {
				disk.detail = value;
			});

		disk.path = 'ms-settings:storagesense';
		disk.asLink = false;
		disk.isSystemLink = true;
		disk.type = 'system';
		this.systemStatus[1] = disk;

		const warranty = new Status();
		warranty.status = 4;
		warranty.id = 'warranty';
		warranty.metricsItemName = 'Warranty';

		this.translate5Subscription = this.translate
			.stream('dashboard.systemStatus.warranty.title')
			.subscribe((value) => {
				warranty.title = value;
			});

		this.translate6Subscription = this.translate
			.stream('dashboard.systemStatus.warranty.detail.notFound')
			.subscribe((value) => {
				warranty.detail = value;
			});

		warranty.path = '/support';
		warranty.asLink = false;
		/* warranty.isSystemLink = true; */
		warranty.isSystemLink = false;
		warranty.type = 'system';
		warranty.isHidden = !this.deviceService.showWarranty;
		this.systemStatus[2] = warranty;

		if (
			this.deviceService &&
			!this.deviceService.isSMode &&
			this.adPolicyService &&
			this.adPolicyService.IsSystemUpdateEnabled
		) {
			const systemUpdate = new Status();
			systemUpdate.status = 4;
			systemUpdate.id = 'systemupdate';
			systemUpdate.metricsItemName = 'System Update';

			this.translate7Subscription = this.translate
				.stream('dashboard.systemStatus.systemUpdate.title')
				.subscribe((value) => {
					systemUpdate.title = value;
				});

			this.translate8Subscription = this.translate
				.stream('dashboard.systemStatus.systemUpdate.detail.update')
				.subscribe((value) => {
					systemUpdate.detail = value;
				});

			systemUpdate.path = 'device/system-updates';
			systemUpdate.asLink = true;
			systemUpdate.isSystemLink = false;
			systemUpdate.type = 'system';
			this.systemStatus[3] = systemUpdate;
		}
	}

	private getSystemInfo() {
		// ram and disk
		this.dashboardService.getMemoryDiskUsage().then((value) => {
			if (value) {
				const memory = this.systemStatus[0];
				const totalRam = value.memory.total;
				const usedRam = value.memory.used;
				if (usedRam === totalRam) {
					memory.status = 1;
				} else {
					memory.status = 0;
				}
				const disk = this.systemStatus[1];
				const totalDisk = value.disk.total;
				const usedDisk = value.disk.used;
				this.translate9Subscription = this.translate
					.stream('dashboard.systemStatus.memory.detail.of')
					.subscribe((re) => {
						memory.detail = `${this.commonService.formatBytes(
							usedRam,
							1
						)} ${re} ${this.commonService.formatBytes(totalRam, 1)}`;
						disk.detail = `${this.commonService.formatBytes(
							usedDisk,
							1
						)} ${re} ${this.commonService.formatBytes(totalDisk, 1)}`;
					});
				if (usedDisk === totalDisk) {
					disk.status = 1;
				} else {
					disk.status = 0;
				}
			}
		});

		// warranty
		this.getWarrantyInfo();

		// system update
		if (
			this.deviceService &&
			!this.deviceService.isSMode &&
			this.adPolicyService &&
			this.adPolicyService.IsSystemUpdateEnabled
		) {
			this.translate10Subscription = this.dashboardService
				.getRecentUpdateInfo()
				.subscribe((value) => {
					if (value) {
						const systemUpdate = this.systemStatus[3];
						const diffInDays = this.systemUpdateService.dateDiffInDays(
							value.lastupdate
						);
						if (value.status === 1) {
							if (diffInDays > 30) {
								systemUpdate.status = 1;
							} else {
								systemUpdate.status = 0;
							}
						} else {
							systemUpdate.status = 1;
						}
						systemUpdate.status = 0;
					}
				});
		}
	}

	getWarrantyInfo() {
		if (this.warrantyService.hasFetchWarranty) {
			this.setWarrantyInfo(this.warrantyService.warrantyData);
		}
	}

	setWarrantyInfo(warrantyData: WarrantyData) {
		const warranty = this.systemStatus[2];
		const warrantyDate = this.formatLocaleDate.transform(warrantyData.endDate);
		// in warranty
		if (warrantyData.warrantyStatus === WarrantyStatusEnum.InWarranty) {
			this.translate12Subscription = this.translate
				.stream('dashboard.systemStatus.warranty.detail.until')
				.subscribe((re) => {
					warranty.detail = `${re} ${warrantyDate}`; // `Until ${warrantyDate}`;
				});
			warranty.status = 0;
		} else if (warrantyData.warrantyStatus === WarrantyStatusEnum.WarrantyExpired) {
			this.translate13Subscription = this.translate
				.stream('dashboard.systemStatus.warranty.detail.expiredOn')
				.subscribe((re) => {
					warranty.detail = `${re} ${warrantyDate}`; // `Warranty expired on ${warrantyDate}`;
				});
			warranty.status = 1;
		} else {
			this.translate14Subscription = this.translate
				.stream('dashboard.systemStatus.warranty.detail.notAvailable')
				.subscribe((re) => {
					warranty.detail = `${re}`; //  'Warranty not available';
				});
			warranty.status = 1;
		}
		warranty.status = 0;
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					if (!this.isOnline) {
						this.getOfflineContent();
					} else {
						this.getCachedContent();
					}
					if (this.showDeviceAndSecurityTimer) {
						clearTimeout(this.showDeviceAndSecurityTimer);
					}
					break;
				case LocalStorageKey.LastWarrantyData:
					if (notification.payload) {
						this.setWarrantyInfo(notification.payload);
					}
					break;
				case SelfSelectEvent.SegmentChange:
					if (this.isOnline) {
						this.getCachedContent();
					}
					this.getUsageType();
					break;
				default:
					break;
			}
		}
	}
	// checking self select status for HW Settings
	private getSelfSelectStatus() {
		this.dashboardService.getSelfSelectStatus().then((value) => {
			this.showQuickSettings = value;
		});
	}

	openFeedbackModal() {
		this.feedbackService.openFeedbackModal();
	}

	ngAfterViewInit() {
		this.commonService.markPerformanceNode('dashboard');
		this.commonService.sendNotification(
			PerformanceNotifications.firstPageInitialized,
			'dashboard'
		);
		this.metricsService.activateScrollCounter(PageName.Dashboard);
	}

	checkDeviceAndSecurityTimer() {
		if (!this.showDeviceAndSecurityTimer && this.dashboardService.canShowDeviceAndSecurityCard && this.isOnline) {
			this.showDeviceAndSecurityTimer = setTimeout(() => {
				this.isShowStateCard = false;
				this.showSecurityStatusCard = false;
			}, 5 * 60 * 1000);
		}
	}

	private async getSecurityCardInfo(): Promise<void> {
		const hypHidePosCStatusCard = await this.hypService.getFeatureSetting('HideSpecialCardOnPositionC')
			.then((result) => result === 'true')
			.catch(() => false);
		if (hypHidePosCStatusCard) { return; }
		this.showSecurityStatusCard = this.dashboardService.canShowDeviceAndSecurityCard && await this.dashboardService.isPositionCShowSecurityCard();
		if (!this.showSecurityStatusCard) {
			return;
		}
		this.checkDeviceAndSecurityTimer();
		const cacheSaStatus: LandingView = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.SecurityLandingLevel
		);
		if (cacheSaStatus) {
			this.setSecurityInfo(cacheSaStatus);
		}
		const pmOwnCache = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.SecurityLandingPasswordManagerShowOwn,
			false
		);
		const wifiOwnCache = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.SecurityLandingWifiSecurityShowOwn,
			false
		);
		const vpnOwnCache = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.SecurityLandingVPNShowOwn,
			false
		);
		this.haveOwnList = {
			passwordManager: pmOwnCache,
			wifiSecurity: wifiOwnCache,
			vpn: vpnOwnCache,
		};
		this.securityLevel = {
			landingStatus: { status: undefined, fullyProtected: false, percent: 0 },
			basicView: [
				securityStatus.avStatus,
				securityStatus.fwStatus,
				this.saFeatureSupport.pluginSupport ? securityStatus.waStatus : undefined,
			],
			intermediateView: [
				this.saFeatureSupport.pwdSupport ? securityStatus.pmStatus : undefined,
				this.saFeatureSupport.fingerprintSupport ? securityStatus.whStatus : undefined,
				this.saFeatureSupport.pluginSupport ? securityStatus.uacStatus : undefined,
			],
			advancedView: [
				this.securityAdvisor?.wifiSecurity.isSupported
					? securityStatus.wfStatus
					: undefined,
				this.saFeatureSupport.vpnSupport ? securityStatus.vpnStatus : undefined,
			],
		};
		this.deviceService
			.getMachineInfo()
			.then((result) => {
				this.saFeatureSupport.vpnSupport = true;
				this.saFeatureSupport.pwdSupport = true;
				if (toLower(result && result.country ? result.country : 'US') === 'cn') {
					this.saFeatureSupport.vpnSupport = false;
					this.saFeatureSupport.pwdSupport = false;
				}
			})
			.catch(() => {
				this.saFeatureSupport.vpnSupport = true;
				this.saFeatureSupport.pwdSupport = true;
			})
			.finally(() => {
				this.hypService
					.getFeatureSetting('SecurityAdvisor')
					.then((result) => {
						this.saFeatureSupport.pluginSupport = result === 'true';
					})
					.catch(() => {
						this.saFeatureSupport.pluginSupport = false;
					})
					.finally(() => {
						if (this.securityAdvisor) {
							this.securityAdvisor.on('*', this.securityAdvisorHandler);
						}
					});
			});
	}

	private refreshSA(): void {
		this.securityAdvisor?.refresh().then(() => {
			this.saFeatureSupport.fingerprintSupport = this.windowsHelloService.showWindowsHello(
				this.securityAdvisor.windowsHello
			);
			this.securityLevel = getSecurityLevel(
				this.securityAdvisor,
				undefined,
				this.haveOwnList,
				this.saFeatureSupport,
				this.localCacheService
			);
			this.setSecurityInfo(this.securityLevel.landingStatus);
		});
	}

	private setSecurityInfo(info: LandingView) {
		this.securityInfo = info;
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.SecurityLandingLevel,
			this.securityInfo
		);
		this.securityInfo.statusText =
			this.securityInfo.status !== undefined
				? this.translate.instant(
					this.positionCData[this.securityInfo.status + 1].statusText
				)
				: '--';
	}
}
