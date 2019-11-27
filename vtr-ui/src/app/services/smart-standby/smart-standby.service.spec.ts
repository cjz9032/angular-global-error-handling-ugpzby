import { TestBed } from '@angular/core/testing';

import { SmartStandbyService } from './smart-standby.service';
import { TranslateService, TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { CommonService } from '../common/common.service';
import { AllDays } from 'src/app/data-models/device/all-days.model';
import { DaysOfWeek } from 'src/app/enums/days-of-week.enum';

describe('SmartStandbyService', () => {

	let days = 'sun,mon,tue,wed,thurs,fri,sat';

	beforeEach(() => TestBed.configureTestingModule({
		providers: [SmartStandbyService, TranslateStore, CommonService],
		imports: [TranslationModule.forChild()]
	}));

	describe(':', () => {

		function setup() {
			//const fixture = TestBed.createComponent(ModalBatteryChargeThresholdComponent);
			//const component = fixture.debugElement.componentInstance;
			const smartStandbyService = TestBed.get(SmartStandbyService);
        	const commonService = TestBed.get(CommonService);

			return { smartStandbyService, commonService };
		}

		it('service should create', ()=> {
			const {smartStandbyService, commonService} = setup();	
			expect(smartStandbyService).toBeTruthy();
			expect(commonService).toBeTruthy();
		});

		it('should call splitDays', ()=> {
			const {smartStandbyService} = setup();
			//days = 'mon,tue,wed,thurs,fri,sat,sun';
			smartStandbyService.days = days;
			smartStandbyService.splitDays();
			expect(smartStandbyService.selectedDays).not.toBe([]);

			smartStandbyService.days = 'mon,tue,wed,thurs,fri';
			smartStandbyService.splitDays();
			expect(smartStandbyService.selectedDays).not.toBe([]);

			smartStandbyService.days = 'sat,sun';
			smartStandbyService.splitDays();
			expect(smartStandbyService.selectedDays).not.toBe([]);

			smartStandbyService.days = 'fri,sat,sun';
			smartStandbyService.splitDays();
			expect(smartStandbyService.selectedDays).not.toBe([]);

			smartStandbyService.days = 'mon';
			smartStandbyService.splitDays();
			expect(smartStandbyService.selectedDays).not.toBe([]);

			smartStandbyService.days = 'sat';
			smartStandbyService.splitDays();
			expect(smartStandbyService.selectedDays).not.toBe([]);

			smartStandbyService.days = '';
			smartStandbyService.splitDays();
			expect(smartStandbyService.selectedDays).toEqual(['']);

		});

		it('should call splitDays weekendays', ()=> {
			const {smartStandbyService} = setup();
			//days = 'mon,tue,wed,thurs,fri,sat,sun';

			smartStandbyService.days = 'sat';
			smartStandbyService.splitDays();
			smartStandbyService.getSelectedDays(1);
			expect(smartStandbyService.selectedDays).not.toBe([]);

			smartStandbyService.days = 'sun';
			smartStandbyService.splitDays();
			smartStandbyService.getSelectedDays(1);
			expect(smartStandbyService.selectedDays).not.toBe([]);

			smartStandbyService.days = 'sun,mon';
			smartStandbyService.splitDays();
			smartStandbyService.getSelectedDays(2);
			expect(smartStandbyService.selectedDays).not.toBe([]);

			smartStandbyService.days = 'mon,tue';
			smartStandbyService.splitDays();
			smartStandbyService.getSelectedDays(2);
			expect(smartStandbyService.selectedDays).not.toBe([]);
		});




	});
});
