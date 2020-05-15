import { Component, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { EMPTY, Subscription } from 'rxjs';
import { DolbyModeResponse } from 'src/app/data-models/audio/dolby-mode-response';
import { MicrophoneOptimizeModes } from 'src/app/data-models/audio/microphone-optimize-modes';
import { Microphone } from 'src/app/data-models/audio/microphone.model';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { WelcomeTutorial } from 'src/app/data-models/common/welcome-tutorial.model';
import { DolbyAudioToggleCapability } from 'src/app/data-models/device/dolby-audio-toggle-capability';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { AudioService } from 'src/app/services/audio/audio.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { RouteHandlerService } from 'src/app/services/route-handler/route-handler.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { PageAnchorLink } from 'src/app/data-models/common/page-achor-link.model';
import { TranslateService } from '@ngx-translate/core';
import { UiCircleRadioWithCheckBoxListModel } from 'src/app/components/ui/ui-circle-radio-with-checkbox-list/ui-circle-radio-with-checkbox-list.model';

@Component({
	selector: 'vtr-subpage-device-settings-audio',
	templateUrl: './subpage-device-settings-audio.component.html',
	styleUrls: ['./subpage-device-settings-audio.component.scss']
})
export class SubpageDeviceSettingsAudioComponent implements OnInit, OnDestroy {
	title = 'device.deviceSettings.audio.subtitle';
	headerCaption = 'device.deviceSettings.audio.description';
	radioGroupAutoDolbySettings = 'radio-grp-auto-dolby-settings';
	radioOptimiseMicSettings = 'radio-grp-optimise-mic-settings';

	public microphoneProperties: Microphone;
	public autoDolbyFeatureStatus: FeatureStatus;
	public dolbyModeResponse: DolbyModeResponse;
	public microOptimizeModeResponse: MicrophoneOptimizeModes;
	microphoneLoader = true;
	autoDolbyFeatureLoader = true;
	isDTmachine = false;
	private notificationSubscription: Subscription;
	public readonly helpIcon = ['far', 'question-circle'];
	public automaticDolbyHelpIcon = [];
	public isOnline: any = true;
	private microphoneDevice: any;
	private microphnePermissionHandler: any;
	private Windows: any;
	public eCourseStatus = new FeatureStatus(false, true);
	public voipStatus = new FeatureStatus(false, true);
	public entertainmentStatus = new FeatureStatus(false, true);
	public entertainmentTooltip;
	public eCourseLoader = true;
	public isNewplugin = true;
	public dolbyToggleButtonStatus = undefined;
	public eCourseToggleButtonStatus = undefined;
	public dolbyModesUIModel: Array<UiCircleRadioWithCheckBoxListModel> = [];
	public microphoneModesUIModel: Array<UiCircleRadioWithCheckBoxListModel> = [];
	@Output() tooltipClick = new EventEmitter<boolean>();

	@Input() dolbyModeDisabled = false;
	@Input() automaticAudioDisabled = false;
	@Input() enumMode = '1';

	headerMenuItems: PageAnchorLink[] = [
		{
			title: 'device.deviceSettings.audio.audioSmartsettings.title',
			path: 'audio',
			sortOrder: 1,
			metricsItem: 'DolbyAudio'
		},
		{
			title: 'device.deviceSettings.audio.microphone.title',
			path: 'microphone',
			sortOrder: 2,
			metricsItem: 'microphone'
		}
	];

	// when initialize page, cacheFlag need change to false if user make changes before getting response back,
	// in this case, need to drop response status.
	cacheFlag = { autoOptimization: true, keyboardNoiseSuppression: true, AEC: true, currentMode: true };

	public dolbyAudioToggleCache: DolbyAudioToggleCapability;

	constructor(
		private routeHandler: RouteHandlerService, // logic is added in constructor, no need to call any method
		private audioService: AudioService,
		private dashboardService: DashboardService,
		private logger: LoggerService,
		private commonService: CommonService,
		private translate: TranslateService,
		private vantageShellService: VantageShellService) {
		this.Windows = vantageShellService.getWindows();
		if (this.Windows) {
			this.microphoneDevice = this.Windows.Devices.Enumeration.DeviceAccessInformation
				.createFromDeviceClass(this.Windows.Devices.Enumeration.DeviceClass.audioCapture);
		}
		const entertainmentTooltipText = this.translate.instant('device.deviceSettings.audio.audioSmartsettings.dolby.automaticAudioMode.entertainmentMode.tooltip');
		this.entertainmentTooltip = JSON.parse(JSON.stringify(entertainmentTooltipText).replace(/<\/?.+?\/?>/g, ''));
	}

	ngOnInit() {
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
		this.isDTmachine = this.commonService.getLocalStorageValue(LocalStorageKey.DesktopMachine);
		this.commonService.checkPowerPageFlagAndHide();

		this.isOnline = this.commonService.isOnline;
		if (this.isOnline) {
			const welcomeTutorial: WelcomeTutorial = this.commonService.getLocalStorageValue(LocalStorageKey.WelcomeTutorial, undefined);
			// if welcome tutorial is available and page is 2 then onboarding is completed by user. Load device settings features
			if (welcomeTutorial && welcomeTutorial.isDone) {
				this.initFeatures();
			}
		} else {
			this.initFeatures();
		}

		if (this.microphoneDevice) {
			this.microphnePermissionHandler = (args: any) => {
				if (args && (args.status != null)) {
					switch (args.status) {
						case 1:
							this.microphoneProperties.permission = true;
							this.getMicrophoneSettingsAsync();
							break;
						case 2:
							this.microphoneProperties.permission = false;
							break;
						case 3:
							this.microphoneProperties.permission = false;
							break;
					}
				}
			};
			this.microphoneDevice.addEventListener('accesschanged', this.microphnePermissionHandler, false);
		}
		// this.Windows.Media.Devices.MediaDevice.addEventListener("defaultaudiocapturedevicechanged", this.defaultAudioCaptureDeviceChanged.bind(this));
	}

	private initFeatures() {
		this.initMockData();

		this.initMicrophoneFromCache();
		this.initDolbyAudioFromCache();

		this.getMicrophoneSettingsAsync();
		this.getDolbyModesStatus();

		this.startMicrophoneMonitor();
		this.startMonitorForDolby();
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		this.stopMicrophoneMonitor();
		this.stopMonitorForDolby();

		if (this.microphoneDevice) {
			this.microphoneDevice.removeEventListener('accesschanged', this.microphnePermissionHandler, false);
		}
		// this.Windows.Media.Devices.MediaDevice.removeEventListener("defaultaudiocapturedevicechanged", this.defaultAudioCaptureDeviceChanged);
	}

	initDolbyAudioFromCache() {
		try {
			this.dolbyModeResponse.available = this.commonService.getLocalStorageValue(LocalStorageKey.IsDolbyModeAvailable, true);
			const dolbyAudioCache = this.commonService.getLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, undefined);
			if (dolbyAudioCache !== undefined) {
				this.dolbyModeResponse = dolbyAudioCache;
				this.refreshDolbyAudioProfileState();
				this.autoDolbyFeatureLoader = false;
				this.eCourseLoader = false;
			}
		} catch (error) {
			this.logger.exception('initDolbyAudioFromCache', error);
		}
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
				case LocalStorageKey.WelcomeTutorial:
					if (payload.page === 2) {
						this.initFeatures();
					}
					break;
				default:
					break;
			}
		}
	}

	// getSupportedModes() {
	// 	try {
	// 		if (this.audioService.isShellAvailable) {
	// 			this.audioService.getSupportedModes()
	// 				.then((response: MicrophoneOptimizeModes) => {
	// 					this.microOptimizeModeResponse = response;
	// 					this.logger.info('getSupportedModes', response);
	// 				}).catch(error => {
	// 					this.logger.error('getSupportedModes', error.message);
	// 					return EMPTY;
	// 				});
	// 		}
	// 	} catch (error) {
	// 		this.logger.error('getSupportedModes' + error.message);
	// 		return EMPTY;
	// 	}
	// }

	onOptimizeModesRadioChange(event: any) {
		try {
			const newVal = event.value;
			if (this.microOptimizeModeResponse.current === newVal) {
				this.logger.info('microphone already set');
				return;
			}
			this.microOptimizeModeResponse.current = newVal;
			if (this.audioService.isShellAvailable) {
				this.cacheFlag.currentMode = false;
				this.audioService.setMicrophoneOpitimaztion(this.microOptimizeModeResponse.current)
					.then((value) => {
						this.logger.info('onOptimizeModesRadioChange:', value);
					}).catch(error => {
						this.logger.error('onOptimizeModesRadioChange', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('onOptimizeModesRadioChange' + error.message);
			return EMPTY;
		}
	}

	// getMicrophoneSettings() {
	// 	try {
	// 		if (this.audioService.isShellAvailable) {
	// 			this.audioService.getMicrophoneSettings()
	// 				.then((microphone: Microphone) => {
	// 					this.getSupportedModes();
	// 					this.microphoneProperties = microphone;

	// 					this.microphoneLoader = false;

	// 					const status = new FeatureStatus(microphone.available, microphone.muteDisabled, microphone.permission);
	// 					this.commonService.setSessionStorageValue(SessionStorageKey.DashboardMicrophone, status);

	// 					this.logger.info('getMicrophoneSettings', microphone);
	// 				}).catch(error => {
	// 					this.logger.error('getMicrophoneSettings', error.message);
	// 					return EMPTY;
	// 				});
	// 		}
	// 	} catch (error) {
	// 		this.logger.error('getMicrophoneSettings' + error.message);
	// 		return EMPTY;
	// 	}
	// }

	public onRightIconClick(tooltip: any, $event: any) {
		this.toggleToolTip(tooltip, true);
		this.tooltipClick.emit($event);
	}

	public toggleToolTip(tooltip: any, canOpen = false) {
		if (tooltip) {
			if (tooltip.isOpen()) {
				tooltip.close();
			} else if (canOpen) {
				tooltip.open();
			}
		}
	}

	getDolbyModesStatus() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.getDolbyMode()
					.then((response: DolbyModeResponse) => {
						if (response.entertainmentStatus === undefined) {
							// Old plugin return undefined, Dealing with ui latency issues
							response.entertainmentStatus = this.dolbyModeResponse.entertainmentStatus;
						}
						this.dolbyModeResponse = response;
						this.updateDolbyModeModel(response);
						this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyModeResponse);
						if (this.dolbyModeResponse.eCourseStatus === undefined) {
							this.isNewplugin = false;
							this.dolbyModeResponse.voIPStatus = (this.microphoneProperties.autoOptimization) ? 'True' : 'False';
							this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyModeResponse);
							this.getDolbyFeatureStatus();
						}
						else {
							if (response.eCourseStatus !== 'NotSupport') {
								this.dolbyToggleButtonStatus = response.isAudioProfileEnabled;
								this.eCourseToggleButtonStatus = (response.eCourseStatus === 'True') ? true : false;
							}
						}
						this.initVisibility();
						this.refreshDolbyAudioProfileState();
						this.autoDolbyFeatureLoader = false;
						this.eCourseLoader = false;
						this.logger.info('getDolbyModesStatus:', response);
					}).catch(error => {
						this.logger.error('getDolbyModesStatus', error.message);
					});
			}
		} catch (error) {
			this.logger.error('getDolbyModesStatus' + error.message);
		}
	}

	updateDolbyModeModel(response: DolbyModeResponse) {
		if (response && response.supportedModes) {
			this.dolbyModesUIModel = [];
			response.supportedModes.forEach(dolbyMode => {
				this.dolbyModesUIModel.push({
					componentId: `radioDolbyMode${dolbyMode}`.replace(/\s/g, ''),
					label: `device.deviceSettings.audio.audioSmartsettings.dolby.options.${dolbyMode.toLowerCase()}`,
					value: dolbyMode,
					isChecked: dolbyMode === response.currentMode,
					isDisabled: false,
					processIcon: true,
					customIcon: '',
					hideIcon: false,
					processLabel: true,
				});
			});
		}
	}

	updateMicrophoneModel(response: MicrophoneOptimizeModes) {
		if (response && response.modes) {
			this.microphoneModesUIModel = [];
			response.modes.forEach(micMode => {
				this.microphoneModesUIModel.push({
					componentId: `radioMicrophone${micMode}`.replace(/\s/g, ''),
					label: `device.deviceSettings.audio.microphone.optimize.options.${micMode}`,
					value: micMode,
					isChecked: micMode === response.current,
					isDisabled: this.microphoneProperties.disableEffect,
					processIcon: true,
					customIcon: micMode.toLowerCase() === 'normal' ? 'LE-VoiceRecognition2x': '',
					hideIcon: micMode.toLowerCase() === 'normal',
					processLabel: true,
				});
			});
		}
	}

	getDolbyFeatureStatus() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.getDolbyFeatureStatus()
					.then((dolbyFeature: FeatureStatus) => {
						this.dolbyModeResponse.entertainmentStatus = (!dolbyFeature.available) ? 'NotSupport' : (dolbyFeature.status) ? 'True' : 'False';
						this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyModeResponse);
						this.refreshDolbyAudioProfileState();
						this.logger.info('getDolbyFeatureStatus old plugin', dolbyFeature);
					}).catch(error => {
						this.logger.error('getDolbyFeatureStatus old plugin' + error.message);
					});
			}
		} catch (error) {
			this.logger.error('getDolbyFeatureStatus old plugin' + error.message);
		}
	}

	startMonitorForDolby() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.startMonitorForDolby(this.startMonitorHandlerForDolby.bind(this))
					.then((value: boolean) => {
						this.logger.info('startMonitorForDolby', value);
					}).catch(error => {
						this.logger.error('startMonitorForDolby', error.message);
					});
			}
		} catch (error) {
			this.logger.error('startMonitorForDolby' + error.message);
		}
	}

	stopMonitorForDolby() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.stopMonitorForDolby()
					.then((value: boolean) => {
						this.logger.info('stopMonitorForDolby', value);
					}).catch(error => {
						this.logger.error('stopMonitorForDolby', error.message);
					});
			}
		} catch (error) {
			this.logger.error('stopMonitorForDolby' + error.message);
		}
	}

	refreshDolbyAudioProfileState() {
		this.logger.info('refreshDolbyAudioProfileState', this.dolbyModeResponse);
		if (this.dolbyModeResponse.voIPStatus === 'True' || this.dolbyModeResponse.voIPStatus === 'False') {
			this.voipStatus.available = true;
			this.voipStatus.status = (this.dolbyModeResponse.voIPStatus === 'True');
		}
		else {
			this.voipStatus.available = false;
		}

		if (this.dolbyModeResponse.entertainmentStatus === 'True' || this.dolbyModeResponse.entertainmentStatus === 'False') {
			this.entertainmentStatus.available = true;
			this.entertainmentStatus.status = (this.dolbyModeResponse.entertainmentStatus === 'True');
		}
		else {
			this.entertainmentStatus.available = false;
		}

		if (this.dolbyModeResponse.eCourseStatus === 'True' || this.dolbyModeResponse.eCourseStatus === 'False') {
			this.eCourseStatus.available = true;
			this.eCourseStatus.status = (this.dolbyModeResponse.eCourseStatus === 'True') ? true : false;
			this.automaticAudioDisabled = this.eCourseStatus.status;
			this.dolbyModeDisabled = this.eCourseStatus.status;
			if (this.eCourseStatus.status && (this.eCourseToggleButtonStatus !== this.eCourseStatus.status) && this.eCourseToggleButtonStatus !== undefined) {
				this.dolbyModeResponse.isAudioProfileEnabled = true;
				this.eCourseToggleButtonStatus = this.eCourseStatus.status;
				this.dolbyToggleButtonStatus = true;
				this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyModeResponse);
			}
			if (!this.dolbyModeResponse.isAudioProfileEnabled && (this.dolbyToggleButtonStatus !== this.dolbyModeResponse.isAudioProfileEnabled) && this.dolbyToggleButtonStatus !== undefined) {
				this.eCourseStatus.status = false;
				this.dolbyModeResponse.eCourseStatus = 'False';
				this.eCourseToggleButtonStatus = false;
				this.dolbyToggleButtonStatus = this.dolbyModeResponse.isAudioProfileEnabled;
				this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyModeResponse);
			}
		} else {
			this.eCourseStatus.available = false;
			this.automaticAudioDisabled = false;
			this.dolbyModeDisabled = false;
		}

	}

	onDolbyAudioToggleOnOff(event: any) {
		if (!event.switchValue && this.dolbyModeResponse.eCourseStatus === 'True') {
			this.eCourseStatus.status = event.switchValue;
			this.dolbyModeResponse.eCourseStatus = 'False';
			this.eCourseToggleButtonStatus = false;
		}
		else {
			this.dolbyModeDisabled = !event.switchValue;
			this.automaticAudioDisabled = !event.switchValue;
		}
		this.dolbyModeResponse.isAudioProfileEnabled = event.switchValue;
		this.dolbyToggleButtonStatus = event.switchValue;
		this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyModeResponse);
		if (this.audioService.isShellAvailable) {
			this.audioService.setDolbyAudioState(event.switchValue)
				.then((response: boolean) => {
					this.logger.info('onDolbyAudioToggleOnOff:', response);
				}).catch(error => {
					this.logger.error('onDolbyAudioToggleOnOff', error.message);
				});
		}
	}

	onVoipCheckboxChange(value: boolean) {
		this.voipStatus.status = value;
		this.dolbyModeResponse.voIPStatus = (value) ? 'True' : 'False';
		this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyModeResponse);
		try {
			if (this.isNewplugin) {
				if (this.audioService.isShellAvailable) {
					this.audioService.setDolbyAudioProfileState('VoIPStatus', value)
						.then((response: boolean) => {
							this.logger.info('onVoipCheckboxChange New plugin', response);
						}).catch(error => {
							this.logger.error('onVoipCheckboxChange New plugin', error.message);
						});
				}
			}
			else {
				this.microphoneProperties.autoOptimization = value;
				this.updateMicrophoneCache();
				if (this.audioService.isShellAvailable) {
					this.cacheFlag.autoOptimization = false;
					this.audioService.setMicrophoneAutoOptimization(value)
						.then((value1) => {
							this.logger.info('onVoipCheckboxChange old plugin', value1);
						}).catch(error => {
							this.logger.error('onVoipCheckboxChange old plugin', error.message);
						});
				}
			}
		} catch (error) {
			this.logger.error('onVoipCheckboxChange' + error.message);
		}
	}

	onEntertainmentCheckboxChange(value: boolean) {
		this.entertainmentStatus.status = value;
		this.dolbyModeResponse.entertainmentStatus = (value) ? 'True' : 'False';
		this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyModeResponse);
		try {
			if (this.isNewplugin) {
				this.audioService.setDolbyAudioProfileState('EntertainmentStatus', value)
					.then((response: boolean) => {
						this.logger.info('onEntertainmentCheckboxChange New plugin', response);
					}).catch(error => {
						this.logger.error('onEntertainmentCheckboxChange New plugin', error.message);
					});
			}
			else {
				if (this.audioService.isShellAvailable) {
					this.audioService.setDolbyOnOff(value)
						.then((value1) => {
							this.logger.info('onEntertainmentCheckboxChange old plugin', value1);
						}).catch(error => {
							this.logger.error('onEntertainmentCheckboxChange old plugin', error.message);
						});
				}
			}
		} catch (error) {
			this.logger.error('onEntertainmentCheckboxChange' + error.message);
		}
	}

	onToggleOfeCourseAutoOptimization(event: any) {
		this.eCourseStatus.status = event.switchValue;
		if (event.switchValue) {
			this.dolbyModeResponse.isAudioProfileEnabled = event.switchValue;
			this.dolbyModeResponse.currentMode = 'Voip';
			this.dolbyToggleButtonStatus = event.switchValue;
		}
		this.dolbyModeDisabled = event.switchValue;
		this.automaticAudioDisabled = event.switchValue;
		this.eCourseToggleButtonStatus = event.switchValue;
		this.dolbyModeResponse.eCourseStatus = (event.switchValue) ? 'True' : 'False';
		this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyModeResponse);
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.setDolbyAudioProfileState('ECourseStatus', event.switchValue)
					.then((response: boolean) => {
						this.logger.info('onToggleOfeCourseAutoOptimization:', response);
					}).catch(error => {
						this.logger.error('onToggleOfeCourseAutoOptimization', error.message);
					});
			}
		} catch (error) {
			this.logger.error('onToggleOfeCourseAutoOptimization' + error.message);
		}
	}

	startMonitorHandlerForDolby(response: any) {
		this.logger.info('startMonitorHandlerForDolby', response);
		this.dolbyModeResponse.available = (Object.keys(response).indexOf('available') !== -1 && response.available !== undefined) ? response.available : this.dolbyModeResponse.available;
		this.dolbyModeResponse.currentMode = (Object.keys(response).indexOf('currentMode') !== -1 && response.currentMode !== undefined) ? response.currentMode : this.dolbyModeResponse.currentMode;
		this.dolbyModeResponse.isAudioProfileEnabled = (Object.keys(response).indexOf('isAudioProfileEnabled') !== -1 && response.isAudioProfileEnabled !== undefined) ? response.isAudioProfileEnabled : this.dolbyModeResponse.isAudioProfileEnabled;
		this.dolbyModeResponse.eCourseStatus = (Object.keys(response).indexOf('eCourseStatus') !== -1 && response.eCourseStatus !== undefined) ? response.eCourseStatus : this.dolbyModeResponse.eCourseStatus;
		this.dolbyModeResponse.driverAvailability = (Object.keys(response).indexOf('driverAvailability') !== -1 && response.driverAvailability !== undefined) ? response.driverAvailability : this.dolbyModeResponse.driverAvailability;
		this.refreshDolbyAudioProfileState();
		this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyModeResponse);
		this.initVisibility();
	}

	onDolbySettingRadioChange(event: any) {
		try {
			this.dolbyModeResponse.currentMode = event.value;
			if (this.audioService.isShellAvailable) {
				this.audioService.setDolbyMode(this.dolbyModeResponse.currentMode)
					.then((value) => {
						this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyModeResponse);
						this.logger.info('onDolbySettingRadioChange', value);
					}).catch(error => {
						this.logger.error('onDolbySettingRadioChange', error.message);
					});
			}
		} catch (error) {
			this.logger.error('onDolbySettingRadioChange' + error.message);
		}
	}

	public onMicrophoneVolumeChange($event: number) {
		const volume = $event;
		try {
			this.microphoneProperties.volume = volume;
			this.updateMicrophoneCache();

			if (this.audioService.isShellAvailable) {
				this.audioService.setMicrophoneVolume(volume)
					.then((response) => {
						this.logger.info('onMicrophoneVolumeChange', { response, volume });
					}).catch(error => {
						this.logger.error('onMicrophoneVolumeChange', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('onMicrophoneVolumeChange' + error.message);
			return EMPTY;
		}
	}

	public onToggleOfMicrophone(event: any) {
		try {
			this.microphoneProperties.muteDisabled = event.switchValue;
			this.updateMicrophoneCache();

			if (this.dashboardService.isShellAvailable) {
				this.dashboardService.setMicrophoneStatus(event.switchValue)
					.then((value: boolean) => {
						const status: FeatureStatus = this.commonService.getSessionStorageValue(SessionStorageKey.DashboardMicrophone);
						status.status = event.switchValue;
						this.commonService.setSessionStorageValue(SessionStorageKey.DashboardMicrophone, status);
						this.logger.info('onToggleOfMicrophone', value);
					}).catch(error => {
						this.logger.error('onToggleOfMicrophone', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('onToggleOfMicrophone' + error.message);
			return EMPTY;
		}
	}

	public onToggleOfSuppressKbdNoise(event: any) {
		try {
			this.microphoneProperties.keyboardNoiseSuppression = event.switchValue;
			this.updateMicrophoneCache();

			if (this.audioService.isShellAvailable) {
				this.cacheFlag.keyboardNoiseSuppression = false;
				this.audioService.setSuppressKeyboardNoise(event.switchValue)
					.then((value: boolean) => {
						this.logger.info('onToggleOfSuppressKbdNoise', value);
					}).catch(error => {
						this.logger.error('onToggleOfSuppressKbdNoise', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('onToggleOfSuppressKbdNoise' + error.message);
			return EMPTY;
		}
	}

	public setMicrophoneAEC(event: any) {
		try {
			this.microphoneProperties.AEC = event.switchValue;
			this.updateMicrophoneCache();

			if (this.audioService.isShellAvailable) {
				this.cacheFlag.AEC = false;
				this.audioService.setMicrophoneAEC(event.switchValue)
					.then((value: boolean) => {
						this.logger.info('setMicrophoneAEC', value);
					}).catch(error => {
						this.logger.error('setMicrophoneAEC', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('setMicrophoneAEC' + error.message);
			return EMPTY;
		}
	}

	startMicrophoneMonitor() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.startMicrophoneMonitor(this.startMonitorHandler.bind(this))
					.then((value: boolean) => {
						this.logger.info('startMicrophoneMonitor.then', value);
					}).catch(error => {
						this.logger.error('startMicrophoneMonitor.error', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.exception('startMicrophoneMonitor.exception', error);
			return EMPTY;
		}
	}

	stopMicrophoneMonitor() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.stopMicrophoneMonitor()
					.then((value: boolean) => {
						this.logger.info('stopMonitor', value);
					}).catch(error => {
						this.logger.error('stopMonitor', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('stopMonitor' + error.message);
			return EMPTY;
		}
	}

	startMonitorHandler(microphone: Microphone) {
		// because microphone object only contains the changed properies
		this.microphoneProperties = { ...this.microphoneProperties, ...microphone };
		// this.microphoneProperties = microphone;
		// update microphone mode
		if (this.microphoneProperties.currentMode !== '') {
			this.microOptimizeModeResponse.current = this.microphoneProperties.currentMode;
		}
		this.microphoneLoader = false;
		this.logger.info('startMonitorHandler for microphone', JSON.stringify(microphone));
		this.updateMicrophoneCache();
	}

	initMockData() {
		this.microphoneProperties = new Microphone(true, false, 0, '', undefined, false, undefined, false, true);

		const dolbySupportedMode = ['device.deviceSettings.audio.audioSmartsettings.dolby.options.dynamic',
			'device.deviceSettings.audio.audioSmartsettings.dolby.options.movie',
			'device.deviceSettings.audio.audioSmartsettings.dolby.options.music',
			'device.deviceSettings.audio.audioSmartsettings.dolby.options.games',
			'device.deviceSettings.audio.audioSmartsettings.dolby.options.voip'];

		this.dolbyModeResponse = new DolbyModeResponse(true, dolbySupportedMode, 'Voip', true, 'NotSupport', 'True', 'True', true);

		// const optimizeMode = ['Only My Voice', 'Normal', 'Multiple Voice', 'Voice Recogntion'];
		const optimizeMode = ['device.deviceSettings.audio.microphone.optimize.options.OnlyMyVoice',
			'device.deviceSettings.audio.microphone.optimize.options.Normal',
			'device.deviceSettings.audio.microphone.optimize.options.MultipleVoices',
			'device.deviceSettings.audio.microphone.optimize.options.VoiceRecognition'];
		this.microOptimizeModeResponse = new MicrophoneOptimizeModes(optimizeMode, '');
	}

	initMicrophoneFromCache() {
		const microphoneCache = this.commonService.getLocalStorageValue(LocalStorageKey.MicrophoneCapability);

		if (microphoneCache) {
			// because autoOptimization is Lenovo feature, so can use cache safely
			if (microphoneCache.data) {
				if (microphoneCache.data.autoOptimization) {
					this.microphoneProperties.autoOptimization = microphoneCache.data.autoOptimization;
					if (!this.isNewplugin) {
						this.dolbyModeResponse.voIPStatus = (this.microphoneProperties.autoOptimization) ? 'True' : 'False';
						this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyModeResponse);
					}
				}
				if (microphoneCache.data.keyboardNoiseSuppression) {
					this.microphoneProperties.keyboardNoiseSuppression = microphoneCache.data.keyboardNoiseSuppression;
				}
				if (microphoneCache.data.AEC) {
					this.microphoneProperties.AEC = microphoneCache.data.AEC;
				}
			}
			if (microphoneCache.modes && microphoneCache.modes.length > 0) {
				// because microOptimizeModeResponse already initiliazed in initMockData function, here can use directly
				this.microOptimizeModeResponse.modes = microphoneCache.modes;

				if (microphoneCache.data.currentMode) {
					this.microphoneProperties.currentMode = microphoneCache.data.currentMode;
					this.microOptimizeModeResponse.current = microphoneCache.data.currentMode;
				}
			}
		}
	}

	getMicrophoneSettingsAsync() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.getMicrophoneSettingsAsync(this.updateMicrophoneHandler.bind(this));
			}
		} catch (error) {
			this.logger.error('getMicrophoneSettingsAsync' + error.message);
		}
	}

	updateMicrophoneHandler(msg: any) {
		this.microphoneLoader = false;

		if (msg.hasOwnProperty('available')) {
			this.microphoneProperties.available = msg.available;
		}
		if (msg.hasOwnProperty('muteDisabled')) {
			this.microphoneProperties.muteDisabled = msg.muteDisabled;
		}
		if (msg.hasOwnProperty('volume')) {
			this.logger.info('*****ready to change volume ' + msg.volume);
			this.microphoneProperties.volume = msg.volume;
		}
		if (msg.hasOwnProperty('permission')) {
			this.microphoneProperties.permission = msg.permission;
			// update cache used in dashboard page
			const status = new FeatureStatus(msg.available, msg.muteDisabled, msg.permission);
			this.commonService.setSessionStorageValue(SessionStorageKey.DashboardMicrophone, status);
		}
		if (msg.hasOwnProperty('modes')) {
			this.microOptimizeModeResponse.modes = msg.modes;
			this.updateMicrophoneModel(this.microOptimizeModeResponse);

		}
		if (msg.hasOwnProperty('currentMode')) {
			if (msg.currentMode && this.cacheFlag.currentMode) {
				this.microphoneProperties.currentMode = msg.currentMode;
				this.microOptimizeModeResponse.current = msg.currentMode;
			}
		}
		if (msg.hasOwnProperty('keyboardNoiseSuppression') && this.cacheFlag.keyboardNoiseSuppression) {
			this.microphoneProperties.keyboardNoiseSuppression = msg.keyboardNoiseSuppression;
		}
		if (msg.hasOwnProperty('AEC') && this.cacheFlag.AEC) {
			this.microphoneProperties.AEC = msg.AEC;
		}
		if (msg.hasOwnProperty('disableEffect')) {
			this.microphoneProperties.disableEffect = msg.disableEffect;
		}
		if (msg.hasOwnProperty('autoOptimization') && this.cacheFlag.autoOptimization) {
			this.microphoneProperties.autoOptimization = msg.autoOptimization;
			if (!this.isNewplugin) {
				this.dolbyModeResponse.voIPStatus = (this.microphoneProperties.autoOptimization) ? 'True' : 'False';
				this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyModeResponse);
			}
			// because this item need plugin response, so it is the last response
			// this.microphoneLoader = false;
		}
		// if message has finished flag, means already get all the data, now can save to cache
		if (msg.hasOwnProperty('finished')) {
			this.updateMicrophoneCache();
			// reset cacheFlag
			this.cacheFlag.AEC = true;
			this.cacheFlag.autoOptimization = true;
			this.cacheFlag.currentMode = true;
			this.cacheFlag.keyboardNoiseSuppression = true;
		}
		this.updateMicrophoneHeader();
		this.logger.info('updateMicrophoneHandler ' + JSON.stringify(msg));
	}

	updateMicrophoneCache() {
		const info = {
			data: this.microphoneProperties,
			modes: this.microOptimizeModeResponse.modes
		};
		this.logger.info('ready to update microphone cache');
		this.commonService.setLocalStorageValue(LocalStorageKey.MicrophoneCapability, info);
		this.updateMicrophoneHeader();
	}

	updateMicrophoneHeader() {
		if (!this.microphoneProperties.available) {
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'microphone');
		}
	}

	// private defaultAudioCaptureDeviceChanged(args: any) {
	// 	this.getMicrophoneSettingsAsync();
	// }

	initVisibility() {
		try {
			if (!this.dolbyModeResponse.available) {
				this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'audio');
				this.checkMenuItemsLength();
			}
		} catch (error) {
			this.logger.exception('initVisibility', error.message);
		}
	}

	public checkMenuItemsLength() {
		if (this.headerMenuItems.length === 1) {
			this.headerMenuItems = [];
		}
	}
}