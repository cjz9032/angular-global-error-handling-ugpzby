import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpageDeviceSettingsDisplayComponent } from './subpage-device-settings-display.component';
import { UiHeaderSubpageComponent } from 'src/app/components/ui/ui-header-subpage/ui-header-subpage.component';
import { ContainerCollapsibleComponent } from 'src/app/components/container-collapsible/container-collapsible.component';
import { UiRowSwitchComponent } from 'src/app/components/ui/ui-row-switch/ui-row-switch.component';
import { EyeCareModeComponent } from 'src/app/components/display/eye-care-mode/eye-care-mode.component';
import { UiRectangleRadioComponent } from 'src/app/components/ui/ui-rectangle-radio/ui-rectangle-radio.component';
import { CameraControlComponent } from 'src/app/components/camera-control/camera-control.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('SubpageDeviceSettingsDisplayComponent', () => {
	let component: SubpageDeviceSettingsDisplayComponent;
	let fixture: ComponentFixture<SubpageDeviceSettingsDisplayComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				FontAwesomeModule
			],
			declarations: [
				SubpageDeviceSettingsDisplayComponent,
				UiHeaderSubpageComponent,
				ContainerCollapsibleComponent,
				UiRowSwitchComponent,
				EyeCareModeComponent,
				UiRectangleRadioComponent,
				CameraControlComponent

			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(
			SubpageDeviceSettingsDisplayComponent
		);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
