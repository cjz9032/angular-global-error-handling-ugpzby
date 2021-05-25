import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { SupportService } from 'src/app/services/support/support.service';

@Component({
	selector: 'vtr-right-content-for-support',
	templateUrl: './right-content-for-support.component.html',
	styleUrls: ['./right-content-for-support.component.scss'],
})
export class RightContentForSupportComponent implements OnInit, OnDestroy {
	isOnline: boolean;
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

	constructor(
		public supportService: SupportService,
		public localInfoService: LocalInfoService,
		private commonService: CommonService
	) {}

	ngOnInit(): void {
		this.setShowList();
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

	ngOnDestroy() {
	}
}
