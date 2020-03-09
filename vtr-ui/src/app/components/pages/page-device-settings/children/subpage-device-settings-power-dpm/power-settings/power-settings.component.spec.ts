import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerSettingsComponent } from './power-settings.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateStore } from '@ngx-translate/core';
import { PowerDpmService } from 'src/app/services/power-dpm/power-dpm.service';
import { PowerPlan } from 'src/app/data-models/dpm/power-plan.model';
import { AllPowerPlans } from 'src/app/data-models/dpm/all-power-plans.model';
import { of } from 'rxjs';
import { DPMDropDownInterval } from 'src/app/data-models/common/dpm-drop-down-interval.model';

describe('PowerSettingsComponent', () => {
	let component: PowerSettingsComponent;
	let fixture: ComponentFixture<PowerSettingsComponent>;
	let powerDpmService: PowerDpmService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PowerSettingsComponent],
			schemas: [NO_ERRORS_SCHEMA],
			imports: [TranslationModule, HttpClientModule, RouterTestingModule],
			providers: [TranslateStore]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PowerSettingsComponent);
		component = fixture.componentInstance;
		powerDpmService = fixture.debugElement.injector.get(PowerDpmService);
	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should get powerButtonAction and passwordOnStandby', () => {
		let mockAllPowerPlans = {
			powerButtonAction: 1,
			passwordOnStandby: 0,
		} as AllPowerPlans;
		spyOn(powerDpmService, 'getAllPowerPlansObs').and.returnValue(of(mockAllPowerPlans));
		fixture.detectChanges();
		expect(component.selectAction).toBe(1);
		expect(component.selectedSignInOptionVal).toBe(0);
	});

	it('#onActionChange should set power button', () => {
		spyOn(powerDpmService, 'setPowerButton');
		component.onActionChange({ name: 'DoNothing', value: 0 } as DPMDropDownInterval);
		expect(powerDpmService.setPowerButton).toHaveBeenCalled();
	});

	it('#onSignInOptionChanged should set sign in option', () => {
		spyOn(powerDpmService, 'setSignInOption');
		component.onSignInOptionChanged({ name: 'Never', value: 0 } as DPMDropDownInterval);
		expect(powerDpmService.setSignInOption).toHaveBeenCalled();
	});
});
