import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTimePickerComponent } from './ui-time-picker.component';
import { CommonService } from 'src/app/services/common/common.service';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule } from '@angular/common/http';
import { TranslateStore } from '@ngx-translate/core';
import { id } from 'inversify';

describe('UiTimePickerComponent', () => {
	let component: UiTimePickerComponent;
	let fixture: ComponentFixture<UiTimePickerComponent>;
	let commonService: CommonService;
	let time = '12:30';

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiTimePickerComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule, HttpClientModule],
			providers: [TranslateStore, CommonService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiTimePickerComponent);
		commonService = TestBed.get(CommonService);
		component = fixture.componentInstance;
		component.time = time;
		fixture.detectChanges();
	});

	it('#UiTimePickerComponent should create', () => {
		expect(component).toBeTruthy();
	});

	it('#UiTimePickerComponent ngOnChanges ', () => {
		spyOn(component, 'splitTime');
		component.ngOnChanges({
			name: new SimpleChange('1:00', '12:30', false)
		});
		expect(component.splitTime).toHaveBeenCalled();
		// expect(component.initiateBlock).toHaveBeenCalled();
	});

	it('#UiTimePickerComponent onToggleDropDown ', () => {
		spyOn(component, 'initiateBlock');
		spyOn(component, 'sendToggleNotification');
		component.showDropDown = false;
		component.onToggleDropDown();
		expect(component.initiateBlock).toHaveBeenCalled();
		expect(component.sendToggleNotification).toHaveBeenCalledWith(true);
	});



	/* 	it('#UiTimePickerComponent onToggleDropDown handleKBNavigations', () => {
			spyOn(component, 'onToggleDropDown');
			const event = { keyCode: 32 };
			component.handleKBNavigations(event);
			expect(component.onToggleDropDown).toHaveBeenCalled();
		}); */



	it('#UiTimePickerComponent sendToggleNotification true with id=dropcheck1 ', () => {
		spyOn(commonService, 'sendNotification');
		component.id = 'dropcheck1';
		component.sendToggleNotification(true);
		expect(commonService.sendNotification).toHaveBeenCalledWith('smartStandbyToggles', { id: 0, value: true });
	});

	it('#UiTimePickerComponent sendToggleNotification true with id=dropcheck2 ', () => {
		spyOn(commonService, 'sendNotification');
		component.id = 'dropcheck2';
		component.sendToggleNotification(true);
		expect(commonService.sendNotification).toHaveBeenCalledWith('smartStandbyToggles', { id: 1, value: true });
	});

	it('#UiTimePickerComponent setAmPm true', () => {
		spyOn(component, 'setAmPm');
		component.setAmPm(true);
		expect(component.copyAmPm).toBeTruthy();
		expect(component.setAmPm).toHaveBeenCalled();
	});

	it('#UiTimePickerComponent setAmPm ', () => {
		spyOn(component, 'setAmPm');
		component.setAmPm(true);
		expect(component.setAmPm).toHaveBeenCalled();
	});

	it('#UiTimePickerComponent setTimer copyAmPm false', () => {
		spyOn(component, 'sendToggleNotification');
		component.copyAmPm = 0;
		component.setTimer();
		expect(component.sendToggleNotification).toHaveBeenCalledWith(false);
	});

	it('#UiTimePickerComponent updateMinutes ', () => {
		spyOn(component, 'setTimerBlock');
		component.updateMinutes(true);
		expect(component.setTimerBlock).toHaveBeenCalled();
	});


	it('#UiTimePickerComponent updateHours ', () => {
		spyOn(component, 'setTimerBlock');
		component.updateHours(true);
		expect(component.setTimerBlock).toHaveBeenCalled();
	});


	it('#UiDaysPickerComponent clearSettings', () => {
		component.id = 'test';
		const listBox = fixture.debugElement.nativeElement.querySelector('#' + component.id);
		spyOn(component, 'sendToggleNotification');
		spyOn(component, 'initiateBlock');
		component.clearSettings();
		expect(component.sendToggleNotification).toHaveBeenCalledWith(false);
		expect(component.initiateBlock).toHaveBeenCalled();

	});

	it('#UiTimePickerComponent handleKBNavigations keycode 32 SPACE ', () => {
		spyOn(component, 'handleKBNavigations');
		const event = { keyCode: 32 };
		component.handleKBNavigations(event);
		expect(component.handleKBNavigations).toHaveBeenCalled();
		//expect(component.onToggleDropDown).toHaveBeenCalled();
	});

	it('#UiTimePickerComponent handleKBNavigations keycode 13 RETURN ', () => {
		spyOn(component, 'handleKBNavigations');
		const event = { keyCode: 32 };
		component.handleKBNavigations(event);

		expect(component.handleKBNavigations).toHaveBeenCalled();
	});

	it('#UiTimePickerComponent handleKBNavigations onToggleDropDown', () => {
		spyOn(component, 'onToggleDropDown');
		const event = { keyCode: 32 };
		component.handleKBNavigations(event);

		expect(component.onToggleDropDown).toHaveBeenCalled();
	});
});
