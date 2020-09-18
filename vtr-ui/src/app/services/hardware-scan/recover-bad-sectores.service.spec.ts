import { TestBed } from '@angular/core/testing';

import { RecoverBadSectoresService } from './recover-bad-sectores.service';

describe('RecoverBadSectoresService', () => {
	let service: RecoverBadSectoresService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(RecoverBadSectoresService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
