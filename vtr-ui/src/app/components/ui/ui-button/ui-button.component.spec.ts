import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiButtonComponent } from './ui-button.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MetricService } from 'src/app/services/metric/metrics.service';

describe('UiButtonComponent', () => {
	let component: UiButtonComponent;
	let fixture: ComponentFixture<UiButtonComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiButtonComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
			providers: [MetricService],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiButtonComponent);
		component = fixture.componentInstance;
		component.alreadyJoinGroup = 'groupNone';
		component.linkId = 'test';
		component.label = 'test';
		component.tooltipText = undefined;
		component.autoFocus = true;
		// component.href = 'http://www.test.com';
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call onClickButton', async(() => {
		fixture.detectChanges();
		spyOn(component, 'onClickButton');

		const button = fixture.debugElement.nativeElement.querySelector('button');
		button.click();

		fixture.whenStable().then(() => {
			expect(component.onClickButton).toHaveBeenCalled();
		});
	}));

	it('should call initTooltipText', () => {
		spyOn(component, 'initTooltipText');
		component.ngOnInit();
		expect(component.initTooltipText).toHaveBeenCalled();
	});

	it('should call initTooltipText with tooltipText empty ', () => {
		spyOn(component, 'initTooltipText');
		component.ngOnInit();
		expect(component.tooltipText).toEqual(component.label);
	});

	/* it('should call autoFocus', async(() => {

		let button = fixture.debugElement.nativeElement.querySelector('#' + component.linkId);
		spyOn(button, 'focus');
		component.ngAfterViewInit();
		fixture.whenStable().then(() => {
			expect(button.focus).toHaveBeenCalled();
		});
	})); */

	it('should test onClick emitter onClickButton method', () => {
		spyOn(component.onClick, 'emit').and.callThrough();
		component.onClickButton(new Event('click'));
		expect(component.onClick.emit).toHaveBeenCalled();
	});

	/* it('should test onClick emitter onClickButton with', () => {
		spyOn(component.onClick, 'emit').and.callThrough();
		component.onClickButton(new Event('click'));
		expect(component.onClick.emit).toHaveBeenCalled();
	}); */
});
