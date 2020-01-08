import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, EventEmitter, NgZone } from '@angular/core';
import { CameraDetail, CameraSettingsResponse, CameraFeatureAccess, EyeCareModeResponse } from 'src/app/data-models/camera/camera-detail.model';
import { BaseCameraDetail } from 'src/app/services/camera/camera-detail/base-camera-detail.service';
import { Subscription, EMPTY } from 'rxjs';
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
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { EyeCareModeCapability } from 'src/app/data-models/device/eye-care-mode-capability.model';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { WinRT } from '@lenovo/tan-client-bridge';
import { WhiteListCapability } from '../../../../../data-models/eye-care-mode/white-list-capability.interface';


@Component({
	selector: 'vtr-subpage-device-settings-display',
	templateUrl: './subpage-device-settings-display.component.html',
	styleUrls: ['./subpage-device-settings-display.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default
})
export class SubpageDeviceSettingsDisplayComponent implements OnInit, OnDestroy {
	title = 'device.deviceSettings.displayCamera.title';
	public dataSource: any;
	public eyeCareDataSource: EyeCareMode;
	public displayColorTempDataSource: any;
	public displayColorTempCache: EyeCareModeResponse;
	public eyeCareModeCache: EyeCareModeCapability;
	public cameraDetails1: CameraSettingsResponse;
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
	public isOnline: any = true;
	private isSet = {
		isSetDaytimeColorTemperatureValue: false,
		isSetEyecaremodeValue: false,
		isSetEyecaremodeStatus: false,
		isSetScheduleStatus: false,
	};
	private setValues = {
		SetDaytimeColorTemperatureValue: undefined,
		SetEyecaremodeValue: undefined,
		SetEyecaremodeStatus: undefined,
		SetScheduleStatus: undefined,
	};

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
	cameraSessionId: Subscription;
	showECMReset = false;

	public readonly displayPriorityRadioGroup = 'displayPriorityRadioGroup';
	public readonly displayPriorityModal =
		{
			selectedValue: 'HDMI',
			options: [
				{
					name: 'CARTRIDGE',
					isAvailable: false,
					label: 'device.deviceSettings.displayCamera.display.displayPriority.options.cartridge',
					icon: 'dpc-optional' // icomoon icon name without "icomoon-"
				},
				{
					name: 'WIGIG',
					isAvailable: false,
					label: 'device.deviceSettings.displayCamera.display.displayPriority.options.wigig',
					icon: 'dpc-wigig'
				},
				{
					name: 'DOCK',
					isAvailable: false,
					label: 'device.deviceSettings.displayCamera.display.displayPriority.options.dock',
					icon: 'dpc-docking'
				},
				{
					name: 'USB_C_DP',
					isAvailable: false,
					label: 'device.deviceSettings.displayCamera.display.displayPriority.options.usb_c_dp',
					icon: 'dpc-type-c'
				},
				{
					name: 'HDMI',
					isAvailable: false,
					label: 'device.deviceSettings.displayCamera.display.displayPriority.options.hdmi',
					icon: 'dpc-hdmi'
				}
			]
		};

	constructor(
		public baseCameraDetail: BaseCameraDetail,
		private deviceService: DeviceService,
		public displayService: DisplayService,
		private commonService: CommonService,
		private ngZone: NgZone,
		private vantageShellService: VantageShellService,
		private cameraFeedService: CameraFeedService,
		private logger: LoggerService,
		private route: ActivatedRoute
	) {
		this.dataSource = new CameraDetail();
		this.cameraFeatureAccess = new CameraFeatureAccess();
		this.eyeCareDataSource = new EyeCareMode();
		this.Windows = vantageShellService.getWindows();
		if (this.Windows) {
			this.DeviceInformation = this.Windows.Devices.Enumeration.DeviceInformation;
			this.DeviceClass = this.Windows.Devices.Enumeration.DeviceClass;
		}
	}

	ngOnInit() {
		this.logger.debug('subpage-device-setting-display onInit');
		this.initDataFromCache();
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
		this.cameraDetailSubscription = this.baseCameraDetail.cameraDetailObservable.subscribe(
			cameraDetail => {
				this.dataSource = cameraDetail;
				this.logger.debug('cameraDetail subpage-dev-settings', this.dataSource);
			},
			error => {
				this.logger.error(error.message);
			}
		);

		this.cameraSessionId = this.route
			.queryParamMap
			.pipe(
				takeWhile(par => {
					return par.get('cameraSession_id') === 'camera';
				}),
			)
			.subscribe(() => {
				this.logger.debug(`get queryParamMap for navigation from smart assist`);
				setTimeout(() => {
					document.getElementById('camera').scrollIntoView();
				}, 500);
			});

		this.isOnline = this.commonService.isOnline;
		if (this.isOnline) {
			const welcomeTutorial: WelcomeTutorial = this.commonService.getLocalStorageValue(LocalStorageKey.WelcomeTutorial, undefined);
			// if welcome tutorial is available and page is 2 then onboarding is completed by user. Load device settings features
			if (welcomeTutorial && welcomeTutorial.isDone) {
				this.initFeatures();
			}
		} else {
			this.initFeatures();
		}
	}

	initDataFromCache() {
		try {
			this.initDisplayColorTempFromCache();
			this.initEyeCareModeFromCache();
			this.initCameraPrivacyFromCache();
		} catch (error) {
			this.logger.error('initDataFromCache', error.message);
		}
	}

	initCameraPrivacyFromCache() {
		const privacy = this.commonService.getLocalStorageValue(LocalStorageKey.DashboardCameraPrivacy);
		if (privacy && privacy.available !== undefined) {
			this.cameraPrivacyModeStatus.available = privacy.available;
		}
	}

	initEyeCareModeFromCache() {
		try {
			this.eyeCareModeCache = this.commonService.getLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, undefined);
			if (this.eyeCareModeCache) {
				this.eyeCareModeStatus.available = this.eyeCareModeCache.available;
				// if (!this.eyeCareModeStatus.available) {
				// 	return;
				// }
				this.eyeCareModeStatus.status = this.eyeCareModeCache.toggleStatus;
				this.eyeCareDataSource = this.eyeCareModeCache.eyeCareDataSource;
				this.enableSlider = this.eyeCareModeCache.enableSlider;
				this.enableSunsetToSunrise = this.eyeCareModeCache.enableSunsetToSunrise;
				this.sunsetToSunriseModeStatus = this.eyeCareModeCache.sunsetToSunriseStatus;
			} else {
				this.eyeCareModeCache = new EyeCareModeCapability();
			}
		} catch (error) {
			this.logger.error('initEyeCareModeFromCache', error.message);
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
			this.logger.error('initDisplayColorTempFromCache', error.message);
		}
	}

	initFeatures() {
		this.getPrivacyGuardCapabilityStatus();
		this.getPrivacyGuardOnPasswordCapabilityStatus();
		this.statusChangedLocationPermission();
		this.initCameraSection();
		this.getOLEDPowerControlCapability();
		setTimeout(() => {
			this.initEyecaremodeSettings();
			this.startEyeCareMonitor();
		}, 5);
	}

	async initCameraSection() {
		this.isDTmachine = this.commonService.getLocalStorageValue(LocalStorageKey.DesktopMachine);
		this.isAllInOneMachineFlag = await this.isAllInOneMachine();
		if (!this.isAllInOneMachineFlag) {
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
			this.logger.debug('frontCameraCount: ', frontCameraCount);
			return frontCameraCount > 0 ? true : false;
		} catch (error) {
			this.logger.debug('isAllInOneMachine:', error.message);
			return frontCameraCount > 0 ? true : false;
		}
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			const { type, payload } = notification;
			switch (type) {
				case DeviceMonitorStatus.CameraStatus:
					this.logger.debug('DeviceMonitorStatus.CameraStatus', payload);
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
		if (this.cameraSessionId) {
			this.cameraSessionId.unsubscribe();
		}
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
			// 		this.logger.debug('getCameraDetails.then', response);
			// 	})
			// 	.catch(error => {
			// 		this.logger.debug(error.message);
			// 	});
			// this.logger.debug('Inside');
			this.displayService
				.getCameraSettingsInfo()
				.then((response) => {
					this.logger.debug('getCameraDetails.then', response);
					this.dataSource = response;
					if (this.dataSource.permission === true) {
						this.shouldCameraSectionDisabled = false;
						this.logger.debug('getCameraDetails.then permission', this.dataSource.permission);

					} else {
						// 	response.exposure.autoValue = true;
						this.dataSource = this.emptyCameraDetails[0];
						this.shouldCameraSectionDisabled = true;
						this.hideNote = true;
						this.cameraFeatureAccess.showAutoExposureSlider = true;
						this.logger.debug('no camera permission .then', this.emptyCameraDetails[0]);
						const privacy = this.commonService.getLocalStorageValue(LocalStorageKey.DashboardCameraPrivacy);
						// privacy.status = false;
						// this.commonService.setSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy, privacy);
						this.commonService.setLocalStorageValue(LocalStorageKey.DashboardCameraPrivacy, privacy);
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
			this.logger.error('getCameraDetails :: error ', error.message);
			return EMPTY;
		}

	}
	// Start EyeCare Mode
	private getDisplayColorTemperature() {
		this.displayService.getDisplayColortemperature().then((response) => {
			this.logger.debug('getDisplayColortemperature.then', response);
			this.eyeCareDataSource = response;
			if (this.isSet.isSetEyecaremodeValue) {
				this.eyeCareDataSource.current = this.setValues.SetEyecaremodeValue;
				this.isSet.isSetEyecaremodeValue = false;
			}
			this.logger.debug('getDisplayColortemperature.then', this.eyeCareDataSource);
			this.commonService.setLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
		});
	}
	public onEyeCareModeStatusToggle(event: any) {
		this.eyeCareModeStatus.status = event.switchValue;
		this.enableSlider = false;
		this.logger.debug('onEyeCareModeStatusToggle', this.eyeCareModeStatus.status);
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.setEyeCareModeState(this.eyeCareModeStatus.status)
					.then((value: any) => {
						this.logger.debug('onEyeCareModeStatusToggle.then', value);
						this.isSet.isSetEyecaremodeStatus = true;
						this.setValues.SetEyecaremodeStatus = event.switchValue;
						this.enableSlider = this.eyeCareModeStatus.status;
						this.eyeCareDataSource.current = value.colorTemperature;
						this.eyeCareModeCache.toggleStatus = this.eyeCareModeStatus.status;
						this.eyeCareModeCache.enableSlider = this.enableSlider;
						this.eyeCareModeCache.eyeCareDataSource = this.eyeCareDataSource;
						this.commonService.setLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
					}).catch(error => {
						this.logger.error('onEyeCareModeStatusToggle', error.message);
						return EMPTY;
					});

				// if (!this.eyeCareModeStatus.status) {
				// 	this.onSetChangeDisplayColorTemp({ value: this.displayColorTempDataSource.current });
				// }

				// if(this.isEyeCareMode){
				// 	this.setToEyeCareMode();
				// }else {
				// 	this.displayColorTempDataSource.current = this.displayColorTempDataSource.maximum;
				// 	//this.onSetChangeDisplayColorTemp({value: this.displayColorTempDataSource.current})

				// }
			}
		} catch (error) {
			this.logger.error('onEyeCareModeStatusToggle', error.message);
			return EMPTY;
		}
	}
	// TROUBLE
	public initEyecaremodeSettings() {
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.initEyecaremodeSettings()
					.then<boolean>(result => {
						this.logger.debug('initEyecaremodeSettings.then', result);
						if (!result) {
							this.initEyecare++;
							if (this.initEyecare <= 1) {
								this.initEyecaremodeSettings();
							}
						}
						return result;
					})
					.then<boolean | WhiteListCapability>(result => {
						if (result) {
							return this.displayService.getWhiteListCapability();
						}
						return result;
					})
					.then(result => {
						switch (result) {
							case 'NotSupport':
								this.showECMReset = true;
								return false;
							case 'NotAvailable':
							case 'Support':
								return true;
							case false:
							default:
								return result;
						}
					})
					.then(result => {
						if (result) {
							this.getSunsetToSunrise();
							this.getEyeCareModeStatus();
							this.getDisplayColorTemperature();
							this.getDaytimeColorTemperature();
						} else {
							this.resetEyecaremodeAllSettings();
						}
					}).catch(error => {
						this.logger.error('initEyecaremodeSettings', error.message);
					});
			}
		} catch (error) {
			this.logger.error('initEyecaremodeSettings', error.message);
			return EMPTY;

		}
	}

	private setEyeCareModeStatus(value: boolean) {
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.setEyeCareModeState(value)
					.then((result: boolean) => {
						this.logger.debug('setEyeCareModeState.then', result);

					}).catch(error => {
						this.logger.error('setEyeCareModeState', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('setEyeCareModeStatus', error.message);
			return EMPTY;
		}
	}

	private getEyeCareModeStatus() {
		if (this.displayService.isShellAvailable) {
			this.displayService
				.getEyeCareModeState()
				.then((featureStatus: FeatureStatus) => {
					this.logger.debug('getEyeCareModeState.then', featureStatus);
					this.eyeCareModeStatus = featureStatus;
					if (this.isSet.isSetEyecaremodeStatus) {
						this.eyeCareModeStatus.status = this.setValues.SetEyecaremodeStatus;
						this.isSet.isSetEyecaremodeStatus = false;
					}
					this.enableSlider = featureStatus.status;
					// this.isEyeCareMode = this.eyeCareModeStatus.status;
					if (this.eyeCareModeStatus.available === true) {
						this.logger.debug('eyeCareModeStatus.available', featureStatus.available);
					}
					this.eyeCareModeCache.available = this.eyeCareModeStatus.available;
					this.eyeCareModeCache.toggleStatus = this.eyeCareModeStatus.status;
					this.eyeCareModeCache.enableSlider = this.enableSlider;
					this.commonService.setLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
				})
				.catch(error => {
					this.logger.error('getEyeCareModeState', error.message);
					return EMPTY;
				});
		}
	}
	public onEyeCareTemparatureChange($event: any) {
		try {
			this.logger.debug('temparature changed in display', $event);
			if (this.displayService.isShellAvailable) {
				this.displayService.setDisplayColortemperature($event.value);

				this.eyeCareModeCache.eyeCareDataSource.current = $event.value;
				this.isSet.isSetEyecaremodeValue = true;
				this.setValues.SetEyecaremodeValue = $event.value;
				this.commonService.setLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
			}
		} catch (error) {
			this.logger.error('onEyeCareTemparatureChange', error.message);
			return EMPTY;
		}
	}
	public onEyeCareTemparatureValueChange($event: ChangeContext) {
		try {
			this.logger.debug('temparature changed in display', $event);
			if (this.displayService.isShellAvailable) {
				this.displayService
					.setDisplayColortemperature($event.value);
			}
		} catch (error) {
			this.logger.error('onEyeCareTemparatureValueChange', error.message);
			return EMPTY;
		}
	}
	private setEyeCareModeTemparature(value: number) {
		try {
			this.logger.debug('temparature changed in display', value);
			if (this.displayService.isShellAvailable) {
				this.displayService
					.setDisplayColortemperature(value);
			}
		} catch (error) {
			this.logger.error('setEyeCareModeTemparature', error.message);
			return EMPTY;
		}
	}
	public onResetTemparature($event: any) {
		try {
			this.logger.debug('SubpageDeviceSettingsDisplayComponent.onResetTemparature: before api call', $event);
			if (this.displayService.isShellAvailable) {
				this.displayService
					.resetEyeCareMode().then((resetData: any) => {
						this.logger.debug('SubpageDeviceSettingsDisplayComponent.onResetTemparature: on api reset data', resetData);
						this.eyeCareDataSource.current = resetData.colorTemperature;
						this.eyeCareModeStatus.status = resetData.eyecaremodeState;
						this.enableSlider = resetData.eyecaremodeState;
						this.sunsetToSunriseModeStatus.status = resetData.autoEyecaremodeState;
						this.eyeCareModeCache.toggleStatus = this.eyeCareModeStatus.status;
						this.eyeCareModeCache.enableSlider = this.enableSlider;
						this.eyeCareModeCache.eyeCareDataSource = this.eyeCareDataSource;
						this.eyeCareModeCache.sunsetToSunriseStatus = this.sunsetToSunriseModeStatus;
						this.commonService.setLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
					});
			}
		} catch (error) {
			this.logger.error('onResetTemparature', error.message);
			return EMPTY;
		}
	}
	public onSunsetToSunrise($featureStatus: any) {
		try {
			this.logger.debug('sunset to sunrise event', $featureStatus);
			if (this.displayService.isShellAvailable) {
				this.displayService
					.setEyeCareAutoMode($featureStatus.status).
					then((response: any) => {
						this.logger.debug('setEyeCareAutoMode.then', response);
						if (response.result === true) {
							this.isSet.isSetScheduleStatus = true;
							this.setValues.SetScheduleStatus = $featureStatus.status;
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
						this.logger.error('setEyeCareAutoMode', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('onSunsetToSunrise', error.message);
			return EMPTY;
		}
	}
	public getSunsetToSunrise() {
		try {
			this.logger.debug(' get sunset to sunrise event');
			if (this.displayService.isShellAvailable) {
				this.displayService
					.getEyeCareAutoMode()
					.then((status: SunsetToSunriseStatus) => {
						this.logger.debug('getSunsetToSunrise.then', status);
						this.sunsetToSunriseModeStatus = status;
						if (this.isSet.isSetScheduleStatus) {
							this.sunsetToSunriseModeStatus.status = this.setValues.SetScheduleStatus;
							this.isSet.isSetScheduleStatus = false;
						}
						if (status.permission === false) {
							// 	this.displayService.openPrivacyLocation();
							this.enableSunsetToSunrise = true;

							this.eyeCareModeCache.sunsetToSunriseStatus = this.sunsetToSunriseModeStatus;
							this.eyeCareModeCache.enableSunsetToSunrise = this.enableSunsetToSunrise;
							this.commonService.setLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
						}
					}).catch(error => {
						this.logger.error('getSunsetToSunrise', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.error('getSunsetToSunrise', error.message);
			return EMPTY;
		}
	}
	// End EyeCare Mode

	// Display color temperature start here
	public getDaytimeColorTemperature() {
		this.displayService.getDaytimeColorTemperature().then((response) => {
			this.displayColorTempDataSource = response;
			this.logger.debug('getDaytimeColorTemperature.then', this.displayColorTempDataSource);
			this.displayColorTempCache.available = this.displayColorTempDataSource.available;
			if (this.isSet.isSetDaytimeColorTemperatureValue) {
				this.displayColorTempDataSource.current = this.setValues.SetDaytimeColorTemperatureValue;
				this.isSet.isSetDaytimeColorTemperatureValue = false;
			}
			this.displayColorTempCache.current = this.displayColorTempDataSource.current;
			this.displayColorTempCache.maximum = this.displayColorTempDataSource.maximum;
			this.displayColorTempCache.minimum = this.displayColorTempDataSource.minimum;
			this.displayColorTempCache.eyeCareMode = this.displayColorTempDataSource.eyemodestate;
			this.commonService.setLocalStorageValue(LocalStorageKey.DisplayColorTempCapability, this.displayColorTempCache);
		});
	}

	public onSetChangeDisplayColorTemp($event: any) {
		try {
			this.logger.debug('temparature changed in display ----->', $event);
			if (this.displayService.isShellAvailable) {
				this.displayService.setDaytimeColorTemperature($event.value);
				this.displayColorTempCache.current = $event.value;
				this.isSet.isSetDaytimeColorTemperatureValue = true;
				this.setValues.SetDaytimeColorTemperatureValue = $event.value;
				this.commonService.setLocalStorageValue(LocalStorageKey.DisplayColorTempCapability, this.displayColorTempCache);
			}
		} catch (error) {
			this.logger.error('onSetChangeDisplayColorTemp', error.message);
			return EMPTY;
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
				this.logger.debug('temparature reset in display', $event);
				this.displayService
					.resetDaytimeColorTemperature().then((resetData: any) => {
						this.logger.debug('temparature reset data', resetData);
						this.displayColorTempDataSource.current = resetData || 6500;
						this.displayColorTempCache.current = this.displayColorTempDataSource.current;
						this.commonService.setLocalStorageValue(LocalStorageKey.DisplayColorTempCapability, this.displayColorTempCache);
					});
			}
		} catch (error) {
			this.logger.error('resetDaytimeColorTemp', error.message);
			return EMPTY;
		}
	}
	// Display color temperature end here

	// Start Camera Privacy
	public onCameraPrivacyModeToggle($event: any) {

		if (this.displayService.isShellAvailable) {
			this.displayService.setCameraPrivacyModeState($event.switchValue)
				.then((value: boolean) => {
					this.logger.debug('setCameraStatus.then', value);
					this.logger.debug('setCameraStatus.then', $event.switchValue);
					this.getCameraPrivacyModeStatus();
					this.onPrivacyModeChange($event.switchValue);
					const privacy = this.commonService.getSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy);
					privacy.status = $event.switchValue;
					// this.commonService.setSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy, privacy);
					this.commonService.setLocalStorageValue(LocalStorageKey.DashboardCameraPrivacy, privacy);
				}).catch(error => {
					this.logger.error('setCameraStatus', error.message);
					return EMPTY;
				});
		}
	}
	//  TROUBLE
	private getCameraPrivacyModeStatus() {
		if (this.displayService.isShellAvailable) {
			this.displayService
				.getCameraPrivacyModeState()
				.then((featureStatus: FeatureStatus) => {
					this.logger.debug('cameraPrivacyModeStatus.then', featureStatus);
					this.cameraPrivacyModeStatus = featureStatus;
				})
				.catch(error => {
					this.logger.error('getCameraStatus', error.message);
					return EMPTY;
				});
		}
	}

	startMonitorHandlerForCamera(value: FeatureStatus) {
		this.logger.debug('startMonitorHandlerForCamera', value);
		this.cameraPrivacyModeStatus = value;
		// this.commonService.setSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy, this.cameraPrivacyModeStatus);
		this.commonService.setLocalStorageValue(LocalStorageKey.DashboardCameraPrivacy, this.cameraPrivacyModeStatus);
	}

	startCameraPrivacyMonitor() {
		this.logger.debug('startCameraPrivacyMonitor');
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.startCameraPrivacyMonitor(this.startMonitorHandlerForCamera.bind(this))
					.then((val) => {
						this.logger.debug('startCameraPrivacyMonitor.then', val);

					}).catch(error => {
						this.logger.error('startCameraPrivacyMonitor', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.debug('startCameraPrivacyMonitor', error.message);
		}
	}

	stopMonitorForCamera() {
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.stopCameraPrivacyMonitor()
					.then((value: any) => {
						this.logger.debug('stopMonitorForCamera.then', value);
					}).catch(error => {
						this.logger.error('stopMonitorForCamera', error.message);
						return EMPTY;
					});
			}
		} catch (error) {
			this.logger.debug('stopMonitorForCamera', error.message);
		}
	}

	public onBrightnessChange($event: ChangeContext) {
		this.logger.debug('setCameraBrightness in display', $event);
		if (this.displayService.isShellAvailable) {
			this.displayService
				.setCameraBrightness($event.value);
		}
	}
	public onContrastChange($event: ChangeContext) {
		this.logger.debug('setCameraContrast', $event);
		if (this.displayService.isShellAvailable) {
			this.displayService
				.setCameraContrast($event.value);
		}
	}
	public onCameraAutoExposureToggle($event: any) {
		this.logger.debug('setCameraAutoExposure.then', $event);
		this.dataSource.exposure.autoValue = $event.switchValue;
		this.cameraFeatureAccess.showAutoExposureSlider = !$event.switchValue;
		this.cameraFeatureAccess.exposureAutoValue = $event.switchValue;
		if (this.displayService.isShellAvailable) {
			this.displayService
				.setCameraAutoExposure($event.switchValue);
		}
	}
	public onCameraExposureValueChange($event: ChangeContext) {
		this.logger.debug('setCameraExposureValue.then', $event);
		if (this.displayService.isShellAvailable) {
			this.displayService
				.setCameraExposureValue($event.value);
		}
	}
	public onCameraAutoFocusToggle($event: any) {
		this.logger.debug('setCameraAutoExposure.then', $event);
		if (this.displayService.isShellAvailable) {
			this.displayService
				.setCameraAutoFocus($event.switchValue);
		}
	}

	public resetCameraSettings() {
		this.logger.debug('Reset Camera settings');
		if (this.displayService.isShellAvailable) {
			this.displayService
				.resetCameraSettings();
			this.getCameraDetails();
		}
	}
	// End Camera Privacy
	public getLocationPermissionStatus(value: any) {
		this.logger.debug('called from loaction service ui', JSON.stringify(value.status));
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
		this.logger.debug('status changed location permission');
		if (this.displayService.isShellAvailable) {
			await this.displayService.statusChangedLocationPermission(this.getLocationPermissionStatus.bind(this));
		}
	}
	public getResetColorTemparatureCallBack(resetData: any) {
		this.logger.debug('called from eyecare monitor', JSON.stringify(resetData));
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
		this.logger.debug('start eyecare monitor');
		if (this.displayService.isShellAvailable) {
			this.displayService
				.startEyeCareMonitor(this.getResetColorTemparatureCallBack.bind(this))
				.then((value: any) => {
					this.logger.debug('startmonitor', value);
				}).catch(error => {
					this.logger.error('startmonitor', error.message);
					return EMPTY;
				});

		}
	}
	public stopEyeCareMonitor() {
		this.logger.debug('stop eyecare monitor');
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
			this.logger.error('onCameraBackgroundBlur', error.message);
			return EMPTY;
		}
	}

	private initCameraBlurMethods() {
		if (this.cameraFeedService.isShellAvailable) {
			this.cameraFeedService.getCameraBlurSettings()
				.then((response: CameraBlur) => {
					this.cameraBlur = response;
					this.logger.debug('initCameraBlurMethods', response);
				}).catch(error => {
					this.logger.debug('initCameraBlurMethods', error.message);
				});
		}
	}

	public onCameraBackgroundOptionChange(isEnabling: boolean, mode: string) {
		this.logger.debug('onCameraBackgroundOptionChange: ' + isEnabling + ', ' + mode);
		if (mode !== '') {
			this.cameraBlur.currentMode = mode;
		}
		if (this.cameraFeedService.isShellAvailable) {
			this.cameraFeedService.setCameraBlurSettings(isEnabling, mode)
				.then((response) => {
					this.logger.debug('onCameraBackgroundOptionChange', response);
				}).catch(error => {
					this.logger.debug('onCameraBackgroundOptionChange', error.message);
				});
		}
	}

	public onCameraAvailable(isCameraAvailable: boolean) {
		this.logger.debug('Camera isAvailable', isCameraAvailable);
		this.isCameraHidden = !isCameraAvailable;
		if (isCameraAvailable) {
			this.initCameraBlurMethods();
		}
	}

	// Start Privacy Gaurd

	public getPrivacyGuardCapabilityStatus() {
		this.displayService.getPrivacyGuardCapability().then((status: boolean) => {
			// this.logger.debug('privacy guard compatability here -------------.>', status);
			if (status) {
				this.privacyGuardCapability = status;
				this.getPrivacyToggleStatus();

				this.privacyGuardInterval = setInterval(() => {
					this.logger.debug('Trying after 30 seconds for getting privacy guard status');
					this.getPrivacyToggleStatus();
				}, 30000);
			}
		})
			.catch(error => {
				this.logger.error('privacy guard compatability error here', error.message);
				return EMPTY;
			});

	}

	public getPrivacyToggleStatus() {
		this.displayService.getPrivacyGuardStatus().then((value: boolean) => {
			// this.logger.debug('privacy guard status here -------------.>', value);
			this.privacyGuardToggleStatus = value;
		})
			.catch(error => {
				this.logger.error('privacy guard status error here', error.message);
				return EMPTY;
			});
	}
	public getPrivacyGuardOnPasswordCapabilityStatus() {
		this.displayService.getPrivacyGuardOnPasswordCapability().then((status: boolean) => {
			// this.logger.debug('privacy guard on password compatability here -------------.>', status);
			if (status) {
				this.privacyGuardOnPasswordCapability = status;
				this.displayService.getPrivacyGuardOnPasswordStatus().then((value: boolean) => {
					this.privacyGuardCheckBox = value;
					// this.logger.debug('privacy guard on password status here -------------.>', value);
				})
					.catch(error => {
						this.logger.error('privacy guard on password status error here', error.message);
						return EMPTY;
					});
			}
		})
			.catch(error => {
				this.logger.error('privacy guard on password compatability error here', error.message);
				return EMPTY;
			});
	}

	public setPrivacyGuardToggleStatus(event) {
		this.privacyGuardToggleStatus = event.switchValue || !this.privacyGuardToggleStatus;
		this.displayService.setPrivacyGuardStatus(event.switchValue).then((response: boolean) => {
			// this.logger.debug('set privacy guard status here ------****-------.>', response);
		})
			.catch(error => {
				this.logger.error('set privacy guard status error here', error.message);
				return EMPTY;
			});
	}

	public setPrivacyGuardOnPasswordStatusVal(event) {
		this.displayService.setPrivacyGuardOnPasswordStatus(event.target.checked).then((response: boolean) => {
			// this.logger.debug('set privacy guard on password status here -------------.>', response);
		})
			.catch(error => {
				this.logger.error('set privacy guard on password status error here', error.message);
				return EMPTY;
			});
	}

	// End Privacy Gaurd
	// when disable the privacy from system setting
	cameraDisabled(event) {
		this.logger.debug('disabled all is', event);
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
						this.logger.debug('getOLEDPowerControlCapability.then', result);
						this.hasOLEDPowerControlCapability = result;

					}).catch(error => {
						this.logger.error('getOLEDPowerControlCapability', error.message);

					});
			}
		} catch (error) {
			this.logger.error('getOLEDPowerControlCapability', error.message);
			return EMPTY;
		}
	}
	onClick(path) {
		this.deviceService.launchUri(path);
	}

	launchProtocol(protocol: string) {
		WinRT.launchUri(protocol);
	}

	resetEyecaremodeAllSettings() {
		if (this.commonService.getLocalStorageValue(LocalStorageKey.EyeCareModeResetStatus) === 'true') {
			return;
		}
		this.displayService.resetEyecaremodeAllSettings()
			.then(errorCode => {
				if (errorCode === 0) {
					this.commonService.setLocalStorageValue(LocalStorageKey.EyeCareModeResetStatus, 'true');
				}
			});
	}

	//#region Display Priority Control

	private getDisplayPriorityCapability() {

	}

	public setDisplayPriorityCapability(option: string) {
		this.logger.debug('SubpageDeviceSettingsDisplayComponent.setDisplayPriorityCapability.then', option);
		this.displayPriorityModal.selectedValue = option;
	}

	//#endregion

}
