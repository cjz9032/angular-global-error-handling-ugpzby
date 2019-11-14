import { TestBed } from '@angular/core/testing';

import { SmartStandbyService } from './smart-standby.service';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { CommonService } from '../common/common.service';

fdescribe('SmartStandbyService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		providers: [TranslateStore, CommonService],
		imports: [TranslationModule.forChild()]
	}));

	it('should be created', () => {
		const ssbService: SmartStandbyService = TestBed.get(SmartStandbyService);
		const commonService: CommonService = TestBed.get(CommonService);
		expect(ssbService).toBeTruthy();
		expect(commonService).toBeTruthy();
	});
});
