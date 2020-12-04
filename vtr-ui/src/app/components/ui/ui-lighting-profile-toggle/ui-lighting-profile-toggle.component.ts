import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-lighting-profile-toggle',
	templateUrl: './ui-lighting-profile-toggle.component.html',
	styleUrls: ['./ui-lighting-profile-toggle.component.scss'],
})
export class UiLightingProfileToggleComponent implements OnInit {
	@Input() currentProfile: any;
	@Output() public setLightingProfileId = new EventEmitter<any>();
	@Input() id: string = '';
	@Input() automationId: string = '';
	@Input() labelId: string = '';
	@Input() isWidgetContainer: boolean = false;
	@Input() isToggle: boolean = false;
	constructor() {}

	ngOnInit() {}
	SetProfile(event) {
		const val = event.target.value;
		this.currentProfile = Number(val);
		this.setLightingProfileId.emit(event);
	}
}
