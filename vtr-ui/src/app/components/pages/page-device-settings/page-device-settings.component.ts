import { Component, OnInit } from '@angular/core';
import { QaService } from '../../../services/qa/qa.service';
import { DevService } from '../../../services/dev/dev.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { AudioService } from 'src/app/services/audio/audio.service';
import { Microphone } from 'src/app/data-models/audio/microphone.model';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

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
	public menuItems = [
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
	isDesktopMachine = true;
	constructor(
		private devService: DevService,
		public qaService: QaService,
		private cmsService: CMSService,
		private commonService: CommonService,
		public deviceService: DeviceService,
		public audioService: AudioService,
		private smartAssist: SmartAssistService,
		private logger: LoggerService
	) {
		this.fetchCMSArticles();
		this.getMicrophoneSettings();
		this.getHPDStatus();
	}

	ngOnInit() {
		this.devService.writeLog('DEVICE SETTINGS INIT', this.menuItems);
		this.isDesktopMachine = this.commonService.getLocalStorageValue(LocalStorageKey.DesktopMachine);
	}

	getMicrophoneSettings() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.getMicrophoneSettings()
					.then((microphone: Microphone) => {
						console.log('getMicrophoneSettings', microphone);
						if (!microphone.available) {
							this.menuItems.splice(1, 1);
						}
					}).catch(error => {
						console.error('getMicrophoneSettings', error);
					});
			}
		} catch (error) {
			console.error('getMicrophoneSettings' + error.message);
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

	/**
	 * check if HPD related features are supported or not. If yes show Smart Assist tab else hide. Default is hidden
	 */
	private getHPDStatus() {
		this.smartAssist.getHPDCapability()
			.then((isAvailable: boolean) => {
				console.log('getHPDStatus.getHPDCapability()', isAvailable);
				// isAvailable = true;
				this.commonService.setLocalStorageValue(LocalStorageKey.IsHPDSupported, isAvailable);
				if (isAvailable) {
					this.menuItems.push({
						id: 'smart-assist',
						label: 'Smart Assist',
						path: 'device/device-settings/smart-assist',
						icon: 'smart-assist',
						subitems: [],
						active: false
					});
				}
			})
			.catch(error => {
				this.logger.error('error in getHPDStatus.getHPDCapability()', error);
			});
	}

}
