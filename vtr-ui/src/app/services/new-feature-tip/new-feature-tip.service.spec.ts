import { TestBed } from '@angular/core/testing';

import { NewFeatureTipService } from './new-feature-tip.service';

describe('NewFeatureTipService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: NewFeatureTipService = TestBed.inject(NewFeatureTipService);
		expect(service).toBeTruthy();
	});
});
