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
	cardContentPositionA: any = {};
	cardContentPositionB: any = {};

	constructor(
		public deviceService: DeviceService,
		public qaService: QaService,
		private cmsService: CMSService
	) { }

	ngOnInit() {
		const queryOptions = {
			'Page': 'dashboard',
			'Lang': 'EN',
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'Lenovo'
		};

		this.cmsService.fetchCMSContent(queryOptions).then(
			(response: any) => {
				this.cardContentPositionA = this.cmsService.getOneCMSContent(response, 'half-width-top-image-title-link', 'position-E')[0];
				this.cardContentPositionB = this.cmsService.getOneCMSContent(response, 'half-width-title-description-link-image', 'position-C')[0];

				this.cardContentPositionB.BrandName = this.cardContentPositionB.BrandName.split('|')[0];
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}
}
