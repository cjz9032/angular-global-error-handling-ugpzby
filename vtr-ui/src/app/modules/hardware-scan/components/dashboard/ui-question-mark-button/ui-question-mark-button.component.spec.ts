import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UiQuestionMarkButtonComponent } from './ui-question-mark-button.component';

fdescribe('UiQuestionMarkButtonComponent', () => {
	let component: UiQuestionMarkButtonComponent;
	let fixture: ComponentFixture<UiQuestionMarkButtonComponent>;
	let debugComponent: DebugElement;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ UiQuestionMarkButtonComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiQuestionMarkButtonComponent);
		component = fixture.componentInstance;
		component.ariaLabel = undefined;
		component.componentId = 'ui-question-mark-button-example';
		component.isGray = false;
		component.tabIndex = 0;
		fixture.detectChanges();
		debugComponent = fixture.debugElement.query(By.css(`#${component.componentId}-tooltip`));
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should test clickEvent emitter onClickEvent method', () => {
		spyOn(component.clickEvent, 'emit').and.callThrough();
		component.onClickEvent(new Event('click'));
		expect(component.clickEvent.emit).toHaveBeenCalled();
	});

	it('should test blurEvent emitter onBlurEvent method', () => {
		spyOn(component.blurEvent, 'emit').and.callThrough();
		component.onBlurEvent(new Event('blur'));
		expect(component.blurEvent.emit).toHaveBeenCalled();
	});

	it('should call onClickEvent on click event', () => {
		spyOn(component, 'onClickEvent');

		const questionMark = debugComponent.nativeElement;
		questionMark.dispatchEvent(new Event('click'));

		expect(component.onClickEvent).toHaveBeenCalled();
	});

	it('should call onBlurEvent on blur event', () => {
		spyOn(component, 'onBlurEvent');

		const questionMark = debugComponent.nativeElement;
		questionMark.dispatchEvent(new Event('blur'));

		expect(component.onBlurEvent).toHaveBeenCalled();
	});

	it('Color should me $menu_hover', () => {
		const questionMarkBlueColor = 'rgb(74, 129, 253)';
		const questionMark = debugComponent.nativeElement;
		const result = window.getComputedStyle(questionMark).color;
		expect(result).toEqual(questionMarkBlueColor);
	});
});
