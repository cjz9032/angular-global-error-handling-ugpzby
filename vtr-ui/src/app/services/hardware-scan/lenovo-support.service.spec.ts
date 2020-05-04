import { TestBed } from '@angular/core/testing';

import { LenovoSupportService } from './lenovo-support.service';

describe('LenovoSupportService', () => {
	let service: LenovoSupportService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(LenovoSupportService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
