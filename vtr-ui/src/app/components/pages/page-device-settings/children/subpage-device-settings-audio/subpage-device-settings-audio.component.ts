import { Component, OnInit } from '@angular/core';

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

	constructor() { }

	onAutomaticDolbyAudioToggleOnOff(event) {
		this.automaticDolbyAudioSettings = event.switchValue;
	}

	ngOnInit() {
	}
}
