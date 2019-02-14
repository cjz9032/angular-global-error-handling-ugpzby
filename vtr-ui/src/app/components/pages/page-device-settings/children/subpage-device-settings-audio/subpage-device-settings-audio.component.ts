import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-subpage-device-settings-audio',
	templateUrl: './subpage-device-settings-audio.component.html',
	styleUrls: ['./subpage-device-settings-audio.component.scss']
})
export class SubpageDeviceSettingsAudioComponent implements OnInit {
	title = 'Audio Settings';
	automaticDolbyAudioSettings: boolean = false;

	constructor() { }

	onAutomaticDolbyAudioToggleOnOff(event) {
		this.automaticDolbyAudioSettings = event.switchValue;
	}

	ngOnInit() {
	}
}
