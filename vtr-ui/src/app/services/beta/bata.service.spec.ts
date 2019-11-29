import { TestBed } from '@angular/core/testing';

import { BetaService } from './beta.service';

xdescribe('ConfigService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: BetaService = TestBed.get(BetaService);
		expect(service).toBeTruthy();
	});
});
