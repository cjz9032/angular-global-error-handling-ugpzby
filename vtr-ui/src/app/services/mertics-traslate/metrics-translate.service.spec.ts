import { TestBed } from '@angular/core/testing';

import { MetricsTranslateService } from './metrics-translate.service';

xdescribe('MetricsTranslateService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: MetricsTranslateService = TestBed.get(MetricsTranslateService);
		expect(service).toBeTruthy();
	});
});
