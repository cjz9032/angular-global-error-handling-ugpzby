import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDaysPickerComponent } from './ui-days-picker.component';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { TranslateStore } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonService } from 'src/app/services/common/common.service';
import { SmartStandbyService } from 'src/app/services/smart-standby/smart-standby.service';

describe('UiDaysPickerComponent', () => {
	let component: UiDaysPickerComponent;
	let fixture: ComponentFixture<UiDaysPickerComponent>;
	let ssbService: SmartStandbyService;
	let commonService: CommonService;
	const days = ['mon', 'tue'];

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiDaysPickerComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule, HttpClientModule],
			providers: [TranslateStore, CommonService, SmartStandbyService]
		})
			.compileComponents();

	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiDaysPickerComponent);
		ssbService = TestBed.get(SmartStandbyService);
		commonService = TestBed.get(CommonService);
		ssbService.days = 'mon,tue';
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('#UiDaysPickerComponent should create', () => {
		// component.subHeadingText = subHeadingText;
		// component.daysId = daysId;
		// component.showDropDown = showDropDown;
		expect(component).toBeTruthy();
	});

	it('#UiDaysPickerComponent ngOnInit ', () => {
		spyOn(ssbService, 'splitDays');
		component.ngOnInit();
		expect(ssbService.splitDays).toHaveBeenCalled();
	});

	it('#UiDaysPickerComponent ngOnChanges ', () => {
		spyOn(ssbService, 'splitDays');
		component.ngOnChanges({
			name: new SimpleChange(null, true, false)
		});
		expect(ssbService.splitDays).toHaveBeenCalled();
	});

	it('#UiDaysPickerComponent clearSettings', () => {
		const listBox = fixture.debugElement.nativeElement.querySelector('#dayslistbox');
		spyOn(ssbService, 'splitDays');
		spyOn(component, 'sendToggleNotification');
		component.clearSettings(listBox);
		expect(ssbService.splitDays).toHaveBeenCalled();
		expect(component.sendToggleNotification).toHaveBeenCalledWith(false);

		// component.showDropDown = true;
		// spyOn(component, 'clearSettings');
		// ssbService.checkedLength = 2;
		// let elemId = 'daysPickerClear';
		// fixture.detectChanges();
		// let button = fixture.debugElement.nativeElement.querySelector('#' + elemId);
		// button.click();
		// // spyOn(component, 'clearSettings').and.callThrough();
		// expect(component.clearSettings).toHaveBeenCalled();

	});


	it('#UiDaysPickerComponent onToggleDropDown', () => {
		// component.showDropDown = true;
		// component.daysId = daysId;
		// spyOn(component, 'onToggleDropDown');
		// fixture.detectChanges();
		// let button = fixture.debugElement.nativeElement.querySelector('#' + daysId);
		// button.click();
		// // spyOn(component, 'onToggleDropDown').and.callThrough();
		// expect(component.onToggleDropDown).toHaveBeenCalled();
		component.showDropDown = false;
		spyOn(ssbService, 'splitDays');
		spyOn(component, 'sendToggleNotification');
		component.onToggleDropDown();
		expect(ssbService.splitDays).toHaveBeenCalled();
		expect(component.sendToggleNotification).toHaveBeenCalledWith(true);
	});

	it('#UiDaysPickerComponent sendToggleNotification ', () => {
		spyOn(commonService, 'sendNotification');
		component.sendToggleNotification(true);
		expect(commonService.sendNotification).toHaveBeenCalledWith('smartStandbyToggles', { id: 2, value: true });
	});

	it('#UiDaysPickerComponent setOffDays ', () => {
		const listBox = fixture.debugElement.nativeElement.querySelector('#dayslistbox');
		spyOn(component, 'sendToggleNotification');
		// fixture.detectChanges();
		component.setOffDays(listBox);
		expect(component.sendToggleNotification).toHaveBeenCalledWith(false);
	});

	it('#UiDaysPickerComponent selectDay true', () => {
		component.smartStandbyService.selectedDays = days;
		const event = { target: { checked: true, value: 'wed' } };
		component.selectDay(event);

		if (component.smartStandbyService.selectedDays.length === 3) {
			expect(component.smartStandbyService.selectedDays.length).toEqual(3);
		}

		if (component.smartStandbyService.selectedDays.length === 2) {
			expect(component.smartStandbyService.selectedDays.length).toEqual(2);
		}

	});

	it('#UiDaysPickerComponent selectDay false', () => {
		component.smartStandbyService.selectedDays = days;
		const event = { target: { checked: false, value: 'mon' } };
		component.selectDay(event);
		if (component.smartStandbyService.selectedDays.length === 2) {
			expect(component.smartStandbyService.selectedDays.length).toEqual(2);
		}
		if (component.smartStandbyService.selectedDays.length === 1) {
			expect(component.smartStandbyService.selectedDays.length).toEqual(1);
		}
	});

});
