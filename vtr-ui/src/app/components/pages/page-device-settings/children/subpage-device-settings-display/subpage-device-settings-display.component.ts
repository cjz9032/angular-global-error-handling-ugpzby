import { Component, OnInit } from '@angular/core';
import { CameraDetail } from 'src/app/data-models/camera/camera-detail.model';
import { BaseCameraDetail } from 'src/app/services/camera/camera-detail/base-camera-detail.service';
import { CameraDetailMockService } from 'src/app/services/camera/camera-detail/camera-detail.mock.service';

@Component({
	selector: 'vtr-subpage-device-settings-display',
	templateUrl: './subpage-device-settings-display.component.html',
	styleUrls: ['./subpage-device-settings-display.component.scss'],
	providers: [
		{ provide: BaseCameraDetail, useClass: CameraDetailMockService }
	]
})
export class SubpageDeviceSettingsDisplayComponent implements OnInit {
	title = 'Display & Camera Settings';
	public dataSource: CameraDetail;

	headerCaption =
		'This section enables you to improve your visual experience and configure your camera properties.' +
		' Explore more features and customize your display experience here.';
	headerMenuTitle = 'Jump to Settings';

	headerMenuItems = [
		{
			title: 'Display',
			path: '/display'
		},
		{
			title: 'Camera',
			path: '/camera'
		}
	];

	constructor(public baseCameraDetail: BaseCameraDetail) {
		this.dataSource = new CameraDetail();
	}

	ngOnInit() {
		this.getCameraDetails();
	}

	/**
	 * When Go to windows privacy settings link button is clicked
	 */
	public onPrivacySettingClick() {}

	/**
	 * When Camera Privacy Mode radio is toggled
	 */
	public onPrivacyModeChange($event: any) {
		this.dataSource.isPrivacyModeEnabled = $event.switchValue;
	}

	private getCameraDetails() {
		this.baseCameraDetail
			.getCameraDetail()
			.then((response: CameraDetail) => {
				this.dataSource = response;
			})
			.catch(error => {
				console.log(error);
			});
	}
}
