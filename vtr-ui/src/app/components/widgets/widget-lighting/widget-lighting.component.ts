import { Subscription } from 'rxjs/internal/Subscription';
import { DeviceService } from './../../../services/device/device.service';
import { Gaming } from './../../../enums/gaming.enum';
import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { GamingAllCapabilitiesService } from './../../../services/gaming/gaming-capabilities/gaming-all-capabilities.service';
import { GamingLightingService } from './../../../services/gaming/lighting/gaming-lighting.service';
import { Component, OnInit, Input, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

@Component({
	selector: 'vtr-widget-lighting',
	templateUrl: './widget-lighting.component.html',
	styleUrls: ['./widget-lighting.component.scss'],
})
export class WidgetLightingComponent implements OnInit, OnDestroy {
	@Input() title = '';
	public isWidgetContainer = true;
	public response: any;
	public didSuccess: any;
	public profileId: any;
	public setprofId: any;
	public ledSetFeature: any;
	public ledDriver: any;
	public isLightingVisible: any;
	public isdriverpopup = false;
	public isPopupVisible: any;
	public defaultLanguage: any;
	public ledlayoutversion: any;
	public ledSwitchButtonFeature: boolean;
	profileChangeEvent: any;
	private notificationSubscribe: Subscription;

	constructor(
		private ngZone: NgZone,
		private gamingLightingService: GamingLightingService,
		private commonService: CommonService,
		private localCacheService: LocalCacheService,
		private deviceService: DeviceService,
		public shellServices: VantageShellService,
		private logger: LoggerService
	) {
		this.profileChangeEvent = this.setProfileEvent.bind(this);
	}

	ngOnInit() {
		this.setprofId = 0;
		this.getCapabilities();
		this.notificationSubscribe = this.commonService
			.getCapabalitiesNotification()
			.subscribe((response) => {
				if (response.type === Gaming.GamingCapabilities) {
					this.getCapabilities();
				}
			});
		this.deviceService.getMachineInfo().then((value: any) => {
			this.defaultLanguage = value.locale;
		});
	}

	ngOnDestroy() {
		if (this.notificationSubscribe) {
			this.notificationSubscribe.unsubscribe();
		}
		this.shellServices.unRegisterEvent(
			EventTypes.gamingLightingProfileIdChangeEvent,
			this.profileChangeEvent
		);
	}

	public getCapabilities() {
		this.ledSetFeature = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.ledSetFeature
		);
		this.ledDriver = this.localCacheService.getLocalCacheValue(LocalStorageKey.ledDriver);
		this.ledlayoutversion = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.ledLayoutVersion
		);
		this.ledSwitchButtonFeature = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.LedSwitchButtonFeature
		);

		if (this.ledSetFeature) {
			if (LocalStorageKey.ProfileId !== undefined) {
				this.setprofId =
					this.localCacheService.getLocalCacheValue(LocalStorageKey.ProfileId) || 0;
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
							this.setprofId =
								this.localCacheService.getLocalCacheValue(
									LocalStorageKey.ProfileId
								) || 0;
						}
					} else {
						if (LocalStorageKey.ProfileId !== undefined) {
							this.localCacheService.setLocalCacheValue(
								LocalStorageKey.ProfileId,
								this.profileId
							);
						}
						this.setprofId = this.profileId;
					}
				});
			}
		} catch (error) {}
	}

	public setLightingProfileId(event) {
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
					this.gamingLightingService
						.setLightingProfileId(0, eventval)
						.then((response: any) => {
							this.didSuccess = response.didSuccess;
							if (this.didSuccess) {
								if (LocalStorageKey.ProfileId !== undefined) {
									this.localCacheService.setLocalCacheValue(
										LocalStorageKey.ProfileId,
										response.profileId
									);
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
		} catch (error) {}
	}

	public regLightingProfileIdChangeEvent() {
		this.gamingLightingService.regLightingProfileIdChangeEvent();
		this.shellServices.registerEvent(
			EventTypes.gamingLightingProfileIdChangeEvent,
			this.profileChangeEvent
		);
	}

	public setProfileEvent(profileId) {
		this.ngZone.run(() => {
			this.logger.info('profileId event ', profileId);
			if (this.setprofId === profileId) {
				return;
			}
			this.setprofId = profileId;
			if (this.setprofId !== undefined) {
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.ProfileId,
					this.setprofId
				);
			}
		});
	}

	public checkStatus(id) {
		if (id) {
			this.isdriverpopup = true;
		}
	}
}
