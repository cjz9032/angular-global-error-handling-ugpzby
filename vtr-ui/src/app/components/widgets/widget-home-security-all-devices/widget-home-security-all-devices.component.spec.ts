import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetHomeSecurityAllDevicesComponent } from './widget-home-security-all-devices.component';

describe('WidgetHomeSecurityAllDevicesComponent', () => {
	let component: WidgetHomeSecurityAllDevicesComponent;
	let fixture: ComponentFixture<WidgetHomeSecurityAllDevicesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ WidgetHomeSecurityAllDevicesComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetHomeSecurityAllDevicesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
