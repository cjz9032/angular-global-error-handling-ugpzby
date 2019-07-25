import { Component, OnInit } from '@angular/core';
import { MockService } from '../../../services/mock/mock.service';
import { SupportService } from '../../../services/support/support.service';
import { DeviceService } from '../../../services/device/device.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { TranslateService } from '@ngx-translate/core';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { Subscription } from 'rxjs';

@Component({
	selector: 'vtr-page-support',
	templateUrl: './page-support.component.html',
	styleUrls: ['./page-support.component.scss']
})
export class PageSupportComponent implements OnInit {

	title = 'support.common.getSupport';
	searchWords = '';
	searchCount = 1;
	articles: any = [];
	/** content | articles */
	articlesType = 'loading';
	articleCategories: any = [];
	warrantyData: { info: any, cache: boolean };
	isOnline: boolean;
	notificationSubscription: Subscription;
	langText = 'en';
	// langText = 'zh-hans';
	backId = 'support-page-btn-back';
	region: string;
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

	constructor(
		public mockService: MockService,
		public supportService: SupportService,
		public deviceService: DeviceService,
		private translate: TranslateService,
		private cmsService: CMSService,
		private commonService: CommonService,
	) {
		this.isOnline = this.commonService.isOnline;
		this.warrantyData = this.supportService.warrantyData;
	}

	ngOnInit() {
		if (this.translate.currentLang) { this.langText = this.translate.currentLang; }
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
		this.getWarrantyInfo(this.isOnline);
		this.fetchCMSContents(this.langText);
		this.fetchCMSArticleCategory(this.langText);
	}

	onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					if (this.isOnline) {
						this.supportService.warrantyData.cache = false;
						sessionStorage.removeItem('warrantyCache');
						const retryInterval = setInterval(() => {
							if (this.articleCategories.length > 0 &&
								this.articles.length > 0 &&
								this.supportService.warrantyData.cache
							) {
								clearInterval(retryInterval);
								return;
							}
							if (this.articleCategories.length === 0) {
								this.fetchCMSArticleCategory(this.langText);
							}
							if (this.articles.length === 0) {
								this.fetchCMSContents(this.langText);
							}
							if (!this.supportService.warrantyData.cache) {
								this.getWarrantyInfo(this.isOnline);
							}
						}, 2500);
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

	fetchCMSContents(lang: string) {
		this.articlesType = 'loading';
		const queryOptions = {
			Page: 'support',
			Lang: lang.toLowerCase(),
			GEO: 'US',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'SMB',
			Brand: 'idea',
		};

		this.cmsService.fetchCMSContent(queryOptions).then(
			(response: any) => {
				if (response && response.length > 0) {
					this.articles = response.slice(0, 8);
					// console.log(this.articles);
					this.articlesType = 'content';
				} else {
					this.fetchCMSContents('en');
				}
			},
			error => {
				console.log('fetchCMSContent error', error);
				if (lang !== 'en') {
					this.fetchCMSContents('en');
				}
			}
		);
	}

	fetchCMSArticleCategory(lang: string) {
		const queryOptions = {
			Lang: lang.toLowerCase(),
			GEO: 'US',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'SMB',
			Brand: 'idea',
		};

		this.cmsService.fetchCMSArticleCategories(queryOptions).then(
			(response: any) => {
				// console.log(response);
				if (response && response.length > 0) {
					this.articleCategories = response.slice(0, 4);
				} else {
					this.fetchCMSArticleCategory('en');
				}
			},
			error => {
				console.log('fetchCMSArticleCategories error', error);
				if (lang !== 'en') {
					this.fetchCMSArticleCategory('en');
				}
			}
		);
	}

	clickCategory(categoryId: string) {
		this.fetchCMSArticles(categoryId, this.langText);
	}

	fetchCMSArticles(categoryId: string, lang: string) {
		this.articlesType = 'loading';
		const queryOptions = {
			Lang: lang.toLowerCase(),
			GEO: 'US',
			OEM: 'Lenovo',
			OS: 'Windows',
			Segment: 'SMB',
			Brand: 'idea',
			category: categoryId,
		};

		this.cmsService.fetchCMSArticles(queryOptions, true).then(
			(response: any) => {
				if (response && response.length > 0) {
					this.articles = response;
					this.articlesType = 'articles';
				} else {
					this.fetchCMSArticles(categoryId, 'en');
				}
			},
			error => {
				console.log('fetchCMSArticles error', error);
				if (lang !== 'en') {
					this.fetchCMSArticles(categoryId, 'en');
				}
			}
		);
	}

	search(value: string) {
		this.searchWords = value;
	}
}
