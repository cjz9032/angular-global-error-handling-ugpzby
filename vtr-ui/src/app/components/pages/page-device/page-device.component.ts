import { Component, OnInit, Input } from '@angular/core';
import { DeviceService } from '../../../services/device/device.service';
import { QaService } from '../../../services/qa/qa.service';
import { CMSService } from 'src/app/services/cms/cms.service';

@Component({
	selector: 'vtr-page-device',
	templateUrl: './page-device.component.html',
	styleUrls: ['./page-device.component.scss']
})
export class PageDeviceComponent implements OnInit {

	title = 'My Device';
	back = 'BACK';
	backarrow = '< ';
	articles: [];

	constructor(
		public deviceService: DeviceService,
		public qaService: QaService,
		private cmsService: CMSService
	) {
		this.fetchCMSArticles();
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

		this.cmsService.fetchCMSArticles(queryOptions).then(
			(response: any) => {
				this.articles = response;
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}
}
