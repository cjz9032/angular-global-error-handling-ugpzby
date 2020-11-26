import { TestBed } from '@angular/core/testing';
import { CommonMetricsService } from './common-metrics.service';

xdescribe('CommonMetricsService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: CommonMetricsService = TestBed.get(CommonMetricsService);
		expect(service).toBeTruthy();
	});
});
