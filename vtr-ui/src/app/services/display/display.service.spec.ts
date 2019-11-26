import { TestBed, async } from '@angular/core/testing';

import { DisplayService } from './display.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DevService } from '../dev/dev.service';
import { CommonService } from '../common/common.service';
import { LoggerService } from '../logger/logger.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { VantageShellService as VantageShellMockService } from '../vantage-shell/vantage-shell-mock.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

fdescribe('DisplayService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		schemas: [NO_ERRORS_SCHEMA],
		imports: [HttpClientModule],
		providers: [DisplayService, DevService, VantageShellService, CommonService, LoggerService, HttpClient, VantageShellMockService]
	}));
	let displayService: DisplayService;
	let devServices: DevService;
	let loggerService: LoggerService;
	let shellService: VantageShellService;
	let mockShellService: VantageShellMockService;
	let commonService: CommonService;
	let http: HttpClient;
	beforeEach(() => {
		commonService = new CommonService();
		shellService = new VantageShellService(commonService, http);
		mockShellService = new VantageShellMockService(commonService, http);
		loggerService = new LoggerService(shellService);
		devServices = new DevService(loggerService);
		displayService = new DisplayService(devServices, shellService, commonService);
	});

	it('should be created', () => {
		const service: DisplayService = TestBed.get(DisplayService);
		expect(service).toBeTruthy();
	});

	it('should start loading', () => {
		console.log(displayService.loading);
		displayService.startLoading();
		expect(displayService.loading).toBe(1);
	});

	it('should stop loading', () => {
		console.log(displayService.loading);
		displayService.endLoading();
		expect(displayService.loading).toBe(0);
	});

	it('should clear loading', () => {
		console.log(displayService.loading);
		displayService.clearLoading();
		expect(displayService.loading).toBe(0);
	});

	it('should get eyeCareMode Status', async () => {
		const eyeCareMode = mockShellService.getEyeCareMode();
		let status = false;
		let available = false;
		await eyeCareMode.getEyeCareModeState().then((item: any) => {
			status = item.status;
			available = item.available;
		});
		expect(status).toBeTruthy();
		expect(available).toBeTruthy();
		// expect(displayService.loading).toBe(0);
	});
});
