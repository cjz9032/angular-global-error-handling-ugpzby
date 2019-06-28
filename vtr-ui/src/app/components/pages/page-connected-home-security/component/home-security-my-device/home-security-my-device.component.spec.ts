import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSecurityMyDeviceComponent } from './home-security-my-device.component';

describe('HomeSecurityMyDeviceComponent', () => {
	let component: HomeSecurityMyDeviceComponent;
	let fixture: ComponentFixture<HomeSecurityMyDeviceComponent>;

	beforeEach(async(() => {
	TestBed.configureTestingModule({
		declarations: [ HomeSecurityMyDeviceComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HomeSecurityMyDeviceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
