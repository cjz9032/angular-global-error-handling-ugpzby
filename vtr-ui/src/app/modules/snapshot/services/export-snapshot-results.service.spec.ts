import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TranslateDefaultValueIfNotFoundPipe } from 'src/app/pipe/translate-default-value-if-not-found/translate-default-value-if-not-found.pipe';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { ExportSnapshotResultsService } from './export-snapshot-results.service';
import { SnapshotService } from './snapshot.service';

describe('ExportSnapshotResultsService', () => {
	const loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['error']);
	const httpServiceSpy = jasmine.createSpyObj('HttpClient', ['get']);
	const translateSpy = jasmine.createSpyObj('TranslateDefaultValueIfNotFoundPipe', ['transform']);
	const vantageShellServiceSpy = jasmine.createSpyObj('VantageShellService', [
		'getMetrics',
		'getVersion',
	]);
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
				{ provide: VantageShellService, useValue: vantageShellServiceSpy },
			],
		});
		service = TestBed.inject(ExportSnapshotResultsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
