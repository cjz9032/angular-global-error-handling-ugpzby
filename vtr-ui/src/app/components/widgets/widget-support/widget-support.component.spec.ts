import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetSupportComponent } from './widget-support.component';

xdescribe('WidgetSupportComponent', () => {
	let component: WidgetSupportComponent;
	let fixture: ComponentFixture<WidgetSupportComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetSupportComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetSupportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
