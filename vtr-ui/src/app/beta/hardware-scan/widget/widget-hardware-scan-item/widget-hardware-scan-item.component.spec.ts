import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetHardwareScanItemComponent } from './widget-hardware-scan-item.component';

describe('WidgetDeviceHardwareScanItemComponent', () => {
	let component: WidgetHardwareScanItemComponent;
	let fixture: ComponentFixture<WidgetHardwareScanItemComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetHardwareScanItemComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetHardwareScanItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
