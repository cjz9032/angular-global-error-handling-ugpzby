import { Component, OnInit, OnDestroy } from '@angular/core';
import { MockService } from '../../../services/mock/mock.service';
import { SupportService } from '../../../services/support/support.service';
import { DeviceService } from '../../../services/device/device.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vtr-page-support',
	templateUrl: './page-support.component.html',
	styleUrls: ['./page-support.component.scss']
})
export class PageSupportComponent implements OnInit, OnDestroy {

	title = 'support.common.getSupport';
	searchWords = '';
	searchCount = 1;
	articles: any;
	/** content | articles */
	articlesType = 'loading';
	articleCategories: any = [];
	warranty: any;
	pageDuration: number;
	location: any;
	warrantyNormalUrl = 'https://pcsupport.lenovo.com/us/en/warrantylookup';
	langText = 'en';
	// langText = 'zh-hans';
	supportDatas = {
		documentation: [
			{
				'icon': ['fal', 'book'],
				'title': 'support.documentation.listUserGuide',
				'clickItem': 'userGuide',
				'metricsItem': 'Documentation.UserGuideButton',
				'metricsEvent': 'FeatureClick',
				'metricsParent': 'Page.Support'
			}
		],
		needHelp: [
			{
				'icon': ['fal', 'comment-alt'],
				'title': 'support.needHelp.listLenovoCommunity',
				'url': 'https://community.lenovo.com',
				'metricsItem': 'NeedHelp.LenovoCommunityButton',
				'metricsEvent': 'FeatureClick',
				'metricsParent': 'Page.Support'
			},
			{
				'icon': ['fal', 'share-alt'],
				'title': 'support.needHelp.listContactCustomerService',
				'url': 'https://support.lenovo.com/',
				'metricsItem': 'NeedHelp.ContactCustomerServiceButton',
				'metricsEvent': 'FeatureClick',
				'metricsParent': 'Page.Support'
			},
			{
				'iconPath': 'assets/images/support/svg_icon_wechat.svg',
				'title': 'support.needHelp.listContactUsOnWechat',
				'clickItem': 'qrCode',
				'metricsItem': 'NeedHelp.ContactUsOnWeChatButton',
				'metricsEvent': 'FeatureClick',
				'metricsParent': 'Page.Support'
			}
		],
		quicklinks: [
			{
				'icon': ['fal', 'ticket-alt'],
				'title': 'support.quicklinks.listETicket',
				'url': 'https://pcsupport.lenovo.com/us/en/eticketwithservice',
				'metricsItem': 'Quicklinks.E-ticketButton',
				'metricsEvent': 'FeatureClick',
				'metricsParent': 'Page.Support'
			},
			{
				'icon': ['fal', 'briefcase'],
				'title': 'support.quicklinks.listServiceProvider',
				'url': 'https://www.lenovo.com/us/en/ordersupport/',
				'metricsItem': 'Quicklinks.ServiceProviderButton',
				'metricsEvent': 'FeatureClick',
				'metricsParent': 'Page.Support'
			},
			{
				'iconPath': 'assets/images/support/svg_icon_about_us.svg',
				'title': 'support.quicklinks.listAboutLenovoVantage',
				'clickItem': 'about',
				'metricsItem': 'Quicklinks.AboutLenovoVantageButton',
				'metricsEvent': 'FeatureClick',
				'metricsParent': 'Page.Support'
			}
		],
	};

	constructor(
		public mockService: MockService,
		public supportService: SupportService,
		public deviceService: DeviceService,
		private translate: TranslateService,
		private cmsService: CMSService
	) {
	}

	ngOnInit() {
		if (this.translate.currentLang) { this.langText = this.translate.currentLang; }
		this.getMachineInfo();
		this.fetchCMSContents(this.langText);
		this.fetchCMSArticleCategory(this.langText);
		// console.log('Open support page.');
		this.location = window.location.href.substring(window.location.href.indexOf('#') + 2).split('/').join('.');
		this.pageDuration = 0;
		setInterval(() => {
			this.pageDuration += 1;
		}, 1000);
	}

	ngOnDestroy() {
		const pageViewMetrics = {
			ItemType: 'PageView',
			PageName: this.location,
			PageContext: 'Get support page',
			PageDuration: this.pageDuration,
			OnlineStatus: ''
		};
		this.supportService.sendMetricsAsync(pageViewMetrics);
		// console.log(pageViewMetrics);
	}

	getMachineInfo() {
		try {
			this.supportService.getMachineInfo().then((machineInfo) => {
				this.supportService
					// .getWarranty('PC0G9X77')
					// .getWarranty('R9T6M3E')
					// .getWarranty('R90HTPEU')
					.getWarranty(machineInfo.serialnumber)
					.then((warranty) => {
						this.warranty = warranty;
						if (machineInfo.serialnumber) {
							this.warranty.url = `https://www.lenovo.com/us/en/warrantyApos?serialNumber=${machineInfo.serialnumber}&cid=ww:apps:pikjhe&utm_source=Companion&utm_medium=Native&utm_campaign=Warranty`;
						} else {
							this.warranty.url = this.warrantyNormalUrl;
						}
					});
			});
		} catch (error) {
			console.log(error);
			this.warranty = {
				status: 2,
				url: this.warrantyNormalUrl
			};
		}
	}

	fetchCMSContents(lang: string) {
		this.articlesType = 'loading';
		const queryOptions = {
			'Page': 'support',
			'Lang': lang,
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'idea',
		};

		this.cmsService.fetchCMSContent(queryOptions).then(
			(response: any) => {
				if (response.length > 0) {
					this.articles = response.slice(0, 8);
					// console.log(this.articles);
					this.articlesType = 'content';
				} else {
					this.fetchCMSContents('EN');
				}
			},
			error => {
				console.log('fetchCMSContent error', error);
				if (lang !== 'EN') {
					this.fetchCMSContents('EN');
				}
			}
		);
	}

	fetchCMSArticleCategory(lang: string) {
		const queryOptions = {
			'Lang': lang,
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'idea',
		};

		this.cmsService.fetchCMSArticleCategories(queryOptions).then(
			(response: any) => {
				if (response.length > 0) {
					this.articleCategories = response.slice(0, 4);
				} else {
					this.fetchCMSArticleCategory('EN');
				}
			},
			error => {
				console.log('fetchCMSArticleCategories error', error);
				if (lang !== 'EN') {
					this.fetchCMSArticleCategory('EN');
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
			'Lang': lang,
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'idea',
			'category': categoryId,
		};

		this.cmsService.fetchCMSArticles(queryOptions, true).then(
			(response: any) => {
				if (response.length > 0) {
					this.articles = response;
					this.articlesType = 'articles';
				} else {
					this.fetchCMSArticles(categoryId, 'EN');
				}
			},
			error => {
				console.log('fetchCMSArticles error', error);
				if (lang !== 'EN') {
					this.fetchCMSArticles(categoryId, 'EN');
				}
			}
		);
	}

	search(value: string) {
		this.searchWords = value;
	}
}
