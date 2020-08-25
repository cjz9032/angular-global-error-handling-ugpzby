import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';

xdescribe('DashboardService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: DashboardService = TestBed.inject(DashboardService);
		expect(service).toBeTruthy();
	});
});
