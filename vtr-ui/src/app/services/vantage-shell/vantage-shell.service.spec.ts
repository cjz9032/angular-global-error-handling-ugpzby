import { TestBed } from '@angular/core/testing';

import { VantageShellService } from './vantage-shell.service';

xdescribe('VantageShellService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: VantageShellService = TestBed.get(VantageShellService);
		expect(service).toBeTruthy();
	});
});
