import { TestBed } from '@angular/core/testing';
import { HardwareScanTestResult } from 'src/app/enums/hardware-scan-test-result.enum';
import { RecoverBadSectoresService } from './recover-bad-sectores.service';

describe('RecoverBadSectoresService', () => {
	let service: RecoverBadSectoresService;

	const resultTitlePass = {
		resultModule: HardwareScanTestResult.Pass,
	};

	const resultTitleCancelled = {
		resultModule: HardwareScanTestResult.Cancelled,
	};

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(RecoverBadSectoresService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('Validate getLastRecoverResultTitle result', () => {
		// Validate Pass value
		service.setRecoverResultItems(resultTitlePass);
		let result = service.getLastRecoverResultTitle();
		expect(result).toEqual(HardwareScanTestResult[HardwareScanTestResult.Pass]);

		// Validate Cancelled value
		service.setRecoverResultItems(resultTitleCancelled);
		result = service.getLastRecoverResultTitle();
		expect(result).toEqual(HardwareScanTestResult[HardwareScanTestResult.Cancelled]);
	});
});
