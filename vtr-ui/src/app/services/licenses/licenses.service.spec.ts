import { TestBed } from '@angular/core/testing';

import { LicensesService } from './licenses.service';

xdescribe('LicensesService', () => {
	let service: LicensesService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(LicensesService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
