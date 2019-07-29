import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpageDeviceSettingsPowerComponent } from './subpage-device-settings-power.component';

xdescribe('SubpageDeviceSettingsPowerComponent', () => {
	let component: SubpageDeviceSettingsPowerComponent;
	let fixture: ComponentFixture<SubpageDeviceSettingsPowerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SubpageDeviceSettingsPowerComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsPowerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
