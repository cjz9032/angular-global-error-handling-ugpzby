import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'vtr-subpage-device-settings-display',
	templateUrl: './subpage-device-settings-display.component.html',
	styleUrls: ['./subpage-device-settings-display.component.scss']
})
export class SubpageDeviceSettingsDisplayComponent implements OnInit {
	title = 'Display & Camera Settings';
	constructor() {}

	ngOnInit() {}

	//#region demo code section for code review

	// tslint:disable-next-line: member-ordering
	public sliderValue = 0; // demo code for code review

	public onSliderChange($event: number) {
		this.sliderValue = $event;
	}

	public onValueChange($event: number) {
		this.sliderValue = $event;
	}

	//#endregion
}
