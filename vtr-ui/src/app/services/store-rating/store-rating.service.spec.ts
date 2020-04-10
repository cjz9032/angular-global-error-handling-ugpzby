import { TestBed } from '@angular/core/testing';

import { StoreRatingService } from './store-rating.service';

describe('StoreRatingService', () => {
	let service: StoreRatingService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(StoreRatingService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
