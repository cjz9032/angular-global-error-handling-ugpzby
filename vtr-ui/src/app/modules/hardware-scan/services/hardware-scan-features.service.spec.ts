import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HardwareScanFeatures } from './hardware-scan-features.service';

describe('HardwareScanFeatures', () => {
	let service: HardwareScanFeatures;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ HttpClientModule ],
			providers: [ HttpClientModule ]
		});
		service = TestBed.inject(HardwareScanFeatures);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
