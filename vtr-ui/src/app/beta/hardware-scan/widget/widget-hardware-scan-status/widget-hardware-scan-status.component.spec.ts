import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetHardwareScanStatusComponent } from './widget-hardware-scan-status.component';

xdescribe('WidgetHardwareScanStatusComponent', () => {
	let component: WidgetHardwareScanStatusComponent;
	let fixture: ComponentFixture<WidgetHardwareScanStatusComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetHardwareScanStatusComponent]
		})
			.compileComponents();
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
