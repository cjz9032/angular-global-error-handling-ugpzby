import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { DolbyModeResponse } from 'src/app/data-models/audio/dolby-mode-response';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { WelcomeTutorial } from 'src/app/data-models/common/welcome-tutorial.model';
import { InputAccessoriesCapability } from 'src/app/data-models/input-accessories/input-accessories-capability.model';
import { ContentActionType } from 'src/app/enums/content.enum';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { AudioService } from 'src/app/services/audio/audio.service';
import { CMSService } from 'src/app/services/cms/cms.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { GuardService } from 'src/app/services/guard/guardService.service';
import { NonArmGuard } from 'src/app/services/guard/non-arm-guard';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { QaService } from '../../../services/qa/qa.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { ConfigService } from 'src/app/services/config/config.service';

declare const Windows: any;

@Component({
	selector: 'vtr-page-device-settings',
	templateUrl: './page-device-settings.component.html',
	styleUrls: ['./page-device-settings.component.scss'],
})
export class PageDeviceSettingsComponent implements OnInit, OnDestroy {
	@ViewChild('hsRouterOutlet', { static: false }) hsRouterOutlet: ElementRef;
	routerSubscription: Subscription;
	activeElement: HTMLElement;
	title = 'Device Settings';
	back = 'BACK';
	backarrow = '< ';
	parentPath = 'device';
	params = { fromTab: true };
	menuItems = [
		{
			id: 'power',
			label: 'device.deviceSettings.power.title',
			path: 'device-settings/power',
			icon: 'power',
			iconClass: 'icomoon-power_nav',
			canDeactivate: [GuardService],
			canActivate: [GuardService, NonArmGuard],
			subitems: [],
			active: true,
		},
		{
			id: 'audio',
			label: 'device.deviceSettings.audio.title',
			path: 'device-settings/audio',
			icon: 'audio',
			iconClass: 'icomoon-audio',
			canDeactivate: [GuardService],
			canActivate: [GuardService, NonArmGuard],
			subitems: [],
			active: false,
		},
		{
			id: 'display-camera',
			label: 'device.deviceSettings.displayCamera.title',
			path: 'device-settings/display-camera',
			icon: 'display-camera',
			iconClass: 'icomoon-display_camera',
			canDeactivate: [GuardService],
			canActivate: [GuardService, NonArmGuard],
			subitems: [],
			active: false,
		},
		{
			id: 'input-accessories',
			label: 'device.deviceSettings.inputAccessories.title',
			path: 'device-settings/input-accessories',
			icon: 'input-accessories',
			iconClass: 'icomoon-input_accessories',
			canDeactivate: [GuardService],
			canActivate: [GuardService, NonArmGuard],
			subitems: [],
			active: false,
		},
		{
			id: 'smart-assist',
			label: 'device.smartAssist.title',
			path: 'device-settings/smart-assist',
			icon: 'smart-assist',
			iconClass: 'icomoon-Smart-Assist',
			canDeactivate: [GuardService],
			canActivate: [GuardService, NonArmGuard],
			subitems: [],
			active: false,
		},
	];
	cardContentPositionA: any = {};
	isDesktopMachine = true;
	machineType: number;
	isOnline: any = true;
	private notificationSubscription: Subscription;
	private cmsSubscription: Subscription;

	constructor(
		public qaService: QaService,
		private keyboardService: InputAccessoriesService,
		private cmsService: CMSService,
		private commonService: CommonService,
		public deviceService: DeviceService,
		public audioService: AudioService,
		private logger: LoggerService,
		private translate: TranslateService,
		private localCacheService: LocalCacheService,
		private router: Router,
		private configService: ConfigService
	) {
		// translate subheader menus
		this.menuItems.forEach((m) => {
			m.label = this.translate.instant(m.label);
		});
	}

	ngOnInit() {
		this.notificationSubscription = this.commonService.notification.subscribe(
			(response: AppNotification) => {
				this.onNotification(response);
			}
		);
		this.logger.info('DEVICE SETTINGS INIT', this.menuItems);
		this.isDesktopMachine = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.DesktopMachine
		);

		this.fetchCMSArticles();

		this.qaService.setCurrentLangTranslations();
		this.initInputAccessories();
		this.getSmartAssistCapability();

		this.isOnline = this.commonService.isOnline;
		if (this.isOnline) {
			const welcomeTutorial: WelcomeTutorial = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.WelcomeTutorial,
				undefined
			);
			// if welcome tutorial is available and page is 2 then onboarding is completed by user. Load device settings features
			if (welcomeTutorial && welcomeTutorial.isDone) {
				this.getAudioPageSettings();
			}
		} else {
			this.getAudioPageSettings();
		}

		this.routerSubscription = this.router.events.subscribe((evt) => {
			if (!(evt instanceof NavigationEnd)) {
				return;
			}
			// focus same active link element after route change , content loaded.
			/* if ((evt instanceof NavigationEnd)) {
				if (this.activeElement) {
					this.activeElement.focus();
				}
			} */
		});
	}

	// VAN-5872, server switch feature
	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		if (this.routerSubscription) {
			this.routerSubscription.unsubscribe();
		}
		if (this.cmsSubscription) {
			this.cmsSubscription.unsubscribe();
		}
	}

	hidePowerPage(routeTo: boolean = true) {
		this.menuItems = this.commonService.removeObjById(this.menuItems, 'power');
		if (routeTo) {
			this.router.navigate(['device/device-settings/audio'], { replaceUrl: true });
		}
	}

	async initInputAccessories() {
		this.machineType = this.localCacheService.getLocalCacheValue(LocalStorageKey.MachineType);
		if (this.machineType) {
			const machineFamily = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.MachineFamilyName,
				undefined
			);
			if (machineFamily) {
				const familyName = machineFamily.replace(/\s+/g, '');
				if (this.machineType === 1 && familyName === 'LenovoTablet10') {
					this.menuItems = this.commonService.removeObjFrom(
						this.menuItems,
						this.menuItems[3].path
					);
					return;
				}
			}
			if (this.machineType !== 1 && this.machineType !== 0) {
				this.menuItems = this.commonService.removeObjFrom(
					this.menuItems,
					this.menuItems[3].path
				);
				return;
			} else {
				const inputAccessoriesCapability: InputAccessoriesCapability = this.localCacheService.getLocalCacheValue(
					LocalStorageKey.InputAccessoriesCapability
				);
				let isAvailable = false;
				if (
					inputAccessoriesCapability &&
					(inputAccessoriesCapability.isKeyboardMapAvailable ||
						inputAccessoriesCapability.isUdkAvailable)
				) {
					isAvailable =
						inputAccessoriesCapability.isKeyboardMapAvailable ||
						inputAccessoriesCapability.isUdkAvailable;
				} else {
					const response = await this.keyboardService.GetAllCapability();
					isAvailable =
						response != null &&
						(Object.keys(response).indexOf('keyboardMapCapability') !== -1 ||
							Object.keys(response).indexOf('isUdkAvailable') !== -1)
							? true
							: false;
				}
				const isVOIPAvailable = this.localCacheService.getLocalCacheValue(
					LocalStorageKey.VOIPCapability
				);
				const topRowFunctionsIdeapadCapability = this.localCacheService.getLocalCacheValue(
					LocalStorageKey.TopRowFunctionsCapability
				);
				const backlightCapability = this.localCacheService.getLocalCacheValue(
					LocalStorageKey.BacklightCapability
				);
				if (
					!isAvailable &&
					!isVOIPAvailable &&
					!topRowFunctionsIdeapadCapability &&
					!backlightCapability
				) {
					this.menuItems = this.commonService.removeObjFrom(
						this.menuItems,
						this.menuItems[3].path
					);
				}
			}
		}
	}

	getAudioPageSettings() {
		// this.audioService.getMicrophoneSettingsAsync
		try {
			if (this.audioService.isShellAvailable) {
				const capture = new Windows.Media.Capture.MediaCapture();
				const init = new Windows.Media.Capture.MediaCaptureInitializationSettings();
				init.audioDeviceId = '';
				init.streamingCaptureMode = 1; // Windows.Media.Capture.StreamingCaptureMode.audio;
				const microphonePromise = new Promise<boolean>((resolve) => {
					capture.initializeAsync(init).then(
						() => {
							resolve(true);
						},
						(error) => {
							if (error.number === -2147024891) {
								// check if audio device exist or not
								const defaultRole = Windows.Media.Devices.MediaDevice.getDefaultAudioCaptureId(
									0
								);
								const commuRole = Windows.Media.Devices.MediaDevice.getDefaultAudioCaptureId(
									1
								);
								return resolve(defaultRole !== '' && commuRole !== '');
							}
							// if (error.number === -1072845856) {
							// 	// microphone device was disabled
							// 	resolve(false);
							// }
							return resolve(false);
						}
					);
				});
				Promise.all([this.audioService.getDolbyMode(), microphonePromise])
					.then((responses: any[]) => {
						const dolbyModeResponse: DolbyModeResponse = responses[0];
						const microphone = responses[1];
						this.logger.info('getAudioPageSettings.Promise.all', responses);
						this.localCacheService.setLocalCacheValue(
							LocalStorageKey.IsDolbyModeAvailable,
							dolbyModeResponse.available
						);
						if (!microphone && !dolbyModeResponse.available) {
							// Array.filter won't trigger changeDetect automatically, so we do it manually.
							const tempMenuItems = this.commonService.removeObjById(
								this.menuItems,
								'audio'
							);
							this.menuItems = tempMenuItems.slice();
							this.localCacheService.setLocalCacheValue(
								LocalStorageKey.IsAudioPageAvailable,
								false
							);
						} else {
							this.localCacheService.setLocalCacheValue(
								LocalStorageKey.IsAudioPageAvailable,
								true
							);
						}
					})
					.catch((error) => {
						this.logger.error(
							'error in getAudioPageSettings.Promise.all',
							error.message
						);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('error in getAudioPageSettings.Promise.all', error.message);
		}
	}

	fetchCMSArticles() {
		const queryOptions = {
			Page: 'device-settings',
		};

		this.cmsSubscription = this.cmsService.fetchCMSContent(queryOptions).subscribe(
			(response: any) => {
				const cardContentPositionA = this.cmsService.getOneCMSContent(
					response,
					'inner-page-right-side-article-image-background',
					'position-A'
				)[0];
				if (cardContentPositionA) {
					this.cardContentPositionA = cardContentPositionA;
					if (this.cardContentPositionA.BrandName) {
						this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split(
							'|'
						)[0];
					}
				}
			},
			(error) => {
				this.logger.info('fetchCMSContent error', error.message);
			}
		);
		this.cardContentPositionA = {
			Title: '',
			ShortTitle: '',
			Description: '',
			FeatureImage: 'assets/cms-cache/Alexa4x3-zone1.jpg',
			Action: '',
			ActionType: ContentActionType.External,
			ActionLink: null,
			BrandName: '',
			BrandImage: '',
			Priority: 'P1',
			Page: 'dashboard',
			Template: 'half-width-title-description-link-image',
			Position: 'position-B',
			ExpirationDate: null,
			Filters: null,
		};
	}

	onRouteActivate($event, hsRouterOutlet: HTMLElement) {
		// On route change , change foucs to immediate next below first tabindex on route change response
		this.activeElement = document.activeElement as HTMLElement;
	}

	getSmartAssistCapability() {
		let smartAssistCap = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.IsSmartAssistSupported
		);
		if (smartAssistCap !== undefined) {
			if (!smartAssistCap) {
				this.menuItems = this.commonService.removeObjById(this.menuItems, 'smart-assist');
			}
			return;
		}

		smartAssistCap = this.configService.isSmartAssistAvailable;
		if (!smartAssistCap) {
			this.menuItems = this.commonService.removeObjById(this.menuItems, 'smart-assist');
		}
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
				case LocalStorageKey.WelcomeTutorial:
					if (payload.page === 2) {
						this.getAudioPageSettings();
					}
					break;
				case LocalStorageKey.IsPowerPageAvailable:
					if (!payload) {
						this.hidePowerPage();
					} else if (typeof payload === 'object') {
						this.hidePowerPage(payload.link);
					}
					break;
				default:
					break;
			}
		}
	}
}
