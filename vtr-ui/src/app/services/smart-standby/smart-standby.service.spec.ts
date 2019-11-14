import { TestBed } from '@angular/core/testing';

import { SmartStandbyService } from './smart-standby.service';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';

describe('SmartStandbyService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		providers: [TranslateStore],
		imports: [TranslationModule.forChild()]
	}));

	it('should be created', () => {
		const service: SmartStandbyService = TestBed.get(SmartStandbyService);
		expect(service).toBeTruthy();
	});
});
