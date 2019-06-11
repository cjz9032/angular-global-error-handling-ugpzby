import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'vtr-ui-lighting-profile',
	templateUrl: './ui-lighting-profile.component.html',
	styleUrls: ['./ui-lighting-profile.component.scss']
})
export class UiLightingProfileComponent implements OnInit {
	@Input() currentProfile: any;
	@Input() effectData: any;
	@Input() public options: any;
	@Input() lightingData: any;
	@Output() public changeDefaultProfile = new EventEmitter<any>();
	@Output() public setDefaultProfileFromLighting = new EventEmitter<any>();
	public isProfileOff: boolean;
	public isOff: number;
	constructor() { }

	ngOnInit() {
		this.isProfileOff = false;
		this.options = this.effectData;
		this.effectData.drop[0].curSelected = this.lightingData.lightInfo[0].lightEffectType;
		this.effectData.drop[1].curSelected = this.lightingData.lightInfo[1].lightEffectType;
	}
	public optionChanged($event, item) { };

	setDeafultLightingSettings($event) {
		this.options = this.effectData;
		this.options.drop[0].curSelected = this.lightingData.lightInfo[0].lightEffectType;
		this.options.drop[1].curSelected = this.lightingData.lightInfo[1].lightEffectType;
		this.currentProfile = 2; //to do
		this.changeDefaultProfile.emit($event);
	}
	setDefaultProfile(event) {
		this.isOff = Number(event.target.value);
		console.log("inprofile clickevent....................................", this.isOff);
		if (this.isOff === 1) {
			this.isProfileOff = true;
		}
		else {
			this.isProfileOff = false;
		}
		this.setDefaultProfileFromLighting.emit(event);
	}
}

