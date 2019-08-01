import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DeviceService } from '../../../services/device/device.service';
import { QaService } from '../../../services/qa/qa.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

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
					if (cardContentPositionA.ActionLink && cardContentPositionA.ActionLink.indexOf('[SerialNumber]') > -1) {
						this.deviceService.getMachineInfo().then((data) => {
							this.cardContentPositionA.ActionLink = cardContentPositionA.ActionLink.replace(/\[SerialNumber\]/g, data.serialnumber);
						});
					}
				}
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}

	// VAN-5872, server switch feature
	ngOnDestroy() {
		this.qaService.destroyChangeSubscribed();
	}
}
