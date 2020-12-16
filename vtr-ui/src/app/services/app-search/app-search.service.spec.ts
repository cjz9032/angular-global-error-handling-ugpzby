import { TestBed } from '@angular/core/testing';
import { AppSearchService } from './app-search.service';

describe('AppSearchService', () => {
	let service: AppSearchService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(AppSearchService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
