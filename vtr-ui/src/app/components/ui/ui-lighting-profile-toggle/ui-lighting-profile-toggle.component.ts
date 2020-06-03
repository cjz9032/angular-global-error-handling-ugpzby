import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-lighting-profile-toggle',
	templateUrl: './ui-lighting-profile-toggle.component.html',
	styleUrls: ['./ui-lighting-profile-toggle.component.scss']
})
export class UiLightingProfileToggleComponent implements OnInit {
	@Input() currentProfile: any;
	@Output() public setLightingProfileId = new EventEmitter<any>();
	public isToggle: boolean = true;
	@Input() id: string = '';
	@Input() automationId: string ='';
	constructor() {}

	ngOnInit() {}
	SetProfile(event) {
		const val = event.target.value;
		this.currentProfile = Number(val);
		this.setLightingProfileId.emit(event);
	}
}
