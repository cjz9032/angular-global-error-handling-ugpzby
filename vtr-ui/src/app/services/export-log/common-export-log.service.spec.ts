import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import jsPDF from 'jspdf';
import { ExportLogErrorStatus, LogType } from 'src/app/enums/export-log.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonExportLogService } from './common-export-log.service';

@Injectable()
class MockClass extends CommonExportLogService {
	constructor(logger: LoggerService, http: HttpClient, shellService: VantageShellService) {
		super(http, logger, shellService);
	}

	protected populatePdf(doc: jsPDF, jsonData: any): void {
		return null;
	}
	protected populateHtml(jsonData: any): void {
		return null;
	}
	protected prepareData(logType?: LogType): Promise<any> {
		return null;
	}
}

class MockSysInfo {
	getMachineInfo() {
		return Promise.resolve();
	}
}

describe('CommonExportLogService', () => {
	const loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['error']);
	const httpServiceSpy = jasmine.createSpyObj('HttpClient', ['get']);
	const shellServiceSpy = jasmine.createSpyObj('ShellService', ['getVersion', 'getSysinfo']);
	let service: MockClass;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				MockClass,
				{ provide: LoggerService, useValue: loggerServiceSpy },
				{ provide: HttpClient, useValue: httpServiceSpy },
				{ provide: VantageShellService, useValue: shellServiceSpy },
			],
		});

		const mockSysInfo = new MockSysInfo();

		shellServiceSpy.getSysinfo = jasmine.createSpy().and.returnValue(mockSysInfo);

		service = TestBed.inject(MockClass);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	// Testing when exportSnapshotResults receive any error in called functions
	[
		{
			description: 'should throw an exception when prepareData return error',
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

			expect(loggerServiceSpy.error).toHaveBeenCalledWith(
				'[Export Log] Could not export log',
				error
			);
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
