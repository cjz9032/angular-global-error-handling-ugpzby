import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OledPowerSettingsComponent } from './oled-power-settings.component';

xdescribe('OledPowerSettingsComponent', () => {
  let component: OledPowerSettingsComponent;
  let fixture: ComponentFixture<OledPowerSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OledPowerSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OledPowerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
