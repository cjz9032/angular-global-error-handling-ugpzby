import { TestBed } from '@angular/core/testing';

import { DeviceService } from './device.service';

xdescribe('DeviceService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: DeviceService = TestBed.inject(DeviceService);
		expect(service).toBeTruthy();
	});
});
