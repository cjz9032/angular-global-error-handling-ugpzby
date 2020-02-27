import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { UiApsSliderComponent } from './ui-aps-slider.component';
import { ChangeContext, PointerType } from 'ng5-slider';

describe('UiApsSliderComponent', () => {
	let component: UiApsSliderComponent;
	let fixture: ComponentFixture<UiApsSliderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [UiApsSliderComponent]
		}).compileComponents();
	}));

	it('should create', () => {
		fixture = TestBed.createComponent(UiApsSliderComponent);
		component = fixture.componentInstance;
		component.stepsArray = [1, 2]
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should call onValueChange', () => {
		const event$: ChangeContext = {
			value: 2,
			highValue: 5,
			pointerType: PointerType.Max
		}
		fixture = TestBed.createComponent(UiApsSliderComponent);
		component = fixture.componentInstance;
		const spy = spyOn(component['valueChange'], 'emit')
		component.onValueChange(event$)
		expect(spy).toHaveBeenCalled()
	});

	it('should call onChange', () => {
		const event$: ChangeContext = {
			value: 2,
			highValue: 5,
			pointerType: PointerType.Max
		}
		fixture = TestBed.createComponent(UiApsSliderComponent);
		component = fixture.componentInstance;
		const spy = spyOn(component['change'], 'emit')
		component.onChange(event$)
		expect(spy).toHaveBeenCalled()
	});

	// it('should call onSliderChanged', () => {
	// 	const event: any = {event: 'click'}
	// 	fixture = TestBed.createComponent(UiApsSliderComponent);
	// 	component = fixture.componentInstance;
	// 	const spy = spyOn(console, 'log')
	// 	component.onSliderChanged(event)
	// 	expect(spy).toHaveBeenCalled()
	// });

	it('should call dragEnd', () => {
		fixture = TestBed.createComponent(UiApsSliderComponent);
		component = fixture.componentInstance;
		const spy = spyOn(component['valueChangeEnd'], 'emit')
		component.dragEnd()
		expect(spy).toHaveBeenCalled()
	});
});
