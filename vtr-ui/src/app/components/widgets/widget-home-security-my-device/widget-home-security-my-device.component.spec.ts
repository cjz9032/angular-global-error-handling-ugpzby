import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetHomeSecurityMyDeviceComponent } from './widget-home-security-my-device.component';

describe('WidgetHomeSecurityMyDeviceComponent', () => {
	let component: WidgetHomeSecurityMyDeviceComponent;
	let fixture: ComponentFixture<WidgetHomeSecurityMyDeviceComponent>;

	beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ WidgetHomeSecurityMyDeviceComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetHomeSecurityMyDeviceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
