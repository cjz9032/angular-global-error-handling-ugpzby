import { Component, OnInit } from '@angular/core';
import { QaService } from '../../../services/qa/qa.service';
import { DevService } from '../../../services/dev/dev.service';
import { CMSService } from 'src/app/services/cms/cms.service';

@Component({
	selector: 'vtr-page-device-settings',
	templateUrl: './page-device-settings.component.html',
	styleUrls: ['./page-device-settings.component.scss']
})
export class PageDeviceSettingsComponent implements OnInit {

	title = 'Device Settings';
	back = 'BACK';
	backarrow = '< ';
	menuItems = [
		{
			id: 'power',
			label: 'Power',
			path: 'device-settings/power',
			icon: 'power',
			subitems: [],
			active: true
		}, {
			id: 'audio',
			label: 'Audio',
			path: 'device-settings/audio',
			icon: 'audio',
			subitems: [],
			active: false
		}, {
			id: 'display-camera',
			label: 'Display & Camera',
			path: 'device-settings/display-camera',
			icon: 'display-camera',
			subitems: [],
			active: false
		}
	];
	cardContentPositionA: any = {};
	cardContentPositionB: any = {};

	constructor(
		private devService: DevService,
		public qaService: QaService,
		private cmsService: CMSService
	) { }

	ngOnInit() {
		this.devService.writeLog('DEVICE SETTINGS INIT', this.menuItems);

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
				this.cardContentPositionA = this.cmsService.getOneCMSContent(response, 'half-width-title-description-link-image', 'position-B')[0];

				this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}

}
