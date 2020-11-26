import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetWarrantyComponent } from './widget-warranty.component';

xdescribe('WidgetWarrantyComponent', () => {
	let component: WidgetWarrantyComponent;
	let fixture: ComponentFixture<WidgetWarrantyComponent>;

	beforeEach(async(() => {
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
