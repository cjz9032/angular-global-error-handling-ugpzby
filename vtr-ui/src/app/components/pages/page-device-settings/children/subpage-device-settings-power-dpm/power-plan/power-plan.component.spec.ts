import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerPlanComponent } from './power-plan.component';
import { PowerDpmService } from 'src/app/services/power-dpm/power-dpm.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AllPowerPlans } from 'src/app/data-models/dpm/all-power-plans.model';
import { PowerPlan } from 'src/app/data-models/dpm/power-plan.model';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateStore } from '@ngx-translate/core';
import value from '*.html';
import { DPMDropDownInterval } from 'src/app/data-models/common/dpm-drop-down-interval.model';

describe('PowerPlanComponent', () => {
	let component: PowerPlanComponent;
	let fixture: ComponentFixture<PowerPlanComponent>;
	let powerDpmService: PowerDpmService;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			declarations: [PowerPlanComponent],
			imports: [TranslationModule, HttpClientModule, RouterTestingModule],
			providers: [TranslateStore]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PowerPlanComponent);
		component = fixture.componentInstance;
		powerDpmService = fixture.debugElement.injector.get(PowerDpmService);

	});

	it('should create', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should get the active power plan', () => {
		let mockAllPowerPlans = {
			activePowerPlan: 'Balanced',
			powerPlanList: [
				{ powerPlanName: 'Balanced' } as PowerPlan,
				{ powerPlanName: 'HighPerformance' } as PowerPlan,
			]
		} as AllPowerPlans;
		spyOn(powerDpmService, 'getAllPowerPlansObs').and.returnValue(of(mockAllPowerPlans));
		fixture.detectChanges();
		expect(component.selectedPowerPlanVal.powerPlanName).toEqual('Balanced');
	});

	it('should get null when error occure', () => {
		component.selectedPowerPlanVal=null;
		spyOn(powerDpmService, 'getAllPowerPlansObs').and.returnValue(of(null));
		fixture.detectChanges();
		expect(component.selectedPowerPlanVal).toBeNull();
	});

	it('#onPowerPlanChange should send active power plan',()=>{
		spyOn(powerDpmService, 'setCurrentPowerPlan');
		component.onPowerPlanChange({name:'plan1',value:1}as DPMDropDownInterval);
		expect(powerDpmService.setCurrentPowerPlan).toHaveBeenCalled();
	});
});
