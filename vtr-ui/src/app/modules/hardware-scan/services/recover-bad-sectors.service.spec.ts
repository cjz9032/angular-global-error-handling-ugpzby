import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { HardwareScanTestResult } from 'src/app/enums/hardware-scan-test-result.enum';
import { DevService } from '../../../services/dev/dev.service';
import { RecoverBadSectorsService } from './recover-bad-sectors.service';

describe('RecoverBadSectorsService', () => {
	let service: RecoverBadSectorsService;
	const resultTitlePass = {
		resultModule: HardwareScanTestResult.Pass,
	};

	const resultTitleCancelled = {
		resultModule: HardwareScanTestResult.Cancelled,
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ TranslateModule.forRoot(), HttpClientModule ],
			providers: [ NgbActiveModal, HttpClientModule, DevService ]
		});
		service = TestBed.inject(RecoverBadSectorsService);
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

	it('Validate openRecoverBadSectorsModal call', () => {
		const spy = spyOn(service, 'openRecoverBadSectorsModal');

		service.openRecoverBadSectorsModal();
		expect(spy).toHaveBeenCalled();
	});
});
