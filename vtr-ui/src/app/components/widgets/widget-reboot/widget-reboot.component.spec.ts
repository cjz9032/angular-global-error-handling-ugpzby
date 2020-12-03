import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WidgetRebootComponent } from './widget-reboot.component';

xdescribe('WidgetRebootComponent', () => {
	let component: WidgetRebootComponent;
	let fixture: ComponentFixture<WidgetRebootComponent>;

	beforeEach(waitForAsync(() => {
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
