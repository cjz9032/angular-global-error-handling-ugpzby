import { Component, OnInit } from '@angular/core';
import { MockService } from '../../../services/mock/mock.service';
import { SupportService } from '../../../services/support/support.service';
import { DeviceService } from '../../../services/device/device.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { TranslateService } from '@ngx-translate/core';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { RegionService } from 'src/app/services/region/region.service';

@Component({
	selector: 'vtr-page-support',
	templateUrl: './page-support.component.html',
	styleUrls: ['./page-support.component.scss']
})
export class PageSupportComponent implements OnInit {

	title = 'support.common.getSupport';
	searchWords = '';
	searchCount = 1;
	backupContentArticles: any = [];
	articles: any = [];
	/** content | articles */
	articlesType = 'loading';
	articleCategories: any = [];
	isCategoryArticlesShow = false;
	warrantyData: { info: any, cache: boolean };
	isOnline: boolean;
	notificationSubscription: Subscription;
	language: string;
	region: string;
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
		needHelp: [
			{
				icon: ['fal', 'comment-alt'],
				title: 'support.needHelp.listLenovoCommunity',
				url: 'https://community.lenovo.com',
				metricsItem: 'NeedHelp.LenovoCommunityButton',
				metricsEvent: 'FeatureClick',
				metricsParent: 'Page.Support'
			},
			{
				icon: ['fal', 'share-alt'],
				title: 'support.needHelp.listContactCustomerService',
				url: 'https://support.lenovo.com/',
				metricsItem: 'NeedHelp.ContactCustomerServiceButton',
				metricsEvent: 'FeatureClick',
				metricsParent: 'Page.Support'
			},
			{
				icon: ['fal', 'heart'],
				title: 'support.needHelp.listFindUs',
				clickItem: 'findUs',
				metricsItem: 'NeedHelp.FindUsButton',
				metricsEvent: 'FeatureClick',
				metricsParent: 'Page.Support'
			}
		],
		quicklinks: [
			{
				icon: ['fal', 'ticket-alt'],
				title: 'support.quicklinks.listETicket',
				url: 'https://pcsupport.lenovo.com/us/en/eticketwithservice',
				metricsItem: 'Quicklinks.E-ticketButton',
				metricsEvent: 'FeatureClick',
				metricsParent: 'Page.Support'
			},
			{
				icon: ['fal', 'briefcase'],
				title: 'support.quicklinks.listServiceProvider',
				url: 'https://www.lenovo.com/us/en/ordersupport/',
				metricsItem: 'Quicklinks.ServiceProviderButton',
				metricsEvent: 'FeatureClick',
				metricsParent: 'Page.Support'
			},
			{
				iconPath: 'assets/images/support/svg_icon_about_us.svg',
				title: 'support.quicklinks.listAboutLenovoVantage',
				clickItem: 'about',
				metricsItem: 'Quicklinks.AboutLenovoVantageButton',
				metricsEvent: 'FeatureClick',
				metricsParent: 'Page.Support'
			}
		],
	};
	offlineImages = [
		'assets/images/support/support-offline-1.jpg',
		'assets/images/support/support-offline-2.jpg',
		'assets/images/support/support-offline-3.jpg',
		'assets/images/support/support-offline-4.jpg',
	];

	cateStartTime: any;
	contentStartTime: any;

	constructor(
		public mockService: MockService,
		public supportService: SupportService,
		public deviceService: DeviceService,
		private translate: TranslateService,
		private cmsService: CMSService,
		private commonService: CommonService,
		private loggerService: LoggerService,
		private regionService: RegionService,
	) {
		this.isOnline = this.commonService.isOnline;
		this.warrantyData = this.supportService.warrantyData;
	}

	ngOnInit() {
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
		this.getWarrantyInfo(this.isOnline);
		this.regionService.getRegion().subscribe({
			next: x => {
				this.region = x;
			},
			error: err => {
				this.region = 'us';
			}
		});
		this.regionService.getLanguage().subscribe({
			next: x => {
				this.language = x;
			},
			error: err => {
				this.language = 'en';
			}
		});
		this.fetchCMSArticleCategory(this.language);
		this.fetchCMSContents();
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
									this.articles.length > 0 &&
									cacheWarranty) {
									clearInterval(retryInterval);
									return;
								}
								if (this.articleCategories.length === 0) {
									this.fetchCMSArticleCategory(this.language);
								}
								if (this.articles.length === 0) {
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

	getWarrantyInfo(online: boolean) {
		this.supportService.getWarrantyInfo(online);
	}

	fetchCMSContents(lang?: string) {
		this.contentStartTime = new Date();
		this.articlesType = 'loading';
		let queryOptions: any = {
			Page: 'support'
		};
		if (lang) {
			queryOptions = {
				Page: 'support',
				Lang: lang,
				GEO: 'US',
			};
		}

		this.cmsService.fetchCMSContent(queryOptions).subscribe(
			(response: any) => {
				const contentEnd: any = new Date();
				const contentUseTime = contentEnd - this.contentStartTime;
				if (response && response.length > 0) {
					response.forEach(article => {
						if (article.FeatureImage) {
							article.FeatureImage = article.FeatureImage.replace('(', '%28').replace( ')', '%29');
						}
					});
					this.articles = response.slice(0, 8);
					this.backupContentArticles = response.slice(0, 8);
					// console.log(this.articles);
					this.articlesType = 'content';
					const msg = `Performance: Support page get content articles, ${contentUseTime}ms`;
					this.loggerService.info(msg);
				} else {
					const msg = `Performance: Support page not have "${lang}" content articles, ${contentUseTime}ms`;
					this.loggerService.info(msg);
					this.fetchCMSContents('en');
				}
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}

	fetchCMSArticleCategory(lang: string) {
		this.cateStartTime = new Date();
		const queryOptions = {
			Lang: this.language,
			GEO: this.region,
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'SMB',
			Brand: 'idea',
		};

		this.cmsService.fetchCMSArticleCategories(queryOptions).then(
			(response: any) => {
				const cateEnd: any = new Date();
				const cateUseTime = cateEnd - this.cateStartTime;
				if (response && response.length > 0) {
					this.articleCategories = response.slice(0, 4);
					const msg = `Performance: Support page get article category, ${cateUseTime}ms`;
					this.loggerService.info(msg);
				} else {
					const msg = `Performance: Support page not have "${lang}" article category, ${cateUseTime}ms`;
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
		this.fetchCMSArticles(categoryId, this.language);
	}

	onInnerBack() {
		this.isCategoryArticlesShow = false;
		if (this.backupContentArticles.length > 0) {
			this.articlesType = 'content';
			this.articles = this.backupContentArticles.slice();
		} else {
			this.fetchCMSContents();
		}
	}

	fetchCMSArticles(categoryId: string, lang: string) {
		this.articlesType = 'loading';
		const queryOptions = {
			Lang: this.language,
			GEO: this.region,
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'SMB',
			Brand: 'idea',
			category: categoryId,
		};

		this.cmsService.fetchCMSArticles(queryOptions, true).then(
			(response: any) => {
				if (response && response.length > 0) {
					response.forEach(article => {
						if (article.Thumbnail) {
							article.Thumbnail = article.Thumbnail.replace('(', '%28').replace( ')', '%29');
						}
					});
					this.articles = response;
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

	search(value: string) {
		this.searchWords = value;
	}
}
