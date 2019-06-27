import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSecurityDeviceComponent } from './home-security-device.component';

describe('HomeSecurityDeviceComponent', () => {
  let component: HomeSecurityDeviceComponent;
  let fixture: ComponentFixture<HomeSecurityDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeSecurityDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSecurityDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
