import { TestBed, async } from '@angular/core/testing';

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

	it('should clear loading', () => {
		displayService.clearLoading();
		expect(displayService.loading).toBe(0);
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

	it('should start Camera privacy monitor', async () => {
		let monitor = false;
		await displayService
			.startCameraPrivacyMonitor(() => console.log('Start monitoring'))
			.then((flag: any) => {
				monitor = flag; // expecting a FeatureStatus, mocked with a boolean
			});
		expect(monitor).toBeTruthy();
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

	it('should set eyeCareMode State', async () => {
		let status = false;
		await displayService.setEyeCareModeState(true)
			.then((flag: boolean) => {
				status = flag;
			});
		expect(status).toBeTruthy();

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

	it('should get camera settings', async () => {
		let status = false;
		await displayService.getCameraSettingsInfo()
			.then((flag) => {
				status = flag;
			});
		expect(status).toBeTruthy();
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

	// it('should get location change status', async () => {
	// 	let status = false;
	// 	await displayService.statusChangedLocationPermission(() => console.log('status changed'))
	// 		.then(flag => {
	// 			status = flag;
	// 		});
	// 	expect(status).toBeTruthy();
	// });

	it('should start eye care monitor', async () => {
		let status = false;
		await displayService
			.startEyeCareMonitor(() => console.log('start eyecare monitoring'))
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

	it('should stop camera permission monitor', async () => {
		let status = false;
		await displayService
			.stopMonitorForCameraPermission()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
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

	it('should init eyecare mode', async () => {
		let status = false;
		await displayService.initEyecaremodeSettings()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should get OLED Capabiliity', async () => {
		let status = false;
		await displayService.getOLEDPowerControlCapability()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should get taskdimmer settings', async () => {
		let status = false;
		await displayService.getTaskbarDimmerSetting()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should get backgronddimmer settings', async () => {
		let status = false;
		await displayService.getBackgroundDimmerSetting()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
	});

	it('should get display dimmer settings', async () => {
		let status = false;
		await displayService.getDisplayDimmerSetting()
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
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

	it('should set background dimmer settings', async () => {
		let status = false;
		const value = '10';
		await displayService.setBackgroundDimmerSetting(value)
			.then(flag => {
				status = flag;
			});
		expect(status).toBeTruthy();
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

});
