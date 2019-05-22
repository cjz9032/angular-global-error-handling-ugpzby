import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WigetHomeSecurityDeviceComponent } from './widget-home-security-device.component';

describe('WigetHomeSecurityDeviceComponent', () => {
  let component: WigetHomeSecurityDeviceComponent;
  let fixture: ComponentFixture<WigetHomeSecurityDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WigetHomeSecurityDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WigetHomeSecurityDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
