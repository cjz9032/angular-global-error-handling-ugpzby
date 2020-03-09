import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerUseComponent } from './power-use.component';
import { PowerDpmService } from 'src/app/services/power-dpm/power-dpm.service';
import { DPMDropDownInterval } from 'src/app/data-models/common/dpm-drop-down-interval.model';
import { TranslateStore } from '@ngx-translate/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PowerPlan } from 'src/app/data-models/dpm/power-plan.model';
import { AllPowerPlans } from 'src/app/data-models/dpm/all-power-plans.model';
import { of } from 'rxjs';

describe('PowerUseComponent', () => {
  let component: PowerUseComponent;
  let fixture: ComponentFixture<PowerUseComponent>;
  let powerDpmService: PowerDpmService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PowerUseComponent],
      imports: [TranslationModule],
      providers: [TranslateStore]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerUseComponent);
    component = fixture.componentInstance;
    powerDpmService = fixture.debugElement.injector.get(PowerDpmService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get the current power plan', () => {
    let mockCurrentPowerPlan = {
      powerPlanName: 'Balanced',
      preDefined: true,
      hddTimeoutAC: 120,
      hiberTimeoutAC: 15,
      suspendTimeoutAC: 0,
      videoTimeoutAC: 45,
      performance: 5,
      temperature: 4,
      powerUsage: 7,
      cpuSpeed: "cpuSpeedAdaptive",
      brightness: 100,
      settingList: [{
        key: 'PowerPlan',
        value: 'Balanced'
      }, {
        key: 'PreDefined',
        value: 'SystemDefined'
      }, {
        key: 'HDDTimeoutAC',
        value: '120'
      }, {
        key: 'HiberTimeoutAC',
        value: '15'
      }, {
        key: 'SuspendTimeoutAC',
        value: '0'
      }, {
        key: 'VideoTimeoutAC',
        value: '45'
      }, {
        key: 'Performance',
        value: '5'
      }, {
        key: 'Temperature',
        value: '4'
      }, {
        key: 'PowerUsage',
        value: '7'
      }, {
        key: 'CPUSpeed',
        value: 'cpuSpeedAdaptive'
      }, {
        key: 'Brightness',
        value: '100'
      },]
    } as PowerPlan;
    spyOn(powerDpmService, 'getCurrentPowerPlanObs').and.returnValue(of(mockCurrentPowerPlan));
    fixture.detectChanges();
    expect(component.turnoffDisplay).toEqual(45);
    expect(component.turnoffHDD).toEqual(120);
    expect(component.sleepAfter).toEqual(0);
    expect(component.hibernateAfter).toEqual(15);
  });

  it('should get null when error occured', () => {
    component.turnoffDisplay = 0;
    component.turnoffHDD = 0;
    component.sleepAfter = 0;
    component.hibernateAfter = 0;
    spyOn(powerDpmService, 'getCurrentPowerPlanObs').and.returnValue(of(null));
    fixture.detectChanges();
    expect(component.turnoffDisplay).toEqual(0);
    expect(component.turnoffHDD).toEqual(0);
    expect(component.sleepAfter).toEqual(0);
    expect(component.hibernateAfter).toEqual(0);
  });

  it('#onTurnOffDisplayChange should set selected turn off display time', () => {
    spyOn(powerDpmService, 'setTurnoffDisplay');
    component.onTurnOffDisplayChange({ name: '1', value: 1 } as DPMDropDownInterval);
    expect(powerDpmService.setTurnoffDisplay).toHaveBeenCalled();
  });

  it('#onTurnOffHDDChange should set selected turn off hdd time', () => {
    spyOn(powerDpmService, 'setTurnoffHDD');
    component.onTurnOffHDDChange({ name: '1', value: 1 } as DPMDropDownInterval);
    expect(powerDpmService.setTurnoffHDD).toHaveBeenCalled();
  });

  it('#onSleepChange should set selected sleep after time', () => {
    spyOn(powerDpmService, 'setSleepAfter');
    component.onSleepChange({ name: '1', value: 1 } as DPMDropDownInterval);
    expect(powerDpmService.setSleepAfter).toHaveBeenCalled();
  });

  it('#onHibernateChange should set selected hibernate after time', () => {
    spyOn(powerDpmService, 'setHibernateAfter');
    component.onHibernateChange({ name: '1', value: 1 } as DPMDropDownInterval);
    expect(powerDpmService.setHibernateAfter).toHaveBeenCalled();
  });

});
