import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetRebootComponent } from './widget-reboot.component';

xdescribe('WidgetRebootComponent', () => {
	let component: WidgetRebootComponent;
	let fixture: ComponentFixture<WidgetRebootComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetRebootComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetRebootComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
