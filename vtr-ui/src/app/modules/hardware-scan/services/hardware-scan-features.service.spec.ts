import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HardwareScanFeaturesService } from './hardware-scan-features.service';

describe('HardwareScanFeaturesService', () => {
	let service: HardwareScanFeaturesService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
			providers: [HttpClientModule],
		});
		service = TestBed.inject(HardwareScanFeaturesService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
