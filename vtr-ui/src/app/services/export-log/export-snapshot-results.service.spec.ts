import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ExportLogErrorStatus, LogType } from 'src/app/enums/export-log.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { DeviceService } from '../device/device.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonExportLogService } from './common-export-log.service';

describe('CommonExportLogService', () => {
	const loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['error']);
	const httpServiceSpy = jasmine.createSpyObj('HttpClient', ['get']);
	const shellServiceSpy = jasmine.createSpyObj('ShellService', ['getSysInfo']);
	const deviceServiceSpy = jasmine.createSpyObj('DeviceService', ['getMachineInfo']);

	let service: CommonExportLogService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				CommonExportLogService,
				{ provide: LoggerService, useValue: loggerServiceSpy },
				{ provide: HttpClient, useValue: httpServiceSpy },
				{ provide: VantageShellService, useValue: shellServiceSpy },
				{ provide: DeviceService, useValue: deviceServiceSpy },
			],
		});
		service = TestBed.inject(CommonExportLogService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	// Testing when exportSnapshotResults receive any error in called functions
	[
		{
			description: 'should throw an exception when prepareDataFromScanLog return error',
			functionName: 'prepareData',
		},
		{
			description: 'should throw an exception when generateHtmlReport return error',
			functionName: 'generateHtmlReport',
		},
		{
			description: 'should throw an exception when exportReportToFile return error',
			functionName: 'exportReportToFile',
		},
	].forEach((testCase) => {
		it(testCase.description, async () => {
			const error = new Error('Generic Error');
			spyOn<any>(service, testCase.functionName).and.throwError(error);

			await expectAsync(service.exportLog(LogType.snapshot)).toBeRejectedWith(
				ExportLogErrorStatus.GenericError
			);

			expect(loggerServiceSpy.error).toHaveBeenCalledWith('Could not get scan log', error);
		});
	});

	it('should return success when correct response is received', async () => {
		const pathMocked = 'C:/Documents';
		spyOn<any>(service, 'prepareData').and.returnValue(Object('Mocked Object'));
		spyOn<any>(service, 'generateHtmlReport').and.returnValue('Mocked Data Format');
		spyOn<any>(service, 'exportReportToFile').and.returnValue(pathMocked);

		await expectAsync(service.exportLog(LogType.snapshot)).toBeResolvedTo([
			ExportLogErrorStatus.SuccessExport,
			pathMocked,
		]);
	});
});
