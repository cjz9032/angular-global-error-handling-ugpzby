
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DevService } from 'src/app/services/dev/dev.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { UiRoundedRectangleCustomRadioListComponent } from './ui-rounded-rectangle-custom-radio-list.component';

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

describe('UiRoundedRectangleCustomRadioListComponent', () => {
	let component: UiRoundedRectangleCustomRadioListComponent;
	let fixture: ComponentFixture<UiRoundedRectangleCustomRadioListComponent>;
	let metricService: MetricService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiRoundedRectangleCustomRadioListComponent],
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
		fixture = TestBed.createComponent(UiRoundedRectangleCustomRadioListComponent);
		component = fixture.componentInstance;
		component.radioDetails = Object.assign([], radioDetailsModel);
		fixture.detectChanges();
	});

	it('UiRoundedRectangleCustomRadioListComponent ::  should create', () => {
		expect(component).toBeTruthy();
	});

	it('UiRoundedRectangleCustomRadioListComponent ::  should call onClick', () => {
		component.radioDetails = Object.assign([], radioDetailsModel);
		spyOn(component, 'onClick');
		const spyInvokeSelectionChangeEvent = spyOn<any>(component, 'invokeSelectionChangeEvent');
		const spySetFocusComponentId = spyOn<any>(component, 'setFocusComponentId');

		const element = fixture.debugElement.nativeElement.querySelector('#' + radioDetailsModel[1].componentId);
		element.click();

		fixture.whenStable().then(() => {
			expect(component.onClick).toHaveBeenCalled();
			expect(spyInvokeSelectionChangeEvent).toHaveBeenCalled();
			expect(spySetFocusComponentId).toHaveBeenCalled();
			component.radioDetails = Object.assign([], radioDetailsModel);
		});
	});

	it('UiRoundedRectangleCustomRadioListComponent ::  should call onKeyDown', () => {
		component.radioDetails = Object.assign([], radioDetailsModel);
		fixture.detectChanges();
		spyOn(component, 'onKeyDown');
		const event = new KeyboardEvent('keydown', {
			'key': 'Up'
		});

		const spyHandleKeyPressEvent = spyOn<any>(component, 'handleKeyPressEvent');
		const element = fixture.debugElement.nativeElement.querySelector('#' + radioDetailsModel[0].componentId);
		element.focus();
		element.dispatchEvent(event);
		// fixture.detectChanges();

		fixture.whenStable().then(() => {
			expect(component.onKeyDown).toHaveBeenCalled();
			expect(spyHandleKeyPressEvent).toHaveBeenCalled();
			component.radioDetails = Object.assign([], radioDetailsModel);
		});
	});

	it('UiRoundedRectangleCustomRadioListComponent ::  should call updateSelection,invokeSelectionChangeEvent,setFocusComponentId', () => {
		// spyOn(component, 'onClick');
		component.radioDetails = Object.assign([], radioDetailsModel);
		const spyUpdateSelection = spyOn<any>(component, 'updateSelection');
		const spySetFocusComponentId = spyOn<any>(component, 'setFocusComponentId');

		const element = fixture.debugElement.nativeElement.querySelector('#' + radioDetailsModel[1].componentId);
		element.click();

		fixture.whenStable().then(() => {
			// 	expect(component.onClick).toHaveBeenCalled();
			expect(spyUpdateSelection).toHaveBeenCalled();
			expect(spySetFocusComponentId).toHaveBeenCalled();
			component.radioDetails = radioDetailsModel;
		});
	});

	it('UiRoundedRectangleCustomRadioListComponent ::  should call invokeSelectionChangeEvent', () => {
		component.radioDetails = Object.assign([], radioDetailsModel);
		metricService = TestBed.get(MetricService);
		component.sendMetrics = true;
		const spy = spyOn(metricService, 'sendMetrics');
		const spyInvokeSelectionChangeEvent = spyOn<any>(component, 'invokeSelectionChangeEvent').and.callThrough();
		const id = spyInvokeSelectionChangeEvent.call(component, radioDetailsModel[1]);
		expect(spy).toHaveBeenCalled()
	});

});
