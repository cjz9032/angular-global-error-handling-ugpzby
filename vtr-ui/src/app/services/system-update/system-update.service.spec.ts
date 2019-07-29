import { TestBed } from '@angular/core/testing';

import { SystemUpdateService } from './system-update.service';

xdescribe('SystemUpdateService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: SystemUpdateService = TestBed.get(SystemUpdateService);
		expect(service).toBeTruthy();
	});
});
