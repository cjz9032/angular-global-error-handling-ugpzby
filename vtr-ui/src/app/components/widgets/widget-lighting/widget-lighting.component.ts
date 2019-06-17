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
	constructor(
		private gamingLightingService: GamingLightingService,
		private gamingAllCapabilities: GamingAllCapabilitiesService
	) { }

	ngOnInit() {
		this.getGaminagLightingCapabilities();
		this.getLightingProfileId();
	}
	public getGaminagLightingCapabilities() {
		if (this.gamingLightingService.isShellAvailable) {
			this.gamingLightingService.getLightingCapabilities().then((response: any) => {
				console.log(
					'gaming Lighting Capabilities js bridge ------------------------>',
					JSON.stringify(response)
				);
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
						this.setprofId = 0;
						console.log('status---false: ' + this.setprofId);
					} else {
						this.setprofId = this.profileId;
						console.log('status---true: ' + this.setprofId);
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
						console.log('setLightingProfileId------------false---------------->');
						//this.setprofId = eventval;
					} else {
						console.log('setLightingProfileId------------True---------------->');
					}
				});
			}
		} catch (error) {
			console.error('setLightingProfileId: ' + error.message);
		}
	}
}
