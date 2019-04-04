import { Component, OnInit } from '@angular/core';
import { QaService } from '../../../services/qa/qa.service';
import { DevService } from '../../../services/dev/dev.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
	selector: 'vtr-page-device-settings',
	templateUrl: './page-device-settings.component.html',
	styleUrls: ['./page-device-settings.component.scss']
})
export class PageDeviceSettingsComponent implements OnInit {

	title = 'Device Settings';
	back = 'BACK';
	backarrow = '< ';
	parentPath = 'device';
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
	cardContentPositionA: any;
	showHideBatteryCard = true;
	constructor(
		private devService: DevService,
		public qaService: QaService,
		private cmsService: CMSService,
		public deviceService: DeviceService
	) {
		this.fetchCMSArticles();
	}

	ngOnInit() {
		this.devService.writeLog('DEVICE SETTINGS INIT', this.menuItems);
		this.getMachineType();
	}

	private getMachineType() {
		try {
			if (this.deviceService.isShellAvailable) {
				this.deviceService.getMachineType()
					.then((value: any) => {
						console.log('getMachineType.then', value);
						this.showHideBatteryCard = value < 2;
					}).catch(error => {
						console.error('getMachineType', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	fetchCMSArticles() {
		const queryOptions = {
			'Page': 'device-settings',
			'Lang': 'EN',
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'Lenovo'
		};

		this.cmsService.fetchCMSContent(queryOptions).then(
			(response: any) => {
				this.cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];

				this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}

}
