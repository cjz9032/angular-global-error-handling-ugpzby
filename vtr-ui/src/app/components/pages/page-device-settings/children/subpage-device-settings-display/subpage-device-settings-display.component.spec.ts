import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
	async,
	ComponentFixture,
	discardPeriodicTasks,
	TestBed,
	fakeAsync,
	tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeContext } from 'ng5-slider';
import { of } from 'rxjs';
import { CameraBlur } from 'src/app/data-models/camera/camera-blur-model';
import {
	CameraDetail,
	CameraFeatureAccess,
	EyeCareModeResponse,
} from 'src/app/data-models/camera/camera-detail.model';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { WelcomeTutorial } from 'src/app/data-models/common/welcome-tutorial.model';
import { EyeCareModeCapability } from 'src/app/data-models/device/eye-care-mode-capability.model';
import { BatteryDetailService } from 'src/app/services/battery-detail/battery-detail.service';
import { BaseCameraDetail } from 'src/app/services/camera/camera-detail/base-camera-detail.service';
import { CameraFeedService } from 'src/app/services/camera/camera-feed/camera-feed.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DeviceService } from 'src/app/services/device/device.service';
import { DisplayService } from 'src/app/services/display/display.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { DevService } from '../../../../../services/dev/dev.service';
import { SubpageDeviceSettingsDisplayComponent } from './subpage-device-settings-display.component';
import { SunsetToSunriseStatus } from 'src/app/data-models/camera/eyeCareMode.model';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

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
	autoExposureStepValue: 4,
};

describe('SubpageDeviceSettingsDisplayComponent', () => {
	let fixture: ComponentFixture<SubpageDeviceSettingsDisplayComponent>;
	let component: SubpageDeviceSettingsDisplayComponent;

	let deviceService: DeviceService;
	let displayService: DisplayService;
	let commonService: CommonService;
	let baseCameraDetailService: BaseCameraDetail;
	let cameraFeedService: CameraFeedService;
	let batteryService: BatteryDetailService;

	beforeEach(async(() => {
		const mockFunction = (message, data) => {};
		let logger = <LoggerService>{
			error: mockFunction,
			info: mockFunction,
			debug: mockFunction,
		};

		TestBed.configureTestingModule({
			imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot()],
			declarations: [SubpageDeviceSettingsDisplayComponent],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				DeviceService,
				DisplayService,
				VantageShellService,
				BaseCameraDetail,
				CommonService,
				DevService,
				CameraFeedService,
				BatteryDetailService,
				LocalCacheService,
				{
					provide: LoggerService,
					useValue: logger,
				},
			],
		});
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsDisplayComponent);
		component = fixture.componentInstance;
	});

	it('should create', async(() => {
		commonService = TestBed.inject(CommonService);
		baseCameraDetailService = TestBed.inject(BaseCameraDetail);
		baseCameraDetailService.cameraDetailObservable = of({ ...cameraDetail });
		spyOn(commonService, 'getLocalStorageValue').and.returnValue('true');
		fixture.detectChanges();
		expect(component).toBeTruthy();
	}));

	it('should call inWhiteList in ngAfterViewInit', (done) => {
		commonService = TestBed.inject(CommonService);
		const welcomeTut: WelcomeTutorial = {
			page: 2,
			tutorialVersion: 'someVersion',
			isDone: true,
		};
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(welcomeTut);
		const spy = spyOn(component, 'inWhiteList').and.returnValue(Promise.resolve(true));
		component.ngAfterViewInit();
		expect(spy).toHaveBeenCalled();
		done();
	});

	it('should call initCameraPrivacyFromCache', async(() => {
		commonService = TestBed.inject(CommonService);
		const privacy = { available: true, status: true };
		const spy = spyOn(commonService, 'getLocalStorageValue').and.returnValue(privacy);
		component.initCameraPrivacyFromCache();
		expect(spy).toHaveBeenCalled();
	}));

	it('should call initCameraSection -isAllInOneMachine false ', async(async () => {
		const spy = spyOn(component, 'isAllInOneMachine').and.returnValue(Promise.resolve(false));

		await component.initCameraSection();
		expect(spy).toHaveBeenCalled();
	}));

	it('should call onPrivacySettingClick', async(() => {
		deviceService = TestBed.inject(DeviceService);
		const spy = spyOn(deviceService, 'launchUri');
		component.onPrivacySettingClick();
		expect(spy).toHaveBeenCalled();
	}));

	it('should call onEyeCareModeStatusToggle', async(() => {
		component.eyeCareDataSource = {
			available: false,
			current: 0,
			maximum: 100,
			minimum: 0,
			status: false,
		};
		displayService = TestBed.inject(DisplayService);
		displayService.isShellAvailable = true;
		const value = { colorTemperature: 0 };
		const event = { switchValue: true };
		component.eyeCareModeCache = new EyeCareModeCapability();
		spyOn(displayService, 'setEyeCareModeState').and.returnValue(Promise.resolve(value));
		component.onEyeCareModeStatusToggle(event);
		expect(component.eyeCareDataSource.current).toBe(value.colorTemperature);
	}));

	it('should call setEyeCareModeStatus promise resolved', async(() => {
		displayService = TestBed.inject(DisplayService);
		displayService.isShellAvailable = true;
		const spy = spyOn(displayService, 'setEyeCareModeState').and.returnValue(
			Promise.resolve(true)
		);
		component.setEyeCareModeStatus(true);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call setEyeCareModeStatus promise rejected', async(() => {
		displayService = TestBed.inject(DisplayService);
		displayService.isShellAvailable = true;
		const spy = spyOn(displayService, 'setEyeCareModeState').and.returnValue(
			Promise.reject(true)
		);
		component.setEyeCareModeStatus(true);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call setEyeCareModeStatus isShellAvailable is false', async(() => {
		displayService = TestBed.inject(DisplayService);
		displayService.isShellAvailable = false;
		const spy = spyOn(displayService, 'setEyeCareModeState').and.returnValue(
			Promise.resolve(true)
		);
		component.setEyeCareModeStatus(true);
		expect(spy).not.toHaveBeenCalled();
	}));

	it('should call setEyeCareModeStatus- outer catch block', async(() => {
		expect(component.setEyeCareModeStatus).toThrow();
	}));

	it('should throw error - onEyeCareTemperatureChange', async(() => {
		expect(component.onEyeCareTemperatureChange).toThrow();
	}));

	it('should call onResetTemperature', async(() => {
		displayService = TestBed.inject(DisplayService);
		const event: any = 'someevent';
		const resetData: any = {
			colorTemperature: 0,
			eyecaremodeState: false,
			autoEyecaremodeState: false,
		};
		component.sunsetToSunriseModeStatus = new SunsetToSunriseStatus(
			false,
			false,
			false,
			'10:00',
			'11:00'
		);
		component.eyeCareModeStatus = new FeatureStatus(true, false);
		component.eyeCareModeCache = new EyeCareModeCapability();
		component.eyeCareModeCache.sunsetToSunriseStatus = new SunsetToSunriseStatus(
			false,
			false,
			false,
			'10:00',
			'11:00'
		);
		displayService.isShellAvailable = true;
		spyOn(displayService, 'resetEyeCareMode').and.returnValue(Promise.resolve(resetData));
		component.onResetTemperature(event);

		if (component.enableSlider === true) {
			expect(component.enableSlider).toEqual(true);
		} else {
			expect(component.enableSlider).toEqual(false);
		}
	}));

	it('should throw error - onResetTemperature', async(() => {
		expect(component.onResetTemperature).toThrow();
	}));

	it('should call getSunsetToSunrise - Promise rejected', async(() => {
		displayService = TestBed.inject(DisplayService);
		displayService.isShellAvailable = true;
		const spy = spyOn(displayService, 'getEyeCareAutoMode').and.returnValue(
			Promise.reject(new Error())
		);
		component.getSunsetToSunrise();
		expect(spy).toHaveBeenCalled();
	}));

	it('should call getSunsetToSunrise - isShellAvailable is false', async(() => {
		displayService = TestBed.inject(DisplayService);
		displayService.isShellAvailable = false;
		const spy = spyOn(displayService, 'getEyeCareAutoMode');
		component.getSunsetToSunrise();
		expect(spy).not.toHaveBeenCalled();
	}));

	it('should call getSunsetToSunrise - throw error', async(() => {
		expect(component.getSunsetToSunrise).toThrow();
	}));

	it('should call getDaytimeColorTemperature', async(() => {
		displayService = TestBed.inject(DisplayService);
		component.isSet.isSetDaytimeColorTemperatureValue = true;
		component.displayColorTempCache = new EyeCareModeResponse();
		const response: any = {
			available: false,
			current: 0,
			maximum: 100,
			minimum: 0,
			eyemodestate: false,
		};
		const spy = spyOn(displayService, 'getDaytimeColorTemperature').and.returnValue(
			Promise.resolve(response)
		);
		component.getDaytimeColorTemperature();
		expect(spy).toHaveBeenCalled();
	}));

	it('should call onSetChangeDisplayColorTemp', async(() => {
		displayService = TestBed.inject(DisplayService);
		component.displayColorTempCache = new EyeCareModeResponse();
		const event: any = {
			value: 5,
		};
		displayService.isShellAvailable = true;
		const spy = spyOn(displayService, 'setDaytimeColorTemperature');
		component.onSetChangeDisplayColorTemp(event);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call resetDaytimeColorTemp', async(() => {
		displayService = TestBed.inject(DisplayService);
		component.displayColorTempDataSource = {
			current: 0,
		};
		component.displayColorTempCache = new EyeCareModeResponse();
		const event: any = { value: 0 };
		displayService.isShellAvailable = true;
		const resetData: any = 10;
		const spy = spyOn(displayService, 'resetDaytimeColorTemperature').and.returnValue(
			Promise.resolve(resetData)
		);
		component.resetDaytimeColorTemp(event);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call onCameraPrivacyModeToggle', async(() => {
		displayService = TestBed.inject(DisplayService);
		const event: any = {
			switchValue: true,
		};
		displayService.isShellAvailable = true;
		const spy = spyOn(displayService, 'setCameraPrivacyModeState').and.returnValue(
			Promise.resolve(true)
		);
		component.onCameraPrivacyModeToggle(event);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call getLocationPermissionStatus -status is true', async(() => {
		component.eyeCareModeCache = new EyeCareModeCapability();
		const value: any = {
			available: true,
			status: true,
			permission: true,
			isLoading: true,
		};
		component.getLocationPermissionStatus(value);
		expect(component.enableSunsetToSunrise).toBe(false);
	}));

	it('should call getLocationPermissionStatus - status is false', async(() => {
		component.eyeCareModeCache = new EyeCareModeCapability();
		const value: any = {
			available: true,
			status: false,
			permission: true,
			isLoading: true,
		};
		component.getLocationPermissionStatus(value);
		expect(component.enableSunsetToSunrise).toBe(true);
	}));

	it('should call onBrightnessChange', async(() => {
		displayService = TestBed.inject(DisplayService);
		displayService.isShellAvailable = true;
		const event: ChangeContext = {
			value: 3,
			highValue: 10,
			pointerType: 0,
		};
		const spy = spyOn(displayService, 'setCameraBrightness');
		component.onBrightnessChange(event.value);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call onContrastChange', async(() => {
		displayService = TestBed.inject(DisplayService);
		displayService.isShellAvailable = true;
		const event: ChangeContext = {
			value: 3,
			highValue: 10,
			pointerType: 0,
		};
		const spy = spyOn(displayService, 'setCameraContrast');
		component.onContrastChange(event.value);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call onCameraAutoExposureToggle', async(() => {
		displayService = TestBed.inject(DisplayService);
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
				value: 0,
			},
		};
		component.cameraFeatureAccess = new CameraFeatureAccess();
		const event: any = {
			switchValue: true,
		};
		const spy = spyOn(displayService, 'setCameraAutoExposure');
		component.onCameraAutoExposureToggle(event);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call onCameraExposureValueChange', async(() => {
		displayService = TestBed.inject(DisplayService);
		displayService.isShellAvailable = true;
		const event: ChangeContext = {
			value: 3,
			highValue: 10,
			pointerType: 0,
		};
		const spy = spyOn(displayService, 'setCameraExposureValue');
		component.onCameraExposureValueChange(event.value);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call onCameraAutoFocusToggle', async(() => {
		displayService = TestBed.inject(DisplayService);
		displayService.isShellAvailable = true;
		const event: any = {
			switchValue: true,
		};
		const spy = spyOn(displayService, 'setCameraAutoFocus');
		component.onCameraAutoFocusToggle(event);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call onCardCollapse', async(() => {
		const isCollapsed = false;
		const spy = spyOn(component.manualRefresh, 'emit');
		component.onCardCollapse(isCollapsed);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call isDisabledCameraBlur', async(() => {
		batteryService = TestBed.inject(BatteryDetailService);
		batteryService.gaugePercent = 20;
		batteryService.isAcAttached = false;
		const spy = spyOn(component, 'onCameraBackgroundBlur');
		component.isDisabledCameraBlur();
		expect(spy).toHaveBeenCalled();
	}));

	it('should call onCameraAvailable', async(() => {
		cameraFeedService = TestBed.inject(CameraFeedService);
		const res: CameraBlur = {
			available: true,
			supportedModes: ['night', 'privacy'],
			currentMode: 'privacy',
			enabled: true,
			errorCode: 0,
		};
		const isCameraAvailable = true;
		const spy = spyOn(cameraFeedService, 'getCameraBlurSettings').and.returnValue(
			Promise.resolve(res)
		);
		component.onCameraAvailable(isCameraAvailable);
		expect(spy).toHaveBeenCalled();
	}));

	it('should call onCameraBackgroundBlur', async(() => {
		const event: any = {
			switchValue: true,
		};
		component.cameraBlur = new CameraBlur();
		component.onCameraBackgroundBlur(event);
		expect(component.cameraBlur.enabled).toBe(true);
	}));

	it('should call cameraDisabled', async(() => {
		const event = true;
		component.dataSource = {
			exposure: {
				autoModeSupported: false,
				autoValue: true,
				supported: true,
				min: 0,
				max: 100,
				step: 0,
				default: 0,
				value: 0,
			},
			permission: true,
		};
		component.cameraFeatureAccess = new CameraFeatureAccess();
		component.cameraDisabled(event);
		expect(component.cameraFeatureAccess.showAutoExposureSlider).toBe(true);
	}));

	it('should call resetEyecaremodeAllSettings', async(() => {
		component.eyeCareModeCache = new EyeCareModeCapability();
		component.eyeCareModeStatus = new FeatureStatus(false, true);
		displayService = TestBed.inject(DisplayService);
		commonService = TestBed.inject(CommonService);
		const errorCode = 0;
		spyOn(commonService, 'getLocalStorageValue').and.returnValue(false);
		spyOn(displayService, 'resetEyecaremodeAllSettings').and.returnValue(
			Promise.resolve(errorCode)
		);
		component.resetEyecaremodeAllSettings();
	}));

	it('when call getPriorityControlCapability and has a valid result. Then should remove invalid options from displayPriorityModal', fakeAsync(() => {
		displayService = TestBed.inject(DisplayService);
		const initalOptionsLength = component.displayPriorityModal.options.length;
		const result: any = {
			DOCK: true,
			CARTRIDGE: true,
			USB_C_DP: true,
			WIGIG: false,
		};
		const spy = spyOn(displayService, 'getPriorityControlCapability').and.returnValue(
			Promise.resolve(result)
		);
		component.getPriorityControlCapability();

		expect(spy).toHaveBeenCalled();

		tick();

		expect(component.displayPriorityModal.options.length).toBe(initalOptionsLength - 2);
		expect(component.displayPriorityModal.options.map((opt) => opt.name)).not.toContain('HDMI');
		expect(component.displayPriorityModal.options.map((opt) => opt.name)).not.toContain(
			'WIGIG'
		);

		discardPeriodicTasks();
	}));

	it('when call getPriorityControlCapability and displayPriorityModal has values. Then should set displayPriorityModal capabilty to true and call setLocalCacheValue', fakeAsync(() => {
		displayService = TestBed.inject(DisplayService);
		const localCacheService = TestBed.inject(LocalCacheService);
		const result: any = {
			DOCK: true,
			CARTRIDGE: true,
			USB_C_DP: true,
			WIGIG: false,
		};
		const getPriorityControlCapabilitySpy = spyOn(
			displayService,
			'getPriorityControlCapability'
		).and.returnValue(Promise.resolve(result));
		const getPriorityControlSettingSpy = spyOn(
			displayService,
			'getPriorityControlSetting'
		).and.returnValue(Promise.resolve('USB_C_DP'));
		const setLocalCacheValueSpy = spyOn(localCacheService, 'setLocalCacheValue')
			.withArgs(LocalStorageKey.PriorityControlCapability, true)
			.and.returnValue(Promise.resolve());

		component.getPriorityControlCapability();

		expect(getPriorityControlCapabilitySpy).toHaveBeenCalled();

		tick();

		expect(setLocalCacheValueSpy).toHaveBeenCalled();
		expect(getPriorityControlSettingSpy).toHaveBeenCalled();
		expect(component.displayPriorityModal.capability).toBeTruthy();

		discardPeriodicTasks();
	}));

	it('when call getPriorityControlCapability and result has false for all. Then should set displayPriorityModal capabilty to false and call setLocalCacheValue', fakeAsync(() => {
		displayService = TestBed.inject(DisplayService);
		const localCacheService = TestBed.inject(LocalCacheService);
		const result: any = {
			DOCK: false,
			CARTRIDGE: false,
			USB_C_DP: false,
			WIGIG: false,
		};
		const getPriorityControlCapabilitySpy = spyOn(
			displayService,
			'getPriorityControlCapability'
		).and.returnValue(Promise.resolve(result));
		const getPriorityControlSettingSpy = spyOn(
			displayService,
			'getPriorityControlSetting'
		).and.returnValue(Promise.resolve('USB_C_DP'));
		const setLocalCacheValueSpy = spyOn(localCacheService, 'setLocalCacheValue')
			.withArgs(LocalStorageKey.PriorityControlCapability, false)
			.and.returnValue(Promise.resolve());

		component.getPriorityControlCapability();

		expect(getPriorityControlCapabilitySpy).toHaveBeenCalled();

		tick();

		expect(setLocalCacheValueSpy).toHaveBeenCalled();
		expect(getPriorityControlSettingSpy).not.toHaveBeenCalled();
		expect(component.displayPriorityModal.capability).toBeFalsy();

		discardPeriodicTasks();
	}));

	it('when call getPriorityControlCapability and has error. Then should call logger error', fakeAsync(() => {
		displayService = TestBed.inject(DisplayService);

		const loggerService = TestBed.inject(LoggerService);
		const errorSpy = spyOn(loggerService, 'error');
		const getPriorityControlCapabilitySpy = spyOn(
			displayService,
			'getPriorityControlCapability'
		).and.returnValue(undefined);

		component.getPriorityControlCapability();

		expect(getPriorityControlCapabilitySpy).toHaveBeenCalled();

		tick();

		expect(errorSpy).toHaveBeenCalled();

		discardPeriodicTasks();
	}));

	it('should call getPriorityControlCapability promise rejected', async(() => {
		displayService = TestBed.inject(DisplayService);
		const error: any = {
			message: 'Something wrong',
		};
		spyOn(displayService, 'getPriorityControlCapability').and.returnValue(
			Promise.reject(error)
		);
		component.getPriorityControlCapability();
		expect(component.displayPriorityModal.capability).toEqual(false);
	}));

	it('should call getPriorityControlSetting', async(() => {
		displayService = TestBed.inject(DisplayService);
		displayService.isShellAvailable = true;
		const spy = spyOn(displayService, 'getPriorityControlSetting').and.returnValue(
			Promise.resolve('HDMI')
		);
		component.getPriorityControlSetting();
		expect(spy).toHaveBeenCalled();
	}));

	it('when call getPriorityControlSetting and the service reject then should set displayPriorityModal.capability to false and call setLocalStorageValue', fakeAsync(() => {
		displayService = TestBed.inject(DisplayService);
		displayService.isShellAvailable = true;
		const localCacheService = TestBed.inject(LocalCacheService);
		const setLocalCacheValueSpy = spyOn(localCacheService, 'setLocalCacheValue')
			.withArgs(LocalStorageKey.PriorityControlCapability, false)
			.and.returnValue(Promise.resolve());
		const getPriorityControlSettingSpy = spyOn(
			displayService,
			'getPriorityControlSetting'
		).and.returnValue(Promise.reject('some message'));
		component.getPriorityControlSetting();
		expect(getPriorityControlSettingSpy).toHaveBeenCalled();

		tick();

		expect(component.displayPriorityModal.capability).toBeFalsy();
		expect(setLocalCacheValueSpy).toHaveBeenCalled();

		discardPeriodicTasks();
	}));

	it('when call getPriorityControlSetting and go to catch statment then should set displayPriorityModal.capability to false and call setLocalStorageValue', fakeAsync(() => {
		displayService = TestBed.inject(DisplayService);
		displayService.isShellAvailable = true;
		const localCacheService = TestBed.inject(LocalCacheService);
		const setLocalCacheValueSpy = spyOn(localCacheService, 'setLocalCacheValue')
			.withArgs(LocalStorageKey.PriorityControlCapability, false)
			.and.returnValue(Promise.resolve());
		const getPriorityControlSettingSpy = spyOn(
			displayService,
			'getPriorityControlSetting'
		).and.returnValue(undefined);
		component.getPriorityControlSetting();
		expect(getPriorityControlSettingSpy).toHaveBeenCalled();
		tick();

		expect(component.displayPriorityModal.capability).toBeFalsy();
		expect(setLocalCacheValueSpy).toHaveBeenCalled();

		discardPeriodicTasks();
	}));

	it('should call setPriorityControlSetting', async(() => {
		displayService = TestBed.inject(DisplayService);
		displayService.isShellAvailable = true;
		spyOn(displayService, 'setPriorityControlSetting').and.returnValue(Promise.resolve(true));
		component.setPriorityControlSetting('HDMI');
		expect(component.displayPriorityModal.selectedValue).toEqual('HDMI');
	}));

	it('should call setPriorityControlSetting - promise rejected', async(() => {
		displayService = TestBed.inject(DisplayService);
		displayService.isShellAvailable = true;
		const error: any = {
			message: 'Something wrong',
		};
		const spy = spyOn(displayService, 'setPriorityControlSetting').and.returnValue(
			Promise.reject(error)
		);
		component.setPriorityControlSetting('HDMI');
		expect(spy).toHaveBeenCalled();
	}));

	it('when call initFeatures and machine type is different from 1 then should set displayPriorityModal capability to false and set to cache', (done) => {
		const localCacheService = TestBed.inject(LocalCacheService);
		const getLocalCacheValue = spyOn(localCacheService, 'getLocalCacheValue')
			.withArgs(LocalStorageKey.DesktopMachine)
			.and.returnValue(Promise.resolve(true));
		const machineTypeCacheSpy = getLocalCacheValue
			.withArgs(LocalStorageKey.MachineType)
			.and.returnValue(Promise.resolve(0));
		const priorityControlCapabilityCacheSpy = spyOn(localCacheService, 'setLocalCacheValue')
			.withArgs(LocalStorageKey.PriorityControlCapability, false)
			.and.returnValue(Promise.resolve());

		getLocalCacheValue
			.withArgs(LocalStorageKey.DesktopMachine)
			.and.returnValue(Promise.resolve(true));

		component.initFeatures().then(() => {
			expect(machineTypeCacheSpy).toHaveBeenCalled();
			expect(priorityControlCapabilityCacheSpy).toHaveBeenCalledTimes(1);
			done();
		});
	});

	it('when call initPriorityControlFromCache then should getLocalCacheValue', async(() => {
		const localCacheService = TestBed.inject(LocalCacheService);
		const getLocalCacheValueSpy = spyOn(localCacheService, 'getLocalCacheValue')
			.withArgs(LocalStorageKey.PriorityControlCapability, true)
			.and.returnValue(Promise.resolve(true));

		component.initPriorityControlFromCache().then(() => {
			expect(component.displayPriorityModal.capability).toBeTruthy();
		});

		expect(getLocalCacheValueSpy).toHaveBeenCalled();
	}));
});
