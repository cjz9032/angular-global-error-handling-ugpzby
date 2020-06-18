import { AfterViewInit, Component, EventEmitter, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChangeContext } from 'ng5-slider';
import { EMPTY, Subject, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { CameraBlur } from 'src/app/data-models/camera/camera-blur-model';
import { CameraDetail, CameraFeatureAccess, CameraSettingsResponse, EyeCareModeResponse } from 'src/app/data-models/camera/camera-detail.model';
import { EyeCareMode, SunsetToSunriseStatus } from 'src/app/data-models/camera/eyeCareMode.model';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { WelcomeTutorial } from 'src/app/data-models/common/welcome-tutorial.model';
import { EyeCareModeCapability } from 'src/app/data-models/device/eye-care-mode-capability.model';
import { DeviceMonitorStatus } from 'src/app/enums/device-monitor-status.enum';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { BaseCameraDetail } from 'src/app/services/camera/camera-detail/base-camera-detail.service';
import { CameraFeedService } from 'src/app/services/camera/camera-feed/camera-feed.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { DisplayService } from 'src/app/services/display/display.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { Md5 } from 'ts-md5';
import { WhiteListCapability } from '../../../../../data-models/eye-care-mode/white-list-capability.interface';
import CommonMetricsModel from 'src/app/data-models/common/common-metrics.model';

@Component({
	selector: 'vtr-subpage-device-settings-display',
	templateUrl: './subpage-device-settings-display.component.html',
	styleUrls: ['./subpage-device-settings-display.component.scss']
})
export class SubpageDeviceSettingsDisplayComponent implements OnInit, OnDestroy, AfterViewInit {
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
	public cameraPrivacyModeStatus = new FeatureStatus(true, true, false, true);
	public sunsetToSunriseModeStatus = new SunsetToSunriseStatus(true, false, false, '', '');
	public enableSunsetToSunrise = false;
	enableSlider = false;
	enableColorTempSlider = true;
	disableDisplayColor = false;
	disableEyeCareMode = false;
	disableDisplayColorReset = false;
	disableEyeCareModeReset = false;
	missingGraphicDriver = false;
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
	private cameraAccessChangedHandler: any;
	private windowsObj: any;
	public readonly metricsParent = CommonMetricsModel.ParentDeviceSettings;
	isSet = {
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
	removeJumpLink$ = new Subject();

	public readonly displayPriorityRadioGroup = 'displayPriorityRadioGroup';
	public readonly displayPriorityModal =
		{
			capability: false,
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
		public batteryService: BatteryDetailService,
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
		this.initEyeCareModeFromCache();
		this.Windows = vantageShellService.getWindows();
		if (this.Windows) {
			this.DeviceInformation = this.Windows.Devices.Enumeration.DeviceInformation;
			this.DeviceClass = this.Windows.Devices.Enumeration.DeviceClass;
			this.windowsObj = this.Windows.Devices.Enumeration.DeviceAccessInformation
				.createFromDeviceClass(this.Windows.Devices.Enumeration.DeviceClass.videoCapture);
		}
	}

	ngOnInit() {
		this.logger.debug('subpage-device-setting-display onInit');
		this.commonService.checkPowerPageFlagAndHide();
		this.initDataFromCache();
		this.batteryService.getBatterySettings();
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
		if (this.commonService.getLocalStorageValue(LocalStorageKey.EyeCareModeResetStatus) === 'true') {
			this.showECMReset = true;
		}

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

		if (this.windowsObj) {
			this.cameraAccessChangedHandler = (args: any) => {
				if (args && this.isAllInOneMachineFlag) {
					this.getCameraDetails();
				}
			}
			this.windowsObj.addEventListener('accesschanged', this.cameraAccessChangedHandler);
		}
	}

	ngAfterViewInit() {
		this.inWhiteList().then(isSupport => {
			if (isSupport) {
				this.initDisplayColorTempFromCache();
				this.initEyeCareModeFromCache();
				this.statusChangedLocationPermission();
				this.initEyecaremodeSettings();
				this.startEyeCareMonitor();
				this.commonService.setLocalStorageValue(LocalStorageKey.EyeCareModeResetStatus, 'false');
				this.showECMReset = false;
			} else {
				this.showECMReset = true;
				this.resetEyecaremodeAllSettings();
			}
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
			this.initCameraPrivacyFromCache();
			this.initPriorityControlFromCache();
		} catch (error) {
			this.logger.error('initDataFromCache', error.message);
		}
	}

	initCameraPrivacyFromCache() {
		const privacy = this.commonService.getLocalStorageValue(LocalStorageKey.DashboardCameraPrivacy);
		if (privacy && privacy.available !== undefined) {
			this.cameraPrivacyModeStatus.available = privacy.available;
			if (privacy.status !== undefined) {
				this.cameraPrivacyModeStatus.status = privacy.status;
				this.cameraPrivacyModeStatus.isLoading = false;
			}
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
				if (this.eyeCareModeCache.eyeCareDataSource.minimum < 3400) {
					this.eyeCareModeCache.eyeCareDataSource.minimum = 3400;
				}
				// if (this.eyeCareModeCache.eyeCareDataSource.current < 3400) {
				// 	this.eyeCareModeCache.eyeCareDataSource.current = 3400
				// }
				this.enableSlider = this.eyeCareModeCache.enableSlider;
				this.eyeCareDataSource = this.eyeCareModeCache.eyeCareDataSource;
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
				if (this.displayColorTempCache.minimum < 3400) {
					this.displayColorTempCache.minimum = 3400;
				}
				// if (this.displayColorTempCache.current < 3400) {
				// 	this.displayColorTempCache.current = 3400;
				// }
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

	initPriorityControlFromCache() {
		const available = this.commonService.getLocalStorageValue(LocalStorageKey.PriorityControlCapability, true);
		this.displayPriorityModal.capability = available;
	}

	initFeatures() {
		this.getPrivacyGuardCapabilityStatus();
		this.getPrivacyGuardOnPasswordCapabilityStatus();
		this.initCameraSection();
		this.getOLEDPowerControlCapability();
		const machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType);
		if (machineType === 1) {
			// commented below line to temporarily hide in current release
			// this.getPriorityControlCapability();
		} else {
			this.displayPriorityModal.capability = false;
			this.commonService.setLocalStorageValue(LocalStorageKey.PriorityControlCapability, false);
		}
	}

	inWhiteList() {
		// noinspection SpellCheckingInspection
		const whitelist = [
			'40346638a8da4aa73c765af43a709673',
			'a8c959c9d2f5f73734de9fb94a7065a2',
			'96442075283918afcc945d55beeeaea9',
			'216d38800e9ca05cd02e77a37184c133',
			'b098dbfb5ffed24d3061aba9f38bd795',
			'bdaf0b7919db29f5db5aa4868800417e',
			'c4c9336f94ed2b360e5a9da9d19b4d6e',
			'1e7a21e23525d272078d685c6a0e9f9d',
			'63971f53e52831b2a3b81896948dd92a',
			'08d313377ea30e73b4e8ab92f0312ec9',
			'479a92a1dccaf9467d168ede8848faba',
			'41849d08794e53826948df3b3bfbfd83',
			'ecc858ed4e4ce4022b04b65a94651efa',
			'ecc858ed4e4ce4022b04b65a94651efa',
			'3672447c877e471a3878b591d1ba5a9f',
			'0b35dc0e49945458f12d02e6ddcd86b7',
			'671f1454b4101503f00ff4f786d44fa0',
			'479a92a1dccaf9467d168ede8848faba',
		];
		return this.deviceService.getMachineInfo()
			.then(res => res.hasOwnProperty('biosVersion')
				&& typeof res.biosVersion === 'string'
				&& res.biosVersion.length >= 5
				&& whitelist.includes(Md5.hashStr(res.biosVersion.substr(0, 5)) as string));
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

	onNotification(notification: AppNotification) {
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

		if (this.windowsObj) {
			this.windowsObj.removeEventListener('accesschanged', this.cameraAccessChangedHandler);
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
					if (response) {
						this.cameraPrivacyModeStatus.permission = response.permission;
						this.commonService.setLocalStorageValue(LocalStorageKey.DashboardCameraPrivacy, this.cameraPrivacyModeStatus);
					}
					this.dataSource = response;
					if (this.dataSource.permission === true) {
						this.shouldCameraSectionDisabled = false;
						this.logger.debug('getCameraDetails.then permission', this.dataSource.permission);
						this.hideNote = false;
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
	getDisplayColorTemperature() {
		this.displayService.getDisplayColorTemperature().then((response) => {
			this.logger.debug('getDisplayColorTemperature.then', response);
			this.displayColorTempDataSource = response;
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

	public onEyeCareModeStatusToggle(event: any) {
		this.eyeCareModeStatus.status = event.switchValue;
		this.isSet.isSetEyecaremodeStatus = true;
		this.setValues.SetEyecaremodeStatus = event.switchValue;
		this.enableSlider = this.eyeCareModeStatus.status;
		// this.enableSlider = false;
		this.logger.debug('onEyeCareModeStatusToggle', this.eyeCareModeStatus.status);

		if (event.switchValue) {
			if (this.eyeCareModeCache.eyeCareDataSource && this.eyeCareModeCache.eyeCareDataSource.current < 3400 && !this.isSet.isSetEyecaremodeValue) {
				this.onEyeCareTemperatureChange(3400);
			}
		} else {
			if (this.displayColorTempCache.current < 3400 && !this.isSet.isSetDaytimeColorTemperatureValue) {
				this.onSetChangeDisplayColorTemp({ value: 3400 });
			}
		}
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.setEyeCareModeState(this.eyeCareModeStatus.status)
					.then((value: any) => {
						this.logger.debug('onEyeCareModeStatusToggle.then', value);
						this.eyeCareDataSource.current = value.colorTemperature;
						this.eyeCareModeCache.toggleStatus = this.eyeCareModeStatus.status;
						this.eyeCareModeCache.enableSlider = this.enableSlider;
						this.eyeCareModeCache.eyeCareDataSource = this.eyeCareDataSource;
						this.commonService.setLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
					}).catch(error => {
						this.logger.error('onEyeCareModeStatusToggle.error', error.message);
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

	setEyeCareModeToggleValue(flag: boolean, isMissingGraphicDriver = false) {
		if (this.isSet.isSetEyecaremodeStatus) {
			this.eyeCareModeStatus.status = this.setValues.SetEyecaremodeStatus;
			this.isSet.isSetEyecaremodeStatus = false;
		} else {
			this.eyeCareModeStatus.status = flag;
		}
		if (!isMissingGraphicDriver) {
			this.enableSlider = this.eyeCareModeStatus.status;
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
							// case 'NotSupport':
							// 	this.showECMReset = true;
							// 	this.resetEyecaremodeAllSettings();
							// 	break;
							// @@IMPORTANT@@ Do NOT correct this typos !!!!  This message is from plugins
							case 'NotAvaliable':
								this.enableSlider = false;
								this.enableColorTempSlider = false;
								this.disableDisplayColor = true;
								this.disableDisplayColorReset = true;
								this.disableEyeCareMode = true;
								this.disableEyeCareModeReset = true;
								this.missingGraphicDriver = true;
								this.statusChangedLocationPermission();
								this.getSunsetToSunrise();
								this.getEyeCareModeStatus(true);
								this.getDisplayColorTemperature();
								this.getDaytimeColorTemperature();
								this.resetMinimumTo3400();
								break;
							case false:
								return;
							case 'Support':
							default:
								this.statusChangedLocationPermission();
								this.getSunsetToSunrise();
								this.getEyeCareModeStatus();
								this.getDisplayColorTemperature();
								this.getDaytimeColorTemperature();
								this.resetMinimumTo3400();
								return result;
						}
					})
					.catch(error => {
						this.logger.error('initEyecaremodeSettings', error.message);
					});
			}
		} catch (error) {
			this.logger.error('initEyecaremodeSettings', error.message);
			return EMPTY;

		}
	}

	resetMinimumTo3400() {
		Promise.all([
			this.displayService.getEyeCareModeState(),
			this.displayService.getDisplayColorTemperature(),
			this.displayService.getDaytimeColorTemperature()
		]).then(([status, displayColorTemperature, daytimeColorTemperature]: any[]) => {
			if (status.status) {
				if (displayColorTemperature.current < 3400 && !this.isSet.isSetEyecaremodeValue) {
					this.onEyeCareTemperatureChange(3400);
				}
			} else {
				if (daytimeColorTemperature.current < 3400 && !this.isSet.isSetDaytimeColorTemperatureValue) {
					this.onSetChangeDisplayColorTemp({ value: 3400 });
				}
			}
		})
	}

	setEyeCareModeStatus(value: boolean) {
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

	private getEyeCareModeStatus(isMissingGraphicDriver = false) {
		if (this.displayService.isShellAvailable) {
			this.displayService
				.getEyeCareModeState()
				.then((featureStatus: FeatureStatus) => {
					this.logger.debug('isSetEyecaremodeStatus ', this.isSet.isSetEyecaremodeStatus);
					this.logger.debug('Current setValues', this.setValues);
					this.logger.debug('getEyeCareModeState.then', featureStatus);
					this.eyeCareModeStatus.available = featureStatus.available;
					this.setEyeCareModeToggleValue(featureStatus.status, isMissingGraphicDriver);
					// if (!isMissingGraphicDriver) {
					// 	this.enableSlider = featureStatus.status;
					// }
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
	public onEyeCareTemperatureChange($event: number) {
		try {
			const value = $event;
			this.logger.debug('onEyeCareTemperatureChange changed in display', value);
			if (this.displayService.isShellAvailable) {
				this.displayService.setDisplayColorTemperature(value);

				this.eyeCareModeCache.eyeCareDataSource.current = value;
				this.isSet.isSetEyecaremodeValue = true;
				this.setValues.SetEyecaremodeValue = value;
				this.commonService.setLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
			}
		} catch (error) {
			this.logger.error('onEyeCareTemperatureChange', error.message);
			return EMPTY;
		}
	}

	public onResetTemperature($event: any) {
		try {
			this.logger.debug('SubpageDeviceSettingsDisplayComponent.onResetTemperature: before api call');
			if (this.displayService.isShellAvailable) {
				this.displayService
					.resetEyeCareMode().then((resetData: any) => {
						this.logger.debug('SubpageDeviceSettingsDisplayComponent.onResetTemperature: on api reset data', { resetData, setValues: this.setValues, isSet: this.isSet });
						this.eyeCareDataSource.current = resetData.colorTemperature;
						this.setEyeCareModeToggleValue(resetData.eyecaremodeState);
						// this.enableSlider = resetData.eyecaremodeState;
						this.sunsetToSunriseModeStatus.status = resetData.autoEyecaremodeState;
						this.eyeCareModeCache.toggleStatus = this.eyeCareModeStatus.status;
						this.eyeCareModeCache.enableSlider = this.enableSlider;
						this.eyeCareModeCache.eyeCareDataSource = this.eyeCareDataSource;
						this.eyeCareModeCache.sunsetToSunriseStatus = this.sunsetToSunriseModeStatus;
						this.commonService.setLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
					});
			}
		} catch (error) {
			this.logger.error('onResetTemperature', error.message);
			return EMPTY;
		}
	}
	public onSunsetToSunrise($featureStatus: any) {
		this.sunsetToSunriseModeStatus.status = $featureStatus.status
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
							this.logger.debug('isSetEyecaremodeStatus ', this.isSet.isSetEyecaremodeStatus);
							this.logger.debug('Current setValues', this.setValues);
							this.setEyeCareModeToggleValue(response.eyecaremodeState);
							if (this.eyeCareModeStatus.status) {
								if (this.eyeCareModeCache.eyeCareDataSource && this.eyeCareModeCache.eyeCareDataSource.current < 3400 && !this.isSet.isSetEyecaremodeValue) {
									this.onEyeCareTemperatureChange(3400);
								}
							} else {
								if (this.displayColorTempCache.current < 3400 && !this.isSet.isSetDaytimeColorTemperatureValue) {
									this.onSetChangeDisplayColorTemp({ value: 3400 });
								}
							}
							// this.isEyeCareMode = this.eyeCareModeStatus.status;
							// this.enableSlider = response.eyecaremodeState;
							this.commonService.setSessionStorageValue(SessionStorageKey.DashboardEyeCareMode, this.eyeCareModeStatus);
							this.eyeCareModeCache.toggleStatus = this.eyeCareModeStatus.status;
							this.eyeCareModeCache.enableSlider = this.enableSlider;
							this.eyeCareModeCache.eyeCareDataSource = this.eyeCareDataSource;
							this.eyeCareModeCache.sunsetToSunriseStatus.status = $featureStatus.status;
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

	public async onSetChangeDisplayColorTemp($event: any) {
		try {
			const value = $event;
			this.logger.debug('onSetChangeDisplayColorTemp', value);
			if (this.displayService.isShellAvailable) {
				await this.displayService.setDaytimeColorTemperature(value);
				this.displayColorTempCache.current = value;
				this.isSet.isSetDaytimeColorTemperatureValue = true;
				this.setValues.SetDaytimeColorTemperatureValue = value;
				this.commonService.setLocalStorageValue(LocalStorageKey.DisplayColorTempCapability, this.displayColorTempCache);
				if (this.eyeCareModeStatus.status) {
					this.onEyeCareTemperatureChange(this.eyeCareDataSource.current);
				}
			}
		} catch (error) {
			this.logger.error('onSetChangeDisplayColorTemp', error.message);
			return EMPTY;
		}
	}
	public setToEyeCareMode($event) {
		if (this.eyeCareModeStatus.status) {
			// this.displayColorTempDataSource.current = this.eyeCareDataSource.current;
			// this.onSetChangeDisplayColorTemp({value: this.eyeCareDataSource.current})
			this.displayService.setDaytimeColorTemperature($event);
			// this.onEyeCareTemperatureChange(this.eyeCareDataSource.current);

		} else {
			this.onSetChangeDisplayColorTemp($event);
		}
	}

	public resetDaytimeColorTemp($event: any) {
		try {
			if (this.displayService.isShellAvailable) {
				this.logger.debug('resetDaytimeColorTemp reset in display');
				this.displayService
					.resetDaytimeColorTemperature().then((resetData: any) => {
						this.logger.debug('temperature reset data', resetData);
						this.displayColorTempDataSource.current = resetData || 6500;
						this.displayColorTempDataSource = Object.assign({}, this.displayColorTempDataSource);
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
			this.cameraPrivacyModeStatus.isLoading = true;
			this.displayService.setCameraPrivacyModeState($event.switchValue)
				.then((value: boolean) => {
					this.logger.debug('setCameraStatus.then', value);
					this.logger.debug('setCameraStatus.then', $event.switchValue);
					this.cameraPrivacyModeStatus.isLoading = false;
					this.cameraPrivacyModeStatus.status = $event.switchValue;
					this.onPrivacyModeChange($event.switchValue);
					const privacy = this.commonService.getLocalStorageValue(LocalStorageKey.DashboardCameraPrivacy);
					privacy.status = $event.switchValue;
					this.commonService.setLocalStorageValue(LocalStorageKey.DashboardCameraPrivacy, privacy);
				}).catch(error => {
					this.cameraPrivacyModeStatus.isLoading = false;
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
					this.cameraPrivacyModeStatus = { ...this.cameraPrivacyModeStatus, ...featureStatus };
					this.cameraPrivacyModeStatus.isLoading = false;
					this.commonService.setLocalStorageValue(LocalStorageKey.DashboardCameraPrivacy, this.cameraPrivacyModeStatus);
				})
				.catch(error => {
					this.cameraPrivacyModeStatus.isLoading = false;
					this.logger.error('getCameraStatus', error.message);
					return EMPTY;
				});
		}
	}

	startMonitorHandlerForCamera(value: FeatureStatus) {
		this.logger.debug('startMonitorHandlerForCamera', value);
		this.cameraPrivacyModeStatus.isLoading = false;
		this.cameraPrivacyModeStatus = { ...this.cameraPrivacyModeStatus, ...value };
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

	public onBrightnessChange($event: number) {
		this.logger.debug('setCameraBrightness in display', $event);
		if (this.displayService.isShellAvailable) {
			this.displayService
				.setCameraBrightness($event);
		}
	}
	public onContrastChange($event: number) {
		this.logger.debug('setCameraContrast', $event);
		if (this.displayService.isShellAvailable) {
			this.displayService
				.setCameraContrast($event);
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
	public onCameraExposureValueChange($event: number) {
		this.logger.debug('setCameraExposureValue.then', $event);
		if (this.displayService.isShellAvailable) {
			this.displayService
				.setCameraExposureValue($event);
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
		this.logger.debug('called from location service ui', JSON.stringify(value.status));
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
		// this.cd.detectChanges();+
	}

	public async statusChangedLocationPermission() {
		this.logger.debug('status changed location permission');
		if (this.displayService.isShellAvailable) {
			await this.displayService.statusChangedLocationPermission(this.getLocationPermissionStatus.bind(this));
		}
	}

	public getResetColorTemperatureCallBack(resetData: any) {
		this.logger.debug('called from eyecare monitor', JSON.stringify(resetData));
		this.eyeCareDataSource.current = resetData.colorTemperature;
		this.logger.debug('isSetEyecaremodeStatus ', this.isSet.isSetEyecaremodeStatus);
		this.logger.debug('Current setValues', this.setValues);
		this.setEyeCareModeToggleValue(resetData.eyecaremodeState);
		// this.enableSlider = resetData.eyecaremodeState;
		this.sunsetToSunriseModeStatus.status = resetData.autoEyecaremodeState;

		// Disable all features when missing graphic driver
		if (resetData.capability === 'NotAvaliable') {
			this.enableSlider = false;
			this.enableColorTempSlider = false;
			this.disableDisplayColor = true;
			this.disableDisplayColorReset = true;
			this.disableEyeCareMode = true;
			this.disableEyeCareModeReset = true;
			this.missingGraphicDriver = true;
		} else {
			this.enableColorTempSlider = true;
			this.disableDisplayColor = false;
			this.disableDisplayColorReset = false;
			this.disableEyeCareMode = false;
			this.disableEyeCareModeReset = false;
			this.missingGraphicDriver = false;
		}

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
				.startEyeCareMonitor(this.getResetColorTemperatureCallBack.bind(this))
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

	public isDisabledCameraBlur(): boolean {
		if (this.batteryService.gaugePercent < 23 && !this.batteryService.isAcAttached) {
			this.onCameraBackgroundBlur({ switchValue: false });
			return true;
		}
		return false;
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

	public onCameraBackgroundOptionChange(isEnabling: boolean, mode: any) {
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

	public setPrivacyGuardOnPasswordStatusVal($event: boolean) {
		this.privacyGuardCheckBox = $event;
		this.displayService.setPrivacyGuardOnPasswordStatus($event).then((response: boolean) => {
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
		this.deviceService.launchUri(protocol);
	}

	resetEyecaremodeAllSettings() {
		if (this.commonService.getLocalStorageValue(LocalStorageKey.EyeCareModeResetStatus) === 'true') {
			return;
		}
		this.displayService.resetEyecaremodeAllSettings()
			.then(errorCode => {
				if (errorCode === 0) {
					this.commonService.setLocalStorageValue(LocalStorageKey.EyeCareModeResetStatus, 'true');
					this.eyeCareModeStatus.available = false;
					this.eyeCareModeCache.available = false;
					this.commonService.setLocalStorageValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
				}
			});
	}

	//#region Display Priority Control

	public getPriorityControlCapability() {
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.getPriorityControlCapability()
					.then((result: any) => {
						this.logger.debug('SubpageDeviceSettingsDisplayComponent:getPriorityControlCapability.then', result);
						for (const option of this.displayPriorityModal.options) {
							if (!result[option.name]) {
								this.displayPriorityModal.options = this.removeObjByName(this.displayPriorityModal.options, option.name);
							}
						}
						if (this.displayPriorityModal.options.length !== 0) {
							this.displayPriorityModal.capability = true;
							this.getPriorityControlSetting();
							this.commonService.setLocalStorageValue(LocalStorageKey.PriorityControlCapability, true);
						} else {
							this.displayPriorityModal.capability = false;
							this.commonService.setLocalStorageValue(LocalStorageKey.PriorityControlCapability, false);
						}
					}).catch(error => {
						this.logger.error('SubpageDeviceSettingsDisplayComponent:getPriorityControlCapability', error.message);
						this.displayPriorityModal.capability = false;
						this.commonService.setLocalStorageValue(LocalStorageKey.PriorityControlCapability, false);
					});
			}
		} catch (error) {
			this.logger.error('SubpageDeviceSettingsDisplayComponent:getPriorityControlCapability', error.message);
			return EMPTY;
		}
	}

	public removeObjByName(array: any[], name: string) {
		return array.filter(e => e.name !== name);
	}

	public getPriorityControlSetting() {
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.getPriorityControlSetting()
					.then((result: string) => {
						this.logger.debug('SubpageDeviceSettingsDisplayComponent:getPriorityControlSetting.then', result);
						this.displayPriorityModal.selectedValue = result;
					}).catch(error => {
						this.logger.error('SubpageDeviceSettingsDisplayComponent:getPriorityControlSetting', error.message);
						this.displayPriorityModal.capability = false;
						this.commonService.setLocalStorageValue(LocalStorageKey.PriorityControlCapability, false);
					});
			}
		} catch (error) {
			this.logger.error('SubpageDeviceSettingsDisplayComponent:getPriorityControlSetting', error.message);
			this.displayPriorityModal.capability = false;
			this.commonService.setLocalStorageValue(LocalStorageKey.PriorityControlCapability, false);
			return EMPTY;
		}
	}

	public setPriorityControlSetting(option: string) {
		try {
			if (this.displayService.isShellAvailable) {
				this.displayService.setPriorityControlSetting(option)
					.then((result: boolean) => {
						this.logger.debug('SubpageDeviceSettingsDisplayComponent:setPriorityControlSetting.then', result);
						this.displayPriorityModal.selectedValue = option;
					}).catch(error => {
						this.logger.error('SubpageDeviceSettingsDisplayComponent:getPriorityControlCapability', error.message);
					});
			}
		} catch (error) {
			this.logger.error('SubpageDeviceSettingsDisplayComponent:getPriorityControlCapability', error.message);
			return EMPTY;
		}
	}

	//#endregion

}
