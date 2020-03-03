import { Component, OnInit, OnDestroy, SecurityContext, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { QaService } from '../../../services/qa/qa.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { Status } from 'src/app/data-models/widgets/status.model';
import { CommonService } from 'src/app/services/common/common.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { SystemUpdateService } from 'src/app/services/system-update/system-update.service';
import { UserService } from 'src/app/services/user/user.service';
import { AndroidService } from 'src/app/services/android/android.service';
import { UPEService } from 'src/app/services/upe/upe.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { AdPolicyService } from 'src/app/services/ad-policy/ad-policy.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { WarrantyService } from 'src/app/services/warranty/warranty.service';
import { SecureMath } from '@lenovo/tan-client-bridge';
import { DccService } from 'src/app/services/dcc/dcc.service';
import { SelfSelectEvent } from 'src/app/enums/self-select.enum';
import { FeatureContent } from 'src/app/data-models/common/feature-content.model';
import {SelfSelectService,SegmentConst} from 'src/app/services/self-select/self-select.service';
interface IConfigItem {
	id: string;
	template: string;
	position: string;
	cardPosition: string;
	cmsCardPosition: string;
	dashboardCache: string;
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
	dashboardStart: any = new Date();
	public hideTitle = false;

	heroBannerItems = []; // tile A
	cardContentPositionB: FeatureContent = new FeatureContent();
	cardContentPositionC: FeatureContent = new FeatureContent();
	cardContentPositionD: FeatureContent = new FeatureContent();
	cardContentPositionE: FeatureContent = new FeatureContent();
	cardContentPositionF: FeatureContent = new FeatureContent();

	heroBannerDemoItems = [];
	canShowDccDemo$: Promise<boolean>;

	heroBannerItemsCms: any[]; // tile A
	cardContentPositionBCms: FeatureContent = new FeatureContent();
	cardContentPositionCCms: FeatureContent = new FeatureContent();
	cardContentPositionDCms: FeatureContent = new FeatureContent();
	cardContentPositionECms: FeatureContent = new FeatureContent();
	cardContentPositionFCms: FeatureContent = new FeatureContent();

	upeRequestResult = {
		tileA: true,
		tileB: true,
		tileC: true,
		tileD: true,
		tileE: true,
		tileF: true
	};

	cmsRequestResult = {
		tileA: false,
		tileB: false,
		tileC: false,
		tileD: false,
		tileE: false,
		tileF: false
	};

	tileSource = {
		tileA: 'CMS',
		tileB: 'CMS',
		tileC: 'CMS',
		tileD: 'CMS',
		tileE: 'CMS',
		tileF: 'CMS'
	};

	configDic = [
		{
			id: 'tileA',
			template: 'home-page-hero-banner',
			position: 'position-A',
			cardPosition: 'heroBannerItems',
			cmsCardPosition: 'heroBannerItemsCms',
			dashboardCache: 'heroBannerItemsOnline'
		},
		{
			template: 'half-width-title-description-link-image',
			position: 'position-B',
			id: 'tileB',
			cardPosition: 'cardContentPositionB',
			cmsCardPosition: 'cardContentPositionBCms',
			dashboardCache: 'cardContentPositionBOnline'
		},
		{
			template: 'half-width-title-description-link-image',
			position: 'position-C',
			id: 'tileC',
			cardPosition: 'cardContentPositionC',
			cmsCardPosition: 'cardContentPositionCCms',
			dashboardCache: 'cardContentPositionCOnline'
		},
		{
			template: 'full-width-title-image-background',
			position: 'position-D',
			id: 'tileD',
			cardPosition: 'cardContentPositionD',
			cmsCardPosition: 'cardContentPositionDCms',
			dashboardCache: 'cardContentPositionDOnline'
		},
		{
			template: 'half-width-top-image-title-link',
			position: 'position-E',
			id: 'tileE',
			cardPosition: 'cardContentPositionE',
			cmsCardPosition: 'cardContentPositionECms',
			dashboardCache: 'cardContentPositionEOnline'
		},
		{
			template: 'half-width-top-image-title-link',
			position: 'position-F',
			id: 'tileF',
			cardPosition: 'cardContentPositionF',
			cmsCardPosition: 'cardContentPositionFCms',
			dashboardCache: 'cardContentPositionFOnline'
		}
	];

	/*forwardLink = {
		path: 'dashboard-customize',
		label: 'Customize Dashboard'
	};*/

	constructor(
		private router: Router,
		public dashboardService: DashboardService,
		public qaService: QaService,
		private modalService: NgbModal,
		config: NgbModalConfig,
		public commonService: CommonService,
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
		private sanitizer: DomSanitizer,
		public dccService: DccService,
		private selfselectService:SelfSelectService
	) {
		this.getProtocalAction();
		config.backdrop = 'static';
		config.keyboard = false;
		this.deviceService.getMachineInfo().then(() => {
			this.setDefaultSystemStatus();
		});
		// this.brand = this.deviceService.getMachineInfoSync().brand;
		this.brand = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType, -1);
		// Evaluate the translations for QA on language Change
		// this.qaService.setTranslationService(this.translate);
		// this.qaService.setCurrentLangTranslations();
		this.qaService.getQATranslation(translate); // VAN-5872, server switch feature
		// this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
		// 	this.fetchContent();
		// });

		this.isOnline = this.commonService.isOnline;
		this.isWarrantyVisible = deviceService.showWarranty;
	}

	ngOnInit() {
		this.dashboardService.isDashboardDisplayed = true;
		this.getWelcomeText();
		this.commonService.setSessionStorageValue(SessionStorageKey.DashboardInDashboardPage, true);
		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});

		this.isOnline = this.commonService.isOnline;
		if (this.dashboardService.isShellAvailable) {
			this.logger.info('PageDashboardComponent.getSystemInfo');
			this.getSystemInfo();
		}
		this.translate
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
				this.getPreviousContent();
				this.fetchContent();
				this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
					this.fetchContent();
				});
			});
		this.getSelfSelectStatus();
		this.canShowDccDemo$ = this.dccService.canShowDccDemo();
		this.launchProtocol();
		this.selfselectService.getConfig().then((re)=>{
			this.hideTitle = re.usageType === SegmentConst.Commercial;
		})
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

	ngAfterViewInit() {
		const dashboardEnd: any = new Date();
		const dashboardTime = dashboardEnd - this.dashboardStart;
		this.logger.info(`Performance: Dashboard load time after view init. ${dashboardTime}ms`);
	}

	ngOnDestroy() {
		this.dashboardService.isDashboardDisplayed = false;
		this.commonService.setSessionStorageValue(SessionStorageKey.DashboardInDashboardPage, false);
		this.qaService.destroyChangeSubscribed();
	}

	private getWelcomeText() {
		if (!this.dashboardService.welcomeText) {
			const win: any = window;
			let isShellOnline = true;
			if (win.VantageShellExtension && win.VantageShellExtension.MsWebviewHelper.getInstance().isInOfflineMode) {
				isShellOnline = false;
			}
			const dashboardLastWelcomeText = this.commonService.getLocalStorageValue(LocalStorageKey.DashboardLastWelcomeText);
			let textIndex = 1;
			const welcomeTextLength = 15;
			if (dashboardLastWelcomeText && dashboardLastWelcomeText.welcomeText) {
				const lastIndex = this.getWelcomeTextIndex(dashboardLastWelcomeText.welcomeText);
				if (!dashboardLastWelcomeText.isOnline && isShellOnline) {
					textIndex = lastIndex;
				} else {
					if (lastIndex === welcomeTextLength) {
						textIndex = 1;
					} else {
						textIndex = lastIndex + 1;
					}
				}
			} else {
				textIndex = Math.floor(SecureMath.random() * 15 + 1);
				if (textIndex === 2) {
					textIndex = 3;
				} // Do not show again in first time
			}
			if (textIndex === 8 && this.translate.currentLang.toLocaleLowerCase() !== 'en') {
				textIndex = 9;
			}
			this.dashboardService.welcomeText = `lenovoId.welcomeText${textIndex}`;
			this.dashboardService.welcomeTextWithoutUserName = `lenovoId.welcomeTextWithoutUserName${textIndex}`;
			this.commonService.setLocalStorageValue(
				LocalStorageKey.DashboardLastWelcomeText,
				{
					welcomeText: this.dashboardService.welcomeText,
					isOnline: isShellOnline
				}
			);
		}
	}

	private getWelcomeTextIndex(key: string) {
		return parseInt(key.replace('lenovoId.welcomeText', ''), 10);
	}

	private fetchContent(lang?: string) {
		// reset upe request result
		this.upeRequestResult = {
			tileA: true,
			tileB: true,
			tileC: true,
			tileD: true,
			tileE: true,
			tileF: true
		};
		// reset cms request result
		this.cmsRequestResult = {
			tileA: false,
			tileB: false,
			tileC: false,
			tileD: false,
			tileE: false,
			tileF: false
		};

		if (this.isOnline) {
			if (this.dashboardService.heroBannerItemsOnline.length > 0) {
				this.heroBannerItems = this.dashboardService.heroBannerItemsOnline;
			}
			if (this.dashboardService.cardContentPositionBOnline) {
				this.cardContentPositionB = this.dashboardService.cardContentPositionBOnline;
			}
			if (this.dashboardService.cardContentPositionCOnline) {
				this.cardContentPositionC = this.dashboardService.cardContentPositionCOnline;
			}
			if (this.dashboardService.cardContentPositionDOnline) {
				this.cardContentPositionD = this.dashboardService.cardContentPositionDOnline;
			}
			if (this.dashboardService.cardContentPositionEOnline) {
				this.cardContentPositionE = this.dashboardService.cardContentPositionEOnline;
			}
			if (this.dashboardService.cardContentPositionFOnline) {
				this.cardContentPositionF = this.dashboardService.cardContentPositionFOnline;
			}
		}

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
		this.cmsService.fetchCMSContent(queryOptions).subscribe(
			(response: any) => {
				const callCmsEndTime: any = new Date();
				const callCmsUsedTime = callCmsEndTime - callCmsStartTime;
				if (response && response.length > 0) {
					this.logger.info(`Performance: Dashboard page get cms content, ${callCmsUsedTime}ms`);
					this.getCMSHeroBannerItems(response);
					this.getCMSCardContentB(response);
					this.getCMSCardContentC(response);
					this.getCMSCardContentD(response);
					this.getCMSCardContentE(response);
					this.getCMSCardContentF(response);

				} else {
					const msg = `Performance: Dashboard page not have this language contents, ${callCmsUsedTime}ms`;
					this.logger.info(msg);
					this.fetchContent('en');
				}
			},
			(error) => {
				this.logger.info('fetchCMSContent error', error);
			}
		);
	}

	getHeroBannerDemoItems() {
		this.cmsRequestResult.tileA = true;
		this.heroBannerDemoItems = [{
			albumId: 1,
			id: '',
			source: this.sanitizer.sanitize(SecurityContext.HTML, 'VANTAGE'),
			title: this.sanitizer.sanitize(SecurityContext.HTML, 'Lenovo exclusive offer of Adobe designer suite'),
			url: '/assets/images/dcc/hero-banner-dcc.jpg',
			ActionLink: 'dcc-demo',
			ActionType: 'Internal',
			DataSource: 'cms'
		}];
	}

	getCMSHeroBannerItems(response) {
		const heroBannerItems = this.cmsService
			.getOneCMSContent(response, 'home-page-hero-banner', 'position-A')
			.map((record, index) => {
				return {
					albumId: 1,
					id: record.Id,
					source: this.sanitizer.sanitize(SecurityContext.HTML, record.Title),
					title: this.sanitizer.sanitize(SecurityContext.HTML, record.Description),
					url: record.FeatureImage,
					ActionLink: record.ActionLink,
					ActionType: record.ActionType,
					DataSource: 'cms'
				};
			});
		if (heroBannerItems && heroBannerItems.length && this.cmsHeroBannerChanged(heroBannerItems, this.heroBannerItemsCms)) {
			this.heroBannerItemsCms = heroBannerItems;
			this.cmsRequestResult.tileA = true;
			if (!this.upeRequestResult.tileA || this.tileSource.tileA === 'CMS') {
				this.heroBannerItems = this.heroBannerItemsCms;
				this.dashboardService.heroBannerItemsOnline = this.heroBannerItemsCms;
			}
		}
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

	getCMSCardContentB(response) {
		const cardContentPositionB = this.cmsService.getOneCMSContent(
			response,
			'half-width-title-description-link-image',
			'position-B'
		)[0];
		if (cardContentPositionB) {
			this.cardContentPositionBCms = cardContentPositionB;
			if (this.cardContentPositionBCms.BrandName) {
				this.cardContentPositionBCms.BrandName = this.cardContentPositionBCms.BrandName.split('|')[0];
			}
			this.cardContentPositionBCms.DataSource = 'cms';
			this.cmsRequestResult.tileB = true;
			if (!this.upeRequestResult.tileB || this.tileSource.tileB === 'CMS') {
				this.cardContentPositionB = this.cardContentPositionBCms;
				this.dashboardService.cardContentPositionBOnline = this.cardContentPositionBCms;
			}
		}
	}

	getCMSCardContentC(response) {
		const cardContentPositionC = this.cmsService.getOneCMSContent(
			response,
			'half-width-title-description-link-image',
			'position-C'
		)[0];
		if (cardContentPositionC) {
			this.cardContentPositionCCms = cardContentPositionC;
			if (this.cardContentPositionC.BrandName) {
				this.cardContentPositionC.BrandName = this.cardContentPositionC.BrandName.split('|')[0];
			}
			this.cardContentPositionCCms.DataSource = 'cms';
			this.cmsRequestResult.tileC = true;
			if (!this.upeRequestResult.tileC || this.tileSource.tileC === 'CMS') {
				this.cardContentPositionC = this.cardContentPositionCCms;
				this.dashboardService.cardContentPositionCOnline = this.cardContentPositionCCms;
			}
		}
	}

	getCMSCardContentD(response) {
		const cardContentPositionD = this.cmsService.getOneCMSContent(
			response,
			'full-width-title-image-background',
			'position-D'
		)[0];
		if (cardContentPositionD) {
			this.cardContentPositionDCms = cardContentPositionD;
			this.cardContentPositionDCms.DataSource = 'cms';
			this.cmsRequestResult.tileD = true;
			if (!this.upeRequestResult.tileD || this.tileSource.tileD === 'CMS') {
				this.cardContentPositionD = this.cardContentPositionDCms;
				this.dashboardService.cardContentPositionDOnline = this.cardContentPositionDCms;
			}
		}
	}

	getCMSCardContentE(response) {
		const cardContentPositionE = this.cmsService.getOneCMSContent(
			response,
			'half-width-top-image-title-link',
			'position-E'
		)[0];
		if (cardContentPositionE) {
			this.cardContentPositionECms = cardContentPositionE;
			this.cardContentPositionECms.DataSource = 'cms';
			this.cmsRequestResult.tileE = true;
			if (!this.upeRequestResult.tileE || this.tileSource.tileE === 'CMS') {
				this.cardContentPositionE = this.cardContentPositionECms;
				this.dashboardService.cardContentPositionEOnline = this.cardContentPositionECms;
			}
		}
	}

	getCMSCardContentF(response) {
		const cardContentPositionF = this.cmsService.getOneCMSContent(
			response,
			'half-width-top-image-title-link',
			'position-F'
		)[0];
		if (cardContentPositionF) {
			this.cardContentPositionFCms = cardContentPositionF;
			this.cardContentPositionFCms.DataSource = 'cms';
			this.cmsRequestResult.tileF = true;
			if (!this.upeRequestResult.tileF || this.tileSource.tileF === 'CMS') {
				this.cardContentPositionF = this.cardContentPositionFCms;
				this.dashboardService.cardContentPositionFOnline = this.cardContentPositionFCms;
			}
		}
	}

	async fetchUPEContent() {
		const positions = [];
		const contentCards: IConfigItem[] = [];
		this.configDic.forEach(cardItem => {
			if (this.tileSource[cardItem.id] === 'UPE') {
				positions.push(cardItem.position);
				contentCards.push(cardItem);
			}
		});

		if (positions.length === 0) {
			return;
		}

		try {
			const response = await this.upeService.fetchUPEContent({ positions });
			contentCards.forEach(cardItem => {
				const articles = this.cmsService.getOneCMSContent(response, cardItem.template, cardItem.position);
				if (cardItem.position === 'position-A') {
					const bannerArticles = articles.map((record) => {
						return {
							albumId: 1,
							id: record.Id,
							source: this.sanitizer.sanitize(SecurityContext.HTML, record.Title),
							title: this.sanitizer.sanitize(SecurityContext.HTML, record.Description),
							url: record.FeatureImage,
							ActionLink: record.ActionLink,
							ActionType: record.ActionType,
							DataSource: 'upe'
						};
					});

					if (bannerArticles && bannerArticles.length) {
						this[cardItem.cardPosition] = bannerArticles;
						this.dashboardService[cardItem.dashboardCache] = bannerArticles;
						this.upeRequestResult[cardItem.id] = true;
					}
				} else {
					const article = articles[0];
					if (article) {
						if (article.BrandName) {
							article.BrandName = article.BrandName.split('|')[0];
						}
						article.DataSource = 'upe';
						this[cardItem.cardPosition] = article;
						this.dashboardService[cardItem.dashboardCache] = article;
						this.upeRequestResult[cardItem.id] = true;
					}
				}
			});
		} catch (ex) {
			this.logger.info(`Cause by error: ${ex}, position-B load CMS content.`);
			contentCards.forEach(cardItem => {
				this.upeRequestResult[cardItem.id] = false;
				if (this.cmsRequestResult[cardItem.id]) {
					this[cardItem.cardPosition] = this[cardItem.cmsCardPosition];
					this.dashboardService[cardItem.dashboardCache] = this[cardItem.cmsCardPosition];
				}
			});
		}
	}

	private getTileSource() {
		return new Promise((resolve) => {
			this.hypService.getAllSettings().then(
				(hyp: any) => {
					const positions = ['A', 'B', 'C', 'D', 'E', 'F'];

					if (hyp.TileSource && hyp.TileSource === 'UPE_*') {	// 1. TileSource like UPE_*
						positions.forEach(position => {
							this.tileSource[`tile${position}`] = 'UPE';
						});
					} else if (hyp.TileSource && hyp.TileSource.startsWith('UPE')) {	// 2. TileSource like UPE_A_B_C_X
						const tileSource = hyp.TileSource.toUpperCase();
						positions.forEach(position => {
							if (tileSource.indexOf(`_${position}`) !== -1) {		// TileSource contains _A, _B, _X ...
								this.tileSource[`tile${position}`] = 'UPE';			// like this.tileSource[tileA] = 'UPE'
							} else {
								this.tileSource[`tile${position}`] = 'CMS';
							}
						});
					} else {	// 3. TileSource like empty/null/unknown value
						positions.forEach(position => {
							this.tileSource[`tile${position}`] = 'CMS';
						});

						// compatible with the older configuration
						this.tileSource.tileB = hyp.TileBSource === 'UPE' ? 'UPE' : 'CMS';
					}

					resolve();
				},
				() => {
					resolve();
					this.logger.info('get tile source failed.');
				}
			);
		});
	}

	private getPreviousContent() {
		this.heroBannerItems = this.dashboardService.heroBannerItems;
		this.cardContentPositionB = this.dashboardService.cardContentPositionB;
		this.cardContentPositionC = this.dashboardService.cardContentPositionC;
		this.cardContentPositionD = this.dashboardService.cardContentPositionD;
		this.cardContentPositionE = this.dashboardService.cardContentPositionE;
		this.cardContentPositionF = this.dashboardService.cardContentPositionF;
	}

	private setDefaultSystemStatus() {
		const memory = new Status();
		memory.status = 4;
		memory.id = 'memory';
		memory.metricsItemName = 'Memory';

		this.translate.stream('dashboard.systemStatus.memory.title').subscribe((value) => {
			memory.title = value;
		});

		this.translate.stream('dashboard.systemStatus.memory.detail.notFound').subscribe((value) => {
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

		this.translate.stream('dashboard.systemStatus.diskSpace.title').subscribe((value) => {
			disk.title = value;
		});

		this.translate.stream('dashboard.systemStatus.diskSpace.detail.notFound').subscribe((value) => {
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

		this.translate.stream('dashboard.systemStatus.warranty.title').subscribe((value) => {
			warranty.title = value;
		});

		this.translate.stream('dashboard.systemStatus.warranty.detail.notFound').subscribe((value) => {
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

			this.translate.stream('dashboard.systemStatus.systemUpdate.title').subscribe((value) => {
				systemUpdate.title = value;
			});

			this.translate.stream('dashboard.systemStatus.systemUpdate.detail.update').subscribe((value) => {
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
				this.translate.stream('dashboard.systemStatus.memory.detail.of').subscribe((re) => {
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
			this.dashboardService.getRecentUpdateInfo().subscribe((value) => {
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
		this.warrantyService.getWarrantyInfo().subscribe((value) => {
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
		const warrantyDate = this.commonService.formatUTCDate(value.endDate);
		// in warranty
		if (value.status === 0) {
			this.translate.stream('dashboard.systemStatus.warranty.detail.until').subscribe((re) => {
				warranty.detail = `${re} ${warrantyDate}`; // `Until ${warrantyDate}`;
			});
			warranty.status = 0;
		} else if (value.status === 1) {
			this.translate.stream('dashboard.systemStatus.warranty.detail.expiredOn').subscribe((re) => {
				warranty.detail = `${re} ${warrantyDate}`; // `Warranty expired on ${warrantyDate}`;
			});
			warranty.status = 1;
		} else {
			this.translate.stream('dashboard.systemStatus.warranty.detail.notAvailable').subscribe((re) => {
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
						this.getPreviousContent();
					} else {
						this.fetchContent();
						// this.fetchUPEContent();
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
}
