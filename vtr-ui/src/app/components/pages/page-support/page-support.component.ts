import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
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

@Component({
	selector: 'vtr-page-support',
	templateUrl: './page-support.component.html',
	styleUrls: ['./page-support.component.scss']
})
export class PageSupportComponent implements OnInit {

	title = 'support.common.getSupport';
	searchWords = '';
	searchCount = 1;
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
	/** content | articles */
	articlesType = 'loading';
	articleCategories: any = [];
	isCategoryArticlesShow = false;
	warrantyData: { info: any, cache: boolean };
	isOnline: boolean;
	notificationSubscription: Subscription;
	backId = 'support-page-btn-back';
	supportDatas = {
		documentation: [
			{
				icon: ['fal', 'book'],
				title: 'support.documentation.listUserGuide',
				clickItem: 'userGuide',
				metricsItem: 'Documentation.UserGuideButton',
				metricsEvent: 'FeatureClick',
				metricsParent: 'Page.Support'
			}
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
		metricsParent: 'Page.Support'
	};
	listContactCustomerService = {
		icon: ['fal', 'share-alt'],
		title: 'support.needHelp.listContactCustomerService',
		url: 'https://support.lenovo.com/contactus?serialnumber=',
		metricsItem: 'NeedHelp.ContactCustomerServiceButton',
		metricsEvent: 'FeatureClick',
		metricsParent: 'Page.Support'
	};
	listFindUs = {
		icon: ['fal', 'heart'],
		title: 'support.needHelp.listFindUs',
		clickItem: 'findUs',
		metricsItem: 'NeedHelp.FindUsButton',
		metricsEvent: 'FeatureClick',
		metricsParent: 'Page.Support'
	};
	listServiceProvider = {
		icon: ['fal', 'briefcase'],
		title: 'support.quicklinks.listServiceProvider',
		url: 'https://www.lenovo.com/us/en/ordersupport/',
		metricsItem: 'Quicklinks.ServiceProviderButton',
		metricsEvent: 'FeatureClick',
		metricsParent: 'Page.Support'
	};
	listAboutLenovoVantage = {
		iconPath: 'assets/images/support/svg_icon_about_us.svg',
		title: 'support.quicklinks.listAboutLenovoVantage',
		clickItem: 'about',
		metricsItem: 'Quicklinks.AboutLenovoVantageButton',
		metricsEvent: 'FeatureClick',
		metricsParent: 'Page.Support'
	};
	offlineImages = [
		'assets/images/support/support-offline-1.jpg',
		'assets/images/support/support-offline-2.jpg',
		'assets/images/support/support-offline-3.jpg',
		'assets/images/support/support-offline-4.jpg',
	];
	localCateIcons = [
		'assets/images/support/design-innovation.png',
		'assets/images/support/how-to.png',
		'assets/images/support/lifestyle-entertainment.png',
		'assets/images/support/software-apps.png',
	];

	cateStartTime: any;
	contentStartTime: any;

	constructor(
		public mockService: MockService,
		public supportService: SupportService,
		public deviceService: DeviceService,
		public localInfoService: LocalInfoService,
		private cmsService: CMSService,
		private commonService: CommonService,
		private loggerService: LoggerService,
		private modalService: NgbModal
	) {
		this.isOnline = this.commonService.isOnline;
		this.warrantyData = this.supportService.warrantyData;
	}

	ngOnInit() {
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
		this.getWarrantyInfo(this.isOnline);

		this.fetchCMSArticleCategory();
		this.fetchCMSContents();
		this.setShowList();
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
							sessionStorage.removeItem('warrantyCache');
							const retryInterval = setInterval(() => {
								const cacheWarranty = sessionStorage.getItem('warrantyCache');
								if (this.articleCategories.length > 0 &&
									this.articles.leftTop.length > 0 &&
									cacheWarranty) {
									clearInterval(retryInterval);
									return;
								}
								if (this.articleCategories.length === 0) {
									this.fetchCMSArticleCategory();
								}
								if (this.articles.leftTop.length === 0) {
									this.fetchCMSContents();
								}
								if (!cacheWarranty) {
									this.getWarrantyInfo(this.isOnline);
								}
							}, 2500);
						}
					}
					break;
				default:
					break;
			}
		}
	}

	setShowList() {
		this.supportDatas.needHelp.push(
			this.listLenovoCommunity,
			this.listFindUs,
		);
		this.supportService.getSerialnumber().then(sn => {
			this.listContactCustomerService.url = `https://support.lenovo.com/contactus?serialnumber=${sn}`;
			this.supportDatas.needHelp.splice(1, 0, this.listContactCustomerService);
		});
		this.supportDatas.quicklinks.push(this.listAboutLenovoVantage);
	}

	getWarrantyInfo(online: boolean) {
		this.supportService.getWarrantyInfo(online);
	}

	fetchCMSContents(lang?: string) {
		this.contentStartTime = new Date();
		this.articlesType = 'loading';

		const queryOptions = {
			Page: 'support'
		};
		if (lang) {
			Object.assign(queryOptions, { Lang: lang, GEO: 'US' });
		}

		this.cmsService.fetchCMSContent(queryOptions).subscribe(
			(response: any) => {
				const contentEnd: any = new Date();
				const contentUseTime = contentEnd - this.contentStartTime;
				if (response && response.length > 0) {
					response.forEach(article => {
						if (article.FeatureImage) {
							article.FeatureImage = article.FeatureImage.replace('(', '%28').replace(')', '%29');
						}
					});
					this.sliceArticles(response);
					this.backupContentArticles = this.copyObjectArray(this.articles);
					// console.log(this.articles);
					this.articlesType = 'content';
					const msg = `Performance: Support page get content articles, ${contentUseTime}ms`;
					this.loggerService.info(msg);
				} else {
					const msg = `Performance: Support page not have this Language content articles, ${contentUseTime}ms`;
					this.loggerService.info(msg);
					this.fetchCMSContents('en');
				}
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}

	fetchCMSArticleCategory(lang?: string) {
		this.cateStartTime = new Date();

		const queryOptions = {};
		if (lang) {
			Object.assign(queryOptions, { Lang: lang });
		}

		this.cmsService.fetchCMSArticleCategories(queryOptions).then(
			(response: any) => {
				const cateEnd: any = new Date();
				const cateUseTime = cateEnd - this.cateStartTime;
				if (response && response.length > 0) {
					this.articleCategories = response.slice(0, 4);
					response.forEach(cate => {
						if (cate.Image) {
							cate.Image = cate.Image.replace('(', '%28').replace(')', '%29');
						}
					});
					const msg = `Performance: Support page get article category, ${cateUseTime}ms`;
					this.loggerService.info(msg);
				} else {
					const msg = `Performance: Support page not have this Language article category, ${cateUseTime}ms`;
					this.loggerService.info(msg);
					this.fetchCMSArticleCategory('en');
				}
			},
			error => {
				console.log('fetchCMSArticleCategories error', error);
				if (lang.toLowerCase() !== 'en') {
					this.fetchCMSArticleCategory('en');
				}
			}
		);
	}

	clickCategory(categoryId: string) {
		this.isCategoryArticlesShow = true;
		this.fetchCMSArticles(categoryId);
	}

	onInnerBack() {
		this.isCategoryArticlesShow = false;
		if (this.backupContentArticles.leftTop.length > 0) {
			this.articlesType = 'content';
			this.articles = this.copyObjectArray(this.backupContentArticles);
		} else {
			this.fetchCMSContents();
		}
	}

	fetchCMSArticles(categoryId: string, lang?: string) {
		this.articlesType = 'loading';
		const queryOptions = {
			category: categoryId,
		};
		if (lang) {
			Object.assign(queryOptions, { Lang: lang });
		}

		this.cmsService.fetchCMSArticles(queryOptions, true).then(
			(response: any) => {
				if (response && response.length > 0) {
					response.forEach(article => {
						if (article.Thumbnail) {
							article.Thumbnail = article.Thumbnail.replace('(', '%28').replace(')', '%29');
						}
					});
					this.sliceArticles(response);
					this.articlesType = 'articles';
				} else {
					this.fetchCMSArticles(categoryId, 'en');
				}
			},
			error => {
				console.log('fetchCMSArticles error', error);
				if (lang.toLowerCase() !== 'en') {
					this.fetchCMSArticles(categoryId, 'en');
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

	search(value: string) {
		this.searchWords = value;
	}
}
