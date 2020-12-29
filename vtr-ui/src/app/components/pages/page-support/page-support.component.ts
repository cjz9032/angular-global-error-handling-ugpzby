import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MockService } from '../../../services/mock/mock.service';
import { SupportService } from '../../../services/support/support.service';
import { DeviceService } from '../../../services/device/device.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { WarrantyService } from 'src/app/services/warranty/warranty.service';
import { SupportContentStatus } from 'src/app/enums/support-content-status.enum';

import { environment } from 'src/environments/environment';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';
import { LicensesService } from 'src/app/services/licenses/licenses.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ContentSource } from 'src/app/enums/content.enum';

@Component({
	selector: 'vtr-page-support',
	templateUrl: './page-support.component.html',
	styleUrls: ['./page-support.component.scss'],
})
export class PageSupportComponent implements OnInit, OnDestroy {
	SupportContentStatus = SupportContentStatus;
	title = 'support.common.getSupport';
	searchWords = '';
	searchCount = 1;
	offlineConnection = 'offline-connection';
	emptyArticles = {
		leftTop: [],
		middleTop: [],
		leftBottom: [],
		middleBottom: [],
		right: [],
		leftBottomSmall: [],
		middleBottomSmall: [],
	};
	backupContentArticles = this.copyObjectArray(this.emptyArticles);
	articles = this.copyObjectArray(this.emptyArticles);
	articlesType = '';
	articleCategories: any = [];
	isCategoryArticlesShow = false;
	selectedCategoryId = '';
	warrantyData: { info: any; cache: boolean };
	warrantyYear = 0;
	isOnline: boolean;
	notificationSubscription: Subscription;
	backId = 'support-page-btn-back';
	getArticlesTimeout: any;
	supportDatas = {
		documentation: [
			{
				icon: ['fal', 'book'],
				title: 'support.documentation.listUserGuide',
				clickItem: 'userGuide',
				metricsItem: 'Documentation.UserGuideButton',
				metricsEvent: 'FeatureClick',
			},
		],
		needHelp: [],
		quicklinks: [],
	};
	listLenovoCommunity = {
		icon: ['fal', 'comment-alt'],
		title: 'support.needHelp.listLenovoCommunity',
		url: 'https://community.lenovo.com',
		metricsItem: 'NeedHelp.LenovoCommunityButton',
		metricsEvent: 'FeatureClick',
	};
	listContactCustomerService = {
		icon: ['fal', 'share-alt'],
		title: 'support.needHelp.listContactCustomerService',
		url: 'https://support.lenovo.com/contactus?serialnumber=',
		metricsItem: 'NeedHelp.ContactCustomerServiceButton',
		metricsEvent: 'FeatureClick',
	};
	listYourVirtualAssistant = {
		icon: ['fal', 'robot'],
		title: 'support.needHelp.listYourVirtualAssistant',
		url: 'https://lena.lenovo.com/lena',
		metricsItem: 'NeedHelp.YourVirtualAssistantButton',
		metricsEvent: 'FeatureClick',
	};

	// lenaUrls = [
	// 	{ url: 'https://in.lena.lenovo.com/lena', lang: 'en', geo: ['in', 'lk', 'bd'] },
	// 	{ url: 'https://us.lena.lenovo.com/lena', lang: 'en', geo: ['us', 'ca'] },
	// 	{ url: 'https://uki.lena.lenovo.com/lena', lang: 'en', geo: ['gb', 'ie'] },
	// 	{ url: 'https://lena.lenovo.com/lena', lang: 'en', geo: ['au', 'nz', 'sg', 'my', 'ph'] },
	// 	{
	// 		url: 'https://las.lena.lenovo.com/lena',
	// 		lang: 'es',
	// 		geo: ['mx', 'co', 'ar', 'pe', 'cl', 'cr', 'do', 'sv', 'gt', 'hn', 'ni', 'pa', 'bo', 'ec', 'py',
	// 			'uy', 've'],
	// 	},
	// 	{ url: 'https://jp.lena.lenovo.com/lena', lang: 'ja', geo: ['jp'] },
	// 	{ url: 'https://eu.lena.lenovo.com/lena', lang: 'de', geo: ['de', 'at'] },
	// ];

	listFindUs = {
		icon: ['fal', 'heart'],
		title: 'support.needHelp.listFindUs',
		clickItem: 'findUs',
		metricsItem: 'NeedHelp.FindUsButton',
		metricsEvent: 'FeatureClick',
	};
	listServiceProvider = {
		icon: ['fal', 'briefcase'],
		title: 'support.quicklinks.listServiceProvider',
		url: 'https://www.lenovo.com/us/en/ordersupport/',
		metricsItem: 'Quicklinks.ServiceProviderButton',
		metricsEvent: 'FeatureClick',
	};
	listAboutLenovoVantage = {
		iconPath: 'assets/images/support/svg_icon_about_us.svg',
		title: 'support.quicklinks.listAboutLenovoVantage',
		clickItem: 'about',
		metricsItem: 'Quicklinks.AboutLenovoVantageButton',
		metricsEvent: 'FeatureClick',
	};

	offlineImages = [
		'assets/images/support/support-offline-1.jpg',
		'assets/images/support/support-offline-2.jpg',
		'assets/images/support/support-offline-3.jpg',
		'assets/images/support/support-offline-4.jpg',
	];
	localCateIcons = [
		'assets/images/support/design-innovation.svg',
		'assets/images/support/how-to.svg',
		'assets/images/support/lifestyle-entertainment.svg',
		'assets/images/support/software-apps.svg',
	];

	cateStartTime: any;
	contentStartTime: any;
	actionSubscription: Subscription;

	constructor(
		public mockService: MockService,
		public supportService: SupportService,
		public warrantyService: WarrantyService,
		public deviceService: DeviceService,
		public localInfoService: LocalInfoService,
		private cmsService: CMSService,
		private commonService: CommonService,
		private licensesService: LicensesService,
		private activatedRoute: ActivatedRoute,
		private loggerService: LoggerService,
		private feedbackService: FeedbackService
	) {
		this.isOnline = this.commonService.isOnline;
	}

	ngOnInit() {
		this.notificationSubscription = this.commonService.notification.subscribe(
			(response: AppNotification) => {
				this.onNotification(response);
			}
		);
		this.getProtocalActions();
		this.getWarrantyInfo();

		this.fetchCMSArticleCategory();
		this.fetchCMSContents();

		this.setShowList();
	}

	ngOnDestroy() {
		clearTimeout(this.getArticlesTimeout);
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		if (this.actionSubscription) {
			this.actionSubscription.unsubscribe();
		}
	}

	onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					if (notification.payload.isOnline !== this.isOnline) {
						this.isOnline = notification.payload.isOnline;
						if (this.isOnline) {
							const retryInterval = setInterval(() => {
								if (
									this.articleCategories.length > 0 &&
									this.articles.leftTop.length > 0
								) {
									clearInterval(retryInterval);
									return;
								}
								if (this.articleCategories.length === 0) {
									this.fetchCMSArticleCategory();
								}
								if (this.articles.leftTop.length === 0) {
									this.fetchCMSContents();
								}
							}, 2500);
							this.getWarrantyInfo();
						}
					}
					break;
				default:
					break;
			}
		}
	}

	getProtocalActions() {
		this.actionSubscription = this.activatedRoute.queryParamMap.subscribe(
			(params: ParamMap) => {
				if (
					params.has('action') &&
					this.activatedRoute.snapshot.queryParams.action === 'licenseagreement'
				) {
					this.licensesService.openLicensesAgreement();
				} else if (
					params.has('action') &&
					this.activatedRoute.snapshot.queryParams.action === 'feedback'
				) {
					this.feedbackService.openFeedbackModal();
				}
			}
		);
	}

	setShowList() {
		if (this.supportService.supportDatas) {
			this.supportDatas = this.supportService.supportDatas;
			return;
		}
		this.supportDatas.needHelp.push(this.listLenovoCommunity);
		this.supportService.getSerialnumber().then((sn) => {
			this.listContactCustomerService.url = `https://support.lenovo.com/contactus?serialnumber=${sn}`;
			this.supportDatas.needHelp.push(this.listContactCustomerService);
			this.localInfoService.getLocalInfo().then((info) => {
				// const GEO = info.GEO;
				// const Lang = info.Lang;
				// const data = window.btoa(`Brand=${info.Brand}&SourcePage=Lenovo Vantage`);
				// const findUrlItem = this.lenaUrls.find(
				// 	(item) => item.geo.indexOf(GEO) >= 0 && item.lang === Lang
				// );
				// if (findUrlItem) {
				// 	this.listYourVirtualAssistant.url =
				// 		findUrlItem.url + `?country=${GEO}&language=${Lang}&data=${data}`;
				// 	this.supportDatas.needHelp.push(this.listYourVirtualAssistant);
				// }

				this.supportDatas.needHelp.push(this.listFindUs);
				this.supportService.supportDatas = this.supportDatas;
			});
		});

		this.supportDatas.quicklinks.push(this.listAboutLenovoVantage);
	}

	getWarrantyInfo() {
		const info = this.warrantyService.getWarrantyInfo();
		if (info) {
			info.subscribe((value) => {
				if (value) {
					this.warrantyData = {
						info: {
							startDate: value.startDate,
							endDate: value.endDate,
							status: value.status,
							dayDiff: value.dayDiff,
							url: this.warrantyService.getWarrantyUrl(),
						},
						cache: true,
					};
					this.warrantyYear = this.warrantyService.getRoundYear(value.dayDiff);
				}
			});
		}
	}

	fetchCMSContents(lang?: string) {
		this.contentStartTime = new Date();
		this.articlesType = SupportContentStatus.Loading;

		const queryOptions = {
			Page: 'support',
		};
		if (lang) {
			Object.assign(queryOptions, { Lang: lang, GEO: 'US' });
		}

		this.cmsService.fetchCMSContent(queryOptions).subscribe(
			(response: any) => {
				const contentEnd: any = new Date();
				const contentUseTime = contentEnd - this.contentStartTime;
				if (response && response.length > 0) {
					response = response.filter((r) => r.Page === 'support');
					response.forEach((article) => {
						article.DataSource = ContentSource.CMS;
						if (article.FeatureImage) {
							article.FeatureImage = article.FeatureImage.replace('(', '%28').replace(
								')',
								'%29'
							);
						}
					});
					this.sliceArticles(response);
					this.backupContentArticles = this.copyObjectArray(this.articles);
					// console.log(this.articles);
					this.articlesType = SupportContentStatus.Content;
					const msg = `Performance: Support page get content articles, ${contentUseTime}ms`;
					this.loggerService.info(msg);
				} else {
					const msg = `Performance: Support page not have this Language content articles, ${contentUseTime}ms`;
					this.loggerService.info(msg);
					this.sliceArticles([]);
					this.articlesType = SupportContentStatus.Empty;
				}
			},
			(error) => {
				this.getArticlesTimeout = setTimeout(() => {
					this.fetchCMSContents();
				}, 5000);
			}
		);
	}

	fetchCMSArticleCategory() {
		this.cateStartTime = new Date();

		const queryOptions = {};

		this.cmsService.fetchCMSArticleCategories(queryOptions).then(
			(response: any) => {
				const cateEnd: any = new Date();
				const cateUseTime = cateEnd - this.cateStartTime;
				if (response && response.length > 0) {
					this.articleCategories = response.slice(0, 4);
					response.forEach((cate) => {
						if (cate.Image) {
							cate.Image = cate.Image.replace('(', '%28').replace(')', '%29');
						}
					});
					const msg = `Performance: Support page get article category, ${cateUseTime}ms`;
					this.loggerService.info(msg);
				} else {
					const msg = `Performance: Support page not have this Language article category, ${cateUseTime}ms`;
					this.loggerService.info(msg);
				}
			},
			(error) => {
				setTimeout(() => {
					this.fetchCMSArticleCategory();
				}, 5000);
			}
		);
	}

	clickCategory(categoryId: string) {
		if (this.selectedCategoryId === categoryId) {
			return false;
		}
		this.isCategoryArticlesShow = true;
		this.selectedCategoryId = categoryId;
		clearTimeout(this.getArticlesTimeout);
		this.fetchCMSArticles(categoryId);
	}

	onInnerBack() {
		clearTimeout(this.getArticlesTimeout);
		this.isCategoryArticlesShow = false;
		this.selectedCategoryId = '';
		if (this.backupContentArticles.leftTop.length > 0) {
			this.articlesType = SupportContentStatus.Content;
			this.articles = this.copyObjectArray(this.backupContentArticles);
		} else {
			this.fetchCMSContents();
		}
	}

	fetchCMSArticles(categoryId: string, lang?: string) {
		this.articlesType = SupportContentStatus.Loading;
		const queryOptions = {
			category: categoryId,
		};
		if (lang) {
			Object.assign(queryOptions, { Lang: lang, GEO: 'us' });
		}

		this.cmsService.fetchCMSArticles(queryOptions, true).then(
			(response: any) => {
				if (response && response.length > 0) {
					response.forEach((article) => {
						article.DataSource = ContentSource.CMS;
						if (article.Thumbnail) {
							article.Thumbnail = article.Thumbnail.replace('(', '%28').replace(
								')',
								'%29'
							);
						}
					});
					this.sliceArticles(response);
					this.articlesType = SupportContentStatus.Articles;
				} else {
					this.sliceArticles([]);
					this.articlesType = SupportContentStatus.Empty;
				}
			},
			(error) => {
				if (lang.toLowerCase() !== 'en') {
					this.getArticlesTimeout = setTimeout(() => {
						this.fetchCMSArticles(categoryId, 'en');
					}, 5000);
				}
			}
		);
	}

	sliceArticles(allArticles: any) {
		this.articles = this.copyObjectArray(this.emptyArticles);
		allArticles.forEach((article, index) => {
			if (index < 4) {
				if (index % 2 === 0) {
					this.articles.leftTop.push(article);
				} else {
					this.articles.middleTop.push(article);
				}
			} else {
				if (index % 3 === 1) {
					this.articles.leftBottom.push(article);
				} else if (index % 3 === 2) {
					this.articles.middleBottom.push(article);
				} else {
					this.articles.right.push(article);
				}
				if (index % 2 === 0) {
					this.articles.leftBottomSmall.push(article);
				} else {
					this.articles.middleBottomSmall.push(article);
				}
			}
		});
	}

	copyObjectArray(obj: any) {
		return JSON.parse(JSON.stringify(obj));
	}

	openFeedbackModal() {
		this.feedbackService.openFeedbackModal();
	}

	search(value: string) {
		this.searchWords = value;
	}
}
