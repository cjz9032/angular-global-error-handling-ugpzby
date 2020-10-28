import { AfterViewInit, Component, EventEmitter, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Subject, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { CameraBlur } from 'src/app/data-models/camera/camera-blur-model';
import { CameraDetail, CameraFeatureAccess, CameraSettingsResponse, EyeCareModeResponse } from 'src/app/data-models/camera/camera-detail.model';
import { EyeCareMode, SunsetToSunriseStatus } from 'src/app/data-models/camera/eyeCareMode.model';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import CommonMetricsModel from 'src/app/data-models/common/common-metrics.model';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
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
import sha256 from 'crypto-js/sha256';
import { WhiteListCapability } from '../../../../../data-models/eye-care-mode/white-list-capability.interface';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

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
	tempHeaderMenuItems = this.headerMenuItems;
	emptyCameraDetails = [
		{
			brightness:
			{
				autoModeSupported: false,
				autoValue: false,
				supported: true,
				min: 0,
				max: 0,
				step: 1,
				default: 0,
				value: 0
			},
			contrast:
			{
				autoModeSupported: false,
				autoValue: false,
				supported: true,
				min: 0,
				max: 0,
				step: 1,
				default: 0,
				value: 0
			},
			exposure:
			{
				autoModeSupported: true,
				autoValue: true,
				supported: true,
				min: 0,
				max: 0,
				step: 1,
				default: 0,
				value: 0
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
	cameraAccessTemp = true;
	@ViewChild('cameraControl') cameraControl: any;

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

	// hide camera preview on devices which has
	// BIOS versions/ID starts with below number
	private biosVersions = ['05WT', '04WT'];
	private receivedBiosVersion = false;
	public isCameraPreviewHidden = true;

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
		private localCacheService: LocalCacheService,
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
		this.receivedBiosVersion = false;
		this.logger.debug('subpage-device-setting-display onInit');
		this.batteryService.checkPowerPageFlagAndHide();
		this.initDataFromCache();
		this.hideCameraPreviewByBiosId();
		this.batteryService.getBatterySettings();
		this.notificationSubscription = this.commonService.notification.subscribe((response: AppNotification) => {
			this.onNotification(response);
		});
		if (this.localCacheService.getLocalCacheValue(LocalStorageKey.EyeCareModeResetStatus) === 'true') {
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
			this.cameraAccessChangedHandler = async (args: any) => {
				this.isAllInOneMachineFlag = await this.isAllInOneMachine();
				if (args && this.isAllInOneMachineFlag) {
					this.getCameraDetails();
					this.getCameraPrivacyModeStatus();
				}
			};
			this.windowsObj.addEventListener('accesschanged', this.cameraAccessChangedHandler);
		}
	}

	async ngAfterViewInit() {
		this.inWhiteList().then(isSupport => {
			if (isSupport) {
				this.initDisplayColorTempFromCache();
				this.initEyeCareModeFromCache();
				this.statusChangedLocationPermission();
				this.initEyecaremodeSettings();
				this.startEyeCareMonitor();
				this.localCacheService.setLocalCacheValue(LocalStorageKey.EyeCareModeResetStatus, 'false');
				this.showECMReset = false;
			} else {
				this.showECMReset = true;
				this.resetEyecaremodeAllSettings();
			}
		});

		this.initFeatures();
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
		const privacy = this.localCacheService.getLocalCacheValue(LocalStorageKey.DashboardCameraPrivacy);
		const shouldCameraSectionDisabled = this.localCacheService.getLocalCacheValue(LocalStorageKey.ShouldCameraSectionDisabled, false);
		this.isCameraPreviewHidden = this.localCacheService.getLocalCacheValue(LocalStorageKey.IsCameraPreviewHidden, false);

		if (privacy && privacy.available !== undefined) {
			if (shouldCameraSectionDisabled !== undefined) {
				this.shouldCameraSectionDisabled = shouldCameraSectionDisabled;
			}
			this.cameraPrivacyModeStatus.available = privacy.available;
			if (this.isCameraPreviewHidden && !this.cameraPrivacyModeStatus.available) {
				this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'camera');
				// this.isAllInOneMachineFlag = false;
			} else {
				if (!this.commonService.isPresent(this.headerMenuItems, 'camera')) {
					this.headerMenuItems.push(this.tempHeaderMenuItems[1]);
				}
				// this.isAllInOneMachineFlag = true;
			}
			if (privacy.status !== undefined) {
				this.cameraPrivacyModeStatus.status = privacy.status;
				this.cameraPrivacyModeStatus.isLoading = false;
			}
		}
	}

	initEyeCareModeFromCache() {
		try {
			this.eyeCareModeCache = this.localCacheService.getLocalCacheValue(LocalStorageKey.DisplayEyeCareModeCapability, undefined);
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
			this.displayColorTempCache = this.localCacheService.getLocalCacheValue(LocalStorageKey.DisplayColorTempCapability, undefined);
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
				this.eyeCareDataSource = this.displayColorTempCache;
			} else {
				this.displayColorTempCache = new EyeCareModeResponse();
			}
		} catch (error) {
			this.logger.error('initDisplayColorTempFromCache', error.message);
		}
	}

	async initPriorityControlFromCache() {
		const available = await this.localCacheService.getLocalCacheValue(LocalStorageKey.PriorityControlCapability, true);
		this.displayPriorityModal.capability = available;
	}

	async initFeatures() {
		try {
			this.getPrivacyGuardCapabilityStatus();
			this.getPrivacyGuardOnPasswordCapabilityStatus();
			this.initCameraSection();
			this.getOLEDPowerControlCapability();
			const machineType = await this.localCacheService.getLocalCacheValue(LocalStorageKey.MachineType);
			if (machineType !== 1) {
				this.displayPriorityModal.capability = false;
				this.setPriorityControlCapabilityCache();
			}
		} catch (error) {
			this.logger.error('initFeatures', error.message);
			return EMPTY;
		}
	}

	inWhiteList() {
		// noinspection SpellCheckingInspection
		const whitelist = [
			'd7f1cae63a721e30d2ad129b8c8c953ba1a871db8468f9ac32049df297cd7626',
			'33315785125c71f61d1a1700f4e2b17b884be4bee3170a86e4a89fb0a4cd7130',
			'01e93a48a5606d822a6ab18b35d7361d7fd013ac20691691ebb3b094066f64fd',
			'6c098bdc2501a5046a5007e51e2b53b7c913db22d43fa3758aa0450029a9f6d9',
			'40707c47758aa2ad28834cbfc5a313bf680dce239c4470d4270079fce7cc9f6b',
			'73e99b3fa8ad5197e7bd768126ffe6160b25044ab8ddbe58f932e29c1bb1f5a5',
			'0facc106411def93e0a97a5ef63650f206486ed2cb3b4c73e2d74be9626feaef',
			'88ee3ec2bfbf8afdfe9ff03389c42e6124a03abb9be9670fef972bf6e7d1b2e8',
			'49b5204f55cd4d27f69baf32629d40f127f5fc7285c744641fb6cb5747cd8c7c',
			'a358b965bee5dbd2991255468990c66f24e9d5c2db7bbf7d415ae98c2ee94a26',
			'04031256907e9c6ecef82942309f11d648de237a50297d2dfd60f2b82d9a2b2e',
			'8f62ccb8a33fd86cdda60151aa976e6430cc4ed58a02b8cb14eee3ea8d407727',
			'c14dacda0ad17380ef8ef0c79ebb6664a93ee6211d196167007d627172fbd1e7',
			'c14dacda0ad17380ef8ef0c79ebb6664a93ee6211d196167007d627172fbd1e7',
			'a9b756fb5dc52a67611c771a9eb7ff40d988aca425716b6708667b2b80c4681f',
			'8c26d983031cb544960e3165163de9423110399a6472f65ab0b226331e26f628',
			'51fce52c76f46ed0d6f2cae3c5749dc5b56ecc750eafba680a95b98d61bda085',
			'04031256907e9c6ecef82942309f11d648de237a50297d2dfd60f2b82d9a2b2e'
		];
		return this.deviceService.getMachineInfo()
			.then(res => res.hasOwnProperty('biosVersion')
				&& typeof res.biosVersion === 'string'
				&& res.biosVersion.length >= 5
				&& whitelist.includes(sha256(res.biosVersion.substr(0, 5)).toString()));
	}

	hideCameraPreviewByBiosId() {
		this.deviceService.getMachineInfo()
			.then(res => {
				// for yoga book need to check first 4 character
				const biosVersion = res.biosVersion.substr(0, 4);
				this.isCameraPreviewHidden = this.biosVersions.includes(biosVersion.toUpperCase());
				this.receivedBiosVersion = true;
				if (!this.isCameraPreviewHidden) {
					this.initCameraMonitor();
				}
				this.localCacheService.setLocalCacheValue(LocalStorageKey.IsCameraPreviewHidden, this.isCameraPreviewHidden);
			});
	}

	async initCameraSection() {
		this.isDTmachine = this.localCacheService.getLocalCacheValue(LocalStorageKey.DesktopMachine);
		this.isAllInOneMachineFlag = await this.isAllInOneMachine();
		if (!this.isAllInOneMachineFlag) {
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'camera');
		} else {
			this.getCameraPrivacyModeStatus();
			this.getCameraDetails();
			this.initCameraMonitor();
		}
	}

	private initCameraMonitor() {
		this.displayService.startMonitorForCameraPermission();
		this.startCameraPrivacyMonitor();
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
					if (!this.cameraPrivacyModeStatus.permission) {
						break;
					}
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
					this.localCacheService.setLocalCacheValue(LocalStorageKey.ShouldCameraSectionDisabled, this.shouldCameraSectionDisabled);
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
					this.dataSource = response;
					// this.cameraFeatureAccess.showAutoExposureSlider = false;
					if (this.dataSource.exposure && this.dataSource.exposure.autoValue === true && !this.shouldCameraSectionDisabled) {
						this.cameraFeatureAccess.exposureAutoValue = true;

					} else {
						this.cameraFeatureAccess.exposureAutoValue = false;
					}
					if (this.dataSource.exposure && this.dataSource.exposure.supported === true && this.dataSource.exposure.autoValue === false) {
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
			this.eyeCareDataSource = this.displayColorTempDataSource;
			this.localCacheService.setLocalCacheValue(LocalStorageKey.DisplayColorTempCapability, this.displayColorTempCache);
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
						this.localCacheService.setLocalCacheValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
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
		});
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
					this.localCacheService.setLocalCacheValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
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
				this.localCacheService.setLocalCacheValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
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
						this.localCacheService.setLocalCacheValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
					});
			}
		} catch (error) {
			this.logger.error('onResetTemperature', error.message);
			return EMPTY;
		}
	}
	public onSunsetToSunrise($featureStatus: any) {
		this.sunsetToSunriseModeStatus.status = $featureStatus.status;
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
							this.localCacheService.setLocalCacheValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
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
							this.localCacheService.setLocalCacheValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
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
			this.localCacheService.setLocalCacheValue(LocalStorageKey.DisplayColorTempCapability, this.displayColorTempCache);
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
				this.localCacheService.setLocalCacheValue(LocalStorageKey.DisplayColorTempCapability, this.displayColorTempCache);
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
						this.localCacheService.setLocalCacheValue(LocalStorageKey.DisplayColorTempCapability, this.displayColorTempCache);
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
					const privacy = this.localCacheService.getLocalCacheValue(LocalStorageKey.DashboardCameraPrivacy);
					privacy.status = $event.switchValue;
					this.localCacheService.setLocalCacheValue(LocalStorageKey.DashboardCameraPrivacy, privacy);
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
					if (this.receivedBiosVersion && this.isCameraPreviewHidden && !this.cameraPrivacyModeStatus.available) {
						this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'camera');
						// this.isAllInOneMachineFlag = false;
					} else {
						if (!this.commonService.isPresent(this.headerMenuItems, 'camera')) {
							this.headerMenuItems.push(this.tempHeaderMenuItems[1]);
						}
						// this.isAllInOneMachineFlag = true;
					}
					this.cameraPrivacyModeStatus.isLoading = false;
					this.localCacheService.setLocalCacheValue(LocalStorageKey.DashboardCameraPrivacy, this.cameraPrivacyModeStatus);
					if (!this.cameraPrivacyModeStatus.permission) {
						if (this.cameraControl) {
							this.cameraControl.cleanupCameraAsync('desktopAppAccess');
						}
					}
					this.cameraChangeFollowAccess(this.cameraPrivacyModeStatus.permission);
					if (this.cameraAccessTemp === false && this.cameraPrivacyModeStatus.permission === true) {
						if (this.cameraControl) {
							this.cameraControl.initializeCameraAsync('desktopAppAccess');
						}
					}
					this.cameraAccessTemp = this.cameraPrivacyModeStatus.permission;
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
		if (this.receivedBiosVersion && this.isCameraPreviewHidden && !this.cameraPrivacyModeStatus.available) {
			// this.isAllInOneMachineFlag = false;
			this.headerMenuItems = this.commonService.removeObjFrom(this.headerMenuItems, 'camera');
		} else {
			if (this.cameraAccessTemp === true && this.cameraPrivacyModeStatus.permission === false) {
				this.cameraChangeFollowAccess(this.cameraPrivacyModeStatus.permission);
				if (this.cameraControl) {
					this.cameraControl.cleanupCameraAsync('desktopAppAccess');
				}
			}
			if (this.cameraAccessTemp === false && this.cameraPrivacyModeStatus.permission === true) {
				if (this.cameraControl) {
					this.cameraControl.initializeCameraAsync('desktopAppAccess');
				}
				this.getCameraDetails();
				this.cameraChangeFollowAccess(this.cameraPrivacyModeStatus.permission);
			}
		}
		this.cameraAccessTemp = this.cameraPrivacyModeStatus.permission;
		// this.commonService.setSessionStorageValue(SessionStorageKey.DashboardCameraPrivacy, this.cameraPrivacyModeStatus);
		this.localCacheService.setLocalCacheValue(LocalStorageKey.DashboardCameraPrivacy, this.cameraPrivacyModeStatus);
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
			this.localCacheService.setLocalCacheValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
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
		this.localCacheService.setLocalCacheValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
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
		this.localCacheService.setLocalCacheValue(LocalStorageKey.ShouldCameraSectionDisabled, this.shouldCameraSectionDisabled);
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
		if (this.localCacheService.getLocalCacheValue(LocalStorageKey.EyeCareModeResetStatus) === 'true') {
			return;
		}
		this.displayService.resetEyecaremodeAllSettings()
			.then(errorCode => {
				if (errorCode === 0) {
					this.localCacheService.setLocalCacheValue(LocalStorageKey.EyeCareModeResetStatus, 'true');
					this.eyeCareModeStatus.available = false;
					this.eyeCareModeCache.available = false;
					this.localCacheService.setLocalCacheValue(LocalStorageKey.DisplayEyeCareModeCapability, this.eyeCareModeCache);
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
						} else {
							this.displayPriorityModal.capability = false;
						}

						this.setPriorityControlCapabilityCache();
					}).catch(error => {
						this.logger.error('SubpageDeviceSettingsDisplayComponent:getPriorityControlCapability', error.message);
						this.displayPriorityModal.capability = false;
						this.setPriorityControlCapabilityCache();
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
						this.setPriorityControlCapabilityCache();
					});
			}
		} catch (error) {
			this.logger.error('SubpageDeviceSettingsDisplayComponent:getPriorityControlSetting', error.message);
			this.displayPriorityModal.capability = false;
			this.setPriorityControlCapabilityCache();
			return EMPTY;
		}
	}

	private setPriorityControlCapabilityCache() {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.PriorityControlCapability, this.displayPriorityModal.capability);
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
	cameraChangeFollowAccess(access) {
		if (access === true) {
			this.shouldCameraSectionDisabled = false;
			this.hideNote = false;
		} else {
			this.dataSource = this.emptyCameraDetails[0];
			this.shouldCameraSectionDisabled = true;
			this.hideNote = true;
			this.cameraFeatureAccess.showAutoExposureSlider = true;
		}
		this.localCacheService.setLocalCacheValue(LocalStorageKey.ShouldCameraSectionDisabled, this.shouldCameraSectionDisabled);
		if (this.dataSource.exposure.autoValue === true && !this.shouldCameraSectionDisabled) {
			this.cameraFeatureAccess.exposureAutoValue = true;

		} else {
			this.cameraFeatureAccess.exposureAutoValue = false;
		}
	}
	//#endregion
}
