import { TestBed } from '@angular/core/testing';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { HardwareScanMetricsService } from './hardware-scan-metrics.service';

describe('HardwareScanMetricsService', () => {
	let service: HardwareScanMetricsService;

	// Mocked dependecy objects
	const mockedMetrics = jasmine.createSpyObj(
		'metrics', ['sendAsync']
	);

	const mockedShellService = jasmine.createSpyObj(
		'mockedShellService', {
			getMetrics: mockedMetrics
		}
	);

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ HardwareScanMetricsService,
				{
					provide: VantageShellService,
					useValue: mockedShellService,
				}
			]
		});
		service = TestBed.inject(HardwareScanMetricsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should call sendFeatureClick and call sendAsync method from metrics service', () => {

		const data = {
			ItemType: 'FeatureClick',
			ItemName: 'dummyName',
			ItemParent: 'dummyParent',
			ItemParam: 'dummyParam'
		};

		service.sendFeatureClickMetrics('dummyName', 'dummyParent', 'dummyParam');
		expect(mockedMetrics.sendAsync).toHaveBeenCalledWith(data);
	});

	it('should call sendTaskActionMetrics and call sendAsync method from metrics service', () => {

		const data = {
			ItemType: 'TaskAction',
			TaskName: 'dummyName',
			TaskCount: 0,
			TaskParam: 'dummyParam',
			TaskResult: 'dummyResult',
			TaskDuration: 10
		};

		service.sendTaskActionMetrics('dummyName', 0, 'dummyParam', 'dummyResult', 10);
		expect(mockedMetrics.sendAsync).toHaveBeenCalledWith(data);
	});
});
