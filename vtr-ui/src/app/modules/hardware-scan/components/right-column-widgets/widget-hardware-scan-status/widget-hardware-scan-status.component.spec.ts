import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WidgetHardwareScanStatusComponent } from './widget-hardware-scan-status.component';

xdescribe('WidgetHardwareScanStatusComponent', () => {
	let component: WidgetHardwareScanStatusComponent;
	let fixture: ComponentFixture<WidgetHardwareScanStatusComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetHardwareScanStatusComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetHardwareScanStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
