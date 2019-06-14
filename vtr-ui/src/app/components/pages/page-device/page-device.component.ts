import { Component, OnInit, Input } from '@angular/core';
import { DeviceService } from '../../../services/device/device.service';
import { QaService } from '../../../services/qa/qa.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
	selector: 'vtr-page-device',
	templateUrl: './page-device.component.html',
	styleUrls: ['./page-device.component.scss']
})
export class PageDeviceComponent implements OnInit {

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
		this.qaService.setTranslationService(this.translate);
		this.qaService.setCurrentLangTranslations();
	}

	ngOnInit() {

	}

	fetchCMSArticles() {
		const queryOptions = {
			'Page': 'device',
			'Lang': 'EN',
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'Lenovo'
		};

		this.cmsService.fetchCMSContent(queryOptions).then(
			(response: any) => {
				const cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];
				if (cardContentPositionA) {
					this.cardContentPositionA = cardContentPositionA;
					if (this.cardContentPositionA.BrandName) {
						this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
					}
				}
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}
}
