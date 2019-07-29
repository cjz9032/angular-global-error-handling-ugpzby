import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDeviceSettingsComponent } from './page-device-settings.component';

xdescribe('PageDeviceSettingsComponent', () => {
	let component: PageDeviceSettingsComponent;
	let fixture: ComponentFixture<PageDeviceSettingsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PageDeviceSettingsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PageDeviceSettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
