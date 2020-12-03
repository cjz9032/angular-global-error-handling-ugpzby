import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WidgetWarrantyComponent } from './widget-warranty.component';

xdescribe('WidgetWarrantyComponent', () => {
	let component: WidgetWarrantyComponent;
	let fixture: ComponentFixture<WidgetWarrantyComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetWarrantyComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetWarrantyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
