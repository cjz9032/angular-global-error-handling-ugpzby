import { WidgetDashboardWarrantyComponent } from './widget-dashboard-warranty.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

xdescribe('WidgetDashboardWarrantyComponent', () => {
	let component: WidgetDashboardWarrantyComponent;
	let fixture: ComponentFixture<WidgetDashboardWarrantyComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetDashboardWarrantyComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetDashboardWarrantyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
