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

	@Output() toggle = new EventEmitter<{ sender: string; value: boolean }>();

	constructor(public dashboardService: DashboardService) {}

	ngOnInit() {
		this.getQuickSettingStatus();
	}

	private getQuickSettingStatus() {
		this.dashboardService
			.getCameraStatus()
			.then((featureStatus: FeatureStatus) => {
				this.cameraStatus = featureStatus;
			})
			.catch(error => {
				console.log('getCameraStatus', error);
			});

		this.dashboardService
			.getMicrophoneStatus()
			.then((featureStatus: FeatureStatus) => {
				this.microphoneStatus = featureStatus;
			})
			.catch(error => {
				console.log('getCameraStatus', error);
			});
	}

	public onCameraStatusToggle($event: boolean) {
		// this.dashboardService
	}

	public onMicrophoneStatusToggle($event: boolean) {
		console.log('WidgetQuicksettingsComponent', $event);
	}

	public onEyeCareModeToggle($event: boolean) {
		console.log('WidgetQuicksettingsComponent', $event);
	}
}
