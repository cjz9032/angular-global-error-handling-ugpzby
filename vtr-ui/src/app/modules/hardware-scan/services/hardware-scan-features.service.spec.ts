import { TestBed } from '@angular/core/testing';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { HardwareScanFeaturesService } from './hardware-scan-features.service';
import { ScanLogService } from './scan-log.service';

fdescribe('HardwareScanFeaturesService', () => {
	const loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['exception']);
	const scanLogServiceSpy = jasmine.createSpyObj('ScanLogService', ['getScanLog']);
	let service: HardwareScanFeaturesService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				HardwareScanFeaturesService,
				{ provide: LoggerService, useValue: loggerServiceSpy },
				{ provide: ScanLogService, useValue: scanLogServiceSpy },
			],
		});

		service = TestBed.inject(HardwareScanFeaturesService);
	});

	fit('should be created', () => {
		expect(service).toBeTruthy();
	});

	// Happy path test
	fit('should set variable exportLogAvailable is true when correct response is received', async () => {
		scanLogServiceSpy.getScanLog.and.returnValue(
			Promise.resolve({
				modulesResults: [1, 2],
				scanSummary: true,
			})
		);

		await service.startCheckFeatures();

		expect(scanLogServiceSpy.getScanLog).toHaveBeenCalled();
		expect(loggerServiceSpy.exception).not.toHaveBeenCalled();
		expect(service.isExportLogAvailable).toBeTruthy();
	});

	// Errors when received response is invalid
	[
		{
			description:
				'should set variable exportLogAvailable as false when incorrect response is received (scanSummary is undefined)',
			input: {
				modulesResults: [1, 2],
				scanSummary: null,
			},
			result: false,
		},
		{
			description:
				'should set variable exportLogAvailable as false when incorrect response is received (modulesResults not is array)',
			input: {
				modulesResults: true,
				scanSummary: true,
			},
			result: false,
		},
		{
			description:
				'should set variable exportLogAvailable as false when incorrect response is received (modulesResults is an empty array)',
			input: {
				modulesResults: [],
				scanSummary: true,
			},
			result: false,
		},
	].forEach((testCase) => {
		fit(testCase.description, async () => {
			scanLogServiceSpy.getScanLog.and.returnValue(Promise.resolve(testCase.input));

			await service.startCheckFeatures();

			expect(scanLogServiceSpy.getScanLog).toHaveBeenCalled();
			expect(loggerServiceSpy.exception).not.toHaveBeenCalled();
			expect(service.isExportLogAvailable).toBe(testCase.result);
		});
	});

	// Error when a rejection occurs
	fit('should set variable exportLogAvailable as false when promise gets rejected ', async () => {
		scanLogServiceSpy.getScanLog.and.returnValue(
			Promise.reject('A terrible exception has occurred')
		);

		await service.startCheckFeatures();

		expect(scanLogServiceSpy.getScanLog).toHaveBeenCalled();
		expect(loggerServiceSpy.exception).toHaveBeenCalled();
		expect(service.isExportLogAvailable).toBeFalse();
	});
});
