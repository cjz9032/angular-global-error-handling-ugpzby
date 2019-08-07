import { Gaming } from './../../../enums/gaming.enum';
import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { GamingAllCapabilitiesService } from './../../../services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

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
	public isdriverpopup = false;
	public isPopupVisible: any;
	constructor(
		private gamingLightingService: GamingLightingService,
		private commonService: CommonService,
		private gamingCapabilityService: GamingAllCapabilitiesService,
		private router: Router
	) { }

	ngOnInit() {
		this.setprofId = 0;
		this.getCapabilities();
		this.commonService.getCapabalitiesNotification().subscribe((response) => {
			if (response.type === Gaming.GamingCapabilities) {
				this.getCapabilities();
			}
		});
	}

	public getCapabilities() {
		console.log('capabilities global values -------------lighting widget dashboard');

		this.ledSetFeature = this.commonService.getLocalStorageValue(LocalStorageKey.ledSetFeature);
		this.ledDriver = this.commonService.getLocalStorageValue(LocalStorageKey.ledDriver);

		if (this.ledSetFeature) {
			if (LocalStorageKey.ProfileId !== undefined) {
				this.setprofId = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId) || 0;
			}
			this.getLightingProfileId();
		}

		if (this.ledSetFeature && this.ledDriver) {
			this.isLightingVisible = true;
			this.isPopupVisible = false;
		} else if (!this.ledSetFeature && this.ledDriver) {
			this.isLightingVisible = false;
		} else if (this.ledSetFeature && !this.ledDriver) {
			this.isLightingVisible = true;
			this.isPopupVisible = true;
		} else if (!this.ledSetFeature && !this.ledDriver) {
			this.isLightingVisible = false;
		}
	}

	public getLightingProfileId() {
		try {
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService.getLightingProfileId().then((response: any) => {
					this.didSuccess = response.didSuccess;
					this.profileId = response.profileId;
					console.log('getLightingProfileId------------response---------------->', JSON.stringify(response));
					if (!this.didSuccess) {
						if (LocalStorageKey.ProfileId !== undefined) {
							this.setprofId = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId) || 0;
						}
						console.log('status---false: ' + this.setprofId);
					} else {
						if (LocalStorageKey.ProfileId !== undefined) {
							this.commonService.setLocalStorageValue(LocalStorageKey.ProfileId, this.profileId);
						}
						this.setprofId = this.profileId;
						console.log(
							'getLightingProfileId---cache----------true: ',
							JSON.stringify(this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId))
						);
					}
				});
			}
		} catch (error) {
			console.error('getLightingProfileId: ' + error.message);
		}
	}

	public SetProfile(event) {
		try {
			const eventval: number = event.target.value;
			let prevSetprofId;
			if (this.gamingLightingService.isShellAvailable) {
				if (this.isPopupVisible) {
					this.isdriverpopup = true;
				} else {
					if (Number(eventval) === this.setprofId) {
						return;
					}
					prevSetprofId = this.setprofId;
					this.setprofId = eventval;
				}
				if (!this.isPopupVisible) {
					this.gamingLightingService.setLightingProfileId(0, eventval).then((response: any) => {

						this.didSuccess = response.didSuccess;
						if (this.didSuccess) {
							if (LocalStorageKey.ProfileId !== undefined) {
								this.commonService.setLocalStorageValue(LocalStorageKey.ProfileId, response.profileId);
							}
							if (!this.isPopupVisible) {
								this.setprofId = response.profileId;
							}
						} else {
							this.setprofId = prevSetprofId;
						}
					});
				}
			}
		} catch (error) {
			console.error('setLightingProfileId: ' + error.message);
		}
	}

	public checkStatus(id) {
		console.log('check status', id + ' ' + this.setprofId);
		if (id) {
			this.isdriverpopup = true;
		}
	}
}
