import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CameraDetail, ICameraSettingsResponse, CameraFeatureAccess } from 'src/app/data-models/camera/camera-detail.model';
import { BaseCameraDetail } from 'src/app/services/camera/camera-detail/base-camera-detail.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { DisplayService } from 'src/app/services/display/display.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { CameraFeedService } from 'src/app/services/camera/camera-feed/camera-feed.service';
import { ChangeContext } from 'ng5-slider';
import { EyeCareMode, SunsetToSunriseStatus } from 'src/app/data-models/camera/eyeCareMode.model';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { DeviceService } from 'src/app/services/device/device.service';
import { promise } from 'protractor';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
enum defaultTemparature {
	defaultValue = 4500
}
@Component({
	selector: 'vtr-subpage-device-settings-display',
	templateUrl: './subpage-device-settings-display.component.html',
	styleUrls: ['./subpage-device-settings-display.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default
})
export class SubpageDeviceSettingsDisplayComponent
	implements OnInit, OnDestroy {
	title = 'device.deviceSettings.displayCamera.title';
	public dataSource: any;
	public eyeCareDataSource: EyeCareMode;
	public cameraDetails1: ICameraSettingsResponse;
	public cameraFeatureAccess: CameraFeatureAccess;
	private cameraDetailSubscription: Subscription;
	public eyeCareModeStatus = new FeatureStatus(false, true);
	public cameraPrivacyModeStatus = new FeatureStatus(false, true);
	public sunsetToSunriseModeStatus = new SunsetToSunriseStatus(true, false, false, '', '');
	public enableSunsetToSunrise = false;
	public enableSlider = false;
	public initEyecare = 0;
	public showHideAutoExposureSlider = false;
	headerCaption = 'device.deviceSettings.displayCamera.description';
	headerMenuTitle = 'device.deviceSettings.displayCamera.jumpTo.title';
	isDesktopMachine: boolean;
	headerMenuItems = [
		{
			title: 'device.deviceSettings.displayCamera.jumpTo.shortcuts.display.title',
			path: 'display'

		},
		{
			title: 'device.deviceSettings.displayCamera.jumpTo.shortcuts.camera.title',
			path: 'camera'
		}
	];

	constructor(public baseCameraDetail: BaseCameraDetail,
		private deviceService: DeviceService,
		// public cd: ChangeDetectorRef,
		public displayService: DisplayService,
		private commonService: CommonService) {
		this.dataSource = new CameraDetail();
		this.cameraFeatureAccess = new CameraFeatureAccess();
		this.eyeCareDataSource = new EyeCareMode();
	}

	ngOnInit() {
		console.log('subpage-device-setting-display onInit');
		this.startEyeCareMonitor();
		this.initEyecaremodeSettings();
		this.getCameraPrivacyModeStatus();
		this.getCameraDetails();
		this.isDesktopMachine = this.commonService.getLocalStorageValue(LocalStorageKey.DesktopMachine);
		if (this.isDesktopMachine) {
			// on desktop machine, camera section need to hide, so it's Jump to Setting link also need to remove
			this.headerMenuItems.pop();
		}
		this.cameraDetailSubscription = this.baseCameraDetail.cameraDetailObservable.subscribe(
			cameraDetail => {
				this.dataSource = cameraDetail;
				console.log('cameraDetail subpage-dev-settings', this.dataSource);
			},
			error => {
				console.log(error);
			}
		);

		this.statusChangedLocationPermission();

	}

	ngOnDestroy() {
		if (this.cameraDetailSubscription) {
			this.cameraDetailSubscription.unsubscribe();
		}
		this.stopEyeCareMonitor();
	}

	/**
	 * When Go to windows privacy settings link button is clicked
	 */
	public onPrivacySettingClick() {
		this.deviceService.launchUri('ms-settings:privacy-webcam');
	}

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
			console.log('response.exposure.supported.then', response.exposure.supported);
			console.log('response.exposure.autoValue.then', response.exposure.autoValue);

			this.dataSource = response;
			if (this.dataSource.exposure.supported === true && this.dataSource.exposure.autoValue === false) {

				this.cameraFeatureAccess.showAutoExposureSlider = true;
			}
		});
	}
	// Start EyeCare Mode
	private getDisplayColorTemperature() {
		this.displayService.getDisplayColortemperature().then((response) => {
			console.log('getDisplayColortemperature.then', response);
			this.eyeCareDataSource = response;
			// if (response.current === 4500 && response.eyecaremode === 4500) {
			// 	this.eyeCareDataSource.current = response.eyecaremode;
			// }
			// this.cd.detectChanges();
			// this.eyecareDatasource.current = response.current;
			console.log('getDisplayColortemperature.then', this.eyeCareDataSource);
		});
	}
	public onEyeCareModeStatusToggle(event: any) {
		console.log('onEyeCareModeStatusToggle', event.switchValue);
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.setEyeCareModeState(event.switchValue)
					.then((value: any) => {
						console.log('onEyeCareModeStatusToggle.then', value);
						this.enableSlider = event.switchValue;
						this.eyeCareDataSource.current = value.colorTemperature;
						const eyeCare = this.commonService.getSessionStorageValue(SessionStorageKey.DashboardEyeCareMode);
						eyeCare.status = event.switchValue;
						this.commonService.setSessionStorageValue(SessionStorageKey.DashboardEyeCareMode, eyeCare);
					}).catch(error => {
						console.error('onEyeCareModeStatusToggle', error);
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
						if (result === false) {
							this.initEyecare++;
							if (this.initEyecare <= 1) {
								this.initEyecaremodeSettings();
							}
						} else {
							//
							this.getSunsetToSunrise();
							this.getEyeCareModeStatus();
							this.getDisplayColorTemperature();
						}

					}).catch(error => {
						console.error('initEyecaremodeSettings', error);

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
					.then((result: boolean) => {
						console.log('setEyeCareModeState.then', result);

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
					this.enableSlider = featureStatus.status;
					if (this.eyeCareModeStatus.available === true) {
						console.log('eyeCareModeStatus.available', featureStatus.available);
					}
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
					.resetEyeCareMode().then((resetData: any) => {
						console.log('temparature reset data', resetData);
						this.eyeCareDataSource.current = resetData.colorTemperature;
						this.eyeCareModeStatus.status = (resetData.eyecaremodeState.toLowerCase() as string) === 'false' ? false : true;
						this.enableSlider = (resetData.eyecaremodeState.toLowerCase() as string) === 'false' ? false : true;
						this.sunsetToSunriseModeStatus.status = (resetData.autoEyecaremodeState.toLowerCase() as string) === 'false' ? false : true;
						console.log('sunsetToSunriseModeStatus.status from temparature reset data', this.sunsetToSunriseModeStatus.status);
						// this.getDisplayColorTemperature();
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	public onSunsetToSunrise($featureStatus: any) {
		try {
			console.log('sunset to sunrise event', $featureStatus.status);
			if (this.displayService.isShellAvailable) {
				this.displayService
					.setEyeCareAutoMode($featureStatus.status).
					then((response: any) => {
						console.log('setEyeCareAutoMode.then', response);
						if (response.result === true) {
							this.eyeCareDataSource.current = response.colorTemperature;
							this.eyeCareModeStatus.status = response.eyecaremodeState;
							this.enableSlider = response.eyecaremodeState;
						}

					}).catch(error => {
						console.error('setEyeCareAutoMode', error);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	public getSunsetToSunrise() {
		try {
			console.log(' get sunset to sunrise event');
			if (this.displayService.isShellAvailable) {
				this.displayService
					.getEyeCareAutoMode()
					.then((status: SunsetToSunriseStatus) => {
						console.log('getSunsetToSunrise.then', status);
						this.sunsetToSunriseModeStatus = status;
						if (status.permission === false) {
							this.displayService.openPrivacyLocation();
							this.enableSunsetToSunrise = true;
						}
					}).catch(error => {
						console.error('getSunsetToSunrise', error);
					});
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
					const privacy = this.commonService.getSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy);
					privacy.status = $event.switchValue;
					this.commonService.setSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy, privacy);
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
						//this.cameraPrivacyModeStatus.available=false;
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
	public onCameraAutoExposureToggle($event: any) {
		console.log('setCameraAutoExposure.then', $event);
		if (this.displayService.isShellAvailable) {
			this.displayService
				.setCameraAutoExposure($event.switchValue);
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
				.setCameraAutoFocus($event.switchValue);
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
	public getLocationPermissionStatus(value: any) {
		console.log('called from loaction service ui', JSON.stringify(value.status));
		if (value.status === false) {
			this.enableSunsetToSunrise = true;
		} else {
			this.enableSunsetToSunrise = false;
		}
	}

	public statusChangedLocationPermission() {
		console.log('status changed location permission');
		if (this.displayService.isShellAvailable) {
			this.displayService
				.statusChangedLocationPermission(this.getLocationPermissionStatus.bind(this))
				.then((value: any) => {
					console.log('startLocation', value);
				}).catch(error => {
					console.error('startLocation', error);
				});

		}
	}
	public getResetColorTemparatureCallBack(resetData: any) {
		console.log('called from eyecare monitor', JSON.stringify(resetData));
		this.eyeCareDataSource.current = resetData.colorTemperature;
		this.eyeCareModeStatus.status = (resetData.eyecaremodeState.toLowerCase() as string) === 'false' ? false : true;
		this.sunsetToSunriseModeStatus.status = (resetData.autoEyecaremodeState.toLowerCase() as string) === 'false' ? false : true;
	}
	public startEyeCareMonitor() {
		console.log('start eyecare monitor');
		if (this.displayService.isShellAvailable) {
			this.displayService
				.startEyeCareMonitor(this.getResetColorTemparatureCallBack.bind(this))
				.then((value: any) => {
					console.log('startmonitor', value);
				}).catch(error => {
					console.error('startmonitor', error);
				});

		}
	}
	public stopEyeCareMonitor() {
		console.log('stop eyecare monitor');
		if (this.displayService.isShellAvailable) {
			this.displayService
				.stopEyeCareMonitor();

		}
	}
}
