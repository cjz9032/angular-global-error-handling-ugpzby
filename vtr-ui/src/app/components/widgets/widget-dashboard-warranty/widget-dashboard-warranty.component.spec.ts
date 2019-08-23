import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDashboardWarrantyComponent } from './widget-dashboard-warranty.component';

xdescribe('WidgetDashboardWarrantyComponent', () => {
	let component: WidgetDashboardWarrantyComponent;
	let fixture: ComponentFixture<WidgetDashboardWarrantyComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ WidgetDashboardWarrantyComponent ]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetDashboardWarrantyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
