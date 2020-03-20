import { TestBed } from '@angular/core/testing';

import { WindowsVersionService } from './windows-version.service';

describe('WindowsVersionService', () => {
	let service: WindowsVersionService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(WindowsVersionService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
