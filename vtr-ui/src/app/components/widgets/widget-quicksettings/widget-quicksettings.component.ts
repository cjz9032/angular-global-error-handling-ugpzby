import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';

import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { DeviceMonitorStatus } from 'src/app/enums/device-monitor-status.enum';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { DisplayService } from 'src/app/services/display/display.service';
import { SunsetToSunriseStatus } from 'src/app/data-models/camera/eyeCareMode.model';

@Component({
	selector: 'vtr-widget-quicksettings',
	templateUrl: './widget-quicksettings.component.html',
	styleUrls: ['./widget-quicksettings.component.scss']
})
export class WidgetQuicksettingsComponent implements OnInit, OnDestroy {
	public cameraStatus = new FeatureStatus(true, true);
	public microphoneStatus = new FeatureStatus(false, true);
	public eyeCareModeStatus = new FeatureStatus(true, true);
	private notificationSubscription: Subscription;
	public quickSettingsWidget = [
		{
			tooltipText: 'MICROPHONE',
			state: true
		},
		{
			tooltipText: 'CAMERA PRIVACY',
			state: true
		},
		{
			tooltipText: 'EYE CARE MODE',
			state: true
		}
	];

	@Output() toggle = new EventEmitter<{ sender: string; value: boolean }>();

	constructor(
		public dashboardService: DashboardService,
		public displayService: DisplayService,
		private commonService: CommonService) { }

	ngOnInit() {
		this.getQuickSettingStatus();
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	//#region private functions
	// DeviceMonitorStatus
	private onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
				case DeviceMonitorStatus.MicrophoneStatus:
					console.log('DeviceMonitorStatus', payload);
					this.microphoneStatus.status = payload.muteDisabled;
					this.microphoneStatus.permission = payload.permission;
					break;
				default:
					break;
			}
		}
	}

	private getQuickSettingStatus() {
		const microphone = this.commonService.getSessionStorageValue(SessionStorageKey.DashboardMicrophone);
		if (microphone) {
			this.microphoneStatus = microphone;
		} else {
			this.getMicrophoneStatus();
		}

		const privacy = this.commonService.getSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy);
		if (privacy) {
			this.cameraStatus = privacy;
		} else {
			this.getCameraStatus();
		}

		this.getEyeCareModePermission();
		this.initEyecaremodeSettings();
		this.getCameraPermission();
	}
	
	public getCameraPermission() {
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.getCameraSettingsInfo()
					.then((result) => {
						console.log('getCameraPermission.then', result);
						if (result) {
							this.cameraStatus.permission = result.permission
							this.commonService.setSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy, this.cameraStatus);
						}
					}).catch(error => {
						console.error('getCameraPermission', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	public initEyecaremodeSettings() {
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.initEyecaremodeSettings()
					.then((result: boolean) => {
						console.log('initEyecaremodeSettings.then', result);
						if (result === true) {
							const eyeCare = this.commonService.getSessionStorageValue(SessionStorageKey.DashboardEyeCareMode);
							if (eyeCare) {
								this.eyeCareModeStatus = eyeCare;
							} else {
								this.getEyeCareModeStatus();
							}
						}
					}).catch(error => {
						console.error('initEyecaremodeSettings', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private getCameraStatus() {
		if (this.dashboardService.isShellAvailable) {
			this.dashboardService
				.getCameraStatus()
				.then((featureStatus: FeatureStatus) => {
					console.log('getCameraStatus.then', featureStatus);
					this.cameraStatus = featureStatus;
					this.commonService.setSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy, featureStatus);
				})
				.catch(error => {
					console.error('getCameraStatus', error);
				});
		}
	}

	private getMicrophoneStatus() {
		if (this.dashboardService.isShellAvailable) {
			this.dashboardService
				.getMicrophoneStatus()
				.then((featureStatus: FeatureStatus) => {
					console.log('getMicrophoneStatus.then', featureStatus);
					this.microphoneStatus = featureStatus;
					this.commonService.setSessionStorageValue(SessionStorageKey.DashboardMicrophone, featureStatus);
				})
				.catch(error => {
					console.error('getCameraStatus', error);
				});
		}
	}

	private getEyeCareModeStatus() {
		if (this.dashboardService.isShellAvailable) {
			this.dashboardService
				.getEyeCareMode()
				.then((featureStatus: FeatureStatus) => {
					console.log('getEyeCareMode.then', featureStatus);
					this.eyeCareModeStatus = featureStatus;
					this.commonService.setSessionStorageValue(SessionStorageKey.DashboardEyeCareMode, featureStatus);
				})
				.catch(error => {
					console.error('getEyeCareMode', error);
				});
		}
	}

	public getEyeCareModePermission() {
		try {
			console.log(' get sunset to sunrise event');
			if (this.displayService.isShellAvailable) {
				this.displayService
					.getEyeCareAutoMode()
					.then((status: SunsetToSunriseStatus) => {
						console.log('getEyeCareModePermission.then', status);
						this.eyeCareModeStatus.permission = status.permission;
						this.eyeCareModeStatus.available = status.available;
						this.commonService.setSessionStorageValue(SessionStorageKey.DashboardEyeCareMode, this.eyeCareModeStatus);
					}).catch(error => {
						console.error('getEyeCareModePermission', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	//#endregion

	public onCameraStatusToggle($event: boolean) {
		this.quickSettingsWidget[1].state = false;
		try {
			if (this.dashboardService.isShellAvailable) {
				this.dashboardService.setCameraStatus($event)
					.then((value: boolean) => {
						console.log('getCameraStatus.then', value, $event);
						this.cameraStatus.status = $event;
						this.quickSettingsWidget[1].state = true;
						this.commonService.setSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy, this.cameraStatus);
					}).catch(error => {
						this.quickSettingsWidget[1].state = true;
						console.error('getCameraStatus', error);
					});
			}
		} catch (error) {
			this.quickSettingsWidget[1].state = true;
			console.log('onCameraStatusToggle', error);
		}
	}

	public onMicrophoneStatusToggle($event: boolean) {
		this.quickSettingsWidget[0].state = false;
		try {
			if (this.dashboardService.isShellAvailable) {
				this.dashboardService.setMicrophoneStatus($event)
					.then((value: boolean) => {
						console.log('setMicrophoneStatus.then', value, $event);
						this.microphoneStatus.status = $event;
						this.quickSettingsWidget[0].state = true;
						this.commonService.setSessionStorageValue(SessionStorageKey.DashboardMicrophone, this.microphoneStatus);
					}).catch(error => {
						this.quickSettingsWidget[0].state = true;
						console.error('setMicrophoneStatus', error);
					});
			}
		} catch (error) {
			this.quickSettingsWidget[0].state = true;
			console.log('onMicrophoneStatusToggle', error);
		}
	}

	public onEyeCareModeToggle($event: boolean) {
		this.quickSettingsWidget[2].state = false;
		try {
			if (this.dashboardService.isShellAvailable) {
				this.dashboardService.setEyeCareMode($event)
					.then((value: boolean) => {
						console.log('setEyeCareMode.then', value, $event);
						this.eyeCareModeStatus.status = $event;
						this.quickSettingsWidget[2].state = true;
						this.commonService.setSessionStorageValue(SessionStorageKey.DashboardEyeCareMode, this.eyeCareModeStatus);
					}).catch(error => {
						this.quickSettingsWidget[2].state = true;
						console.error('setEyeCareMode', error);
					});
			}
		} catch (error) {
			this.quickSettingsWidget[2].state = true;
			console.log('onEyeCareModeToggle', error);
		}
	}
}
