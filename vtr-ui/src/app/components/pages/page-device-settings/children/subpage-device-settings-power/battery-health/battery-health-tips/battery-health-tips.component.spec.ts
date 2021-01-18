import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryHealthTipsComponent } from './battery-health-tips.component';

describe('BatteryHealthTipsComponent', () => {
  let component: BatteryHealthTipsComponent;
  let fixture: ComponentFixture<BatteryHealthTipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatteryHealthTipsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteryHealthTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
