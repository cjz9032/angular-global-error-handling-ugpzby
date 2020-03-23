import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetEnergyStarComponent } from './widget-energy-star.component';

describe('WidgetEnergyStarComponent', () => {
	let component: WidgetEnergyStarComponent;
	let fixture: ComponentFixture<WidgetEnergyStarComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetEnergyStarComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetEnergyStarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
