import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CapitalizeFirstPipe } from 'src/app/pipe/capitalize-pipe/capitalize-first.pipe';
import { DevService } from 'src/app/services/dev/dev.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { UiCircleRadioWithCheckBoxListComponent } from './ui-circle-radio-with-checkbox-list.component';
import { By } from '@angular/platform-browser';

const radioDetailsModel = [
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
		metricsItem: 'radio.top-row-fn.special-function',
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
		metricsItem: 'radio.top-row-fn.function-key',
	},
];
const testValue = 'test';
const groupName = 'groupName';
describe('UiCircleRadioWithCheckBoxListComponent', () => {
	let component: UiCircleRadioWithCheckBoxListComponent;
	let fixture: ComponentFixture<UiCircleRadioWithCheckBoxListComponent>;
	let metricService: MetricService;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiCircleRadioWithCheckBoxListComponent, CapitalizeFirstPipe],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
			providers: [LoggerService, MetricService, DevService, TranslateService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiCircleRadioWithCheckBoxListComponent);
		component = fixture.componentInstance;
		component.radioDetails = Object.assign([], radioDetailsModel);
		component.groupName = groupName;
		fixture.detectChanges();
	});

	it('UiCircleRadioWithCheckBoxListComponent  :: should  create', () => {
		expect(component).toBeTruthy();
	});

	it('UiCircleRadioWithCheckBoxListComponent  :: should  call onClick', () => {
		fixture = TestBed.createComponent(UiCircleRadioWithCheckBoxListComponent);
		component = fixture.componentInstance;
		component.radioDetails = Object.assign([], radioDetailsModel);
		component.groupName = groupName;
		fixture.detectChanges();

		const spyInvokeSelectionChangeEvent = spyOn<any>(component, 'invokeSelectionChangeEvent');
		const spySetFocusComponentId = spyOn<any>(component, 'setFocusComponentId');

		const options: DebugElement[] = fixture.debugElement.queryAll(
			By.css('[role=radio][aria-disabled=false]')
		);
		const secondOption: HTMLInputElement = options[1].nativeElement;
		secondOption.click();

		// expect(component.onClick).toHaveBeenCalled();
		// expect(spyUpdateSelection).toHaveBeenCalled();
		expect(spyInvokeSelectionChangeEvent).toHaveBeenCalled();
		expect(spySetFocusComponentId).toHaveBeenCalled();
	});

	it('UiCircleRadioWithCheckBoxListComponent ::  UiCircleRadioWithCheckBoxListComponent  :: should  call onKeyDown', () => {
		fixture = TestBed.createComponent(UiCircleRadioWithCheckBoxListComponent);
		component = fixture.componentInstance;
		component.radioDetails = Object.assign([], radioDetailsModel);
		component.groupName = groupName;
		fixture.detectChanges();

		// const spyKeyDown = spyOn(component, 'onKeyDown');
		const spyHandleKeyPressEvent = spyOn<any>(component, 'handleKeyPressEvent');
		const spySetFocusComponentId = spyOn<any>(component, 'setFocusComponentId');

		const options: DebugElement[] = fixture.debugElement.queryAll(By.css('[role=radiogroup]'));
		const firstOption: HTMLElement = options[0].nativeElement;
		// fixture.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
		// secondOption.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
		// firstOption.focus();
		const event = new KeyboardEvent('keydown', {
			bubbles: true,
			cancelable: true,
			key: 'up',
			shiftKey: true,
			code: '38',
		});
		firstOption.dispatchEvent(event);

		// expect(component.onKeyDown).toHaveBeenCalled();
		// expect(spyHandleKeyPressEvent).toHaveBeenCalled();
		expect(spySetFocusComponentId).toHaveBeenCalled();
	});

	it('UiCircleRadioWithCheckBoxListComponent  :: should  call invokeSelectionChangeEvent', () => {
		fixture = TestBed.createComponent(UiCircleRadioWithCheckBoxListComponent);
		component = fixture.componentInstance;
		component.radioDetails = Object.assign([], radioDetailsModel);
		component.groupName = groupName;
		metricService = TestBed.inject(MetricService);
		component.sendMetrics = true;
		fixture.detectChanges();

		const spy = spyOn(metricService, 'sendMetrics');
		const spyInvokeSelectionChangeEvent = spyOn<any>(
			component,
			'invokeSelectionChangeEvent'
		).and.callThrough();
		const id = spyInvokeSelectionChangeEvent.call(component, radioDetailsModel[1]);
		expect(spy).toHaveBeenCalled();
	});

	it('UiCircleRadioWithCheckBoxListComponent  :: should  call getIconName method process Icon true', () => {
		component.radioDetails = Object.assign([], radioDetailsModel);
		const icon = component.getIconName(radioDetailsModel[1]);
		expect(icon).toBe(radioDetailsModel[1].value);
	});

	it('UiCircleRadioWithCheckBoxListComponent  :: should  call getIconName method process Icon true , value having spaces', () => {
		component.radioDetails = Object.assign([], radioDetailsModel);
		const value = radioDetailsModel[1].value;
		radioDetailsModel[1].processIcon = true;
		radioDetailsModel[1].value = testValue;
		const icon = component.getIconName(radioDetailsModel[1]);
		expect(icon).toBe(radioDetailsModel[1].value.split(' ').join(''));
		radioDetailsModel[1].value = value;
	});

	it('UiCircleRadioWithCheckBoxListComponent  :: should  call getIconName method process Icon true , value having & ', () => {
		component.radioDetails = Object.assign([], radioDetailsModel);
		component.radioDetails = radioDetailsModel;
		const value = radioDetailsModel[1].value;
		radioDetailsModel[1].processIcon = true;
		radioDetailsModel[1].value = 'test &';
		const icon = component.getIconName(radioDetailsModel[1]);
		expect(icon).toBe(testValue);
		radioDetailsModel[1].value = value;
	});

	it('UiCircleRadioWithCheckBoxListComponent  :: should  call getIconName method process Icon true , empty value ', () => {
		component.radioDetails = Object.assign([], radioDetailsModel);
		const value = radioDetailsModel[1].value;
		radioDetailsModel[1].processIcon = true;
		radioDetailsModel[1].value = undefined;
		const icon = component.getIconName(radioDetailsModel[1]);
		expect(icon).toBe('');
		radioDetailsModel[1].value = value;
	});
	it('UiCircleRadioWithCheckBoxListComponent  :: should  call getIconName method process Icon false', () => {
		component.radioDetails = Object.assign([], radioDetailsModel);
		radioDetailsModel[1].processIcon = false;
		const icon = component.getIconName(radioDetailsModel[1]);
		expect(icon).toBe(radioDetailsModel[1].value);
		radioDetailsModel[1].processIcon = true;
	});

	it('UiCircleRadioWithCheckBoxListComponent  :: should  call getSelectedRadioId', () => {
		component.radioDetails = Object.assign([], radioDetailsModel);
		radioDetailsModel[1].processIcon = false;
		const icon = component.getIconName(radioDetailsModel[1]);
		expect(icon).toBe(radioDetailsModel[1].value);
		radioDetailsModel[1].processIcon = true;
	});
});
