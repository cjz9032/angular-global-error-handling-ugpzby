import { TestBed } from '@angular/core/testing';

import { DccService } from './dcc.service';

describe('DccService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: DccService = TestBed.get(DccService);
		expect(service).toBeTruthy();
	});
});
