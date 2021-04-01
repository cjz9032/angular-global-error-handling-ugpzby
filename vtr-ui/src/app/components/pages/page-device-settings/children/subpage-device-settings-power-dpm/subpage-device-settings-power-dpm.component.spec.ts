import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpageDeviceSettingsPowerDpmComponent } from './subpage-device-settings-power-dpm.component';
import { PowerDpmService } from 'src/app/services/power-dpm/power-dpm.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateStore } from '@ngx-translate/core';
import { PowerPlan } from 'src/app/data-models/dpm/power-plan.model';
import { AllPowerPlans } from 'src/app/data-models/dpm/all-power-plans.model';
import { of } from 'rxjs';

describe('SubpageDeviceSettingsPowerDpmComponent', () => {
	let component: SubpageDeviceSettingsPowerDpmComponent;
	let fixture: ComponentFixture<SubpageDeviceSettingsPowerDpmComponent>;
	let powerDpmService: PowerDpmService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SubpageDeviceSettingsPowerDpmComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule, HttpClientModule, RouterTestingModule],
			providers: [TranslateStore]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SubpageDeviceSettingsPowerDpmComponent);
		component = fixture.componentInstance;
		powerDpmService = fixture.debugElement.injector.get(PowerDpmService);
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should hide loading circle after getting power plan', () => {
		let mockAllPowerPlans = {
			activePowerPlan: 'Balanced'
		} as AllPowerPlans;
		spyOn(powerDpmService, 'getAllPowerPlansObs').and.returnValue(of(mockAllPowerPlans));
		fixture.detectChanges();
		expect(component.isLoading).toBeFalsy();
	});

	it('should show loading circle after getting null', () => {
		spyOn(powerDpmService, 'getAllPowerPlansObs').and.returnValue(of(null));
		fixture.detectChanges();
		expect(component.isLoading).toBeTruthy();
	});
});
