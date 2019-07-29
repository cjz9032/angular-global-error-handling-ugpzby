import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiApsSliderComponent } from './ui-aps-slider.component';

xdescribe('UiApsSliderComponent', () => {
	let component: UiApsSliderComponent;
	let fixture: ComponentFixture<UiApsSliderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UiApsSliderComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiApsSliderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
