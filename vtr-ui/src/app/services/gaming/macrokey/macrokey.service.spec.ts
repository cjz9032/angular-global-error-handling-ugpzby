import { TestBed } from '@angular/core/testing';

import { MacrokeyService } from './macrokey.service';

xdescribe('MacrokeyService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: MacrokeyService = TestBed.get(MacrokeyService);
		expect(service).toBeTruthy();
	});
});
