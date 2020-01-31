import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CptpageDeviceUpdatesComponent } from './cptpage-device-updates.component';

describe('CptpageDeviceUpdatesComponent', () => {
  let component: CptpageDeviceUpdatesComponent;
  let fixture: ComponentFixture<CptpageDeviceUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CptpageDeviceUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CptpageDeviceUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
