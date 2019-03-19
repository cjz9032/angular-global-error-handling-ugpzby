import { Component, OnInit, OnDestroy } from '@angular/core';
import { AudioService } from 'src/app/services/audio/audio.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { MicrophoneOptiomizeStatus } from 'src/app/enums/microphone-optimize.enum';
import { Microphone } from 'src/app/data-models/audio/microphone.model';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { DolbyModeResponse } from 'src/app/data-models/audio/dolby-mode-response';
import { MicrophoneOptimizeModes } from 'src/app/data-models/audio/microphone-optimize-modes';

@Component({
	selector: 'vtr-subpage-device-settings-audio',
	templateUrl: './subpage-device-settings-audio.component.html',
	styleUrls: ['./subpage-device-settings-audio.component.scss']
})
export class SubpageDeviceSettingsAudioComponent implements OnInit, OnDestroy {

	title = 'Audio Settings';
	headerCaption = `This section enables you to automatically optimize or fully configure your audio settings manually
	, such as Dolby settings, microphone, etc.`;

	radioGroupAutoDolbySettings = 'radio-grp-auto-dolby-settings';
	radioOptimiseMicSettings = 'radio-grp-optimise-mic-settings';
	public microphoneProperties: Microphone;
	public autoDolbyFeatureStatus: FeatureStatus;
	public dolbyModeResponse: DolbyModeResponse;
	public microOptimizeModeResponse: MicrophoneOptimizeModes;
	
	constructor(private audioService: AudioService, private dashboardService: DashboardService) { 
	}
	
	getSupportedModes() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.getSupportedModes()
				.then((response: MicrophoneOptimizeModes) => {
					this.microOptimizeModeResponse = response
					console.log('getSupportedModes', response);
				}).catch(error => {
					console.error('getSupportedModes', error);
				});
			}
		} catch(error) {
			console.error("getSupportedModes" + error.message)
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
		} catch(error) {
			console.error("onOptimizeModesRadioChange" + error.message)
		}
	}

	getMicrophoneSettings() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.getMicrophoneSettings()
				.then((microphone: Microphone) => {
					this.microphoneProperties = microphone
					console.log('getMicrophoneSettings', microphone);
				}).catch(error => {
					console.error('getMicrophoneSettings', error);
				});
			}
		} catch(error) {
			console.error("getMicrophoneSettings" + error.message)
		}
	}

	onAutomaticDolbyAudioToggleOnOff(event) {
		try {
			this.autoDolbyFeatureStatus.status = event.switchValue;
			if(this.autoDolbyFeatureStatus.status && !this.autoDolbyFeatureStatus.available) {
				//TODO: Make switch off as Automatic Dolby Audio feature is unavailable 
			}
			if (this.audioService.isShellAvailable) {
				this.audioService.setDolbyOnOff(event.switchValue)
				.then((value) => {
					console.log('onAutomaticDolbyAudioToggleOnOff', value);
				}).catch(error => {
					console.error('onAutomaticDolbyAudioToggleOnOff', error);
				});
			}
		} catch(error) {
			console.error("onAutomaticDolbyAudioToggleOnOff" + error.message)
		}
	}

	getDolbyFeatureStatus() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.getDolbyFeatureStatus()
				.then((dolbyFeature: FeatureStatus) => {
					this.autoDolbyFeatureStatus = dolbyFeature
					console.log('getDolbyFeatureStatus:', dolbyFeature);
				}).catch(error => {
					console.error('getDolbyFeatureStatus', error);
				});
			}
		} catch(error) {
			console.error("getDolbyFeatureStatus" + error.message)
		}
	}

	getDolbyModesStatus() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.getDolbyMode()
				.then((response: DolbyModeResponse) => {
					this.dolbyModeResponse = response
					console.log('getDolbyModesStatus:', response);
				}).catch(error => {
					console.error('getDolbyModesStatus', error);
				});
			}
		} catch(error) {
			console.error("getDolbyModesStatus" + error.message)
		}
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
		} catch(error) {
			console.error("onDolbySeetingRadioChange" + error.message)
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
		} catch(error) {
			console.error("onToggleOfMicrophoneAutoOptimization" + error.message)
		}
	}


	ngOnInit() {
		this.initMockData();
		this.getMicrophoneSettings();
		this.getDolbyFeatureStatus();
		this.getDolbyModesStatus();
		this.getSupportedModes();
		this.startMonitor();
	}

	public setVolume(event) {
		let volumn = event.value
		try {
			this.microphoneProperties.volume = volumn
			if (this.audioService.isShellAvailable) {
				this.audioService.setMicrophoneVolume(volumn)
				.then((value) => {
					console.log('setVolume', value);
				}).catch(error => {
					console.error('setVolume', error);
				});
			}
		} catch(error) {
			console.error("setVolume" + error.message)
		}
	}

	public onToggleOfMicrophone(event) {
		try {
			if (this.dashboardService.isShellAvailable) { 
				this.dashboardService.setMicrophoneStatus(event.switchValue)
					.then((value: boolean) => {
						console.log('onToggleOfMicrophone', value);
					}).catch(error => {
						console.error('onToggleOfMicrophone', error);
					});
			}
		} catch(error) {
			console.error("onToggleOfMicrophone" + error.message)
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
		} catch(error) {
			console.error("onToggleOfSuppressKbdNoise" + error.message)
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
		} catch(error) {
			console.error("setMicrophoneAEC" + error.message)
		}
	}

	startMonitor() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.startMonitor(this.startMonitorHandler)
					.then((value: boolean) => {
						console.log('startMonitor', value);
					}).catch(error => {
						console.error('startMonitor', error);
					});
			}
		} catch(error) {
			console.error("startMonitor" + error.message)
		}
	}

	stopMonitor() {
		try {
			if (this.audioService.isShellAvailable) {
				this.audioService.stopMonitor()
					.then((value: boolean) => {
						console.log('stopMonitor', value);
					}).catch(error => {
						console.error('stopMonitor', error);
					});
			}
		} catch(error) {
			console.error("stopMonitor" + error.message)
		}
	}

	startMonitorHandler(microphone: Microphone) {
		this.microphoneProperties = microphone
		console.log('startMonitorHandler', microphone);
	}

	initMockData() {
		this.microphoneProperties = new Microphone(false, 1, "", false, false, false, false);
		this.autoDolbyFeatureStatus = new FeatureStatus(true, false);
		
		let dolbySupportedMode =  ["dynamic","movie","music","game","voice"]
		this.dolbyModeResponse = new DolbyModeResponse(true, dolbySupportedMode, "");

		let optimizeMode = ["Only My Voice", "Normal", "Multiple Voice", "Voice Recogntion"]
		this.microOptimizeModeResponse = new MicrophoneOptimizeModes(optimizeMode, "")
	}

	ngOnDestroy() {
		this.stopMonitor();
	}
}
