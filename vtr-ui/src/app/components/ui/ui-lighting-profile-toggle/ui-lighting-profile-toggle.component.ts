import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-lighting-profile-toggle',
	templateUrl: './ui-lighting-profile-toggle.component.html',
	styleUrls: ['./ui-lighting-profile-toggle.component.scss'],
})
export class UiLightingProfileToggleComponent implements OnInit {
	@Input() currentProfile: any;
	@Output() public setLightingProfileId = new EventEmitter<any>();
	@Input() id = '';
	@Input() automationId = '';
	@Input() labelId = '';
	@Input() isWidgetContainer = false;
	@Input() isToggle = false;
	constructor() {}

	ngOnInit() {}
	setProfile(event) {
		this.setLightingProfileId.emit(event);
	}
}
