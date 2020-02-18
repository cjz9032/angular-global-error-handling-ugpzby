import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';

import { DisplayService } from './display.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DevService } from '../dev/dev.service';
import { CommonService } from '../common/common.service';
import { LoggerService } from '../logger/logger.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { stat } from 'fs';

describe('DisplayService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		schemas: [NO_ERRORS_SCHEMA],
		imports: [HttpClientModule],
		providers: [DisplayService, DevService, VantageShellService, CommonService, LoggerService, HttpClient]
	}));
	let displayService: DisplayService;
	let devServices: DevService;
	let loggerService: LoggerService;
	let shellService: VantageShellService;
	let commonService: CommonService;
	let http: HttpClient;
	beforeEach(() => {
		commonService = new CommonService();
		shellService = new VantageShellService(commonService, http);
		loggerService = new LoggerService(shellService);
		devServices = new DevService(loggerService);
		displayService = new DisplayService(devServices, shellService, commonService);
	});

	it('should be created', () => {
		const service: DisplayService = TestBed.get(DisplayService);
		expect(service).toBeTruthy();
	});

	it('should start loading', () => {
		displayService.startLoading();
		expect(displayService.loading).toBe(1);
	});

	it('should stop loading', () => {
		displayService.endLoading();
		expect(displayService.loading).toBe(0);
	});

	it('should stop loading -else case', () => {
		displayService.loading = 1
		displayService.endLoading();
		expect(displayService.loading).toBe(0);
	});

	it('should clear loading', () => {
		displayService.clearLoading();
		expect(displayService.loading).toBe(0);
	});

	it('should emit window resize', () => {
		let service = {windowWidth: '', windowHeight: ''}
		let spy = spyOn(displayService['windowResize'], 'emit')
		displayService.calcSize(service);
		expect(spy).toHaveBeenCalled()
	});

	it('should dispatch new resize event', fakeAsync(() => {
		let evt = new Event('resize');
		let spy = spyOn(window, 'dispatchEvent')
		displayService.resizeWindow()
		tick(100)
		expect(spy).toHaveBeenCalledWith(evt)
	}));

	it('should listen to window resizing', () => {
		displayService.windowResizeListener();
		expect(displayService['windowResize']).toBeTruthy()
	});

	it('should get EyeCareMode State', () => {
		displayService['displayEyeCareMode'] = {getEyeCareModeState() {
			return
		}}
		let spy = spyOn(displayService['displayEyeCareMode'], 'getEyeCareModeState')
		displayService.getEyeCareModeState();
		expect(spy).toHaveBeenCalled()
	});

	it('should get EyeCareMode State - else', () => {
		displayService['displayEyeCareMode'] = undefined;
		let res = displayService.getEyeCareModeState()
		expect(res).toBeUndefined()
	});

	it('should get eyeCareMode Status', async () => {
		let status = false;
		let available = false;
		await displayService.getEyeCareAutoMode().then((item: any) => {
			status = item.status;
			available = item.available;
		});
		expect(status).toBeTruthy();
		expect(available).toBeTruthy();
	});

	it('should get Camera Privacy mode state', async () => {
		let status = false;
		let available = false;
		await displayService.getCameraPrivacyModeState().then((item: any) => {
			status = item.status;
			available = item.available;
		});
		expect(status).toBeTruthy();
		expect(available).toBeTruthy();

	});

	it('should get Camera Privacy mode status else case', () => {
		displayService['cameraPrivacyStatus'] = undefined
		displayService.getCameraPrivacyModeState()
		let spy = spyOn(shellService, 'getCameraPrivacy');
		expect(spy).not.toHaveBeenCalled()
	});

	it('should start Camera privacy monitor', async () => {
		let monitor = false;
		await displayService
			.startCameraPrivacyMonitor(() => {})
			.then((flag: any) => {
				monitor = flag; // expecting a FeatureStatus, mocked with a boolean
			});
		expect(monitor).toBeTruthy();
	});

	it('should start Camera privacy monitor - else', () => {
		let callback = () => {
			return
		};
		displayService['cameraPrivacyStatus'] = undefined;
		let res = displayService.startCameraPrivacyMonitor(callback)
		expect(res).toBeUndefined()
		
	});

	it('should stop Camera privacy monitor', async () => {
		let monitor = false;
		await displayService
			.stopCameraPrivacyMonitor()
			.then((flag: any) => {
				monitor = flag; // expecting a FeatureStatus, mocked with a boolean
			});
		expect(monitor).toBeTruthy();
	});

	it('should stop Camera privacy monitor -else case', () => {
		displayService['cameraPrivacyStatus'] = undefined;
		displayService.stopCameraPrivacyMonitor();
		let spy = spyOn(shellService, 'getCameraPrivacy');
		expect(spy).not.toHaveBeenCalled()
	});

	it('should set eyeCareMode State', async () => {
		let status = false;
		await displayService.setEyeCareModeState(true)
			.then((flag: boolean) => {
				status = flag;
			});
		expect(status).toBeTruthy();

	});

	it('should set eyeCareMode State - else', () => {
		let value = true;
		displayService['displayEyeCareMode'] = undefined;
		let res = displayService.setEyeCareModeState(value)
		expect(res).toBeUndefined()
		
	});

	it('should set Camera Privacy mode', async () => {
		let monitor = false;
		await displayService
			.setCameraPrivacyModeState(true)
			.then((flag: any) => {
				monitor = flag; // expecting a FeatureStatus, mocked with a boolean
			});
		expect(monitor).toBeTruthy();
	});

	it('should set Camera Privacy mode - else', () => {
		let value = true;
		displayService['cameraPrivacyStatus'] = undefined;
		let res = displayService.setCameraPrivacyModeState(value)
		expect(res).toBeUndefined()
		
	});

	it('should get camera settings', async () => {
		let status = false;
		await displayService.getCameraSettingsInfo()
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should get camera settings - else', () => {
		displayService['cameraSettings'] = undefined;
		let res = displayService.getCameraSettingsInfo()
		expect(res).toBeUndefined()
		
	});

	it('should set Camera Brightness', async () => {
		let status = false;
		const brightness = 10;
		await displayService.setCameraBrightness(brightness)
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should set Camera Contrast', async () => {
		let status = false;
		const contrast = 7;
		await displayService.setCameraContrast(contrast)
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should set Camera Auto Exposure', async () => {
		let status = false;
		const exposure = true;
		await displayService.setCameraAutoExposure(exposure)
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should set Camera Exposure', async () => {
		let status = false;
		const exposure = 6;
		await displayService.setCameraExposureValue(exposure)
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should set Camera autofocus', async () => {
		let status = false;
		const focus = 6;
		await displayService.setCameraAutoFocus(focus)
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should set Camera reset', async () => {
		let status = false;
		await displayService.resetCameraSettings()
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should get Display Color Temp', async () => {
		let status = false;
		await displayService.getDisplayColortemperature()
			.then((res) => {
				status = res.available;
			});
		expect(status).toBeTruthy();
	});

	it('should set Display Color Temp', async () => {
		let status = false;
		const value = 10;
		await displayService.setDisplayColortemperature(value)
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should reset EyeCare mode', async () => {
		let status = false;
		await displayService.resetEyeCareMode()
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should set Auto EyeCare mode', async () => {
		let status = false;
		const value = true;
		await displayService.setEyeCareAutoMode(value)
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should get Auto EyeCare mode', async () => {
		let status = false;
		await displayService.getEyeCareAutoMode()
			.then((res) => {
				status = res.available;
			});
		expect(status).toBeTruthy();
	});

	it('should get Daytime Color Temp', async () => {
		let status = false;
		await displayService.getDaytimeColorTemperature()
			.then((res) => {
				status = res.available;
			});
		expect(status).toBeTruthy();
	});

	it('should set Daytime Color Temp', async () => {
		let status = false;
		const value = 19;
		await displayService.setDaytimeColorTemperature(value)
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should reset Daytime Color Temp', async () => {
		let status = false;
		await displayService.resetDaytimeColorTemperature()
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should get Privacy Guard Capability', async () => {
		let status = false;
		await displayService.getPrivacyGuardCapability()
			.then(res => {
				status = res;
			});
		expect(status).toBeTruthy();
	});

	it('should get Privacy Guard Password Capability', async () => {
		let status = false;
		await displayService.getPrivacyGuardOnPasswordCapability()
			.then(res => {
				status = res;
			});
		expect(status).toBeTruthy();
	});

	it('should get Privacy Guard status', async () => {
		let status = false;
		await displayService.getPrivacyGuardStatus()
			.then(res => {
				status = res;
			});
		expect(status).toBeTruthy();
	});

	it('should get Privacy Password Guard status', async () => {
		let status = false;
		await displayService.getPrivacyGuardOnPasswordStatus()
			.then(res => {
				status = res;
			});
		expect(status).toBeTruthy();
	});

	it('should set Privacy Guard status', async () => {
		let status = false;
		const value = true;
		await displayService.setPrivacyGuardStatus(value)
			.then(res => {
				status = res;
			});
		expect(status).toBeTruthy();
	});

	it('should set Privacy Guard password status', async () => {
		let status = false;
		const value = true;
		await displayService.setPrivacyGuardOnPasswordStatus(value)
			.then(res => {
				status = res;
			});
		expect(status).toBeTruthy();
	});

	it('should get status changed location permission', () => {
		let handler = () => {
			return
		}
		displayService['isShellAvailable'] = true;
		let spy = spyOn(displayService['displayEyeCareMode'], 'statusChangedLocationPermission')
		displayService.statusChangedLocationPermission(handler);
		expect(spy).toHaveBeenCalled()
	});

	it('should get status changed location permission', () => {
		let handler = () => {
			return
		}
		displayService['isShellAvailable'] = false;
		let res = displayService.statusChangedLocationPermission(handler);
		expect(res).toBeUndefined()
	});

	it('should start eye care monitor', async () => {
		let status = false;
		await displayService
			.startEyeCareMonitor(() => {})
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should start camera permission monitor', async () => {
		let status = false;
		await displayService
			.startMonitorForCameraPermission()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should start camera permission monitor - else', () => {
		displayService['isShellAvailable'] = false
		let res = displayService.startMonitorForCameraPermission()
		expect(res).toBeUndefined()
	});

	it('should stop camera permission monitor', async () => {
		let status = false;
		await displayService
			.stopMonitorForCameraPermission()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should stop camera permission monitor', () => {
		displayService['isShellAvailable'] = false
		let res = displayService.stopMonitorForCameraPermission()
		expect(res).toBeUndefined()
	});

	it('should stop eyecare monitor', async () => {
		let status = false;
		await displayService
			.stopEyeCareMonitor()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should stop eyecare monitor', () => {
		displayService['isShellAvailable'] = false
		let res = displayService.stopEyeCareMonitor()
		expect(res).toBeUndefined()
	});

	it('should open Privacy Location', () => {
		displayService['isShellAvailable'] = true
		displayService['displayEyeCareMode'] = {openPrivacyLocation() {
			return
		}}
		let spy = spyOn(displayService['displayEyeCareMode'], 'openPrivacyLocation');
		displayService.openPrivacyLocation();
		expect(spy).toHaveBeenCalled()
	});

	it('should open Privacy Location -else', () => {
		displayService['isShellAvailable'] = false
		let res = displayService.openPrivacyLocation()
		expect(res).toBeUndefined()
	});

	it('should init eyecare mode', async () => {
		let status = false;
		await displayService.initEyecaremodeSettings()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should init eyecare mode -else', () => {
		displayService['displayEyeCareMode'] = false
		let res = displayService.initEyecaremodeSettings()
		expect(res).toBeUndefined()
	});

	it('should get OLED Capabiliity', async () => {
		let status = false;
		await displayService.getOLEDPowerControlCapability()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should get OLED Capabiliity -else', () => {
		displayService['oledSettings'] = false
		let res = displayService.getOLEDPowerControlCapability()
		expect(res).toBeUndefined()
	});

	it('should get taskdimmer settings', async () => {
		let status = false;
		await displayService.getTaskbarDimmerSetting()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should get taskdimmer setting -else', () => {
		displayService['oledSettings'] = false
		let res = displayService.getTaskbarDimmerSetting()
		expect(res).toBeUndefined()
	});

	it('should get backgronddimmer settings', async () => {
		let status = false;
		await displayService.getBackgroundDimmerSetting()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should get backgronddimmer setting -else', () => {
		displayService['oledSettings'] = false
		let res = displayService.getBackgroundDimmerSetting()
		expect(res).toBeUndefined()
	});

	it('should get display dimmer settings', async () => {
		let status = false;
		await displayService.getDisplayDimmerSetting()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should get display dimmer setting -else', () => {
		displayService['oledSettings'] = false
		let res = displayService.getDisplayDimmerSetting()
		expect(res).toBeUndefined()
	});

	it('should set taskbar dimmer settings', async () => {
		let status = false;
		const value = '10';
		await displayService.setTaskbarDimmerSetting(value)
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should set taskbar dimmer setting -else', () => {
		displayService['oledSettings'] = false
		let value = 'abc'
		let res = displayService.setTaskbarDimmerSetting(value)
		expect(res).toBeUndefined()
	});

	it('should set background dimmer settings', async () => {
		let status = false;
		const value = '10';
		await displayService.setBackgroundDimmerSetting(value)
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should set background dimmer setting -else', () => {
		displayService['oledSettings'] = false
		let value = 'abc'
		let res = displayService.setBackgroundDimmerSetting(value)
		expect(res).toBeUndefined()
	});

	it('should set display dimmer settings', async () => {
		let status = false;
		const value = '10';
		await displayService.setDisplayDimmerSetting(value)
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should set display dimmer setting -else', () => {
		displayService['oledSettings'] = false
		let value = 'abc'
		let res = displayService.setDisplayDimmerSetting(value)
		expect(res).toBeUndefined()
	});

	it('should reset Eye care mode all settings', () => {
		displayService['displayEyeCareMode'] = {resetEyecaremodeAllSettings() {
			return
		}}
		let spy = spyOn(displayService['displayEyeCareMode'], 'resetEyecaremodeAllSettings')
		displayService.resetEyecaremodeAllSettings()
		expect(spy).toHaveBeenCalled()
	});

	it('should be able to get whiteList', () => {
		displayService['displayEyeCareMode'] = {getWhiteListCapability() {
			return
		}}
		let spy = spyOn(displayService['displayEyeCareMode'], 'getWhiteListCapability')
		displayService.getWhiteListCapability()
		expect(spy).toHaveBeenCalled()
	});

});
