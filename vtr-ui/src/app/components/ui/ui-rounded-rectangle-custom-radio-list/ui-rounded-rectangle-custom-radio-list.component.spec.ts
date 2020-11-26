import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DevService } from 'src/app/services/dev/dev.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { MetricService } from 'src/app/services/metric/metrics.service';
import { UiRoundedRectangleCustomRadioListComponent } from './ui-rounded-rectangle-custom-radio-list.component';
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

describe('UiRoundedRectangleCustomRadioListComponent', () => {
	let component: UiRoundedRectangleCustomRadioListComponent;
	let fixture: ComponentFixture<UiRoundedRectangleCustomRadioListComponent>;
	let metricService: MetricService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiRoundedRectangleCustomRadioListComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
			providers: [LoggerService, MetricService, DevService, TranslateService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiRoundedRectangleCustomRadioListComponent);
		component = fixture.componentInstance;
		component.radioDetails = Object.assign([], radioDetailsModel);
		component.groupName = groupName;
		fixture.detectChanges();
	});

	it('UiRoundedRectangleCustomRadioListComponent ::  should create', () => {
		expect(component).toBeTruthy();
	});

	it('UiRoundedRectangleCustomRadioListComponent  :: should  call onClick', () => {
		fixture = TestBed.createComponent(UiRoundedRectangleCustomRadioListComponent);
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

	it('UiRoundedRectangleCustomRadioListComponent ::  should call onKeyDown', () => {
		fixture = TestBed.createComponent(UiRoundedRectangleCustomRadioListComponent);
		component = fixture.componentInstance;
		component.radioDetails = Object.assign([], radioDetailsModel);
		component.groupName = groupName;

		fixture.detectChanges();

		// const spyKeyDown = spyOn(component, 'onKeyDown');
		// const spyHandleKeyPressEvent = spyOn<any>(component, 'handleKeyPressEvent');
		const spySetFocusComponentId = spyOn<any>(component, 'setFocusComponentId');
		// const spyInvokeSelectionChangeEvent = spyOn<any>(component, 'invokeSelectionChangeEvent');
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
		// expect(spyInvokeSelectionChangeEvent).toHaveBeenCalled();
	});

	it('UiRoundedRectangleCustomRadioListComponent ::  should call invokeSelectionChangeEvent', () => {
		fixture = TestBed.createComponent(UiRoundedRectangleCustomRadioListComponent);
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

	/* it('UiRoundedRectangleCustomRadioListComponent ::  should call handleKeyPressEvent down arrow ', () => {
		fixture = TestBed.createComponent(UiRoundedRectangleCustomRadioListComponent);
		component = fixture.componentInstance;
		component.radioDetails = Object.assign([], radioDetailsModel);
		component.groupName = groupName;
		fixture.detectChanges();

		// const spyKeyDown = spyOn(component, 'onKeyDown');
		const spyInvokeSelectionChangeEvent = spyOn<any>(component, 'invokeSelectionChangeEvent');

		// const spySetFocusComponentId = spyOn<any>(component, 'setFocusComponentId');

		const options: DebugElement[] = fixture.debugElement.queryAll(By.css('[role=radiogroup]'));
		const firstOption: HTMLElement = options[0].nativeElement;
		// fixture.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
		// secondOption.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
		firstOption.focus();
		const event = new KeyboardEvent('keydown', {
			bubbles: true,
			cancelable: true,
			key: 'down',
			shiftKey: true,
			code: '40',
		});
		const spyHandleKeyPressEvent = spyOn<any>(component, 'handleKeyPressEvent').withArgs(event);
		spyHandleKeyPressEvent.and.callThrough();
		// firstOption.dispatchEvent(event);

		expect(spyInvokeSelectionChangeEvent).toHaveBeenCalled();
		// expect(spyHandleKeyPressEvent).toHaveBeenCalled();
		// expect(spySetFocusComponentId).toHaveBeenCalled();
	}); */

	/* it('UiRoundedRectangleCustomRadioListComponent ::  should call onRadioGroupFocus', () => {
		fixture = TestBed.createComponent(UiRoundedRectangleCustomRadioListComponent);
		component = fixture.componentInstance;
		component.radioDetails = Object.assign([], radioDetailsModel);
		component.groupName = groupName;
		const spyOnRadioGroupFocus = spyOn(component, 'onRadioGroupFocus');

		fixture.detectChanges();
		// const spySetFocusComponentId = spyOn<any>(component, 'setFocusComponentId');

		const radioGroup = fixture.debugElement.query(By.css('[role=radiogroup]'));

		// fixture.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
		// secondOption.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
		radioGroup.nativeElement.focus();

		expect(component.onRadioGroupFocus).toHaveBeenCalled();
		// expect(spySetFocusComponentId).toHaveBeenCalled();

	}); */
});
