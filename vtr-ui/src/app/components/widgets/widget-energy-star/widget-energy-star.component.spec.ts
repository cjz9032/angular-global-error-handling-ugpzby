import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WidgetEnergyStarComponent } from './widget-energy-star.component';

xdescribe('WidgetEnergyStarComponent', () => {
	let component: WidgetEnergyStarComponent;
	let fixture: ComponentFixture<WidgetEnergyStarComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetEnergyStarComponent],
		}).compileComponents();
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
