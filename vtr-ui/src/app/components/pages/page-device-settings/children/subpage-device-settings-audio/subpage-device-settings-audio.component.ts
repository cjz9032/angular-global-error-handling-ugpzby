import { Component, OnInit } from '@angular/core';
import { HwsettingsService } from 'src/app/services/hwsettings/hwsettings.service';

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

	constructor(
		public hwsettings: HwsettingsService
	) { }

	onAutomaticDolbyAudioToggleOnOff(event) {
		this.automaticDolbyAudioSettings = event.switchValue;
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

		if (this.hwsettings.isShellAvailable) {
			this.hwsettings.getSupportedModes()
			.then((value) => {
				console.log('getSupportedModes.then', value);
				this.supportedModes = value;
			}).catch(error => {
				console.error('getSupportedModes', error);
			});
		}
	}

	public setVolume(volume: number) {
		if (this.hwsettings.isShellAvailable) {
			this.hwsettings.setMicrophoneVolume(volume)
			.then((value) => {
				console.log('Microphone Volume Set:', value);
			}).catch(error => {
				console.error('setMicrophoneVolume', error);
			});
		}
	}

}
