import { TestBed } from '@angular/core/testing';

import { CMSService } from './cms.service';

xdescribe('CMSService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: CMSService = TestBed.get(CMSService);
		expect(service).toBeTruthy();
	});
});
