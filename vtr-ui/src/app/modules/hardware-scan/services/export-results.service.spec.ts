import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ExportResultsService } from './export-results.service';

describe('ExportResultsService', () => {
	let service: ExportResultsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ HttpClientModule ],
			providers: [ HttpClientModule ]
		});
		service = TestBed.inject(ExportResultsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('Validate exportScanResults call', () => {
		const spy = spyOn(service, 'exportScanResults');

		service.exportScanResults();
		expect(spy).toHaveBeenCalled();
	});
});
