import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, NgZone } from '@angular/core';
import { CameraDetail, ICameraSettingsResponse, CameraFeatureAccess, EyeCareModeResponse } from 'src/app/data-models/camera/camera-detail.model';
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
import { CameraFeedService } from 'src/app/services/camera/camera-feed/camera-feed.service';
import { CameraBlur } from 'src/app/data-models/camera/camera-blur-model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { WelcomeTutorial } from 'src/app/data-models/common/welcome-tutorial.model';
import { EyeCareModeCapability } from 'src/app/data-models/device/eye-care-mode-capability.model';


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
	public displayColorTempDataSource: any;
	public displayColorTempCache: EyeCareModeResponse;
	public eyeCareModeCache: EyeCareModeCapability;
	public cameraDetails1: ICameraSettingsResponse;
	public cameraFeatureAccess: CameraFeatureAccess;
	private cameraDetailSubscription: Subscription;
	public eyeCareModeStatus = new FeatureStatus(false, true);
	public cameraPrivacyModeStatus = new FeatureStatus(true, true);
	public sunsetToSunriseModeStatus = new SunsetToSunriseStatus(true, false, false, '', '');
	public enableSunsetToSunrise = false;
	public enableSlider = false;
	public isEyeCareMode = false;
	public initEyecare = 0;
	public showHideAutoExposureSlider = false;
	public hideNote = false;
	private notificationSubscription: Subscription;
	public manualRefresh: EventEmitter<void> = new EventEmitter<void>();
	public shouldCameraSectionDisabled = true;
	public isCameraHidden = false;
	public privacyGuardCapability = false;
	public privacyGuardToggleStatus = false;
	public privacyGuardCheckBox = false;
	public privacyGuardOnPasswordCapability = false;
	public privacyGuardInterval: any;
	public hasOLEDPowerControlCapability = false;
	private Windows: any;
	private DeviceInformation: any;
	private DeviceClass: any;
	headerCaption = 'device.deviceSettings.displayCamera.description';
	headerMenuTitle = 'device.deviceSettings.displayCamera.jumpTo.title';
	headerMenuItems = [
		{
			title: 'device.deviceSettings.displayCamera.jumpTo.shortcuts.display.title',
			path: 'display',
			metricsItem: 'Display'

		},
		{
			title: 'device.deviceSettings.displayCamera.jumpTo.shortcuts.camera.title',
			path: 'camera',
			metricsItem: 'Camera'
		}
	];
	emptyCameraDetails = [
		{
			brightness:
			{
				autoModeSupported: false,
				autoValue: false,
				supported: true,
				min: 0,
				max: 255,
				step: 1,
				default: 128,
				value: 136
			},
			contrast:
			{
				autoModeSupported: false,
				autoValue: false,
				supported: true,
				min: 0,
				max: 255,
				step: 1,
				default: 32,
				value: 179
			},
			exposure:
			{
				autoModeSupported: true,
				autoValue: true,
				supported: true,
				min: -11,
				max: -3,
				step: 1,
				default: -6,
				value: -5
			},
			focus:
			{
				autoModeSupported: false,
				autoValue: false,
				supported: false,
				min: 0,
				max: 0,
				step: 0,
				default: 0,
				value: 0
			},
			permission: false
		}
	];
	public cameraBlur = new CameraBlur();
	isDTmachine = false;
	isAllInOneMachineFlag = false;

	constructor(
		public baseCameraDetail: BaseCameraDetail,
		private deviceService: DeviceService,
		public displayService: DisplayService,
		private commonService: CommonService,
		private ngZone: NgZone,
		private vantageShellService: VantageShellService,
		private cameraFeedService: CameraFeedService) {
		this.dataSource = new CameraDetail();
		this.cameraFeatureAccess = new CameraFeatureAccess();
		this.eyeCareDataSource = new EyeCareMode();
		this.Windows = vantageShellService.getWindows();
		this.DeviceInformation = this.Windows.Devices.Enumeration.DeviceInformation;
		this.DeviceClass = this.Windows.Devices.Enumeration.DeviceClass;
	}

	ngOnInit() {
		console.log('subpage-device-setting-display onInit');
		this.initDataFromCache();
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

		const welcomeTutorial: WelcomeTutorial = this.commonService.getLocalStorageValue(LocalStorageKey.WelcomeTutorial, undefined);
		// if welcome tutorial is available and page is 2 then onboarding is completed by user. Load device settings features
		if (welcomeTutorial && welcomeTutorial.page === 2) {
			this.initFeatures();
		}
	}

	initDataFromCache() {
		try {
			this.initDisplayColorTempFromCache();
			this.initEyeCareModeFromCache();
		} catch (error) {
			console.error('initDataFromCache', error);
		}
	}

	initEyeCareModeFromCache() {
		try {
			this.eyeCareModeCache = this.commonService.getLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, undefined);
			if (this.eyeCareModeCache) {
				this.eyeCareModeStatus.available = this.eyeCareModeCache.available;
				if (!this.eyeCareModeStatus.available) {
					return;
				}
				this.eyeCareModeStatus.status = this.eyeCareModeCache.toggleStatus;
				this.eyeCareDataSource = this.eyeCareModeCache.eyeCareDataSource;
				this.enableSlider = this.eyeCareModeCache.enableSlider;
				this.enableSunsetToSunrise = this.eyeCareModeCache.enableSunsetToSunrise;
				this.sunsetToSunriseModeStatus = this.eyeCareModeCache.sunsetToSunriseStatus;
			} else {
				this.eyeCareModeCache = new EyeCareModeCapability();
			}
		} catch (error) {
			console.error('initEyeCareModeFromCache', error);
		}
	}

	initDisplayColorTempFromCache() {
		try {
			this.displayColorTempCache = this.commonService.getLocalStorageValue(LocalStorageKey.DisplayColorTempCapability, undefined);
			if (this.displayColorTempCache) {
				this.displayColorTempDataSource = {};
				this.displayColorTempDataSource.available = this.displayColorTempCache.available;
				if (!this.displayColorTempDataSource.available) {
					return;
				}
				this.displayColorTempDataSource.current = this.displayColorTempCache.current;
				this.displayColorTempDataSource.maximum = this.displayColorTempCache.maximum;
				this.displayColorTempDataSource.minimum = this.displayColorTempCache.minimum;
				this.displayColorTempDataSource.eyemodestate = this.displayColorTempCache.eyeCareMode;
			} else {
				this.displayColorTempCache = new EyeCareModeResponse();
			}
		} catch (error) {
			console.error('initDisplayColorTempFromCache', error);
		}
	}

	private initFeatures() {
		this.startEyeCareMonitor();
		this.initEyecaremodeSettings();
		this.getPrivacyGuardCapabilityStatus();
		this.getPrivacyGuardOnPasswordCapabilityStatus();
		this.statusChangedLocationPermission();
		this.initCameraSection();
		this.getOLEDPowerControlCapability();
	}

	async initCameraSection() {
		this.isDTmachine = this.commonService.getLocalStorageValue(LocalStorageKey.DesktopMachine);
		this.isAllInOneMachineFlag = await this.isAllInOneMachine();
		if (this.isDTmachine && !this.isAllInOneMachineFlag) {
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'camera');
		} else {
			this.getCameraPrivacyModeStatus();
			this.getCameraDetails();
			this.displayService.startMonitorForCameraPermission();
			this.startCameraPrivacyMonitor();
		}
	}

	async isAllInOneMachine() {
		let frontCameraCount = 0;
		try {
			const panel = this.Windows.Devices.Enumeration.Panel.front;
			const devices = await this.DeviceInformation.findAllAsync(this.DeviceClass.videoCapture);
			devices.forEach((cameraDeviceInfo) => {
				if (cameraDeviceInfo.enclosureLocation !== null && cameraDeviceInfo.enclosureLocation.panel === panel) {
					frontCameraCount = frontCameraCount + 1;
				}
			});
			console.log('frontCameraCount: ', frontCameraCount);
			return frontCameraCount > 0 ? true : false;
		} catch (error) {
			console.log('isAllInOneMachine:', error);
			return frontCameraCount > 0 ? true : false;
		}
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
				case DeviceMonitorStatus.CameraStatus:
					console.log('DeviceMonitorStatus.CameraStatus', payload);
					this.dataSource.permission = payload;
					this.hideNote = !this.dataSource.permission;
					if (payload) {
						this.shouldCameraSectionDisabled = false;
						// this.cameraFeatureAccess.showAutoExposureSlider = false;
						if (this.dataSource.exposure.autoValue === true) {
							this.cameraFeatureAccess.exposureAutoValue = true;
						} else {
							this.cameraFeatureAccess.exposureAutoValue = false;
						}
						if (this.dataSource.exposure.supported === true && this.dataSource.exposure.autoValue === false) {
							this.cameraFeatureAccess.showAutoExposureSlider = true;
						}

					} else {
						this.shouldCameraSectionDisabled = true;
						this.cameraFeatureAccess.exposureAutoValue = false;
						if (this.dataSource.exposure.supported === true && this.cameraFeatureAccess.exposureAutoValue === false) {
							this.cameraFeatureAccess.showAutoExposureSlider = true;
						}
					}
					break;
				case LocalStorageKey.WelcomeTutorial:
					if (payload.page === 2) {
						this.initFeatures();
					}
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
		clearTimeout(this.privacyGuardInterval);
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
	// TROUBLE
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
			// console.log('Inside');
			this.displayService
				.getCameraSettingsInfo()
				.then((response) => {
					console.log('getCameraDetails.then', response);
					this.dataSource = response;
					if (this.dataSource.permission === true) {
						this.shouldCameraSectionDisabled = false;
						console.log('getCameraDetails.then permission', this.dataSource.permission);

					} else {
						// 	response.exposure.autoValue = true;
						this.dataSource = this.emptyCameraDetails[0];
						this.shouldCameraSectionDisabled = true;
						this.hideNote = true;
						this.cameraFeatureAccess.showAutoExposureSlider = true;
						console.log('no camera permission .then', this.emptyCameraDetails[0]);
						const privacy = this.commonService.getSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy);
						// privacy.status = false;
						this.commonService.setSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy, privacy);
						this.dataSource.exposure.autoValue = false;
					}
					this.cameraFeatureAccess.showAutoExposureSlider = false;
					if (this.dataSource.exposure.autoValue === true && !this.shouldCameraSectionDisabled) {
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
			console.log('getDisplayColortemperature.then', this.eyeCareDataSource);
			this.commonService.setLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
		});
	}
	public onEyeCareModeStatusToggle(event: any) {
		this.eyeCareModeStatus.status = event.switchValue;
		this.enableSlider = false;
		console.log('onEyeCareModeStatusToggle', this.eyeCareModeStatus.status);
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.setEyeCareModeState(this.eyeCareModeStatus.status)
					.then((value: any) => {
						console.log('onEyeCareModeStatusToggle.then', value);
						this.enableSlider = this.eyeCareModeStatus.status;
						this.eyeCareDataSource.current = value.colorTemperature;
						const eyeCare = this.commonService.getSessionStorageValue(SessionStorageKey.DashboardEyeCareMode);
						eyeCare.status = this.eyeCareModeStatus.status;
						console.log('eycare mode request sent to the dashboard------------->', eyeCare);
						this.commonService.setSessionStorageValue(SessionStorageKey.DashboardEyeCareMode, eyeCare);

						this.eyeCareModeCache.toggleStatus = this.eyeCareModeStatus.status;
						this.eyeCareModeCache.enableSlider = this.enableSlider;
						this.eyeCareModeCache.eyeCareDataSource = this.eyeCareDataSource;
						this.commonService.setLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
					}).catch(error => {
						console.error('onEyeCareModeStatusToggle', error);
					});

				if (!this.eyeCareModeStatus.status) {
					this.onSetChangeDisplayColorTemp({ value: this.displayColorTempDataSource.current });
				}

				// if(this.isEyeCareMode){
				// 	this.setToEyeCareMode();
				// }else {
				// 	this.displayColorTempDataSource.current = this.displayColorTempDataSource.maximum;
				// 	//this.onSetChangeDisplayColorTemp({value: this.displayColorTempDataSource.current})

				// }
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	// TROUBLE
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
							this.getDaytimeColorTemperature();
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
					// this.isEyeCareMode = this.eyeCareModeStatus.status;
					if (this.eyeCareModeStatus.available === true) {
						console.log('eyeCareModeStatus.available', featureStatus.available);
					}
					this.eyeCareModeCache.available = this.eyeCareModeStatus.available;
					this.eyeCareModeCache.toggleStatus = this.eyeCareModeStatus.status;
					this.eyeCareModeCache.enableSlider = this.enableSlider;
					this.commonService.setLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
				})
				.catch(error => {
					console.error('getEyeCareModeState', error);
				});
		}
	}
	public onEyeCareTemparatureChange($event: any) {
		try {
			console.log('temparature changed in display', $event);
			if (this.displayService.isShellAvailable) {
				this.displayService.setDisplayColortemperature($event.value);

				this.eyeCareModeCache.eyeCareDataSource.current = $event.value;
				this.commonService.setLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
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

						this.eyeCareModeCache.toggleStatus = this.eyeCareModeStatus.status;
						this.eyeCareModeCache.enableSlider = this.enableSlider;
						this.eyeCareModeCache.eyeCareDataSource = this.eyeCareDataSource;
						this.eyeCareModeCache.sunsetToSunriseStatus = this.sunsetToSunriseModeStatus;
						this.commonService.setLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	public onSunsetToSunrise($featureStatus: any) {
		try {
			console.log('sunset to sunrise event', $featureStatus);
			if (this.displayService.isShellAvailable) {
				this.displayService
					.setEyeCareAutoMode($featureStatus.status).
					then((response: any) => {
						console.log('setEyeCareAutoMode.then', response);
						if (response.result === true) {
							this.eyeCareDataSource.current = response.colorTemperature;
							this.eyeCareModeStatus.status = response.eyecaremodeState;
							// this.isEyeCareMode = this.eyeCareModeStatus.status;
							this.enableSlider = response.eyecaremodeState;
							this.commonService.setSessionStorageValue(SessionStorageKey.DashboardEyeCareMode, this.eyeCareModeStatus);

							this.eyeCareModeCache.toggleStatus = this.eyeCareModeStatus.status;
							this.eyeCareModeCache.enableSlider = this.enableSlider;
							this.eyeCareModeCache.eyeCareDataSource = this.eyeCareDataSource;
							this.commonService.setLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
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

							this.eyeCareModeCache.sunsetToSunriseStatus = this.sunsetToSunriseModeStatus;
							this.eyeCareModeCache.enableSunsetToSunrise = this.enableSunsetToSunrise;
							this.commonService.setLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
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

	// Display color temperature start here
	public getDaytimeColorTemperature() {
		this.displayService.getDaytimeColorTemperature().then((response) => {
			this.displayColorTempDataSource = response;
			console.log('getDaytimeColorTemperature.then', this.displayColorTempDataSource);
			this.displayColorTempCache.available = this.displayColorTempDataSource.available;
			this.displayColorTempCache.current = this.displayColorTempDataSource.current;
			this.displayColorTempCache.maximum = this.displayColorTempDataSource.maximum;
			this.displayColorTempCache.minimum = this.displayColorTempDataSource.minimum;
			this.displayColorTempCache.eyeCareMode = this.displayColorTempDataSource.eyemodestate;
			this.commonService.setLocalStorageValue(LocalStorageKey.DisplayColorTempCapability, this.displayColorTempCache);
		});
	}

	public onSetChangeDisplayColorTemp($event: any) {
		try {
			console.log('temparature changed in display ----->', $event);
			if (this.displayService.isShellAvailable) {
				this.displayService.setDaytimeColorTemperature($event.value);
				this.displayColorTempCache.current = $event.value;
				this.commonService.setLocalStorageValue(LocalStorageKey.DisplayColorTempCapability, this.displayColorTempCache);
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	public setToEyeCareMode() {
		if (this.eyeCareModeStatus.status) {
			// this.displayColorTempDataSource.current = this.eyeCareDataSource.current;
			// this.onSetChangeDisplayColorTemp({value: this.eyeCareDataSource.current})
			this.onEyeCareTemparatureChange({ value: this.eyeCareDataSource.current });

		}
	}

	public resetDaytimeColorTemp($event: any) {
		try {
			if (this.displayService.isShellAvailable) {
				console.log('temparature reset in display', $event);
				this.displayService
					.resetDaytimeColorTemperature().then((resetData: any) => {
						console.log('temparature reset data', resetData);
						this.displayColorTempDataSource.current = resetData || 6500;
						this.displayColorTempCache.current = this.displayColorTempDataSource.current;
						this.commonService.setLocalStorageValue(LocalStorageKey.DisplayColorTempCapability, this.displayColorTempCache);
					});
			}
		} catch (error) {
			console.error(error.message);
		}
	}
	// Display color temperature end here

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
	//  TROUBLE
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

	startCameraPrivacyMonitor() {
		console.log('startCameraPrivacyMonitor');
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.startCameraPrivacyMonitor(this.startMonitorHandlerForCamera.bind(this))
					.then((val) => {
						console.log('startCameraPrivacyMonitor.then', val);

					}).catch(error => {
						console.error('startCameraPrivacyMonitor', error);
					});
			}
		} catch (error) {
			console.log('startCameraPrivacyMonitor', error);
		}
	}

	stopMonitorForCamera() {
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.stopCameraPrivacyMonitor()
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
		console.log('setCameraContrast', $event);
		if (this.displayService.isShellAvailable) {
			this.displayService
				.setCameraContrast($event.value);
		}
	}
	public onCameraAutoExposureToggle($event: any) {
		console.log('setCameraAutoExposure.then', $event);
		this.dataSource.exposure.autoValue = $event.switchValue;
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
			this.eyeCareModeCache.enableSunsetToSunrise = this.enableSunsetToSunrise;
			this.commonService.setLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
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
		this.eyeCareModeStatus.status = resetData.eyecaremodeState;
		this.enableSlider = resetData.eyecaremodeState;
		this.sunsetToSunriseModeStatus.status = resetData.autoEyecaremodeState;

		this.eyeCareModeCache.sunsetToSunriseStatus = this.sunsetToSunriseModeStatus;
		this.eyeCareModeCache.toggleStatus = this.eyeCareModeStatus.status;
		this.eyeCareModeCache.eyeCareDataSource = this.eyeCareDataSource;
		this.eyeCareModeCache.enableSlider = this.enableSlider;
		this.commonService.setLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
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
			this.cameraBlur.enabled = $event.switchValue;
			this.onCameraBackgroundOptionChange(this.cameraBlur.enabled, '');
		} catch (error) {
			console.error(error.message);
		}
	}

	private initCameraBlurMethods() {
		if (this.cameraFeedService.isShellAvailable) {
			this.cameraFeedService.getCameraBlurSettings()
				.then((response: CameraBlur) => {
					this.cameraBlur = response;
					console.log('initCameraBlurMethods', response);
				}).catch(error => {
					console.log('initCameraBlurMethods', error);
				});
		}
	}

	public onCameraBackgroundOptionChange(isEnabling: boolean, mode: string) {
		console.log('onCameraBackgroundOptionChange: ' + isEnabling + ', ' + mode);
		if (mode !== '') {
			this.cameraBlur.currentMode = mode;
		}
		if (this.cameraFeedService.isShellAvailable) {
			this.cameraFeedService.setCameraBlurSettings(isEnabling, mode)
				.then((response) => {
					console.log('onCameraBackgroundOptionChange', response);
				}).catch(error => {
					console.log('onCameraBackgroundOptionChange', error);
				});
		}
	}

	public onCameraAvailable(isCameraAvailable: boolean) {
		console.log('Camera isAvailable', isCameraAvailable);
		this.isCameraHidden = !isCameraAvailable;
		if (isCameraAvailable) {
			this.initCameraBlurMethods();
		}
	}

	// Start Privacy Gaurd

	public getPrivacyGuardCapabilityStatus() {
		this.displayService.getPrivacyGuardCapability().then((status: boolean) => {
			// console.log('privacy guard compatability here -------------.>', status);
			if (status) {
				this.privacyGuardCapability = status;
				this.getPrivacyToggleStatus();

				this.privacyGuardInterval = setInterval(() => {
					console.log('Trying after 30 seconds for getting privacy guard status');
					this.getPrivacyToggleStatus();
				}, 30000);
			}
		})
			.catch(error => {
				console.error('privacy guard compatability error here', error);
			});

	}

	public getPrivacyToggleStatus() {
		this.displayService.getPrivacyGuardStatus().then((value: boolean) => {
			// console.log('privacy guard status here -------------.>', value);
			this.privacyGuardToggleStatus = value;
		})
			.catch(error => {
				console.error('privacy guard status error here', error);
			});
	}
	public getPrivacyGuardOnPasswordCapabilityStatus() {
		this.displayService.getPrivacyGuardOnPasswordCapability().then((status: boolean) => {
			// console.log('privacy guard on password compatability here -------------.>', status);
			if (status) {
				this.privacyGuardOnPasswordCapability = status;
				this.displayService.getPrivacyGuardOnPasswordStatus().then((value: boolean) => {
					this.privacyGuardCheckBox = value;
					// console.log('privacy guard on password status here -------------.>', value);
				})
					.catch(error => {
						console.error('privacy guard on password status error here', error);
					});
			}
		})
			.catch(error => {
				console.error('privacy guard on password compatability error here', error);
			});
	}

	public setPrivacyGuardToggleStatus(event) {
		this.displayService.setPrivacyGuardStatus(event.switchValue).then((response: boolean) => {
			// console.log('set privacy guard status here ------****-------.>', response);
		})
			.catch(error => {
				console.error('set privacy guard status error here', error);
			});
	}

	public setPrivacyGuardOnPasswordStatusVal(event) {
		this.displayService.setPrivacyGuardOnPasswordStatus(event.target.checked).then((response: boolean) => {
			// console.log('set privacy guard on password status here -------------.>', response);
		})
			.catch(error => {
				console.error('set privacy guard on password status error here', error);
			});
	}

	// End Privacy Gaurd
	// when disable the privacy from system setting
	cameraDisabled(event) {
		console.log('disabled all is', event);
		this.shouldCameraSectionDisabled = event;
		this.dataSource.permission = false;
		this.hideNote = true;
		this.cameraFeatureAccess.exposureAutoValue = false;
		if (this.dataSource.exposure.supported === true && this.cameraFeatureAccess.exposureAutoValue === false) {
			this.cameraFeatureAccess.showAutoExposureSlider = true;
		}
	}

	// Updates whether device has OLEDPowerControl
	public getOLEDPowerControlCapability() {
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.getOLEDPowerControlCapability()
					.then((result: boolean) => {
						console.log('getOLEDPowerControlCapability.then', result);
						this.hasOLEDPowerControlCapability = result;

					}).catch(error => {
						console.error('getOLEDPowerControlCapability', error);

					});
			}
		} catch (error) {
			console.error(error.message);

		}
	}
	onClick(path) {
		this.deviceService.launchUri(path);
	}
}
