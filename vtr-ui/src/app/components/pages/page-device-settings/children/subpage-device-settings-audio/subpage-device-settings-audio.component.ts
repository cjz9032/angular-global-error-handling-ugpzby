import { Component, OnInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio/audio.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { MicrophoneOptiomizeStatus } from 'src/app/enums/microphone-optimize.enum';

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
	public supportedModes;
	public microphoneProperties;
	public microphoneOptiomizeStatus: MicrophoneOptiomizeStatus.MULTIPLE_VOICES
	constructor(private audioService: AudioService, private dashboardService: DashboardService) { 
	}

	onAutomaticDolbyAudioToggleOnOff(event) {
		this.automaticDolbyAudioSettings = event.switchValue;
		if (this.audioService.isShellAvailable) {
			this.audioService.setDolbyOnOff(this.automaticDolbyAudioSettings)
			.then((value) => {
				console.log('Dolby Setting Set:', value);
			}).catch(error => {
				console.error('setDolbyOnOff', error);
			});
		}
	}

	ngOnInit() {
		
		// this.hwsettings.getMicrophoneSettings()
		// .then(() => {
		// 	this.microphoneProperties = this.hwsettings.getMicrophoneProperties();
		// 	console.log('getMicrophoneSettings.then', this.microphoneProperties);
		// 	console.log(this.microphoneProperties.dataMute);
		// }).catch(error => {
		// 	console.error('getMicrophoneSettings', error);
		// });

		// if (this.hwsettings.isShellAvailable) {
		// 	this.hwsettings.getSupportedModes()
		// 	.then((value) => {
		// 		console.log('getSupportedModes.then', value);
		// 		this.supportedModes = value;
		// 	}).catch(error => {
		// 		console.error('getSupportedModes', error);
		// 	});
		// }
	}

	public setVolume(volumn: number) {
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
