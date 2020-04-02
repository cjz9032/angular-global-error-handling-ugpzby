import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareScanExecutingHeaderComponent } from './hardware-scan-executing-header.component';

describe('HardwareScanExecutingHeaderComponent', () => {
  let component: HardwareScanExecutingHeaderComponent;
  let fixture: ComponentFixture<HardwareScanExecutingHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareScanExecutingHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareScanExecutingHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
