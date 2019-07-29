import { TestBed } from '@angular/core/testing';

import { BatteryDetailService } from './battery-detail.service';

xdescribe('BatteryDetailService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: BatteryDetailService = TestBed.get(BatteryDetailService);
		expect(service).toBeTruthy();
	});
});
