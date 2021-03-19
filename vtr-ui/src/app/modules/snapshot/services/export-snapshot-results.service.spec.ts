import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ExportLogErrorStatus } from 'src/app/enums/export-log.enum';
import { TranslateDefaultValueIfNotFoundPipe } from 'src/app/pipe/translate-default-value-if-not-found/translate-default-value-if-not-found.pipe';
import { LoggerService } from 'src/app/services/logger/logger.service';

import { ExportSnapshotResultsService } from './export-snapshot-results.service';
import { SnapshotService } from './snapshot.service';

describe('ExportSnapshotResultsService', () => {
	const loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['error']);
	const httpServiceSpy = jasmine.createSpyObj('HttpClient', ['get']);
	const translateSpy = jasmine.createSpyObj('TranslateDefaultValueIfNotFoundPipe', ['transform']);
	const snapshotServiceSpy = jasmine.createSpyObj('SnapshotService', [
		'getSoftwareComponentsList',
		'addinVersion',
		'snapshotInfo',
	]);

	let service: ExportSnapshotResultsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ExportSnapshotResultsService,
				{ provide: TranslateDefaultValueIfNotFoundPipe, useValue: translateSpy },
				{ provide: LoggerService, useValue: loggerServiceSpy },
				{ provide: HttpClient, useValue: httpServiceSpy },
				{ provide: SnapshotService, useValue: snapshotServiceSpy },
			],
		});
		service = TestBed.inject(ExportSnapshotResultsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	// Testing when exportSnapshotResults receive any error in called functions
	[
		{
			description: 'should throw an exception when prepareDataFromScanLog return error',
			functionName: 'prepareDataFromScanLog',
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

			await expectAsync(service.exportSnapshotResults()).toBeRejectedWith(ExportLogErrorStatus.GenericError);
			expect(loggerServiceSpy.error).toHaveBeenCalledWith('Could not get scan log', error);
		});
	});
});
