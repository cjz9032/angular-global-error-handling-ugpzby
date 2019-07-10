import { Component, OnInit } from '@angular/core';
import { QaService } from '../../../services/qa/qa.service';
import { DevService } from '../../../services/dev/dev.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { AudioService } from 'src/app/services/audio/audio.service';
import { Microphone } from 'src/app/data-models/audio/microphone.model';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

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
			label: 'device.deviceSettings.power.title',
			path: 'device-settings/power',
			icon: 'power',
			subitems: [],
			active: true
		}, {
			id: 'audio',
			label: 'device.deviceSettings.audio.title',
			path: 'device-settings/audio',
			icon: 'audio',
			subitems: [],
			active: false
		}, {
			id: 'display-camera',
			label: 'device.deviceSettings.displayCamera.title',
			path: 'device-settings/display-camera',
			icon: 'display-camera',
			subitems: [],
			active: false
		}, {
			id: 'input-accessories',
			label: 'device.deviceSettings.inputAccessories.title',
			path: 'device-settings/input-accessories',
			icon: 'input-accessories',
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
		private translate: TranslateService
	) {
		this.fetchCMSArticles();
		this.getMicrophoneSettings();
		// Evaluate the translations for QA on language Change
		this.qaService.setTranslationService(this.translate);
		this.qaService.setCurrentLangTranslations();

		//translate subheader menus
		this.menuItems.forEach(m => {
			m.label = this.translate.instant(m.label);
			this.translate.stream(m.label).subscribe((value) => {
				m.label = value;
			});
		});
	}

	ngOnInit() {
		this.devService.writeLog('DEVICE SETTINGS INIT', this.menuItems);
		this.isDesktopMachine = this.commonService.getLocalStorageValue(LocalStorageKey.DesktopMachine);

		//translate subheader menus
		this.menuItems.forEach(m => {
			m.label = this.translate.instant(m.label);
			this.translate.stream(m.label).subscribe((value) => {
				m.label = value;
			});
		});
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
		this.cardContentPositionA = {
			Title: '',
			ShortTitle: '',
			Description: '',
			FeatureImage: './../../../../assets/cms-cache/Alexa4x3-zone1.jpg',
			Action: '',
			ActionType: 'External',
			ActionLink: null,
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-title-description-link-image',
			Position: 'position-B',
			ExpirationDate: null,
			Filters: null
		};
	}
}
