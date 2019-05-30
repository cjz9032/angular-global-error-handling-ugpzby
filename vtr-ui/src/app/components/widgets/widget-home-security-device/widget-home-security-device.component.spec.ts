import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetHomeSecurityDeviceComponent } from './widget-home-security-device.component';

describe('WigetHomeSecurityDeviceComponent', () => {
  let component: WidgetHomeSecurityDeviceComponent;
  let fixture: ComponentFixture<WidgetHomeSecurityDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetHomeSecurityDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetHomeSecurityDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
