import { TestBed } from '@angular/core/testing';

import { AppsForYouService } from './apps-for-you.service';

xdescribe('AppsForYouService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: AppsForYouService = TestBed.get(AppsForYouService);
		expect(service).toBeTruthy();
	});
});
