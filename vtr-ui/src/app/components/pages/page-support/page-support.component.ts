import { Component, OnInit, OnDestroy } from '@angular/core';
import { MockService } from '../../../services/mock/mock.service';
import { SupportService } from '../../../services/support/support.service';
import { DeviceService } from '../../../services/device/device.service';
import { CMSService } from 'src/app/services/cms/cms.service';

@Component({
	selector: 'vtr-page-support',
	templateUrl: './page-support.component.html',
	styleUrls: ['./page-support.component.scss']
})
export class PageSupportComponent implements OnInit, OnDestroy {

	title = 'support.common.get-support';
	searchWords = '';
	searchCount = 1;
	articles: any;
	warranty: any;
	pageDuration: number;
	location: any;
	warrantyNormalUrl = 'https://pcsupport.lenovo.com/us/en/warrantylookup';
	supportDatas = {
		documentation: [
			{
				'icon': ['fas', 'book'],
				'title': 'support.documentation.list-user-guide',
				'url': 'https://support.lenovo.com',
				'metricsItem': 'Documentation.UserGuideButton',
				'metricsEvent': 'ItemClick',
				'metricsParent': 'Page.Support',
			}
		],
		needHelp: [
			{
				'icon': ['fas', 'comment-alt'],
				'title': 'support.need-help.list-lenovo-community',
				'url': 'https://community.lenovo.com',
				'metricsItem': 'NeedHelp.LenovoCommunityButton',
				'metricsEvent': 'ItemClick',
				'metricsParent': 'Page.Support',
			},
			{
				'icon': ['fas', 'share-alt'],
				'title': 'support.need-help.list-contact-customer-service',
				'url': 'https://support.lenovo.com/',
				'metricsItem': 'NeedHelp.ContactCustomerServiceButton',
				'metricsEvent': 'ItemClick',
				'metricsParent': 'Page.Support',
			},
			{
				'icon': ['fab', 'weixin'],
				'title': 'support.need-help.list-contact-us-on-wechat',
				'hideArrow': true,
				'image': 'assets/images/wechat-qrcode.png',
			}
		],
		quicklinks: [
			{
				'icon': ['fas', 'ticket-alt'],
				'title': 'support.quicklinks.list-e-ticket',
				'url': 'https://pcsupport.lenovo.com/us/en/eticketwithservice',
				'metricsItem': 'Quicklinks.E-ticketButton',
				'metricsEvent': 'ItemClick',
				'metricsParent': 'Page.Support',
			},
			{
				'icon': ['fas', 'briefcase'],
				'title': 'support.quicklinks.list-service-provider',
				'url': 'https://www.lenovo.com/us/en/ordersupport/',
				'metricsItem': 'Quicklinks.ServiceProviderButton',
				'metricsEvent': 'ItemClick',
				'metricsParent': 'Page.Support',
			}
		],
	};

	constructor(
		public mockService: MockService,
		public supportService: SupportService,
		public deviceService: DeviceService,
		private cmsService: CMSService
	) {
		this.getMachineInfo();
		this.fetchCMSArticles();
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

	ngOnInit() {
		console.log('Open support page.');
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
		console.log(pageViewMetrics);
	}

	fetchCMSArticles() {
		const queryOptions = {
			'Page': 'support',
			'Lang': 'EN',
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'Lenovo'
		};

		this.cmsService.fetchCMSContent(queryOptions).then(
			(response: any) => {
				console.log(response);
				this.articles = response;
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}

	search(value: string) {
		this.searchWords = value;
	}
}
