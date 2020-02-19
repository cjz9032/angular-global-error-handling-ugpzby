import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { AudioService } from 'src/app/services/audio/audio.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { Microphone } from 'src/app/data-models/audio/microphone.model';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { DolbyModeResponse } from 'src/app/data-models/audio/dolby-mode-response';
import { MicrophoneOptimizeModes } from 'src/app/data-models/audio/microphone-optimize-modes';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { WelcomeTutorial } from 'src/app/data-models/common/welcome-tutorial.model';
import { Subscription, EMPTY } from 'rxjs';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { DolbyAudioToggleCapability } from 'src/app/data-models/device/dolby-audio-toggle-capability';
import { RouteHandlerService } from 'src/app/services/route-handler/route-handler.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

@Component({
	selector: 'vtr-subpage-device-settings-audio',
	templateUrl: './subpage-device-settings-audio.component.html',
	styleUrls: ['./subpage-device-settings-audio.component.scss']
})
export class SubpageDeviceSettingsAudioComponent implements OnInit, OnDestroy {
	public manualRefresh: EventEmitter<void> = new EventEmitter<void>();

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

	// when initialize page, cacheFlag need change to false if user make changes before getting response back,
	// in this case, need to drop response status.
	cacheFlag = {autoOptimization: true, keyboardNoiseSuppression: true, AEC: true, currentMode: true};

	public dolbyAudioToggleCache: DolbyAudioToggleCapability;

	constructor(
		private routeHandler: RouteHandlerService, // logic is added in constructor, no need to call any method
		private audioService: AudioService,
		private dashboardService: DashboardService,
		private logger: LoggerService,
		private commonService: CommonService,
		private vantageShellService: VantageShellService) {

			this.Windows = vantageShellService.getWindows();
			if (this.Windows) {
				this.microphoneDevice = this.Windows.Devices.Enumeration.DeviceAccessInformation
					.createFromDeviceClass(this.Windows.Devices.Enumeration.DeviceClass.audioCapture);
			}
	}

	ngOnInit() {
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
		this.isDTmachine = this.commonService.getLocalStorageValue(LocalStorageKey.DesktopMachine);

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
			this.microphnePermissionHandler = (args: any) =>{
				if(args && args.status) {
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
	}

	private initFeatures() {
		this.initMockData();

		this.initMicrophoneFromCache();
		this.initDolbyAudioFromCache();

		this.getMicrophoneSettingsAsync();
		this.getDolbyFeatureStatus();
		this.getDolbyModesStatus();
		
		this.startMonitor();
		this.startMonitorForDolby();
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		this.stopMonitor();
		this.stopMonitorForDolby();

		if (this.microphoneDevice) {
			this.microphoneDevice.removeEventListener('accesschanged', this.microphnePermissionHandler, false);
		}
	}

	initDolbyAudioFromCache() {
		try {
			this.dolbyModeResponse.available = this.commonService.getLocalStorageValue(LocalStorageKey.IsDolbyModeAvailable, true);
			this.dolbyAudioToggleCache = this.commonService.getLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, undefined);
			if (this.dolbyAudioToggleCache !== undefined) {
				this.autoDolbyFeatureStatus.available = this.dolbyAudioToggleCache.available;
				this.autoDolbyFeatureStatus.status = this.dolbyAudioToggleCache.status;
				this.autoDolbyFeatureLoader = this.dolbyAudioToggleCache.loader;
				this.automaticDolbyHelpIcon = this.dolbyAudioToggleCache.icon;
				this.dolbyModeResponse = this.dolbyAudioToggleCache.dolbyModeResponse;
			} else {
				this.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
				this.dolbyAudioToggleCache.available = this.autoDolbyFeatureStatus.available;
				this.dolbyAudioToggleCache.status = this.autoDolbyFeatureStatus.status;
				this.dolbyAudioToggleCache.loader = this.autoDolbyFeatureLoader;
				this.dolbyAudioToggleCache.icon = this.automaticDolbyHelpIcon;
				this.dolbyAudioToggleCache.dolbyModeResponse = this.dolbyModeResponse;
				this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyAudioToggleCache);
			}
		} catch (error) {}
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
	// 					console.log('getSupportedModes', response);
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

	onOptimizeModesRadioChange(event) {
		try {
			const newVal = event.target.value;
			if (this.microOptimizeModeResponse.current == newVal) {
				return;
			}
			this.microOptimizeModeResponse.current = newVal;
			if (this.audioService.isShellAvailable) {
				this.cacheFlag.currentMode = false;
				this.audioService.setMicrophoneOpitimaztion(this.microOptimizeModeResponse.current)
					.then((value) => {}).catch(error => {
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
						
	// 					console.log('getMicrophoneSettings', microphone);
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

	onAutomaticDolbyAudioToggleOnOff(event) {
		try {
			this.autoDolbyFeatureStatus.status = event.switchValue;

			this.dolbyAudioToggleCache.status = this.autoDolbyFeatureStatus.status;
			this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyAudioToggleCache);

			if (this.autoDolbyFeatureStatus.status && !this.autoDolbyFeatureStatus.available) {
				// TODO: Make switch off as Automatic Dolby Audio feature is unavailable
			}
			if (this.audioService.isShellAvailable) {
				this.audioService.setDolbyOnOff(event.switchValue)
					.then((value) => {}).catch(error => {
						this.logger.error('onAutomaticDolbyAudioToggleOnOff', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('onAutomaticDolbyAudioToggleOnOff' + error.message);
			return EMPTY;
		}
	}

	getDolbyFeatureStatus() {
		try {
			if (this.isDTmachine) {
				this.autoDolbyFeatureStatus.available = false;
				this.autoDolbyFeatureLoader = false;

				this.dolbyAudioToggleCache.available = this.autoDolbyFeatureStatus.available;
				this.dolbyAudioToggleCache.loader = this.autoDolbyFeatureLoader;
				this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyAudioToggleCache);
			}
			if (this.audioService.isShellAvailable) {
				this.audioService.getDolbyFeatureStatus()
					.then((dolbyFeature: FeatureStatus) => {
						this.autoDolbyFeatureStatus = dolbyFeature;
						this.autoDolbyFeatureLoader = false;
						this.automaticDolbyHelpIcon = (this.autoDolbyFeatureStatus.available) ? this.helpIcon : [];

						this.dolbyAudioToggleCache.available = this.autoDolbyFeatureStatus.available;
						this.dolbyAudioToggleCache.status = this.autoDolbyFeatureStatus.status;
						this.dolbyAudioToggleCache.loader = this.autoDolbyFeatureLoader;
						this.dolbyAudioToggleCache.icon = this.automaticDolbyHelpIcon;
						this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyAudioToggleCache);
					}).catch(error => {
						this.logger.error('getDolbyFeatureStatus', error.message);
						this.autoDolbyFeatureLoader = false;
						this.autoDolbyFeatureStatus.available = false;

						this.dolbyAudioToggleCache.available = this.autoDolbyFeatureStatus.available;
						this.dolbyAudioToggleCache.loader = this.autoDolbyFeatureLoader;
						this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyAudioToggleCache);
						return EMPTY;
					});
			}
		} catch (error) {
			this.autoDolbyFeatureLoader = false;
			this.autoDolbyFeatureStatus.available = false;

			this.dolbyAudioToggleCache.available = this.autoDolbyFeatureStatus.available;
			this.dolbyAudioToggleCache.loader = this.autoDolbyFeatureLoader;
			this.dolbyAudioToggleCache.icon = this.automaticDolbyHelpIcon;
			this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyAudioToggleCache);

			this.logger.error('getDolbyFeatureStatus' + error.message);
			return EMPTY;
		}
	}

	getDolbyModesStatus() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.getDolbyMode()
					.then((response: DolbyModeResponse) => {
						this.dolbyModeResponse = response;
						this.dolbyAudioToggleCache.dolbyModeResponse = this.dolbyModeResponse;
						this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyAudioToggleCache);
					}).catch(error => {
						this.logger.error('getDolbyModesStatus', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('getDolbyModesStatus' + error.message);
			return EMPTY;
		}
	}

	startMonitorForDolby() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.startMonitorForDolby(this.startMonitorHandlerForDolby.bind(this))
					.then((value: boolean) => {}).catch(error => {
						this.logger.error('startMonitorForDolby', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('startMonitorForDolby' + error.message);
			return EMPTY;
		}
	}

	stopMonitorForDolby() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.stopMonitorForDolby()
					.then((value: boolean) => {}).catch(error => {
						this.logger.error('stopMonitorForDolby', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('stopMonitorForDolby' + error.message);
			return EMPTY;
		}
	}

	startMonitorHandlerForDolby(response: DolbyModeResponse) {
		this.dolbyModeResponse = response;
		this.dolbyAudioToggleCache.dolbyModeResponse = this.dolbyModeResponse;
		this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyAudioToggleCache);
	}

	onDolbySeetingRadioChange(event) {
		try {
			this.dolbyModeResponse.currentMode = event.target.value;
			this.dolbyAudioToggleCache.dolbyModeResponse = this.dolbyModeResponse;
			this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyAudioToggleCache);
			if (this.audioService.isShellAvailable) {
				this.audioService.setDolbyMode(this.dolbyModeResponse.currentMode)
					.then((value) => {}).catch(error => {
						this.logger.error('onDolbySeetingRadioChange', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('onDolbySeetingRadioChange' + error.message);
			return EMPTY;
		}
	}

	onToggleOfMicrophoneAutoOptimization(event) {
		try {
			if (this.audioService.isShellAvailable) {
				this.cacheFlag.autoOptimization = false;
				this.audioService.setMicrophoneAutoOptimization(event.switchValue)
					.then((value) => {}).catch(error => {
						this.logger.error('onToggleOfMicrophoneAutoOptimization', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('onToggleOfMicrophoneAutoOptimization' + error.message);
			return EMPTY;
		}
	}

	public setVolume(event) {
		const volume = event.value;
		try {
			this.microphoneProperties.volume = volume;
			if (this.audioService.isShellAvailable) {
				this.audioService.setMicrophoneVolume(volume)
					.then((value) => {}).catch(error => {
						this.logger.error('setVolume', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('setVolume' + error.message);
			return EMPTY;
		}
	}

	public onToggleOfMicrophone(event) {
		try {
			if (this.dashboardService.isShellAvailable) {
				this.dashboardService.setMicrophoneStatus(event.switchValue)
					.then((value: boolean) => {
						const status: FeatureStatus = this.commonService.getSessionStorageValue(SessionStorageKey.DashboardMicrophone);
						status.status = event.switchValue;
						this.commonService.setSessionStorageValue(SessionStorageKey.DashboardMicrophone, status);
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

	public onToggleOfSuppressKbdNoise(event) {
		try {
			if (this.audioService.isShellAvailable) {
				this.cacheFlag.keyboardNoiseSuppression = false;
				this.audioService.setSuppressKeyboardNoise(event.switchValue)
					.then((value: boolean) => {}).catch(error => {
						this.logger.error('onToggleOfSuppressKbdNoise', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('onToggleOfSuppressKbdNoise' + error.message);
			return EMPTY;
		}
	}

	public setMicrophoneAEC(event) {
		try {
			if (this.audioService.isShellAvailable) {
				this.cacheFlag.AEC = false;
				this.audioService.setMicrophoneAEC(event.switchValue)
					.then((value: boolean) => {}).catch(error => {
						this.logger.error('setMicrophoneAEC', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('setMicrophoneAEC' + error.message);
			return EMPTY;
		}
	}

	startMonitor() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.startMicrophoneMonitor(this.startMonitorHandler.bind(this))
					.then((value: boolean) => {}).catch(error => {
						this.logger.error('startMonitor', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('startMonitor' + error.message);
			return EMPTY;
		}
	}

	stopMonitor() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.stopMicrophoneMonitor()
					.then((value: boolean) => {}).catch(error => {
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
		this.microphoneProperties = {...this.microphoneProperties, ...microphone};
		// this.microphoneProperties = microphone;
		// update microphone mode
		if (this.microphoneProperties.currentMode != '') {
			this.microOptimizeModeResponse.current = this.microphoneProperties.currentMode;
		}
		this.microphoneLoader = false;
		this.logger.info('startMonitorHandler for microphone:' + JSON.stringify(microphone));
		this.updateMicrophoneCache();
	}

	initMockData() {
		this.microphoneProperties = new Microphone(true, false, 0, '', false, false, false, false, true);
		this.autoDolbyFeatureStatus = new FeatureStatus(true, false);

		// const dolbySupportedMode = ['dynamic', 'movie', 'music', 'game', 'voice'];
		const dolbySupportedMode = ['device.deviceSettings.audio.audioSmartsettings.dolby.options.dynamic',
			'device.deviceSettings.audio.audioSmartsettings.dolby.options.movie',
			'device.deviceSettings.audio.audioSmartsettings.dolby.options.music',
			'device.deviceSettings.audio.audioSmartsettings.dolby.options.games',
			'device.deviceSettings.audio.audioSmartsettings.dolby.options.voip'];

		this.dolbyModeResponse = new DolbyModeResponse(true, dolbySupportedMode, '');

		// const optimizeMode = ['Only My Voice', 'Normal', 'Multiple Voice', 'Voice Recogntion'];
		const optimizeMode = ['device.deviceSettings.audio.microphone.optimize.options.OnlyMyVoice',
			'device.deviceSettings.audio.microphone.optimize.options.Normal',
			'device.deviceSettings.audio.microphone.optimize.options.MultipleVoices',
			'device.deviceSettings.audio.microphone.optimize.options.VoiceRecognition'];
		this.microOptimizeModeResponse = new MicrophoneOptimizeModes(optimizeMode, '');
	}

	public onCardCollapse(isCollapsed: boolean) {
		if (!isCollapsed) {
			this.manualRefresh.emit();
		}
	}

	initMicrophoneFromCache() {
		const microphoneCache = this.commonService.getLocalStorageValue(LocalStorageKey.MicrohoneCapability);

		if (microphoneCache) {
			//because autoOptimization is Lenovo feature, so can use cache safely
			if(microphoneCache.data) {
				if (microphoneCache.data.autoOptimization) {
					this.microphoneProperties.autoOptimization = microphoneCache.data.autoOptimization;
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
			this.logger.info('*****ready to change volume ' + msg.volume)
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
		}
		if (msg.hasOwnProperty('currentMode')) {
			if(msg.currentMode && this.cacheFlag.currentMode) {
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
		
		this.logger.info('updateMicrophoneHandler ' + JSON.stringify(msg));
	}

	updateMicrophoneCache() {
		const info = {
			data: this.microphoneProperties,
			modes: this.microOptimizeModeResponse.modes
		};
		this.logger.info('ready to update microhone cache');
		this.commonService.setLocalStorageValue(LocalStorageKey.MicrohoneCapability, info);
	}

}
