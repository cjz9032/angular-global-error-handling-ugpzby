import { TestBed } from '@angular/core/testing';

import { SelfSelectService } from './self-select.service';
import { HttpClientModule } from '@angular/common/http';

describe('SelfSelectService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		imports: [HttpClientModule]
	}));

	it('should be created', () => {
		const service: SelfSelectService = TestBed.get(SelfSelectService);
		expect(service).toBeTruthy();
	});
});
