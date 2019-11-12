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
import { Subscription } from 'rxjs/internal/Subscription';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { EMPTY } from 'rxjs';
import { DolbyAudioToggleCapability } from 'src/app/data-models/device/dolby-audio-toggle-capability';
import { RouteHandlerService } from 'src/app/services/route-handler/route-handler.service';

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


	public dolbyAudioToggleCache: DolbyAudioToggleCapability;

	constructor(
		private routeHandler: RouteHandlerService, // logic is added in constructor, no need to call any method
		private audioService: AudioService,
		private dashboardService: DashboardService,
		private logger: LoggerService,
		private commonService: CommonService) {
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
			if (welcomeTutorial && welcomeTutorial.page === 2) {
				this.initFeatures();
			}
		} else {
				this.initFeatures();
		}

	}

	private initFeatures() {
		this.initMockData();
		this.initDolbyAudioFromCache();
		this.getMicrophoneSettings();
		this.getDolbyFeatureStatus();
		this.getDolbyModesStatus();
		this.getSupportedModes();
		this.startMonitor();
		this.startMonitorForDolby();
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		this.stopMonitor();
		this.stopMonitorForDolby();
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
			} else {
				this.dolbyAudioToggleCache = new DolbyAudioToggleCapability();
				this.dolbyAudioToggleCache.available = this.autoDolbyFeatureStatus.available;
				this.dolbyAudioToggleCache.status = this.autoDolbyFeatureStatus.status;
				this.dolbyAudioToggleCache.loader = this.autoDolbyFeatureLoader;
				this.dolbyAudioToggleCache.icon = this.automaticDolbyHelpIcon;
				this.commonService.setLocalStorageValue(LocalStorageKey.DolbyAudioToggleCache, this.dolbyAudioToggleCache);
			}
		} catch (error) {
			console.log('initExpressChargingFromCache', error);
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

	getSupportedModes() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.getSupportedModes()
					.then((response: MicrophoneOptimizeModes) => {
						this.microOptimizeModeResponse = response;
						console.log('getSupportedModes', response);
					}).catch(error => {
						this.logger.error('getSupportedModes', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('getSupportedModes' + error.message);
			return EMPTY;
		}
	}

	onOptimizeModesRadioChange(event) {
		try {
			this.microOptimizeModeResponse.current = event.target.value;
			if (this.audioService.isShellAvailable) {
				this.audioService.setMicrophoneOpitimaztion(this.microOptimizeModeResponse.current)
					.then((value) => {
						console.log('onOptimizeModesRadioChange:', value);
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

	getMicrophoneSettings() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.getMicrophoneSettings()
					.then((microphone: Microphone) => {
						this.microphoneProperties = microphone;
						const status = new FeatureStatus(microphone.available, microphone.muteDisabled, microphone.permission);
						this.commonService.setSessionStorageValue(SessionStorageKey.DashboardMicrophone, status);
						this.microphoneLoader = false;
						console.log('getMicrophoneSettings', microphone);
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
					.then((value) => {
						console.log('onAutomaticDolbyAudioToggleOnOff', value);
					}).catch(error => {
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

						console.log('getDolbyFeatureStatus:', dolbyFeature);
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
						console.log('getDolbyModesStatus:', response);
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
					.then((value: boolean) => {
						console.log('startMonitorForDolby', value);
					}).catch(error => {
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
					.then((value: boolean) => {
						console.log('stopMonitorForDolby', value);
					}).catch(error => {
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
		console.log('startMonitorHandlerForDolby', response);
		this.dolbyModeResponse = response;
	}

	onDolbySeetingRadioChange(event) {
		try {
			this.dolbyModeResponse.currentMode = event.target.value;
			if (this.audioService.isShellAvailable) {
				this.audioService.setDolbyMode(this.dolbyModeResponse.currentMode)
					.then((value) => {
						console.log('onDolbySeetingRadioChange:', value);
					}).catch(error => {
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
				this.audioService.setMicrophoneAutoOptimization(event.switchValue)
					.then((value) => {
						console.log('onToggleOfMicrophoneAutoOptimization:', value);
					}).catch(error => {
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
					.then((value) => {
						console.log('setVolume', value);
					}).catch(error => {
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
						console.log('onToggleOfMicrophone', value);
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
				this.audioService.setSuppressKeyboardNoise(event.switchValue)
					.then((value: boolean) => {
						console.log('onToggleOfSuppressKbdNoise', value);
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

	public setMicrophoneAEC(event) {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.setMicrophoneAEC(event.switchValue)
					.then((value: boolean) => {
						console.log('setMicrophoneAEC', value);
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

	startMonitor() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.startMicrophoneMonitor(this.startMonitorHandler.bind(this))
					.then((value: boolean) => {
						console.log('startMonitor', value);
					}).catch(error => {
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
					.then((value: boolean) => {
						console.log('stopMonitor', value);
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
		this.microphoneProperties = microphone;
		this.microphoneLoader = false;
		console.log('startMonitorHandler', microphone);
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
}
