import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BatteryConditionModel as BatteryCondition } from 'src/app/data-models/battery/battery-conditions.model';
import BatteryGaugeDetail from 'src/app/data-models/battery/battery-gauge-detail-model';
import { 
  BatteryConditionsEnum as Conditions,
  BatteryStatus as Status
}  from 'src/app/enums/battery-conditions.enum';
import { BatteryConditionNotesComponent } from './battery-condition-notes.component';
import { TranslateModule } from '@ngx-translate/core';

describe('BatteryConditionNotesComponent', () => {
  let component: BatteryConditionNotesComponent;
  let fixture: ComponentFixture<BatteryConditionNotesComponent>;
  
  const goodCondition = new BatteryCondition(Conditions.Good, Status.Good);
  const acConnectedCondition = new BatteryCondition(Conditions.FullACAdapterSupport, Status.AcAdapterStatus);
  const goodAndAcConnectedConditions = [goodCondition, acConnectedCondition];

  const acBatteryNotDetectedCondition = new BatteryCondition(Conditions.NotDetected, Status.AcAdapterStatus);
  const goodAndBatteryNotDetectedCondition = [goodCondition, acBatteryNotDetectedCondition];

  const batteryGauge = new BatteryGaugeDetail();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatteryConditionNotesComponent ],
      imports: [TranslateModule.forRoot()],
      providers: [], 
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteryConditionNotesComponent);
    component = fixture.componentInstance;
    component.batteryGauge = batteryGauge;
    component.batteryFullChargeCapacity = 100;
    component.batteryDesignCapacity = 100;
    component.batteryConditions = goodAndAcConnectedConditions;
    component.batteryDetected = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#getTranslatedConditionTips', () => {
    it('should transform conditions to notes', () => {
      fixture.detectChanges();
      expect(component.getTranslatedConditionTips()).toEqual([
        'device.deviceSettings.batteryGauge.condition.Good', 
        'device.deviceSettings.batteryGauge.condition.FullACAdapterSupport'
      ]);
    })
  });

  describe("'see details click' should change to detailed note", () => {
    it('should change ac detailed note', () => {
      const notSupportedAcAdapterNote = 'device.deviceSettings.batteryGauge.condition.NotSupportACAdapter';
      spyOn(component, 'canShowSeeDetailsLink').and.returnValue(true);
      spyOnProperty(component, 'notes').and.returnValue([notSupportedAcAdapterNote]);
      fixture.detectChanges();

      let button = fixture.debugElement.query(By.css('#battery-condition-tip-ACAdapterError-seeDetails-link'));
      button.nativeElement.click();
      
      expect(component.notes[0]).toBe(notSupportedAcAdapterNote+'Detail');
    });
  });

  describe('with a battery with store limitation', () => {
    it('and poor status should show store limitation note', () => {
      const poorAndStoreLimitation = new BatteryCondition(Conditions.StoreLimitation, Status.Poor);
      component.batteryConditions = [poorAndStoreLimitation];
      fixture.detectChanges();
      let h6 = fixture.debugElement.query(By.css('h6')).nativeElement;
      expect(h6.textContent).toEqual('device.deviceSettings.batteryGauge.condition.StoreLimitation');
    });

    it('and fair status should show store limitation note', () => {
      const fairAndStoreLimitation = new BatteryCondition(Conditions.StoreLimitation, Status.Fair);
      component.batteryConditions = [fairAndStoreLimitation];
      fixture.detectChanges();
      let h6 = fixture.debugElement.query(By.css('h6')).nativeElement;
      expect(h6.textContent).toEqual('device.deviceSettings.batteryGauge.condition.StoreLimitation');
    });

    it('and good status should not show store limitation note', () => {
      const goodAndStoreLimitation = new BatteryCondition(Conditions.StoreLimitation, Status.Good);
      component.batteryConditions = [goodAndStoreLimitation];
      fixture.detectChanges();

      let h6 = fixture.debugElement.query(By.css('h6'));

      expect(h6).toBe(null);
    });
  });

  describe('with ac adapter connected', () => {
    describe('and with battery gauge not attached', () => {
      it('should not show the full support adapter Note', () => {
        batteryGauge.isAttached = false;
        fixture.detectChanges();
        expect(component.canShowFullSupportAdapterNote(1)).toBeFalsy();
      });
    });

    describe('and battery gauge attached', () => {
      beforeEach(() => {
        component.batteryConditions = [acConnectedCondition];
        batteryGauge.isAttached = true;
      })
      it("should render generic 'power is connected note' when ac wattage is 0 or adapterType is blank", () => {
        batteryGauge.acWattage = 0;
        batteryGauge.acAdapterType = '';
        fixture.detectChanges();

        let h6 = fixture.debugElement.query(By.css('h6')).nativeElement;
        expect(h6.innerHTML).toBe('device.deviceSettings.batteryGauge.condition.AcAdapterConnected');
      });

      it("should render note containing the acWattage and adapterType when they're not blank", () => {
        batteryGauge.acWattage = 65;
        batteryGauge.acAdapterType = 'usb';
        fixture.detectChanges();

        let h6 = fixture.debugElement.query(By.css('h6')).nativeElement;
        expect(h6.innerHTML).toBe('device.deviceSettings.batteryGauge.condition.FullACAdapterSupport');
        expect(component.canShowFullSupportAdapterNote(0)).toBe(true);
        expect(component.acAdapter.wattage).toEqual(65);
        expect(component.acAdapter.type).toEqual('USB-C');
      });      
    });
    describe('and battery is not detected', () => {
      it("should render 'battery is not detected' message", () => {
        component.batteryDetected = false;
        fixture.detectChanges();
        let h6 = fixture.debugElement.query(By.css('#battery-condition-battery-not-detected')).nativeElement;
        expect(h6.innerHTML).toBe('device.deviceSettings.batteryGauge.condition.NotDetected');
      });

      it("should render generic 'power is connected note'", () => {
        component.batteryDetected = false;
        component.batteryConditions = goodAndBatteryNotDetectedCondition;
        fixture.detectChanges();
        let h6 = fixture.debugElement.query(By.css('[data-battery-condition=notDetected]')).nativeElement;
        expect(h6.innerHTML).toBe('device.deviceSettings.batteryGauge.condition.AcAdapterConnected');
      });
    });
  });
});
