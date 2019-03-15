import { Component, OnInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio/audio.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { MicrophoneOptiomizeStatus } from 'src/app/enums/microphone-optimize.enum';
import { Microphone } from 'src/app/data-models/common/microphone.model';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';

@Component({
	selector: 'vtr-subpage-device-settings-audio',
	templateUrl: './subpage-device-settings-audio.component.html',
	styleUrls: ['./subpage-device-settings-audio.component.scss']
})
export class SubpageDeviceSettingsAudioComponent implements OnInit {

	title = 'Audio Settings';
	headerCaption = `This section enables you to automatically optimize or fully configure your audio settings manually
	, such as Dolby settings, microphone, etc.`;
	automaticDolbyAudioSettings = false;

	radioGroupAutoDolbySettings = 'radio-grp-auto-dolby-settings';
	radioOptimiseMicSettings = 'radio-grp-optimise-mic-settings';
	public microphoneProperties = new Microphone(false, 1, "", false, false, false, false);
	public autoDolbyFeatureStatus = new FeatureStatus(true, false);
	constructor(private audioService: AudioService, private dashboardService: DashboardService) { 
	}

	getMicrophoneSettings() {
		if (this.audioService.isShellAvailable) {
			this.audioService.getMicrophoneSettings()
			.then((microphone: Microphone) => {
				this.microphoneProperties = microphone
				console.log('getMicrophoneSettings', microphone);
			}).catch(error => {
				console.error('getMicrophoneSettings', error);
			});
		}
	}

	onAutomaticDolbyAudioToggleOnOff(event) {
		this.autoDolbyFeatureStatus.status = event.switchValue;
		if(this.autoDolbyFeatureStatus.status && !this.autoDolbyFeatureStatus.available) {
			//TODO: Make switch off as Automatic Dolby Audio feature is unavailable 
		}
		if (this.audioService.isShellAvailable) {
			this.audioService.setDolbyOnOff(event.switchValue)
			.then((value) => {
				console.log('Dolby Setting Set:', value);
			}).catch(error => {
				console.error('setDolbyOnOff', error);
			});
		}
	}

	getDolbyFeatureStatus() {
		if (this.audioService.isShellAvailable) {
			this.audioService.getDolbyFeatureStatus()
			.then((dolbyFeature: FeatureStatus) => {
				this.autoDolbyFeatureStatus = dolbyFeature
				console.log('getDolbyFeatureStatus:', dolbyFeature);
			}).catch(error => {
				console.error('getDolbyFeatureStatus', error);
			});
		}
	}

	onToggleOfMicrophoneAutoOptimization(event) {
		if (this.audioService.isShellAvailable) {
			this.audioService.setMicrophoneAutoOptimization(event.switchValue)
			.then((value) => {
				console.log('onToggleOfMicrophoneAutoOptimization:', value);
			}).catch(error => {
				console.error('onToggleOfMicrophoneAutoOptimization', error);
			});
		}
	}


	ngOnInit() {
		this.getMicrophoneSettings();
		this.getDolbyFeatureStatus();
	}

	public setVolume(volumn: number) {
		this.microphoneProperties.volume = volumn
		if (this.audioService.isShellAvailable) {
			this.audioService.setMicrophoneVolume(volumn)
			.then((value) => {
				console.log('Microphone Volume Set:', value);
			}).catch(error => {
				console.error('setMicrophoneVolume', error);
			});
		}
	}

	public onToggleOfMicrophone(event) {
		if (this.dashboardService.isShellAvailable) { 
			this.dashboardService.setMicrophoneStatus(event.switchValue)
				.then((value: boolean) => {
					console.log('onToggleOfMicrophone.then', value);
				}).catch(error => {
					console.error('onToggleOfMicrophone', error);
				});
		}
	}

	public onToggleOfSuppressKbdNoise(event) {
		if (this.audioService.isShellAvailable) {
			this.audioService.setSuppressKeyboardNoise(event.switchValue)
				.then((value: boolean) => {
					console.log('onToggleOfSuppressKbdNoise.then', value);
				}).catch(error => {
					console.error('onToggleOfSuppressKbdNoise', error);
				});
		}
	}

	public setMicrophoneAEC(event) {
		if (this.audioService.isShellAvailable) {
			this.audioService.setMicrophoneAEC(event.switchValue)
				.then((value: boolean) => {
					console.log('setMicrophoneAEC.then', value);
				}).catch(error => {
					console.error('setMicrophoneAEC', error);
				});
		}
	}
}
