import { TestBed } from '@angular/core/testing';

import { ScanExecutionService } from './scan-execution.service';

describe('ScanExecutionService', () => {
	let service: ScanExecutionService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ScanExecutionService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
