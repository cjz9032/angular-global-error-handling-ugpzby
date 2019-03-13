import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryChargeThresholdSettingsComponent } from './battery-charge-threshold-settings.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('BatteryChargeThresholdSettingsComponent', () => {
	let component: BatteryChargeThresholdSettingsComponent;
	let fixture: ComponentFixture<BatteryChargeThresholdSettingsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [FontAwesomeModule],
			declarations: [BatteryChargeThresholdSettingsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BatteryChargeThresholdSettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
