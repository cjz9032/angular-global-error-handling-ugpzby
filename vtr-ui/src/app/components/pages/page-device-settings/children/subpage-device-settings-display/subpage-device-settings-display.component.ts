import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-subpage-device-settings-display',
	templateUrl: './subpage-device-settings-display.component.html',
	styleUrls: ['./subpage-device-settings-display.component.scss']
})
export class SubpageDeviceSettingsDisplayComponent implements OnInit {
	title = 'Display & Camera Settings';
	public isAutoExposureEnabled = false;
	constructor() {}

	ngOnInit() {}

	public onAutoExposureChange($event) {
		this.isAutoExposureEnabled = $event.switchValue;
	}
}
