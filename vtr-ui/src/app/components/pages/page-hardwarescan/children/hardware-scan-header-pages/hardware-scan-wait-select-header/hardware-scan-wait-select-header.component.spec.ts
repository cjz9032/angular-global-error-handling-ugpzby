import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareScanWaitSelectHeaderComponent } from './hardware-scan-wait-select-header.component';

describe('HardwareScanWaitSelectHeaderComponent', () => {
  let component: HardwareScanWaitSelectHeaderComponent;
  let fixture: ComponentFixture<HardwareScanWaitSelectHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareScanWaitSelectHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareScanWaitSelectHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('button should be enabled', () => {
	expect(component.isButtonDisable()).toEqual(false);
  });
});
