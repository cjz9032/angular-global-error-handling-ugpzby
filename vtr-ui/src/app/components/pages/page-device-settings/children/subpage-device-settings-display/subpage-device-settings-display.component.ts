import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-subpage-device-settings-display',
	templateUrl: './subpage-device-settings-display.component.html',
	styleUrls: ['./subpage-device-settings-display.component.scss']
})
export class SubpageDeviceSettingsDisplayComponent implements OnInit {
	title = 'Display & Camera Settings';
	public isAutoExposureEnabled = false;

	headerCaption =
		'This section enables you to improve your visual experience and configure your camera properties.' +
		' Explore more features and customize your display experience here.';
	headerMenuTitle = 'Jump to Settings';

	headerMenuItems = [
		{
			title: 'Display',
			path: '/display'
		},
		{
			title: 'Camera',
			path: '/camera'
		}
	];

	constructor() {}

	ngOnInit() {}

	public onAutoExposureChange($event) {
		this.isAutoExposureEnabled = $event.switchValue;
	}
}
