import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, NgZone } from '@angular/core';
import { CameraDetail, ICameraSettingsResponse, CameraFeatureAccess } from 'src/app/data-models/camera/camera-detail.model';
import { BaseCameraDetail } from 'src/app/services/camera/camera-detail/base-camera-detail.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { DisplayService } from 'src/app/services/display/display.service';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { ChangeContext } from 'ng5-slider';
import { EyeCareMode, SunsetToSunriseStatus } from 'src/app/data-models/camera/eyeCareMode.model';
import { CommonService } from 'src/app/services/common/common.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { DeviceMonitorStatus } from 'src/app/enums/device-monitor-status.enum';
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
	private notificationSubscription: Subscription;
	public manualRefresh: EventEmitter<void> = new EventEmitter<void>();
	public shouldCameraSectionDisabled = true;
	public showCameraBackgroundBlurFeature = true;
	headerCaption = 'device.deviceSettings.displayCamera.description';
	headerMenuTitle = 'device.deviceSettings.displayCamera.jumpTo.title';
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
	emptyCameraDetails = [
		{
			'brightness':
			{
				'autoModeSupported': false,
				'autoValue': false,
				'supported': true,
				'min': 0,
				'max': 255,
				'step': 1,
				'default': 128,
				'value': 136
			},
			'contrast':
			{
				'autoModeSupported': false,
				'autoValue': false,
				'supported': true,
				'min': 0,
				'max': 255,
				'step': 1,
				'default': 32,
				'value': 179
			},
			'exposure':
			{
				'autoModeSupported': true,
				'autoValue': true,
				'supported': true,
				'min': -11,
				'max': -3,
				'step': 1,
				'default': -6,
				'value': -5
			},
			'focus':
			{
				'autoModeSupported': false,
				'autoValue': false,
				'supported': false,
				'min': 0,
				'max': 0,
				'step': 0,
				'default': 0,
				'value': 0
			},
			'permission': false
		}
	];
	constructor(public baseCameraDetail: BaseCameraDetail,
		private deviceService: DeviceService,
		// public cd: ChangeDetectorRef,
		public displayService: DisplayService,
		private commonService: CommonService,
		private cd: ChangeDetectorRef,
		private ngZone: NgZone) {
		this.dataSource = new CameraDetail();
		this.cameraFeatureAccess = new CameraFeatureAccess();
		this.eyeCareDataSource = new EyeCareMode();
	}

	ngOnInit() {
		console.log('subpage-device-setting-display onInit');
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
		this.cameraDetailSubscription = this.baseCameraDetail.cameraDetailObservable.subscribe(
			cameraDetail => {
				this.dataSource = cameraDetail;
				console.log('cameraDetail subpage-dev-settings', this.dataSource);
			},
			error => {
				console.log(error);
			}
		);
		this.startEyeCareMonitor();
		this.initEyecaremodeSettings();

		this.getCameraPrivacyModeStatus();
		this.getCameraDetails();
		this.statusChangedLocationPermission();
		this.displayService.startMonitorForCameraPermission();
		this.startMonitorForCamera();
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
				case DeviceMonitorStatus.CameraStatus:
					console.log('DeviceMonitorStatus.CameraStatus', payload);
					this.dataSource.permission = payload;
					break;
				default:
					break;
			}
		}
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		if (this.cameraDetailSubscription) {
			this.cameraDetailSubscription.unsubscribe();
		}
		this.stopEyeCareMonitor();
		this.stopMonitorForCamera();
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
		try {
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
				if (this.dataSource.permission === true) {
					this.shouldCameraSectionDisabled = false;
					console.log('getCameraDetails.then permission', this.dataSource.permission);

				} else {
					// 	response.exposure.autoValue = true;
					this.dataSource = this.emptyCameraDetails[0];
					this.shouldCameraSectionDisabled = true;
					console.log('no camera permission .then', this.emptyCameraDetails[0]);
					const privacy = this.commonService.getSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy);
					privacy.status = false;
					this.commonService.setSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy, privacy);
				}
				this.cameraFeatureAccess.showAutoExposureSlider = false;
				if (this.dataSource.exposure.autoValue === true) {
					this.cameraFeatureAccess.exposureAutoValue = true;
				} else {
					this.cameraFeatureAccess.exposureAutoValue = false;
				}
				if (this.dataSource.exposure.supported === true && this.dataSource.exposure.autoValue === false) {
					this.cameraFeatureAccess.showAutoExposureSlider = true;
				}
				// if (this.dataSource.permission) {
				// 	this.shouldCameraSectionDisabled = false;
				// }
			});
		} catch (error) {
			console.error(error.message);
		}

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
							// 	this.displayService.openPrivacyLocation();
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
					console.log('cameraPrivacyModeStatus.then', featureStatus);
					this.cameraPrivacyModeStatus = featureStatus;
					if (!this.cameraPrivacyModeStatus.available) {
						// on desktop machine, camera section need to hide, so it's Jump to Setting link also need to remove
						this.headerMenuItems.pop();
					}
				})
				.catch(error => {
					console.error('getCameraStatus', error);
				});
		}
	}

	startMonitorHandlerForCamera(value: FeatureStatus) {
		console.log('startMonitorHandlerForCamera', value);
		this.cameraPrivacyModeStatus = value;
		this.commonService.setSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy, this.cameraPrivacyModeStatus);
	}

	startMonitorForCamera() {
		console.log('startMonitorForCamera');
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.startMonitorForCamera(this.startMonitorHandlerForCamera.bind(this))
					.then((val) => {
						console.log('startMonitorForCamera.then', val);
						
					}).catch(error => {
						console.error('startMonitorForCamera', error);
					});
			}
		} catch (error) {
			console.log('startMonitorForCamera', error);
		}
	}

	stopMonitorForCamera() {
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.stopMonitorForCamera()
					.then((value: any) => {
						console.log('stopMonitorForCamera.then', value);
					}).catch(error => {
						console.error('stopMonitorForCamera', error);
					});
			}
		} catch (error) {
			console.log('stopMonitorForCamera', error);
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
		this.cameraFeatureAccess.showAutoExposureSlider = !$event.switchValue;
		this.cameraFeatureAccess.exposureAutoValue = $event.switchValue;
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
		// this.sunsetToSunriseModeStatus.permission = value.status;
		this.ngZone.run(() => {
			if (value.status === false) {
				this.enableSunsetToSunrise = true;
			} else {
				this.enableSunsetToSunrise = false;
			}
		});
		// this.cd.detectChanges();
	}

	public async statusChangedLocationPermission() {
		console.log('status changed location permission');
		if (this.displayService.isShellAvailable) {
			await this.displayService.statusChangedLocationPermission(this.getLocationPermissionStatus.bind(this));
		}
	}
	public getResetColorTemparatureCallBack(resetData: any) {
		console.log('called from eyecare monitor', JSON.stringify(resetData));
		this.eyeCareDataSource.current = resetData.colorTemperature;
		this.eyeCareModeStatus.status = (resetData.eyecaremodeState.toLowerCase() as string) === 'false' ? false : true;
		this.enableSlider = (resetData.eyecaremodeState.toLowerCase() as string) === 'false' ? false : true;
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

	public onCardCollapse(isCollapsed: boolean) {
		if (!isCollapsed) {
			this.manualRefresh.emit();
		}
	}

	public onCameraBackgroundBlur($event: any) {
		try {
			this.showCameraBackgroundBlurFeature = $event.switchValue;
		} catch (error) {
			console.error(error.message);
		}
	}
}
