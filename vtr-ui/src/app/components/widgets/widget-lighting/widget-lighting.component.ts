import { DeviceService } from './../../../services/device/device.service';
import { Gaming } from './../../../enums/gaming.enum';
import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { GamingAllCapabilitiesService } from './../../../services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { LoggerService } from 'src/app/services/logger/logger.service';

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
	public defaultLanguage: any;
	public ledSwitchButtonFeature: boolean;

	constructor(
		private ngZone: NgZone,
		private gamingLightingService: GamingLightingService,
		private commonService: CommonService,
		private deviceService: DeviceService,
		public shellServices: VantageShellService,
		private logger: LoggerService
	) { }

	ngOnInit() {
		this.setprofId = 0;
		this.getCapabilities();
		this.commonService.getCapabalitiesNotification().subscribe((response) => {
			if (response.type === Gaming.GamingCapabilities) {
				this.getCapabilities();
			}
		});
		this.deviceService.getMachineInfo().then((value: any) => {
			this.defaultLanguage = value.locale;
		});
	}

	public getCapabilities() {
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
		this.logger.info('ledSwitchButtonFeature: ', this.ledSwitchButtonFeature);
		if (this.ledSwitchButtonFeature) {
		 this.regLightingProfileIdChangeEvent();
		}
	}

	public getLightingProfileId() {
		try {
			if (this.gamingLightingService.isShellAvailable) {
				this.gamingLightingService.getLightingProfileId().then((response: any) => {
					this.didSuccess = response.didSuccess;
					this.profileId = response.profileId;
					if (!this.didSuccess) {
						if (LocalStorageKey.ProfileId !== undefined) {
							this.setprofId = this.commonService.getLocalStorageValue(LocalStorageKey.ProfileId) || 0;
						}
					} else {
						if (LocalStorageKey.ProfileId !== undefined) {
							this.commonService.setLocalStorageValue(LocalStorageKey.ProfileId, this.profileId);
						}
						this.setprofId = this.profileId;
					}
				});
			}
		} catch (error) {
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
		}
	}


	public regLightingProfileIdChangeEvent() {
		this.gamingLightingService.regLightingProfileIdChangeEvent();
		this.shellServices.registerEvent(
		  EventTypes.gamingLightingProfileIdChangeEvent,
		  this.setProfileEvent.bind(this)
		);
	}

	public setProfileEvent(profileId) {
		this.ngZone.run(() => {
			this.logger.info('profileId event ', profileId);
			if (this.setprofId === profileId) { return; }
			this.setprofId = profileId;
			if (this.setprofId !== undefined) {
				this.commonService.setLocalStorageValue(LocalStorageKey.ProfileId, this.setprofId);
			}
		});
	}

	public checkStatus(id) {
		if (id) {
			this.isdriverpopup = true;
		}
	}
}
