import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiBrightnessSliderComponent } from './ui-brightness-slider.component';

describe('UiBrightnessSliderComponent', () => {
	let component: UiBrightnessSliderComponent;
	let fixture: ComponentFixture<UiBrightnessSliderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiBrightnessSliderComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiBrightnessSliderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should check dragEnd when event true', () => {
		const event=true;
		component.dragEnd(event);
		expect(component).toBeTruthy();
	});

	it('should check dragEnd when event false', () => {
		const event=false;
		component.dragEnd(event);
		expect(component).toBeTruthy();
	});

});
