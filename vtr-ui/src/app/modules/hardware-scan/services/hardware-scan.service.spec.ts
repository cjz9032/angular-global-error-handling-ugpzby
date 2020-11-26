import { TestBed } from '@angular/core/testing';

import { HardwareScanService } from './hardware-scan.service';

xdescribe('HardwareScanService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: HardwareScanService = TestBed.inject(HardwareScanService);
		expect(service).toBeTruthy();
	});
});
