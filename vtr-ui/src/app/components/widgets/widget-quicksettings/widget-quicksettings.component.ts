import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

@Component({
	selector: 'vtr-widget-quicksettings',
	templateUrl: './widget-quicksettings.component.html',
	styleUrls: ['./widget-quicksettings.component.scss']
})
export class WidgetQuicksettingsComponent implements OnInit {
	public cameraStatus = new FeatureStatus(false, false);
	public microphoneStatus = new FeatureStatus(false, false);
	public eyeCareModeStatus = new FeatureStatus(false, false);

	@Output() toggle = new EventEmitter<{ sender: string; value: boolean }>();

	constructor(public dashboardService: DashboardService) { }

	ngOnInit() {
		this.getQuickSettingStatus();
	}

	//#region private functions

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
					this.getCameraStatus();
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
					this.getMicrophoneStatus();
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
					this.getEyeCareModeStatus();
				}).catch(error => {
					console.error('setEyeCareMode', error);
				});
		}
	}


}
