import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpageColorCalibrationComponent } from './subpage-color-calibration.component';

describe('SubpageColorCalibrationComponent', () => {
  let component: SubpageColorCalibrationComponent;
  let fixture: ComponentFixture<SubpageColorCalibrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubpageColorCalibrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubpageColorCalibrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
