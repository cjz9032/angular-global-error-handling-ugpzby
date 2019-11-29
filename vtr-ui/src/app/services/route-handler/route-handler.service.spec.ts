import { TestBed } from '@angular/core/testing';

import { RouteHandlerService } from './route-handler.service';

describe('RouteHandlerService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: RouteHandlerService = TestBed.get(RouteHandlerService);
		expect(service).toBeTruthy();
	});
});
