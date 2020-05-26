import { TestBed } from '@angular/core/testing';

import { MetricService } from './metrics.service';

xdescribe('MetricService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: MetricService = TestBed.get(MetricService);
		expect(service).toBeTruthy();
	});
});
