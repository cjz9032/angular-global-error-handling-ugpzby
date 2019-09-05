import { TestBed } from '@angular/core/testing';

import { AdPolicyService } from './ad-policy.service';

xdescribe('AdPolicyService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: AdPolicyService = TestBed.get(AdPolicyService);
		expect(service).toBeTruthy();
	});
});
