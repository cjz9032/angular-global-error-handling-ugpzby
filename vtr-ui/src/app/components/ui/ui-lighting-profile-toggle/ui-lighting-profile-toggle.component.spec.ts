import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiLightingProfileToggleComponent } from './ui-lighting-profile-toggle.component';
import { NO_ERRORS_SCHEMA, Pipe } from '@angular/core';
import { GAMING_DATA } from './../../../../testing/gaming-data';

describe('UiLightingProfileToggleComponent', () => {
	let component: UiLightingProfileToggleComponent;
	let fixture: ComponentFixture<UiLightingProfileToggleComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [
				UiLightingProfileToggleComponent,
				GAMING_DATA.mockPipe({ name: 'translate' }),
				GAMING_DATA.mockPipe({ name: 'sanitize' }),
			],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();
		fixture = TestBed.createComponent(UiLightingProfileToggleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('Should set the profile', () => {
		component.setProfile({ target: { value: 1 } });
		expect(component.currentProfile).toBeUndefined();
	});
});
