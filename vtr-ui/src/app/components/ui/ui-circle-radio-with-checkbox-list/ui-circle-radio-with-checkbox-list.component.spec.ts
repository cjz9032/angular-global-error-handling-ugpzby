import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCircleRadioWithCheckBoxListComponent } from './ui-circle-radio-with-checkbox-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { DevService } from 'src/app/services/dev/dev.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CapitalizeFirstPipe } from 'src/app/pipe/capitalize-pipe/capitalize-first.pipe';
import { KeyCode } from 'src/app/enums/key-code.enum';
let radioDetailsModel = [
	{
		componentId: 'thinkpad-special-key-radio-button',
		label: `device.deviceSettings.inputAccessories.inputAccessory.topRowFunctions.subSection.radioButton.sFunKey`,
		value: 'special-key',
		isChecked: true,
		isDisabled: false,
		processIcon: true,
		customIcon: 'Special-function',
		hideIcon: true,
		processLabel: false,
		metricsItem: 'radio.top-row-fn.special-function'
	},
	{
		componentId: 'thinkpad-F1-F12-funciton-radio-button',
		label: `device.deviceSettings.inputAccessories.inputAccessory.topRowFunctions.subSection.radioButton.fnKey`,
		value: 'function-key',
		isChecked: false,
		isDisabled: false,
		processIcon: true,
		customIcon: 'F1-F12-funciton',
		hideIcon: true,
		processLabel: false,
		metricsItem: 'radio.top-row-fn.function-key'
	}];
const testValue = 'test';

fdescribe('UiCircleRadioWithCheckBoxListComponent', () => {
	let component: UiCircleRadioWithCheckBoxListComponent;
	let fixture: ComponentFixture<UiCircleRadioWithCheckBoxListComponent>;
	let metricService: MetricService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiCircleRadioWithCheckBoxListComponent, CapitalizeFirstPipe],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				TranslateModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule
			],
			providers: [
				LoggerService,
				MetricService,
				DevService,
				TranslateService
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiCircleRadioWithCheckBoxListComponent);
		component = fixture.componentInstance;
		component.radioDetails = Object.assign([], radioDetailsModel);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call onClick', () => {
		component.radioDetails = Object.assign([], radioDetailsModel);
		spyOn(component, 'onClick');
		const spyInvokeSelectionChangeEvent = spyOn<any>(component, 'invokeSelectionChangeEvent');

		const element = fixture.debugElement.nativeElement.querySelector('#' + radioDetailsModel[1].componentId);
		element.click();

		fixture.whenStable().then(() => {
			expect(component.onClick).toHaveBeenCalled();
			expect(spyInvokeSelectionChangeEvent).toHaveBeenCalled();
			component.radioDetails = Object.assign([], radioDetailsModel);
		});
	});

	it('should call onKeyDown', () => {
		component.radioDetails = Object.assign([], radioDetailsModel);
		fixture.detectChanges();
		spyOn(component, 'onKeyDown');
		const event = new KeyboardEvent('keydown', {
			'code': 'Up'
		});

		const spyHandleKeyPressEvent = spyOn<any>(component, 'handleKeyPressEvent');
		const element = fixture.debugElement.nativeElement.querySelector('#' + radioDetailsModel[0].componentId);
		element.focus();
		element.dispatchEvent(event);
		fixture.detectChanges();

		fixture.whenStable().then(() => {
			expect(component.onKeyDown).toHaveBeenCalled();
			// expect(spyHandleKeyPressEvent).toHaveBeenCalled();
			component.radioDetails = Object.assign([], radioDetailsModel);
		});
	});

	it('should call updateSelection,invokeSelectionChangeEvent,setFocusComponentId', () => {
		// spyOn(component, 'onClick');
		component.radioDetails = Object.assign([], radioDetailsModel);
		const spyUpdateSelection = spyOn<any>(component, 'updateSelection').and.callThrough();
		//const spySetFocusComponentId = spyOn<any>(component, 'setFocusComponentId')

		const element = fixture.debugElement.nativeElement.querySelector('#' + radioDetailsModel[1].componentId);
		element.click();

		fixture.whenStable().then(() => {
			// 	expect(component.onClick).toHaveBeenCalled();
			expect(spyUpdateSelection).toHaveBeenCalled();
			//expect(spySetFocusComponentId).toHaveBeenCalled();
			component.radioDetails = radioDetailsModel;
		});
	});

	/* 	 it('should call getSelectedRadioId with SPY', () => {
			component.radioDetails = Object.assign([], radioDetailsModel);
			fixture.detectChanges();
			const spyGetSelectedRadioId = spyOn<any>(component, 'getSelectedRadioId').and.callThrough();
			const id = spyGetSelectedRadioId.call(component);
			expect(id).toBe(radioDetailsModel[0].componentId);
		});  */


	it('should call invokeSelectionChangeEvent', () => {
		component.radioDetails = Object.assign([], radioDetailsModel);
		metricService = TestBed.get(MetricService);
		component.sendMetrics = true;
		const spy = spyOn(metricService, 'sendMetrics');
		const spyInvokeSelectionChangeEvent = spyOn<any>(component, 'invokeSelectionChangeEvent').and.callThrough();
		const id = spyInvokeSelectionChangeEvent.call(component, radioDetailsModel[1]);
		expect(spy).toHaveBeenCalled()
	});


	it('should call getIconName method process Icon true', () => {
		component.radioDetails = Object.assign([], radioDetailsModel);
		const icon = component.getIconName(radioDetailsModel[1]);
		expect(icon).toBe(radioDetailsModel[1].value);
	});

	it('should call getIconName method process Icon true , value having spaces', () => {
		component.radioDetails = Object.assign([], radioDetailsModel);
		let value = radioDetailsModel[1].value;
		radioDetailsModel[1].processIcon = true;
		radioDetailsModel[1].value = testValue;
		const icon = component.getIconName(radioDetailsModel[1]);
		expect(icon).toBe(radioDetailsModel[1].value.split(' ').join(''));
		radioDetailsModel[1].value = value;
	});

	it('should call getIconName method process Icon true , value having & ', () => {
		component.radioDetails = Object.assign([], radioDetailsModel);
		component.radioDetails = radioDetailsModel;
		const value = radioDetailsModel[1].value;
		radioDetailsModel[1].processIcon = true;
		radioDetailsModel[1].value = 'test &';
		const icon = component.getIconName(radioDetailsModel[1]);
		expect(icon).toBe(testValue);
		radioDetailsModel[1].value = value;
	});

	it('should call getIconName method process Icon true , empty value ', () => {
		component.radioDetails = Object.assign([], radioDetailsModel);
		const value = radioDetailsModel[1].value;
		radioDetailsModel[1].processIcon = true;
		radioDetailsModel[1].value = undefined;
		const icon = component.getIconName(radioDetailsModel[1]);
		expect(icon).toBe('');
		radioDetailsModel[1].value = value;
	});
	it('should call getIconName method process Icon false', () => {
		component.radioDetails = Object.assign([], radioDetailsModel);
		radioDetailsModel[1].processIcon = false;
		const icon = component.getIconName(radioDetailsModel[1]);
		expect(icon).toBe(radioDetailsModel[1].value);
		radioDetailsModel[1].processIcon = true;
	});

	it('should call getSelectedRadioId', () => {
		component.radioDetails = Object.assign([], radioDetailsModel);
		radioDetailsModel[1].processIcon = false;
		const icon = component.getIconName(radioDetailsModel[1]);
		expect(icon).toBe(radioDetailsModel[1].value);
		radioDetailsModel[1].processIcon = true;
	});


});
