import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ScanLogService } from './scan-log.service';

describe('ScanLogService', () => {
	let service: ScanLogService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
			providers: [HttpClientModule],
		});
		service = TestBed.inject(ScanLogService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('Validate getScanLog call', () => {
		const spy = spyOn(service, 'getScanLog');

		service.getScanLog();
		expect(spy).toHaveBeenCalled();
	});
});
