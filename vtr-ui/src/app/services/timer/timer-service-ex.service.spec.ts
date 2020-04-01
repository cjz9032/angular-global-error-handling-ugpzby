import { TestBed } from '@angular/core/testing';

import { DurationCounterService } from './timer-service-ex.service';

describe('DurationCounterService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: DurationCounterService = TestBed.get(DurationCounterService);
		expect(service).toBeTruthy();
	});
});
