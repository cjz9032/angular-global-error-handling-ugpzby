import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import map from 'lodash/map';
import sample from 'lodash/sample';
import trim from 'lodash/trim';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';
import { WelcomeTextContent } from 'src/app/data-models/welcomeText/welcome-text.model';
import { Status } from 'src/app/data-models/widgets/status.model';
import { ContentActionType, ContentSource } from 'src/app/enums/content.enum';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { SelfSelectEvent } from 'src/app/enums/self-select.enum';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { FormatLocaleDatePipe } from 'src/app/pipe/format-locale-date/format-locale-date.pipe';
import { AdPolicyService } from 'src/app/services/ad-policy/ad-policy.service';
import { AndroidService } from 'src/app/services/android/android.service';
import { CMSService } from 'src/app/services/cms/cms.service';
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
import { SegmentConst, SelfSelectService } from 'src/app/services/self-select/self-select.service';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { UPEService } from 'src/app/services/upe/upe.service';
import { UserService } from 'src/app/services/user/user.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { WarrantyService } from 'src/app/services/warranty/warranty.service';
import { QaService } from '../../../services/qa/qa.service';

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
	styleUrls: ['./page-dashboard.component.scss']
})
export class PageDashboardComponent implements OnInit, OnDestroy, AfterViewInit {

	offlineConnection = 'offline-connection';
	public systemStatus: Status[] = [];
	public isOnline = true;
	public brand;
	private protocolAction: any;
	private lastAction: any;
	public warrantyData: { info: { endDate: null; status: 2; startDate: null; url: string }; cache: boolean };
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
	cmsSubscription: Subscription;

	supportDatas = {
		documentation: [
			{
				icon: ['fal', 'book'],
				title: 'support.documentation.listUserGuide',
				clickItem: 'userGuide',
				metricsItem: 'Documentation.UserGuideButton',
				metricsEvent: 'FeatureClick',
				metricsParent: 'Dashboard'
			}
		],
		needHelp: [],
		quicklinks: [],
	};

	heroBannerDemoItems = [];
	canShowDccDemo$: Promise<boolean>;

	contentCards = {
		positionA: {
			displayContent: [],
			template: 'home-page-hero-banner',
			cardId: 'positionA',
			positionParam: 'position-A',
			tileSource: 'CMS',
			cmsContent: undefined,
			upeContent: undefined
		},
		positionB: {
			displayContent: new FeatureContent(),
			template: 'half-width-title-description-link-image',
			cardId: 'positionB',
			positionParam: 'position-B',
			tileSource: 'CMS',
			cmsContent: undefined,
			upeContent: undefined
		},
		positionC: {
			displayContent: new FeatureContent(),
			template: 'half-width-title-description-link-image',
			cardId: 'positionC',
			positionParam: 'position-C',
			tileSource: 'CMS',
			cmsContent: undefined,
			upeContent: undefined
		},
		positionD: {
			displayContent: new FeatureContent(),
			template: 'full-width-title-image-background',
			cardId: 'positionD',
			positionParam: 'position-D',
			tileSource: 'CMS',
			cmsContent: undefined,
			upeContent: undefined
		},
		positionE: {
			displayContent: new FeatureContent(),
			template: 'half-width-top-image-title-link',
			cardId: 'positionE',
			positionParam: 'position-E',
			tileSource: 'CMS',
			cmsContent: undefined,
			upeContent: undefined
		},
		positionF: {
			displayContent: new FeatureContent(),
			template: 'half-width-top-image-title-link',
			cardId: 'positionF',
			positionParam: 'position-F',
			tileSource: 'CMS',
			cmsContent: undefined,
			upeContent: undefined
		}
	};

	constructor(
		private router: Router,
		public dashboardService: DashboardService,
		public qaService: QaService,
		private config: NgbModalConfig,
		public commonService: CommonService,
		private formatLocaleDate: FormatLocaleDatePipe,
		public deviceService: DeviceService,
		private cmsService: CMSService,
		private upeService: UPEService,
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
		private metricsService: MetricService
	) {
	}

	ngOnInit() {
		this.getProtocalAction();
		this.config.backdrop = 'static';
		this.config.keyboard = false;
		this.isOnline = this.commonService.isOnline;
		this.deviceService.getMachineInfo().then(() => {
			this.setDefaultSystemStatus();
			if (this.dashboardService.isShellAvailable) {
				this.logger.info('PageDashboardComponent.getSystemInfo');
				this.getSystemInfo();
			}
		});
		this.brand = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType, -1);
		this.qaService.setCurrentLangTranslations();
		this.isWarrantyVisible = this.deviceService.showWarranty;
		this.dashboardService.isDashboardDisplayed = true;
		this.getWelcomeTextFromCache();
		this.commonService.setSessionStorageValue(SessionStorageKey.DashboardInDashboardPage, true);
		this.subscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});

		this.translateSubscription = this.translate
			.stream([
				'dashboard.offlineInfo.welcomeToVantage',
				'common.menu.support',
				'common.menu.device.sub2',
				'dashboard.offlineInfo.systemHealth',
				'settings.preferenceSettings',
				'systemUpdates.title',
				'systemUpdates.readMore'
			])
			.subscribe((result) => {
				this.dashboardService.translateString = result;
				this.dashboardService.setDefaultCMSContent();
				this.getOfflineContent();
				this.fetchContent();
			});

		this.langChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.fetchContent();
		});

		this.getSelfSelectStatus();
		this.canShowDccDemo$ = this.dccService.canShowDccDemo();
		this.launchProtocol();
		this.hideTitleInCommercial();
	}

	private hideTitleInCommercial() {
		this.selfselectService.getConfig().then((re) => {
			this.hideTitle = re.usageType === SegmentConst.Commercial;
		});
	}

	private getProtocalAction() {
		this.protocolAction = this.activatedRoute.snapshot.queryParams.action;
		const currentNavigate = this.router.getCurrentNavigation();
		if (currentNavigate && this.router.getCurrentNavigation().extras !== undefined) {
			const extras = this.router.getCurrentNavigation().extras;
			if (!this.protocolAction && extras.queryParams !== undefined && extras.queryParams.action !== undefined) {
				this.protocolAction = extras.queryParams.action;
			}
		}
	}

	private launchProtocol() {
		if (this.protocolAction && (this.lastAction !== this.protocolAction)) {
			if (this.protocolAction.toLowerCase() === 'lenovoid' && !this.userService.auth) {
				const shellVersion = this.vantageShellService.getShellVersion();
				if (this.commonService.compareVersion(shellVersion, '10.2001.9') >= 0) {
					// New shell use await to sync with UI, launch LID immediately
					setTimeout(() => this.dialogService.openLenovoIdDialog(), 0);
				} else {
					// Delay 2 seconds then launch LID, this is workarround for old shell sync issue with UI,
					//  UI will possibly become blank in case of protocol launch
					setTimeout(() => this.dialogService.openLenovoIdDialog(), 2000);
				}
			} else if (this.protocolAction.toLowerCase() === 'modernpreload') {
				setTimeout(() => this.dialogService.openModernPreloadModal(), 0);
			}
			this.lastAction = this.protocolAction;
		}
	}


	ngOnDestroy() {
		this.metricsService.deactivateScrollCounter(PageName.Dashboard);

		this.dashboardService.isDashboardDisplayed = false;
		this.commonService.setSessionStorageValue(SessionStorageKey.DashboardInDashboardPage, false);
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
		if (this.cmsSubscription) {
			this.cmsSubscription.unsubscribe();
		}
	}

	private getWelcomeTextFromCache() {
		if (!this.dashboardService.welcomeText) {
			const cacheWelcomeTexts: WelcomeTextContent[] = this.commonService.getLocalStorageValue(LocalStorageKey.DashboardWelcomeTexts);
			if (cacheWelcomeTexts && cacheWelcomeTexts.length > 0) {
				this.localInfoService.getLocalInfo().then((localInfo: any) => {
					const isLangCacheTexts = cacheWelcomeTexts.find(content => content.language === localInfo.Lang);
					if (isLangCacheTexts && [SegmentConst.Consumer, SegmentConst.SMB].includes(localInfo.Segment)) {
						this.dashboardService.welcomeText = sample(isLangCacheTexts.titles);
					}
				});
			}
		}
	}

	private getWelcomeTextFromCms(response: any) {
		const welcomeTextContent: any = this.cmsService.getOneCMSContent(response, 'top-title-welcome-text', 'welcome-text')[0];
		if (welcomeTextContent && welcomeTextContent.Title) {
			this.localInfoService.getLocalInfo().then((localInfo: any) => {
				if ([SegmentConst.Consumer, SegmentConst.SMB].includes(localInfo.Segment)) {
					let dashboardWelcomeTexts: WelcomeTextContent[] = [];
					const titles = map(welcomeTextContent.Title.split('|||'), trim);
					if (!this.dashboardService.welcomeText) {
						this.dashboardService.welcomeText = sample(titles);
					}
					const cacheWelcomeTexts: WelcomeTextContent[] = this.commonService.getLocalStorageValue(LocalStorageKey.DashboardWelcomeTexts);
					if (cacheWelcomeTexts && cacheWelcomeTexts.length > 0) {
						dashboardWelcomeTexts = cacheWelcomeTexts;
					}
					const language = localInfo.Lang;
					const isLangCacheTexts = dashboardWelcomeTexts.find(content => content.language === language);
					if (isLangCacheTexts) {
						isLangCacheTexts.titles = titles;
					} else {
						dashboardWelcomeTexts.push({ language, titles });
					}
					this.commonService.setLocalStorageValue(LocalStorageKey.DashboardWelcomeTexts, dashboardWelcomeTexts);
				}
			});
		}
	}

	private fetchContent(lang?: string) {

		// apply online cache
		if (this.isOnline) {
			Object.keys(this.contentCards).forEach(cardId => {
				if (this.dashboardService.onlineCardContent[cardId]) {
					this.contentCards[cardId].displayContent = this.dashboardService.onlineCardContent[cardId];
				}
			});
		}

		// fetch new online content
		this.getTileSource().then(() => {
			this.fetchCMSContent(lang);
			this.fetchUPEContent();
		});

		this.dccService.canShowDccDemo().then((show) => {
			if (show) {
				this.getHeroBannerDemoItems();
			}
		});
	}

	private fetchCMSContent(lang?: string) {
		const callCmsStartTime: any = new Date();
		let queryOptions: any = {
			Page: 'dashboard'
		};
		if (lang) {
			queryOptions = {
				Page: 'dashboard',
				Lang: lang,
				GEO: 'US'
			};
		}

		this.cmsSubscription = this.cmsService.fetchCMSContent(queryOptions).subscribe(
			(response: any) => {
				const callCmsEndTime: any = new Date();
				const callCmsUsedTime = callCmsEndTime - callCmsStartTime;
				if (response && response.length > 0) {
					this.logger.info(`Performance: Dashboard page get cms content, ${callCmsUsedTime}ms`);
					this.populateCMSContent(response);
					this.getWelcomeTextFromCms(response);

				} else {
					const msg = `Performance: Dashboard page not have this language contents, ${callCmsUsedTime}ms`;
					this.logger.info(msg);
					// this.fetchContent('en'); if cms server return nothing, it would retry infinitely
				}
			},
			(error) => {
				this.logger.info('fetchCMSContent error', error);
			}
		);
	}

	async fetchUPEContent() {
		const upeContentCards = Object.values(this.contentCards).filter(contentCard => contentCard.tileSource === 'UPE');
		if (upeContentCards.length === 0) {
			return;
		}

		const upePositions = upeContentCards.map(contentCard => contentCard.positionParam);
		const startCallUPE: any = new Date();
		try {
			const response = await this.upeService.fetchUPEContent({ positions: upePositions });
			const endCallUPE: any = new Date();
			this.logger.info(`Performance: Dashboard page get upe content, ${endCallUPE - startCallUPE}ms`);
			this.populateUPEContent(response, upeContentCards);
		} catch (ex) {
			upeContentCards.forEach(contentCard => {
				contentCard.upeContent = null;

				if (contentCard.cmsContent) {
					this.dashboardService.onlineCardContent[contentCard.cardId] = contentCard.cmsContent;
				} // else do nothing

				if (this.isOnline && this.dashboardService.onlineCardContent[contentCard.cardId]) {
					contentCard.displayContent = this.dashboardService.onlineCardContent[contentCard.cardId];
				}
			});
		}
	}


	private formalizeContent(contents, position, dataSource) {
		contents.forEach(content => {
			if (content.BrandName) {
				content.BrandName = content.BrandName.split('|')[0]; // formalize BrandName
			}
			content.DataSource = dataSource;
		});

		if (position === 'position-A') {
			return contents.map((record) => {
				return {
					albumId: 1,
					id: record.Id,
					source: record.Title,
					title: record.Description,
					url: record.FeatureImage,
					ActionLink: record.ActionLink,
					ActionType: record.ActionType,
					OverlayTheme: record.OverlayTheme ? record.OverlayTheme : '',
					DataSource: record.DataSource
				};
			});

		} else {
			return contents[0];
		}
	}

	private populateCMSContent(response: any) {
		const dataSource = 'cms';
		const contentCards: IConfigItem[] = Object.values(this.contentCards);

		contentCards.forEach(contentCard => {
			let contents: any = this.cmsService.getOneCMSContent(response, contentCard.template, contentCard.positionParam);
			if (contents && contents.length > 0) {
				contents = this.formalizeContent(contents, contentCard.positionParam, dataSource);
				contentCard.cmsContent = contents;
				if ((contentCard.tileSource === 'CMS' || contentCard.upeContent === null) && contentCard.cmsContent) {	// contentCard.upeContent === null means no upe content
					this.dashboardService.onlineCardContent[contentCard.cardId] = contentCard.cmsContent;

					if (contentCard.cardId === 'positionA'
						&& !this.cmsHeroBannerChanged(contentCard.displayContent, this.dashboardService.onlineCardContent[contentCard.cardId])) {
						return;	// don't need to update, developer said this could present the refresh of positionA
					}
					contentCard.displayContent = this.dashboardService.onlineCardContent[contentCard.cardId];
				} // else do nothing
			} // else do nothing
		});
	}


	private populateUPEContent(response: any, contentCards: IConfigItem[]) {
		const dataSource = 'upe';

		contentCards.forEach(contentCard => {
			let contents: any = this.cmsService.getOneCMSContent(response, contentCard.template, contentCard.positionParam, ContentSource.UPE);
			contentCard.upeContent = null;
			if (contents && contents.length > 0) {
				contents = this.formalizeContent(contents, contentCard.positionParam, dataSource);
				contentCard.upeContent = contents;
				this.dashboardService.onlineCardContent[contentCard.cardId] = contentCard.upeContent;
			} else if (contentCard.cmsContent) {
				this.dashboardService.onlineCardContent[contentCard.cardId] = contentCard.cmsContent;
			} // else do nothing

			if (contentCard.cardId === 'positionA'
				&& !this.cmsHeroBannerChanged(contentCard.displayContent, this.dashboardService.onlineCardContent[contentCard.cardId])) {
				return;	// don't need to update, developer said this could present the refresh of positionA
			}

			if (this.dashboardService.onlineCardContent[contentCard.cardId]) {
				contentCard.displayContent = this.dashboardService.onlineCardContent[contentCard.cardId];
			}
		});
	}

	getHeroBannerDemoItems() {
		this.heroBannerDemoItems = [{
			albumId: 1,
			id: '',
			source: 'VANTAGE',
			title: 'Lenovo exclusive offer of Adobe designer suite',
			url: 'assets/images/dcc/hero-banner-dcc.jpg',
			ActionLink: 'dcc-demo',
			ActionType: ContentActionType.Internal,
			DataSource: ContentSource.Local
		}];
	}

	cmsHeroBannerChanged(bannerItems1, bannerItems2) {
		let result = false;
		if ((bannerItems1 && !bannerItems2)
			|| (!bannerItems1 && bannerItems2)) {
			result = true;
		} else if (bannerItems1 && bannerItems2) {
			if (bannerItems1.length !== bannerItems2.length) {
				result = true;
			} else {
				for (let i = 0; i < bannerItems1.length; i++) {
					if ((bannerItems1[i] && !bannerItems2[i])
						|| (!bannerItems1[i] && bannerItems2[i])) {
						result = true;
						break;
					} else if (bannerItems1[i] && bannerItems2[i]
						&& JSON.stringify(bannerItems2[i]) !== JSON.stringify(bannerItems1[i])) {
						result = true;
						break;
					}
				}
			}
		}
		return result;
	}

	private async getTileSource() {
		const allPositions = ['positionA', 'positionB', 'positionC', 'positionD', 'positionE', 'positionF'];
		let upePositions = [];

		try {
			const hyp = await this.hypService.getAllSettings() as any;
			if (hyp.TileSource && hyp.TileSource === 'UPE_*') {	// 1. TileSource like UPE_*

				upePositions = allPositions;

			} else if (hyp.TileSource && hyp.TileSource.startsWith('UPE')) {

				const tileSource = hyp.TileSource.toUpperCase();
				upePositions = allPositions.filter(position => {
					const lastLetter = position.substr(-1, 1);
					return tileSource.indexOf(`_${lastLetter}`) !== -1;		// 2. TileSource like UPE_A_B_C_X
				});

			} else if (hyp.TileBSource === 'UPE') {	// 3. TileSource like empty/null/unknown value, check TileBSource for compatible

				upePositions.push('positionB');

			} // else do nothing
		} catch (ex) {
			this.logger.info(`get tile source failed.${ex.message}`);
		}

		allPositions.forEach(position => {
			this.contentCards[position].tileSource = 'CMS';
		});

		upePositions.forEach(position => {
			this.contentCards[position].tileSource = 'UPE';
		});
	}

	private getOfflineContent() {
		Object.keys(this.contentCards).forEach(cardId => {	// 'positionA', 'positionB'...'positionF'
			this.contentCards[cardId].displayContent = this.dashboardService.offlineCardContent[cardId];
		});
	}

	private setDefaultSystemStatus() {
		const memory = new Status();
		memory.status = 4;
		memory.id = 'memory';
		memory.metricsItemName = 'Memory';

		this.translate1Subscription = this.translate.stream('dashboard.systemStatus.memory.title').subscribe((value) => {
			memory.title = value;
		});

		this.translate2Subscription = this.translate.stream('dashboard.systemStatus.memory.detail.notFound').subscribe((value) => {
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

		this.translate3Subscription = this.translate.stream('dashboard.systemStatus.diskSpace.title').subscribe((value) => {
			disk.title = value;
		});

		this.translate4Subscription = this.translate.stream('dashboard.systemStatus.diskSpace.detail.notFound').subscribe((value) => {
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

		this.translate5Subscription = this.translate.stream('dashboard.systemStatus.warranty.title').subscribe((value) => {
			warranty.title = value;
		});

		this.translate6Subscription = this.translate.stream('dashboard.systemStatus.warranty.detail.notFound').subscribe((value) => {
			warranty.detail = value;
		});

		warranty.path = '/support';
		warranty.asLink = false;
		/* warranty.isSystemLink = true; */
		warranty.isSystemLink = false;
		warranty.type = 'system';
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

			this.translate7Subscription = this.translate.stream('dashboard.systemStatus.systemUpdate.title').subscribe((value) => {
				systemUpdate.title = value;
			});

			this.translate8Subscription = this.translate.stream('dashboard.systemStatus.systemUpdate.detail.update').subscribe((value) => {
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
				this.translate9Subscription = this.translate.stream('dashboard.systemStatus.memory.detail.of').subscribe((re) => {
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
			this.translate10Subscription = this.dashboardService.getRecentUpdateInfo().subscribe((value) => {
				if (value) {
					const systemUpdate = this.systemStatus[3];
					const diffInDays = this.systemUpdateService.dateDiffInDays(value.lastupdate);
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
		this.translate11Subscription = this.warrantyService.getWarrantyInfo().subscribe((value) => {
			if (value) {
				this.setWarrantyInfo(value);
			}
		});
	}

	setWarrantyInfo(value: any) {
		this.warrantyData = {
			info: {
				startDate: value.startDate,
				endDate: value.endDate,
				status: value.status,
				url: this.warrantyService.getWarrantyUrl()
			},
			cache: true
		};
		const warranty = this.systemStatus[2];
		const warrantyDate = this.formatLocaleDate.transform(value.endDate);
		// in warranty
		if (value.status === 0) {
			this.translate12Subscription = this.translate.stream('dashboard.systemStatus.warranty.detail.until').subscribe((re) => {
				warranty.detail = `${re} ${warrantyDate}`; // `Until ${warrantyDate}`;
			});
			warranty.status = 0;
		} else if (value.status === 1) {
			this.translate13Subscription = this.translate.stream('dashboard.systemStatus.warranty.detail.expiredOn').subscribe((re) => {
				warranty.detail = `${re} ${warrantyDate}`; // `Warranty expired on ${warrantyDate}`;
			});
			warranty.status = 1;
		} else {
			this.translate14Subscription = this.translate.stream('dashboard.systemStatus.warranty.detail.notAvailable').subscribe((re) => {
				warranty.detail = `${re}`; //  'Warranty not available';
			});
			warranty.status = 1;
		}
		warranty.isHidden = !this.deviceService.showWarranty;
		this.isWarrantyVisible = this.deviceService.showWarranty;
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
						this.fetchContent();
						this.getWarrantyInfo();
					}
					break;
				case LocalStorageKey.LastWarrantyStatus:
					if (notification.payload) {
						this.setWarrantyInfo(notification.payload);
					}
					break;
				case SelfSelectEvent.SegmentChange:
					if (this.isOnline) {
						this.fetchContent();
					}
					this.hideTitleInCommercial();
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
		this.metricsService.activateScrollCounter(PageName.Dashboard);
	}
}
