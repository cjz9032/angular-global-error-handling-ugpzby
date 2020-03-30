import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { SubpageDeviceSettingsDisplayComponent } from "./subpage-device-settings-display.component";

import { DisplayService } from "src/app/services/display/display.service";
import { DeviceService } from "src/app/services/device/device.service";
import { CommonService } from "src/app/services/common/common.service";
import { BaseCameraDetail } from "src/app/services/camera/camera-detail/base-camera-detail.service";
import { LoggerService } from "src/app/services/logger/logger.service";
import { VantageShellService } from "src/app/services/vantage-shell/vantage-shell.service";
import { DevService } from "../../../../../services/dev/dev.service";
import {
	CameraDetail,
	EyeCareModeResponse,
	CameraFeatureAccess
} from "src/app/data-models/camera/camera-detail.model";

import { TranslateModule } from "@ngx-translate/core";
import { of, Observable } from "rxjs";
import { CameraFeedService } from "src/app/services/camera/camera-feed/camera-feed.service";
import { WelcomeTutorial } from "src/app/data-models/common/welcome-tutorial.model";
import { AppNotification } from "src/app/data-models/common/app-notification.model";
import { LocalStorageKey } from "src/app/enums/local-storage-key.enum";
import { DeviceMonitorStatus } from "src/app/enums/device-monitor-status.enum";
import { WhiteListCapability } from "src/app/data-models/eye-care-mode/white-list-capability.interface";
import { ChangeContext } from "ng5-slider";
import { EyeCareModeCapability } from "src/app/data-models/device/eye-care-mode-capability.model";
import { SunsetToSunriseStatus, EyeCareMode } from "src/app/data-models/camera/eyeCareMode.model";
import { CameraBlur } from 'src/app/data-models/camera/camera-blur-model';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';

const cameraDetail: CameraDetail = {
	isPrivacyModeEnabled: false,
	isAutoExposureEnabled: false,
	isAutoFocusEnabled: true,
	hasAccessToCamera: true,
	brightnessMinValue: 15,
	brightnessMaxValue: 35,
	brightnessValue: 25,
	brightnessStepValue: 3,
	contrastMinValue: 5,
	contrastMaxValue: 10,
	contrastValue: 15,
	contrastStepValue: 2,
	autoExposureMinValue: 0,
	autoExposureMaxValue: 25,
	autoExposureValue: 10,
	autoExposureStepValue: 4
};

describe("SubpageDeviceSettingsDisplayComponent", () => {
	let fixture: ComponentFixture<SubpageDeviceSettingsDisplayComponent>;
	let component: SubpageDeviceSettingsDisplayComponent;

	let deviceService: DeviceService;
	let displayService: DisplayService;
	let commonService: CommonService;
	let baseCameraDetailService: BaseCameraDetail;
	let vantageShellService: VantageShellService;
	let logger: LoggerService;
	let devService: DevService;
	let cameraFeedService: CameraFeedService;
	let batteryService: BatteryDetailService

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				HttpClientTestingModule,
				TranslateModule.forRoot()
			],
			declarations: [SubpageDeviceSettingsDisplayComponent],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				DeviceService,
				DisplayService,
				VantageShellService,
				BaseCameraDetail,
				CommonService,
				DevService,
				LoggerService,
				CameraFeedService,
				BatteryDetailService
			]
		});
	}));

	it("should create", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		baseCameraDetailService = TestBed.get(BaseCameraDetail);
		baseCameraDetailService.cameraDetailObservable = of({
			...cameraDetail
		});
		spyOn(commonService, "getLocalStorageValue").and.returnValue("true");
		fixture.detectChanges();
		expect(component).toBeTruthy();
	}));

	it("should call inWhiteList in ngAfterViewInit", done => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		const welcomeTut: WelcomeTutorial = {
			page: 2,
			tutorialVersion: "someVersion",
			isDone: true
		};
		spyOn(commonService, "getLocalStorageValue").and.returnValue(
			welcomeTut
		);
		const spy = spyOn(component, "inWhiteList").and.returnValue(
			Promise.resolve(true)
		);
		component.ngAfterViewInit();
		expect(spy).toHaveBeenCalled();
		done();
	});

	it("should call initCameraPrivacyFromCache", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		commonService = TestBed.get(CommonService);
		const privacy = { available: true };
		const spy = spyOn(
			commonService,
			"getLocalStorageValue"
		).and.returnValue(privacy);
		component.initCameraPrivacyFromCache();
		expect(spy).toHaveBeenCalled();
	}));

	it("should call initCameraSection", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		const spy = spyOn(component, "isAllInOneMachine").and.returnValue(
			Promise.resolve(true)
		);
		component.initCameraSection();
		expect(spy).toHaveBeenCalled();
	}));

	it("should call onNotification - DeviceMonitorStatus.CameraStatus", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		component.dataSource = {
			exposure: {
				autoModeSupported: false,
				autoValue: true,
				supported: true,
				min: 0,
				max: 100,
				step: 0,
				default: 0,
				value: 0
			}
		};
		const notification: AppNotification = {
			type: DeviceMonitorStatus.CameraStatus,
			payload: true
		};
		component["onNotification"](notification);
		expect(component.shouldCameraSectionDisabled).toBe(false);
	}));

	it("should call onNotification - DeviceMonitorStatus.CameraStatus and auto value is false", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		component.dataSource = {
			exposure: {
				autoModeSupported: false,
				autoValue: false,
				supported: true,
				min: 0,
				max: 100,
				step: 0,
				default: 0,
				value: 0
			}
		};
		const notification: AppNotification = {
			type: DeviceMonitorStatus.CameraStatus,
			payload: true
		};
		component["onNotification"](notification);
		expect(component.shouldCameraSectionDisabled).toBe(false);
	}))

	it("should call onNotification - LocalStorageKey.WelcomeTutorial", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		const spy = spyOn(component, "initFeatures");
		const notification: AppNotification = {
			type: LocalStorageKey.WelcomeTutorial,
			payload: { page: 2 }
		};
		component["onNotification"](notification);
		expect(spy).toHaveBeenCalled();
	}));

	it("should call onNotification - when no notification", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		component.dataSource = {
			exposure: {
				autoModeSupported: false,
				autoValue: true,
				supported: true,
				min: 0,
				max: 100,
				step: 0,
				default: 0,
				value: 0
			}
		};
		const notification: AppNotification = {
			type: DeviceMonitorStatus.CameraStatus,
			payload: ""
		};
		component["onNotification"](notification);
		expect(component.cameraFeatureAccess.showAutoExposureSlider).toBe(true);
	}));

	it("should call onPrivacySettingClick", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		deviceService = TestBed.get(DeviceService);
		const spy = spyOn(deviceService, "launchUri");
		component.onPrivacySettingClick();
		expect(spy).toHaveBeenCalled();
	}));

	it("should call getDisplayColorTemperature", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		component["isSet"].isSetEyecaremodeValue = true;
		const response = {
			available: false,
			current: 0,
			maximum: 100,
			minimum: 0,
			status: false
		};
		displayService = TestBed.get(DisplayService);
		const spy = spyOn(
			displayService,
			"getDisplayColortemperature"
		).and.returnValue(Promise.resolve(response));
		component["getDisplayColorTemperature"]();
		expect(spy).toHaveBeenCalled();
	}));

	it("should call onEyeCareModeStatusToggle", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		component.eyeCareDataSource = {
			available: false,
			current: 0,
			maximum: 100,
			minimum: 0,
			status: false
		};
		displayService = TestBed.get(DisplayService);
		displayService.isShellAvailable = true;
		const value = { colorTemperature: 0 };
		const event = { switchValue: true };
		component.eyeCareModeCache = new EyeCareModeCapability();
		spyOn(displayService, "setEyeCareModeState").and.returnValue(
			Promise.resolve(value)
		);
		component.onEyeCareModeStatusToggle(event);
		expect(component.eyeCareDataSource.current).toBe(
			value.colorTemperature
		);
	}));

	it("should call initEyecaremodeSettings when result is false", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		displayService.isShellAvailable = true;
		const spy = spyOn(
			displayService,
			"initEyecaremodeSettings"
		).and.returnValue(Promise.resolve(false));
		component.initEyecaremodeSettings();
		expect(spy).toHaveBeenCalled();
	}));

	it("should call initEyecaremodeSettings when result is NotAvailable", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		displayService.isShellAvailable = true;
		spyOn(component, "getDaytimeColorTemperature");
		const listCap: WhiteListCapability = "NotAvaliable";
		spyOn(displayService, "getWhiteListCapability").and.returnValue(
			Promise.resolve(listCap)
		);
		component.initEyecaremodeSettings();
		expect(component.enableSlider).toBe(false);
	}));

	it("should call initEyecaremodeSettings when result is Support", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		logger = TestBed.get(LoggerService);
		displayService.isShellAvailable = true;
		spyOn(component, "getDaytimeColorTemperature");
		const listCap: WhiteListCapability = "Support";
		const spy = spyOn(logger, "error");
		spyOn(displayService, "getWhiteListCapability").and.returnValue(
			Promise.resolve(listCap)
		);
		component.initEyecaremodeSettings();
		expect(spy).not.toHaveBeenCalled();
	}));

	it("should call setEyeCareModeStatus promise resolved", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		logger = TestBed.get(LoggerService);
		displayService.isShellAvailable = true;
		const spy = spyOn(
			displayService,
			"setEyeCareModeState"
		).and.returnValue(Promise.resolve(true));
		component["setEyeCareModeStatus"](true);
		expect(spy).toHaveBeenCalled();
	}));

	it("should call setEyeCareModeStatus promise rejected", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		logger = TestBed.get(LoggerService);
		displayService.isShellAvailable = true;
		const spy = spyOn(
			displayService,
			"setEyeCareModeState"
		).and.returnValue(Promise.reject(true));
		component["setEyeCareModeStatus"](true);
		expect(spy).toHaveBeenCalled();
	}));

	it("should call setEyeCareModeStatus isShellAvailable is false", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		logger = TestBed.get(LoggerService);
		displayService.isShellAvailable = false;
		const spy = spyOn(
			displayService,
			"setEyeCareModeState"
		).and.returnValue(Promise.resolve(true));
		component["setEyeCareModeStatus"](true);
		expect(spy).not.toHaveBeenCalled();
	}));

	it("should call setEyeCareModeStatus- outer catch block", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		expect(component["setEyeCareModeStatus"]).toThrow();
	}));

	it("should call onEyeCareTemparatureChange", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		const event: any = {
			value: 4
		};
		displayService.isShellAvailable = true;
		const spy = spyOn(displayService, "setDisplayColortemperature");
		component.onEyeCareTemparatureChange(event);
		expect(spy).toHaveBeenCalled();
	}));

	it("should call onEyeCareTemparatureValueChange", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		const event: ChangeContext = {
			value: 3,
			highValue: 10,
			pointerType: 0
		};
		const spy = spyOn(displayService, "setDisplayColortemperature");
		component.onEyeCareTemparatureValueChange(event);
		expect(spy).toHaveBeenCalled();
	}));

	it("should throw error - onEyeCareTemparatureValueChange", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		expect(component.onEyeCareTemparatureValueChange).toThrow();
	}));

	it("should call setEyeCareModeTemparature", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		const value: number = 4;
		displayService = TestBed.get(DisplayService);
		const spy = spyOn(displayService, "setDisplayColortemperature");
		component["setEyeCareModeTemparature"](value);
		expect(spy).toHaveBeenCalled();
	}));

	it("should throw error - setEyeCareModeTemparature", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		expect(component["setEyeCareModeTemparature"]).toThrow();
	}));

	it("should call onResetTemparature", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		const event: any = "someevent";
		const resetData: any = {
			colorTemperature: 0,
			eyecaremodeState: false,
			autoEyecaremodeState: false
		};
		component.eyeCareModeCache = new EyeCareModeCapability();
		displayService.isShellAvailable = true;
		spyOn(displayService, "resetEyeCareMode").and.returnValue(
			Promise.resolve(resetData)
		);
		component.onResetTemparature(event);
		expect(component.enableSlider).toEqual(false);
	}));

	it("should throw error - onResetTemparature", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		expect(component.onResetTemparature).toThrow();
	}));

	it("should call onSunsetToSunrise result is true", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		displayService.isShellAvailable = true;
		const featureStatus: any = { status: true };
		component.eyeCareModeCache = new EyeCareModeCapability();
		const response: any = {
			eyecaremodeState: false,
			result: true,
			colorTemperature: 0
		};
		spyOn(displayService, "setEyeCareAutoMode").and.returnValue(
			Promise.resolve(response)
		);
		component.onSunsetToSunrise(featureStatus);
		expect(component.eyeCareDataSource.current).toBe(
			response.colorTemperature
		);
	}));

	it("should call onSunsetToSunrise result is false", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		displayService.isShellAvailable = true;
		const featureStatus: any = { status: true };
		component.eyeCareModeCache = new EyeCareModeCapability();
		const response: any = {
			eyecaremodeState: false,
			result: false,
			colorTemperature: 0
		};
		spyOn(displayService, "setEyeCareAutoMode").and.returnValue(
			Promise.resolve(response)
		);
		component.onSunsetToSunrise(featureStatus);
		expect(component["isSet"].isSetScheduleStatus).toBe(false);
	}));

	it("should call onSunsetToSunrise isShellAvailable is false", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		displayService.isShellAvailable = false;
		const featureStatus: any = { status: true };
		const spy = spyOn(displayService, "setEyeCareAutoMode");
		component.onSunsetToSunrise(featureStatus);
		expect(spy).not.toHaveBeenCalled();
	}));

	it("should call getSunsetToSunrise - - Promise resolved", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		displayService.isShellAvailable = true;
		const status: SunsetToSunriseStatus = {
			available: true,
			status: true,
			permission: false,
			sunriseTime: "0600",
			sunsetTime: "1800"
		};
		component.eyeCareModeCache = new EyeCareModeCapability();
		component["isSet"].isSetScheduleStatus = true;
		const spy = spyOn(displayService, "getEyeCareAutoMode").and.returnValue(
			Promise.resolve(status)
		);
		component.getSunsetToSunrise();
		expect(spy).toHaveBeenCalled();
	}));

	it("should call getSunsetToSunrise - Promise rejected", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		displayService.isShellAvailable = true;
		const spy = spyOn(displayService, "getEyeCareAutoMode").and.returnValue(
			Promise.reject(new Error())
		);
		component.getSunsetToSunrise();
		expect(spy).toHaveBeenCalled();
	}));

	it("should call getSunsetToSunrise - isShellAvailable is false", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		displayService.isShellAvailable = false;
		const spy = spyOn(displayService, "getEyeCareAutoMode");
		component.getSunsetToSunrise();
		expect(spy).not.toHaveBeenCalled();
	}));

	it("should call getSunsetToSunrise - throw error", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		expect(component.getSunsetToSunrise).toThrow();
	}));

	it("should call getDaytimeColorTemperature", async(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		component["isSet"].isSetDaytimeColorTemperatureValue = true;
		component.displayColorTempCache = new EyeCareModeResponse();
		const response: any = {
			available: false,
			current: 0,
			maximum: 100,
			minimum: 0,
			eyemodestate: false
		};
		const spy = spyOn(
			displayService,
			"getDaytimeColorTemperature"
		).and.returnValue(Promise.resolve(response));
		component.getDaytimeColorTemperature();
		expect(spy).toHaveBeenCalled();
	}));

	it("should call onSetChangeDisplayColorTemp", async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		component.displayColorTempCache = new EyeCareModeResponse();
		const event: any = {
			value: 5
		}
		displayService.isShellAvailable = true;
		const spy = spyOn(displayService, 'setDaytimeColorTemperature')
		component.onSetChangeDisplayColorTemp(event);
		expect(spy).toHaveBeenCalled()
	}));

	it('should call setToEyeCareMode', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		component.eyeCareModeStatus.status = true;
		const spy = spyOn(component, 'onEyeCareTemparatureChange')
		component.setToEyeCareMode();
		expect(spy).toHaveBeenCalled()
	}));

	it('should call resetDaytimeColorTemp', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		component.displayColorTempDataSource = {
			current: 0
		}
		component.displayColorTempCache = new EyeCareModeResponse();
		const event: any = {value: 0}
		displayService.isShellAvailable = true;
		const resetData: any = 10
		const spy = spyOn(displayService, 'resetDaytimeColorTemperature').and.returnValue(Promise.resolve(resetData));
		component.resetDaytimeColorTemp(event);
		expect(spy).toHaveBeenCalled()
	}));

	it('should call onCameraPrivacyModeToggle', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		const event: any = {
			switchValue: true
		}
		displayService.isShellAvailable = true;
		const spy = spyOn(displayService, 'setCameraPrivacyModeState').and.returnValue(Promise.resolve(true));
		component.onCameraPrivacyModeToggle(event);
		expect(spy).toHaveBeenCalled()
	}));

	it('should call startMonitorHandlerForCamera', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		const value: FeatureStatus = {
			available: true,
			status: true,
			permission: true,
			isLoading: true
		}
		component.startMonitorHandlerForCamera(value);
		expect(component.cameraPrivacyModeStatus).toEqual(value)
	}));

	it('should call getLocationPermissionStatus -status is true', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		component.eyeCareModeCache = new EyeCareModeCapability()
		const value: any = {
			available: true,
			status: true,
			permission: true,
			isLoading: true
		}
		component.getLocationPermissionStatus(value);
		expect(component.enableSunsetToSunrise).toBe(false)
	}));

	it('should call getLocationPermissionStatus - status is false', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		component.eyeCareModeCache = new EyeCareModeCapability()
		const value: any = {
			available: true,
			status: false,
			permission: true,
			isLoading: true
		}
		component.getLocationPermissionStatus(value);
		expect(component.enableSunsetToSunrise).toBe(true)
	}));

	it('should call onBrightnessChange', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		displayService.isShellAvailable = true;
		const event: ChangeContext = {
			value: 3,
			highValue: 10,
			pointerType: 0
		};
		const spy = spyOn(displayService, 'setCameraBrightness');
		component.onBrightnessChange(event);
		expect(spy).toHaveBeenCalled()
	}));

	it('should call onContrastChange', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		displayService.isShellAvailable = true;
		const event: ChangeContext = {
			value: 3,
			highValue: 10,
			pointerType: 0
		};
		const spy = spyOn(displayService, 'setCameraContrast');
		component.onContrastChange(event);
		expect(spy).toHaveBeenCalled()
	}));

	it('should call onCameraAutoExposureToggle', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		displayService.isShellAvailable = true;
		component.dataSource = {
			exposure: {
				autoModeSupported: false,
				autoValue: true,
				supported: true,
				min: 0,
				max: 100,
				step: 0,
				default: 0,
				value: 0
			}
		}
		component.cameraFeatureAccess = new CameraFeatureAccess()
		const event: any = {
			switchValue: true
		};
		const spy = spyOn(displayService, 'setCameraAutoExposure');
		component.onCameraAutoExposureToggle(event);
		expect(spy).toHaveBeenCalled()
	}));

	it('should call onCameraExposureValueChange', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		displayService.isShellAvailable = true;
		const event: ChangeContext = {
			value: 3,
			highValue: 10,
			pointerType: 0
		};
		const spy = spyOn(displayService, 'setCameraExposureValue');
		component.onCameraExposureValueChange(event);
		expect(spy).toHaveBeenCalled()
	}));

	it('should call onCameraAutoFocusToggle', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		displayService.isShellAvailable = true;
		const event: any = {
			switchValue: true
		};
		const spy = spyOn(displayService, 'setCameraAutoFocus');
		component.onCameraAutoFocusToggle(event);
		expect(spy).toHaveBeenCalled()
	}));

	it('should call resetCameraSettings', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		displayService.isShellAvailable = true;
		const spy = spyOn(displayService, 'resetCameraSettings');
		component.resetCameraSettings();
		expect(spy).toHaveBeenCalled()
	}));

	it('should call getResetColorTemparatureCallBack - capability is NotAvailable', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		const resetData: any = {
			eyecaremodeState: false,
			capability: 'NotAvaliable',
			colorTemperature: 0
		}
		component.eyeCareDataSource = new EyeCareMode();
		component.eyeCareModeCache = new EyeCareModeCapability();
		component.getResetColorTemparatureCallBack(resetData)
		expect(component.enableSlider).toBe(false);
	}));

	it('should call getResetColorTemparatureCallBack - capability is not NotAvailable', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		const resetData: any = {
			eyecaremodeState: false,
			capability: 'Support',
			colorTemperature: 0
		}
		component.eyeCareDataSource = new EyeCareMode();
		component.eyeCareModeCache = new EyeCareModeCapability();
		component.getResetColorTemparatureCallBack(resetData)
		expect(component.disableDisplayColor).toBe(false);
	}));

	it('should call onCardCollapse', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		const isCollapsed: boolean = false;
		const spy = spyOn(component.manualRefresh, 'emit')
		component.onCardCollapse(isCollapsed);
		expect(spy).toHaveBeenCalled()
	}));

	it('should call isDisabledCameraBlur', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		batteryService = TestBed.get(BatteryDetailService);
		batteryService.gaugePercent = 20;
		batteryService.isAcAttached = false;
		const spy = spyOn(component, 'onCameraBackgroundBlur');
		component.isDisabledCameraBlur();
		expect(spy).toHaveBeenCalled()
	}));

	it('should call onCameraAvailable', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		cameraFeedService = TestBed.get(CameraFeedService);
		const res: CameraBlur = {
			available: true,
			supportedModes: ['night', 'privacy'],
			currentMode: 'privacy',
			enabled: true,
			errorCode: 0
		}
		const isCameraAvailable: boolean = true;
		const spy = spyOn(cameraFeedService, 'getCameraBlurSettings').and.returnValue(Promise.resolve(res));
		component.onCameraAvailable(isCameraAvailable);
		expect(spy).toHaveBeenCalled()
	}));

	it('should call onCameraBackgroundBlur', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		const event: any = {
			switchValue: true
		};
		component.cameraBlur = new CameraBlur();
		component.onCameraBackgroundBlur(event);
		expect(component.cameraBlur.enabled).toBe(true)
	}));

	it('should call cameraDisabled', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		const event = true
		component.dataSource = {
			exposure: {
				autoModeSupported: false,
				autoValue: true,
				supported: true,
				min: 0,
				max: 100,
				step: 0,
				default: 0,
				value: 0
			},
			permission: true
		}
		component.cameraFeatureAccess = new CameraFeatureAccess();
		component.cameraDisabled(event)
		expect(component.cameraFeatureAccess.showAutoExposureSlider).toBe(true)
	}));

	it('should call resetEyecaremodeAllSettings', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		component.eyeCareModeCache = new EyeCareModeCapability();
		component.eyeCareModeStatus = new FeatureStatus(false, true)
		displayService = TestBed.get(DisplayService);
		commonService = TestBed.get(CommonService)
		const errorCode = 0
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(false)
		spyOn(displayService, 'resetEyecaremodeAllSettings').and.returnValue(Promise.resolve(errorCode));
		component.resetEyecaremodeAllSettings()
	}));

	it('should call getPriorityControlCapability', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		const result: any = {
			HDMI: true,
			DOCK: false,
			CARTRIDGE: false,
			USB_C_DP: false,
			WIGIG: false
		}
		const spy = spyOn(displayService, 'getPriorityControlCapability').and.returnValue(Promise.resolve(result));
		component.getPriorityControlCapability();
		expect(spy).toHaveBeenCalled()
	}));

	it('should call getPriorityControlCapability promise rejected', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		const error: any = {
			message: 'Something wrong'
		}
		spyOn(displayService, 'getPriorityControlCapability').and.returnValue(Promise.reject(error));
		component.getPriorityControlCapability();
		expect(component.displayPriorityModal.capability).toEqual(false)
	}));

	it('should call getPriorityControlSetting', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		displayService.isShellAvailable = true;
		const spy = spyOn(displayService, 'getPriorityControlSetting').and.returnValue(Promise.resolve('HDMI'));
		component.getPriorityControlSetting()
		expect(spy).toHaveBeenCalled()
	}));

	it('should call setPriorityControlSetting', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		displayService.isShellAvailable = true;
		spyOn(displayService, 'setPriorityControlSetting').and.returnValue(Promise.resolve(true));
		component.setPriorityControlSetting('HDMI')
		expect(component.displayPriorityModal.selectedValue).toEqual('HDMI')
	}));

	it('should call setPriorityControlSetting - promise rejected', async(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
		displayService = TestBed.get(DisplayService);
		displayService.isShellAvailable = true;
		const error: any = {
			message: 'Something wrong'
		}
		const spy = spyOn(displayService, 'setPriorityControlSetting').and.returnValue(Promise.reject(error));
		component.setPriorityControlSetting('HDMI')
		expect(spy).toHaveBeenCalled()
	}));
});
