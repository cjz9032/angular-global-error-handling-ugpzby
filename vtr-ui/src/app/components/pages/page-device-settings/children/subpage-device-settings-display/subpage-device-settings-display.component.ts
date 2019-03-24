import { Component, OnInit, OnDestroy } from '@angular/core';
import { CameraDetail, ICameraSettingsResponse } from 'src/app/data-models/camera/camera-detail.model';
import { BaseCameraDetail } from 'src/app/services/camera/camera-detail/base-camera-detail.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { DisplayService } from 'src/app/services/display/display.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { CameraFeedService } from 'src/app/services/camera/camera-feed/camera-feed.service';
import { ChangeContext } from 'ng5-slider';
import { EyeCareMode } from 'src/app/data-models/camera/eyeCareMode.model';
enum defaultTemparature {
	defaultValue = 4500
}
@Component({
	selector: 'vtr-subpage-device-settings-display',
	templateUrl: './subpage-device-settings-display.component.html',
	styleUrls: ['./subpage-device-settings-display.component.scss']
})
export class SubpageDeviceSettingsDisplayComponent
	implements OnInit, OnDestroy {
	title = 'Display & Camera Settings';
	public dataSource: any;
	public eyeCareDataSource: EyeCareMode;
	public cameraDetails1: ICameraSettingsResponse;
	private cameraDetailSubscription: Subscription;
	public eyeCareModeStatus = new FeatureStatus(false, true);
	public cameraPrivacyModeStatus = new FeatureStatus(false, true);

	headerCaption =
		'This section enables you to improve your visual experience and configure your camera properties.' +
		' Explore more features and customize your display experience here.';
	headerMenuTitle = 'Jump to Settings';

	headerMenuItems = [
		{
			title: 'Display',
			path: 'display'

		},
		{
			title: 'Camera',
			path: 'camera'
		}
	];

	constructor(public baseCameraDetail: BaseCameraDetail,
		public displayService: DisplayService) {
		this.dataSource = new CameraDetail();
		this.eyeCareDataSource = new EyeCareMode();
	}

	ngOnInit() {
		console.log('subpage-device-setting-display onInit');

		this.getEyeCareModeStatus();
		this.getDisplayColorTemperature();
		this.getCameraPrivacyModeStatus();
		this.getCameraDetails();

		this.cameraDetailSubscription = this.baseCameraDetail.cameraDetailObservable.subscribe(
			cameraDetail => {
				this.dataSource = cameraDetail;
				console.log('cameraDetail subpage-dev-settings', this.dataSource);
			},
			error => {
				console.log(error);
			}
		);
		//	this.statusChangedLocationPermission() ;
	}

	ngOnDestroy() {
		if (this.cameraDetailSubscription) {
			this.cameraDetailSubscription.unsubscribe();
		}
	}

	/**
	 * When Go to windows privacy settings link button is clicked
	 */
	public onPrivacySettingClick() { }

	/**
	 * When Camera Privacy Mode radio is toggled
	 */
	public onPrivacyModeChange($event: any) {
		this.baseCameraDetail.toggleCameraPrivacyMode($event.switchValue);
	}

	private getCameraDetails() {

		// this.baseCameraDetail
		// 	.getCameraDetail()
		// 	.then((response: any) => {
		// 		// this.dataSource = response;
		// 		console.log('getCameraDetails.then', response);
		// 	})
		// 	.catch(error => {
		// 		console.log(error);
		// 	});
		console.log('Inside');
		this.displayService.getCameraSettingsInfo().then((response) => {
			console.log('getCameraDetails.then', response);
			this.dataSource = response;
		});
	}
	// Start EyeCare Mode
	private getDisplayColorTemperature() {
		console.log('Inside Eycaremode details');
		this.displayService.getDisplayColortemperature().then((response) => {
			console.log('getDisplayColortemperature.then', response);
			this.eyeCareDataSource = response;
			//	this.eyecareDatasource.current = response.current;
			console.log('getDisplayColortemperature.then', this.eyeCareDataSource);
		});
	}
	public onEyeCareModeStatusToggle(event: any) {
		console.log('onEyeCareModeStatusToggle', event.switchValue);
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.setEyeCareModeState(event.switchValue)
					.then((value: boolean) => {
						console.log('onEyeCareModeStatusToggle.then', value);
						//this.setEyeCareModeTemparature(defaultTemparature.defaultValue)

						///	this.eyecareDatasource.current = defaultTemparature.defaultValue;
						this.getEyeCareModeStatus();
					}).catch(error => {
						console.error('onEyeCareModeStatusToggle', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private setEyeCareModeStatus(value: boolean) {
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.setEyeCareModeState(value)
					.then((value: boolean) => {
						console.log('setEyeCareModeState.then', value);

					}).catch(error => {
						console.error('setEyeCareModeState', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private getEyeCareModeStatus() {
		if (this.displayService.isShellAvailable) {
			this.displayService
				.getEyeCareModeState()
				.then((featureStatus: FeatureStatus) => {
					console.log('getEyeCareModeState.then', featureStatus);
					this.eyeCareModeStatus = featureStatus;
					// alert(this.eyeCareModeStatus.status);
				})
				.catch(error => {
					console.error('getEyeCareModeState', error);
				});
		}
	}
	public onEyeCareTemparatureChange($event: ChangeContext) {
		try {
			console.log('temparature changed in display', $event);
			if (this.displayService.isShellAvailable) {
				this.displayService
					.setDisplayColortemperature($event.value);
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	public onEyeCareTemparatureValueChange($event: ChangeContext) {
		try {
			console.log('temparature changed in display', $event);
			if (this.displayService.isShellAvailable) {
				this.displayService
					.setDisplayColortemperature($event.value);
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	private setEyeCareModeTemparature(value: number) {
		try {
			console.log('temparature changed in display', value);
			if (this.displayService.isShellAvailable) {
				this.displayService
					.setDisplayColortemperature(value);
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	public onResetTemparature($event: any) {
		try {
			console.log('temparature reset in display', $event);
			if (this.displayService.isShellAvailable) {
				this.displayService
					.resetEyeCareMode();
				this.getDisplayColorTemperature();
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	// End EyeCare Mode
	// Start Camera Privacy
	public onCameraPrivacyModeToggle($event: any) {

		if (this.displayService.isShellAvailable) {
			this.displayService.setCameraPrivacyModeState($event.switchValue)
				.then((value: boolean) => {
					console.log('setCameraStatus.then', value);
					console.log('setCameraStatus.then', $event.switchValue);
					this.getCameraPrivacyModeStatus();
					this.onPrivacyModeChange($event.switchValue);
				}).catch(error => {
					console.error('setCameraStatus', error);
				});
		}
	}
	private getCameraPrivacyModeStatus() {
		if (this.displayService.isShellAvailable) {
			this.displayService
				.getCameraPrivacyModeState()
				.then((featureStatus: FeatureStatus) => {
					if (featureStatus.available) {
						console.log('cameraPrivacyModeStatus.then', featureStatus);
						this.cameraPrivacyModeStatus = featureStatus;
					}
				})
				.catch(error => {
					console.error('getCameraStatus', error);
				});
		}
	}
	public onBrightnessChange($event: ChangeContext) {
		console.log('setCameraBrightness in display', $event);
		if (this.displayService.isShellAvailable) {
			this.displayService
				.setCameraBrightness($event.value);
		}
	}
	public onContrastChange($event: ChangeContext) {
		console.log('setCameraContrst', $event);
		if (this.displayService.isShellAvailable) {
			this.displayService
				.setCameraContrst($event.value);
		}
	}
	public onCameraAutoExposureToggle($event: ChangeContext) {
		console.log('setCameraAutoExposure.then', $event);
		if (this.displayService.isShellAvailable) {
			this.displayService
				.setCameraAutoExposure($event.value);
		}
	}
	public onCameraExposureValueChange($event: ChangeContext) {
		console.log('setCameraExposureValue.then', $event);
		if (this.displayService.isShellAvailable) {
			this.displayService
				.setCameraExposureValue($event.value);
		}
	}
	public onCameraAutoFocusToggle($event: any) {
		console.log('setCameraAutoExposure.then', $event);
		if (this.displayService.isShellAvailable) {
			this.displayService
				.setCameraAutoExposure($event.value);
		}
	}

	public resetCameraSettings() {
		console.log('Reset Camera settings');
		if (this.displayService.isShellAvailable) {
			this.displayService
				.resetCameraSettings();
			this.getCameraDetails();
		}
	}
	// End Camera Privacy
	public getLocationPermissionStatus(value: boolean) {
		console.log('called from loaction service ui', value);
	}

	public statusChangedLocationPermission() {
		console.log('status changed location permission');
		if (this.displayService.isShellAvailable) {
			this.displayService
				.statusChangedLocationPermission(this.getLocationPermissionStatus.bind(this));

		}
	}
}
