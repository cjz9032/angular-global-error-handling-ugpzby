import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpageDeviceSettingsPowerComponent } from './subpage-device-settings-power.component';
import { UiHeaderSubpageComponent } from 'src/app/components/ui/ui-header-subpage/ui-header-subpage.component';
import { ContainerCollapsibleComponent } from 'src/app/components/container-collapsible/container-collapsible.component';
import { UiRowSwitchComponent } from 'src/app/components/ui/ui-row-switch/ui-row-switch.component';
import { UiRectangleRadioComponent } from 'src/app/components/ui/ui-rectangle-radio/ui-rectangle-radio.component';
import { BatteryChargeThresholdSettingsComponent } from 'src/app/components/battery/battery-charge-threshold-settings/battery-charge-threshold-settings.component';

describe('SubpageDeviceSettingsPowerComponent', () => {
	let component: SubpageDeviceSettingsPowerComponent;
	let fixture: ComponentFixture<SubpageDeviceSettingsPowerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				SubpageDeviceSettingsPowerComponent,
				UiHeaderSubpageComponent,
				ContainerCollapsibleComponent,
				UiRowSwitchComponent,
				UiRectangleRadioComponent,
				BatteryChargeThresholdSettingsComponent
			]
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
