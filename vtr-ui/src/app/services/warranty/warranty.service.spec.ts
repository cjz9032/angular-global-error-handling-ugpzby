import { TestBed } from '@angular/core/testing';

import { WarrantyService } from './warranty.service';

describe('WarrantyService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: WarrantyService = TestBed.get(WarrantyService);
		expect(service).toBeTruthy();
	});
});
