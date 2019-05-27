import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpageDeviceSettingsSmartAssistComponent } from './subpage-device-settings-smart-assist.component';

describe('SubpageDeviceSettingsSmartAssistComponent', () => {
	let component: SubpageDeviceSettingsSmartAssistComponent;
	let fixture: ComponentFixture<SubpageDeviceSettingsSmartAssistComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SubpageDeviceSettingsSmartAssistComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsSmartAssistComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
