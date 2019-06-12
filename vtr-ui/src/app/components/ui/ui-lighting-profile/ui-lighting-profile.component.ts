import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { CommonService } from './../../../services/common/common.service';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
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
	public eventval: number;
	public brgtId: number;
	public didSuccess: any;
	public brightness: any;
	public response: any;
	public defbrgtval: 1;
	public cacheval: number;
	public tempval: number;


	constructor(private gamingLightingService: GamingLightingService, private commonService: CommonService) { }

	ngOnInit() {
		this.isProfileOff = false;
		this.options = this.effectData;
		this.effectData.drop[0].curSelected = this.lightingData.lightInfo[0].lightEffectType;
		this.effectData.drop[1].curSelected = this.lightingData.lightInfo[1].lightEffectType;
		this.getLightingBrightness();
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



	setLightingBrightness(event) {
		event = event + 1;
		console.log("in eventval--------------------------------" + event);
		if (this.gamingLightingService.isShellAvailable) {
			this.gamingLightingService.setLightingProfileBrightness(event).then((response: any) => {
				//this.didSuccess = response.didSuccess;
				this.didSuccess = false;
				this.brightness = response.brightness;

				console.log('setLightingProfileBrightness---------------------------->',
					JSON.stringify(response));

				if (!this.didSuccess) {
					this.getLightingBrightness();

				} else {
					this.commonService.setLocalStorageValue(LocalStorageKey.ProfileBrightness, this.brightness);
					this.getLightingBrightness();
				}
			});
		}
	}

	public getLightingBrightness() {
		this.tempval = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileBrightness)||0;
		this.cacheval = (this.tempval) - 1;
		console.log('cache value  ----------------', this.cacheval);
	}
}

