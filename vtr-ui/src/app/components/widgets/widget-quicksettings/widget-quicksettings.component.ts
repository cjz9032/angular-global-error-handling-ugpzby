import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';

import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { CommonService } from 'src/app/services/common/common.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { DeviceMonitorStatus } from 'src/app/enums/device-monitor-status.enum';

@Component({
	selector: 'vtr-widget-quicksettings',
	templateUrl: './widget-quicksettings.component.html',
	styleUrls: ['./widget-quicksettings.component.scss']
})
export class WidgetQuicksettingsComponent implements OnInit, OnDestroy {
	public cameraStatus = new FeatureStatus(false, true);
	public microphoneStatus = new FeatureStatus(false, true);
	public eyeCareModeStatus = new FeatureStatus(false, true);
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
		public dashboardService: DashboardService
		, private commonService: CommonService) { }

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
		this.getCameraStatus();
		this.getMicrophoneStatus();
		this.getEyeCareModeStatus();
	}

	private getCameraStatus() {
		if (this.dashboardService.isShellAvailable) {
			this.dashboardService
				.getCameraStatus()
				.then((featureStatus: FeatureStatus) => {
					console.log('getCameraStatus.then', featureStatus);
					this.cameraStatus = featureStatus;
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
				})
				.catch(error => {
					console.error('getEyeCareMode', error);
				});
		}
	}

	//#endregion

	public onCameraStatusToggle($event: boolean) {
		this.quickSettingsWidget[1].state = false
		try {
			if (this.dashboardService.isShellAvailable) {
				this.dashboardService.setCameraStatus($event)
					.then((value: boolean) => {
						console.log('getCameraStatus.then', value, $event);
						this.cameraStatus.status = $event;
						this.quickSettingsWidget[1].state = true
					}).catch(error => {
						this.quickSettingsWidget[1].state = true
						console.error('getCameraStatus', error);
					});
			}
		} 
		catch(error) {
			this.quickSettingsWidget[1].state = true
			console.log('onCameraStatusToggle', error);
		}
	}

	public onMicrophoneStatusToggle($event: boolean) {
		this.quickSettingsWidget[0].state = false
		try {
			if (this.dashboardService.isShellAvailable) {
				this.dashboardService.setMicrophoneStatus($event)
					.then((value: boolean) => {
						console.log('setMicrophoneStatus.then', value, $event);
						this.microphoneStatus.status = $event;
						this.quickSettingsWidget[0].state = true
					}).catch(error => {
						this.quickSettingsWidget[0].state = true
						console.error('setMicrophoneStatus', error);
					});
			}
		} 
		catch(error) {
			this.quickSettingsWidget[0].state = true
			console.log('onMicrophoneStatusToggle', error);
		}
	}

	public onEyeCareModeToggle($event: boolean) {
		this.quickSettingsWidget[2].state = false
		try {
			if (this.dashboardService.isShellAvailable) {
				this.dashboardService.setEyeCareMode($event)
					.then((value: boolean) => {
						console.log('setEyeCareMode.then', value, $event);
						this.eyeCareModeStatus.status = $event;
						this.quickSettingsWidget[2].state = true
					}).catch(error => {
						this.quickSettingsWidget[2].state = true
						console.error('setEyeCareMode', error);
					});
			}
		} 
		catch(error) {
			this.quickSettingsWidget[2].state = true
			console.log('onEyeCareModeToggle', error);
		}
	}
}
