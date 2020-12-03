import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiSwitchTristateComponent } from './ui-switch-tristate.component';

xdescribe('UiSwitchTristateComponent', () => {
	let component: UiSwitchTristateComponent;
	let fixture: ComponentFixture<UiSwitchTristateComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UiSwitchTristateComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UiSwitchTristateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
