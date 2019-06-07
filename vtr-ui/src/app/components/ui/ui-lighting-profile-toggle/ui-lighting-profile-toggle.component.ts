import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-lighting-profile-toggle',
	templateUrl: './ui-lighting-profile-toggle.component.html',
	styleUrls: ['./ui-lighting-profile-toggle.component.scss']
})
export class UiLightingProfileToggleComponent implements OnInit {
	@Input() currentProfile: any;
	@Output() public setDefaultProfile = new EventEmitter<any>();
	public p1Checked: boolean;
	public p2Checked: boolean;
	public p3Checked: boolean;


	constructor() {


	}

	ngOnInit() {
		this.currentProfile=2;
		if (this.currentProfile === 3) {
			this.p3Checked = true;
			this.p2Checked = false;
		}
	}
	SetProfile(event) {
		let val1:number = event.target.value;

		this.setDefaultProfile.emit(event);
	}
}
