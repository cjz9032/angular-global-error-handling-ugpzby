import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { GamingAllCapabilitiesService } from './../../../services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-widget-lighting',
	templateUrl: './widget-lighting.component.html',
	styleUrls: ['./widget-lighting.component.scss']
})
export class WidgetLightingComponent implements OnInit {
	public response: any;
	@Input() title = '';

	public didSuccess: any;
	public profileId: any;
	public setprofId: any;
	public ledSetFeature: any;
	public ledDriver: any;
	public isLightingVisible: any;
	constructor(
		private gamingLightingService: GamingLightingService,
		private commonService: CommonService,
		private gamingCapabilityService: GamingAllCapabilitiesService,
	) { }

	ngOnInit() {
		this.getGaminagAllCapabilities();
		this.getLightingProfileId();
	}
	public getGaminagAllCapabilities() {
		if (this.gamingCapabilityService.isShellAvailable) {
			this.gamingCapabilityService.getCapabilities().then((response: any) => {
				console.log(
					'getCapabilities  response from homee ------------------------>',
					JSON.stringify(response)
				);
					this.ledSetFeature=response.ledSetFeature;
					this.ledDriver=response.ledDriver;
					//this.ledSetFeature = false;
					//this.ledDriver = false;

				if (this.ledSetFeature && this.ledDriver) {
					this.isLightingVisible = true;
				} else if (!this.ledSetFeature && this.ledDriver) {
					this.isLightingVisible = false;
				} else if (this.ledSetFeature && !this.ledDriver) {
					this.isLightingVisible = true;
				} else {
					this.isLightingVisible = false;
				}
			});
		}
	}
	public getLightingProfileId() {
		try {
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService.getLightingProfileId().then((response: any) => {
					this.didSuccess = response.didSuccess;
					this.profileId = response.profileId;
					console.log('getLightingProfileId------------response---------------->',
						JSON.stringify(response));
					if (!this.didSuccess) {
						this.setprofId = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId) || 0;
						console.log('status---false: ' + this.setprofId);
					} else {
						this.commonService.setLocalStorageValue(LocalStorageKey.ProfileId, this.profileId);
						this.setprofId = this.profileId;
						console.log('getLightingProfileId---cache----------true: ', JSON.stringify(this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId)));
					}
				});
			}
		} catch (error) {
			console.error('getLightingProfileId: ' + error.message);
		}

	}

	public SetProfile(event) {
		try {
			let eventval: number = event.target.value;
			console.log("--------------home page lighting event-----" + eventval);

			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService.setLightingProfileId(1, eventval).then((response: any) => {
					console.log('setLightingProfileId------------response---------------->',
						JSON.stringify(response));

					this.didSuccess = response.didSuccess;

					if (!this.didSuccess) {
						this.setprofId = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId) || 0;
						console.log('setLightingProfileId------------false---------------->');
						//this.setprofId = eventval;
					} else {
						this.commonService.setLocalStorageValue(LocalStorageKey.ProfileId,  response.profileId);
						this.setprofId = response.profileId;
						console.log('setLightingProfileId------------True---------------->',this.setprofId);
					}
				});
			}
		} catch (error) {
			console.error('setLightingProfileId: ' + error.message);
		}
	}
}
