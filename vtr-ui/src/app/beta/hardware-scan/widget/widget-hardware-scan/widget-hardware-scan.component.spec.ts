import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetHardwareScanComponent } from './widget-hardware-scan.component';

xdescribe('WidgetHardwareScanComponent', () => {
	let component: WidgetHardwareScanComponent;
	let fixture: ComponentFixture<WidgetHardwareScanComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetHardwareScanComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetHardwareScanComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
