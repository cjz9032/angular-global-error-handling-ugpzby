import { Component, OnDestroy, OnInit } from '@angular/core';
import { QaService } from '../../../services/qa/qa.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { AudioService } from 'src/app/services/audio/audio.service';
import { Microphone } from 'src/app/data-models/audio/microphone.model';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { InputAccessoriesCapability } from 'src/app/data-models/input-accessories/input-accessories-capability.model';
import { WelcomeTutorial } from 'src/app/data-models/common/welcome-tutorial.model';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { EMPTY } from 'rxjs';

@Component({
	selector: 'vtr-page-device-settings',
	templateUrl: './page-device-settings.component.html',
	styleUrls: ['./page-device-settings.component.scss']
})
export class PageDeviceSettingsComponent implements OnInit, OnDestroy {

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
	machineType: number;
	private notificationSubscription: Subscription;
	public isOnline: any = true;


	constructor(
		public qaService: QaService,
		private cmsService: CMSService,
		private commonService: CommonService,
		public deviceService: DeviceService,
		public audioService: AudioService,
		private logger: LoggerService,
		private translate: TranslateService
	) {
		this.fetchCMSArticles();
		// VAN-5872, server switch feature on language change
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.fetchCMSArticles();
		});

		// Evaluate the translations for QA on language Change
		// this.qaService.setTranslationService(this.translate);
		// this.qaService.setCurrentLangTranslations();
		this.qaService.getQATranslation(translate); // VAN-5872, server switch feature

		// translate subheader menus
		this.menuItems.forEach(m => {
			// m.label = this.translate.instant(m.label);//VAN-5872, server switch feature
			this.translate.stream(m.label).subscribe((value) => {
				m.label = value;
			});
		});
	}

	ngOnInit() {
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
		console.log('DEVICE SETTINGS INIT', this.menuItems);
		this.isDesktopMachine = this.commonService.getLocalStorageValue(LocalStorageKey.DesktopMachine);
		// translate subheader menus
		/*this.menuItems.forEach(m => {
			//m.label = this.translate.instant(m.label);
			this.translate.stream(m.label).subscribe((value) => {
				m.label = value;
			});
		});*/  // VAN-5872, server switch feature
		this.initInputAccessories();

		this.isOnline = this.commonService.isOnline;
		if (this.isOnline) {
			const welcomeTutorial: WelcomeTutorial = this.commonService.getLocalStorageValue(LocalStorageKey.WelcomeTutorial, undefined);
			// if welcome tutorial is available and page is 2 then onboarding is completed by user. Load device settings features
			if (welcomeTutorial && welcomeTutorial.page === 2) {
				this.getMicrophoneSettings();
			}
		} else {
			this.getMicrophoneSettings();
		}
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
				case LocalStorageKey.WelcomeTutorial:
					if (payload.page === 2) {
						this.getMicrophoneSettings();
					}
					break;
				default:
					break;
			}
		}
	}

	initInputAccessories() {
		this.machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType);
		if (this.machineType !== 1 && this.machineType !== 0) {
			this.menuItems = this.commonService.removeObjFrom(this.menuItems, this.menuItems[3].path);
			return;
		} else {
			const inputAccessoriesCapability: InputAccessoriesCapability = this.commonService.getLocalStorageValue(LocalStorageKey.InputAccessoriesCapability);
			const isAvailable = inputAccessoriesCapability.isUdkAvailable
				|| inputAccessoriesCapability.isKeyboardMapAvailable;
			const isVOIPAvailable = this.commonService.getLocalStorageValue(LocalStorageKey.VOIPCapability);
			const topRowFunctionsIdeapadCapability = this.commonService.getLocalStorageValue(LocalStorageKey.TopRowFunctionsCapability);
			if (!isAvailable && !isVOIPAvailable && !topRowFunctionsIdeapadCapability) {
				this.menuItems = this.commonService.removeObjFrom(this.menuItems, this.menuItems[3].path);
			}
		}
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
						this.logger.error('getMicrophoneSettings', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('getMicrophoneSettings' + error.message);
			return EMPTY;
		}
	}

	fetchCMSArticles() {
		const queryOptions = {
			Page: 'device-settings'
		};

		this.cmsService.fetchCMSContent(queryOptions).subscribe(
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
				console.log('fetchCMSContent error', error.message);
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

	// VAN-5872, server switch feature
	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		this.qaService.destroyChangeSubscribed();
	}

}
