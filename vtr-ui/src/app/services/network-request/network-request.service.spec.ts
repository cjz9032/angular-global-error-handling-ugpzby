import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { NetworkRequestService } from './network-request.service';

describe('NetworkRequestService', () => {
	let service: NetworkRequestService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
		});
		service = TestBed.inject(NetworkRequestService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
