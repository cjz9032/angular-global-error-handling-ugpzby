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
			tooltipText: 'MICROPHONE'
		},
		{
			tooltipText: 'CAMERA PRIVACY'
		},
		{
			tooltipText: 'EYE CARE MODE'
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
		if (this.dashboardService.isShellAvailable) {
			this.dashboardService.setCameraStatus($event)
				.then((value: boolean) => {
					console.log('getCameraStatus.then', value);
				}).catch(error => {
					console.error('getCameraStatus', error);
				});
		}
	}

	public onMicrophoneStatusToggle($event: boolean) {
		if (this.dashboardService.isShellAvailable) {
			this.dashboardService.setMicrophoneStatus($event)
				.then((value: boolean) => {
					console.log('setMicrophoneStatus.then', value);
				}).catch(error => {
					console.error('setMicrophoneStatus', error);
				});
		}
	}

	public onEyeCareModeToggle($event: boolean) {
		if (this.dashboardService.isShellAvailable) {
			this.dashboardService.setEyeCareMode($event)
				.then((value: boolean) => {
					console.log('setEyeCareMode.then', value);
				}).catch(error => {
					console.error('setEyeCareMode', error);
				});
		}
	}
}
