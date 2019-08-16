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
	private welcomeTutorial: WelcomeTutorial = undefined;
	private notificationSubscription: Subscription;

	constructor(
		private audioService: AudioService,
		private dashboardService: DashboardService,
		private commonService: CommonService) {
	}

	ngOnInit() {
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
		this.isDTmachine = this.commonService.getLocalStorageValue(LocalStorageKey.DesktopMachine);
		this.welcomeTutorial = this.commonService.getLocalStorageValue(LocalStorageKey.WelcomeTutorial, undefined);
		// if welcome tutorial is available and page is 2 then onboarding is completed by user. Load device settings features
		if (this.welcomeTutorial && this.welcomeTutorial.page === 2) {
			this.initFeatures();
		}

	}

	private initFeatures() {
		this.initMockData();
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
						console.error('getSupportedModes', error);
					});
			}
		} catch (error) {
			console.error('getSupportedModes' + error.message);
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
						console.error('onOptimizeModesRadioChange', error);
					});
			}
		} catch (error) {
			console.error('onOptimizeModesRadioChange' + error.message);
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
						console.error('getMicrophoneSettings', error);
					});
			}
		} catch (error) {
			console.error('getMicrophoneSettings' + error.message);
		}
	}

	onAutomaticDolbyAudioToggleOnOff(event) {
		try {
			this.autoDolbyFeatureStatus.status = event.switchValue;
			if (this.autoDolbyFeatureStatus.status && !this.autoDolbyFeatureStatus.available) {
				// TODO: Make switch off as Automatic Dolby Audio feature is unavailable
			}
			if (this.audioService.isShellAvailable) {
				this.audioService.setDolbyOnOff(event.switchValue)
					.then((value) => {
						console.log('onAutomaticDolbyAudioToggleOnOff', value);
					}).catch(error => {
						console.error('onAutomaticDolbyAudioToggleOnOff', error);
					});
			}
		} catch (error) {
			console.error('onAutomaticDolbyAudioToggleOnOff' + error.message);
		}
	}

	getDolbyFeatureStatus() {
		try {
			if (this.isDTmachine) {
				this.autoDolbyFeatureStatus.available = false;
				this.autoDolbyFeatureLoader = false;
			}
			if (this.audioService.isShellAvailable) {
				this.audioService.getDolbyFeatureStatus()
					.then((dolbyFeature: FeatureStatus) => {
						this.autoDolbyFeatureStatus = dolbyFeature;
						this.autoDolbyFeatureLoader = false;
						console.log('getDolbyFeatureStatus:', dolbyFeature);
					}).catch(error => {
						console.error('getDolbyFeatureStatus', error);
						this.autoDolbyFeatureLoader = false;
						this.autoDolbyFeatureStatus.available = false;
					});
			}
		} catch (error) {
			this.autoDolbyFeatureLoader = false;
			this.autoDolbyFeatureStatus.available = false;
			console.error('getDolbyFeatureStatus' + error.message);
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
						console.error('getDolbyModesStatus', error);
					});
			}
		} catch (error) {
			console.error('getDolbyModesStatus' + error.message);
		}
	}

	startMonitorForDolby() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.startMonitorForDolby(this.startMonitorHandlerForDolby.bind(this))
					.then((value: boolean) => {
						console.log('startMonitorForDolby', value);
					}).catch(error => {
						console.error('startMonitorForDolby', error);
					});
			}
		} catch (error) {
			console.error('startMonitorForDolby' + error.message);
		}
	}

	stopMonitorForDolby() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.stopMonitorForDolby()
					.then((value: boolean) => {
						console.log('stopMonitorForDolby', value);
					}).catch(error => {
						console.error('stopMonitorForDolby', error);
					});
			}
		} catch (error) {
			console.error('stopMonitorForDolby' + error.message);
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
						console.error('onDolbySeetingRadioChange', error);
					});
			}
		} catch (error) {
			console.error('onDolbySeetingRadioChange' + error.message);
		}
	}

	onToggleOfMicrophoneAutoOptimization(event) {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.setMicrophoneAutoOptimization(event.switchValue)
					.then((value) => {
						console.log('onToggleOfMicrophoneAutoOptimization:', value);
					}).catch(error => {
						console.error('onToggleOfMicrophoneAutoOptimization', error);
					});
			}
		} catch (error) {
			console.error('onToggleOfMicrophoneAutoOptimization' + error.message);
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
						console.error('setVolume', error);
					});
			}
		} catch (error) {
			console.error('setVolume' + error.message);
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
						console.error('onToggleOfMicrophone', error);
					});
			}
		} catch (error) {
			console.error('onToggleOfMicrophone' + error.message);
		}
	}

	public onToggleOfSuppressKbdNoise(event) {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.setSuppressKeyboardNoise(event.switchValue)
					.then((value: boolean) => {
						console.log('onToggleOfSuppressKbdNoise', value);
					}).catch(error => {
						console.error('onToggleOfSuppressKbdNoise', error);
					});
			}
		} catch (error) {
			console.error('onToggleOfSuppressKbdNoise' + error.message);
		}
	}

	public setMicrophoneAEC(event) {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.setMicrophoneAEC(event.switchValue)
					.then((value: boolean) => {
						console.log('setMicrophoneAEC', value);
					}).catch(error => {
						console.error('setMicrophoneAEC', error);
					});
			}
		} catch (error) {
			console.error('setMicrophoneAEC' + error.message);
		}
	}

	startMonitor() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.startMicrophoneMonitor(this.startMonitorHandler.bind(this))
					.then((value: boolean) => {
						console.log('startMonitor', value);
					}).catch(error => {
						console.error('startMonitor', error);
					});
			}
		} catch (error) {
			console.error('startMonitor' + error.message);
		}
	}

	stopMonitor() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.stopMicrophoneMonitor()
					.then((value: boolean) => {
						console.log('stopMonitor', value);
					}).catch(error => {
						console.error('stopMonitor', error);
					});
			}
		} catch (error) {
			console.error('stopMonitor' + error.message);
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
