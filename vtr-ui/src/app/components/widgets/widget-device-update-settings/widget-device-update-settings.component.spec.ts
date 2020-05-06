import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetDeviceUpdateSettingsComponent } from './widget-device-update-settings.component';

xdescribe('WidgetDeviceUpdateSettingsComponent', () => {
	let component: WidgetDeviceUpdateSettingsComponent;
	let fixture: ComponentFixture<WidgetDeviceUpdateSettingsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WidgetDeviceUpdateSettingsComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WidgetDeviceUpdateSettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
