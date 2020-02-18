import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceService } from '../../../services/device/device.service';
import { QaService } from '../../../services/qa/qa.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { RouteHandlerService } from 'src/app/services/route-handler/route-handler.service';

@Component({
	selector: 'vtr-page-device',
	templateUrl: './page-device.component.html',
	styleUrls: ['./page-device.component.scss']
})
export class PageDeviceComponent implements OnInit, OnDestroy {

	// title = 'My Device';
	// back = 'BACK';
	backarrow = '< ';
	cardContentPositionA: any = {};

	constructor(
		routeHandler: RouteHandlerService, // logic is added in constructor, no need to call any method
		public deviceService: DeviceService,
		public qaService: QaService,
		private cmsService: CMSService,
		private translate: TranslateService,
	) {
		this.fetchCMSArticles();
		// Evaluate the translations for QA on language Change
		// this.qaService.setTranslationService(this.translate);
		// this.qaService.setCurrentLangTranslations();
		this.qaService.getQATranslation(translate); // VAN-5872, server switch feature
	}

	ngOnInit() {
		// VAN-5872, server switch feature on language change
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.fetchCMSArticles();
		});
	}

	fetchCMSArticles() {
		const queryOptions = {
			Page: 'device'
		};

		this.cmsService.fetchCMSContent(queryOptions).subscribe(
			(response: any) => {
				const cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];
				if (cardContentPositionA) {
					this.cardContentPositionA = cardContentPositionA;
					if (this.cardContentPositionA.BrandName) {
						this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
					}
					if (cardContentPositionA.ActionLink) {
						const isHaveSerialNumber = cardContentPositionA.ActionLink.indexOf('[SerialNumber]') > -1;
						const isWarrantyAposLink = cardContentPositionA.ActionLink.startsWith('https://www.lenovo.com/us/en/warrantyApos');
						if (isHaveSerialNumber || isWarrantyAposLink) {
							this.deviceService.getMachineInfo().then((info) => {
								if (isWarrantyAposLink && info && info.mtm && info.mtm.toLocaleLowerCase().endsWith('cd')) {
									this.cardContentPositionA.ActionLink = 'https://item.lenovo.com.cn/product/100785.html?pmf_group=qjz&pmf_medium=qjz&pmf_source=Z00009560T000&_ga=2.136201912.800236951.1571628156-244493281.1561709922';
								} else if (isHaveSerialNumber && info && info.serialnumber) {
									this.cardContentPositionA.ActionLink = cardContentPositionA.ActionLink.replace(/\[SerialNumber\]/g, info.serialnumber);
								}
							});
						}
					}
				}
			},
			error => {}
		);
	}

	// VAN-5872, server switch feature
	ngOnDestroy() {
		this.qaService.destroyChangeSubscribed();
	}
}
