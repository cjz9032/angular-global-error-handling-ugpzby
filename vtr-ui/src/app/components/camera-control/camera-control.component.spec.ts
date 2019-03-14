import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraControlComponent } from './camera-control.component';
import { UiRangeSliderComponent } from '../ui/ui-range-slider/ui-range-slider.component';
import { UiSwitchOnoffComponent } from '../ui/ui-switch-onoff/ui-switch-onoff.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Ng5SliderModule } from 'ng5-slider';

describe('CameraControlComponent', () => {
  let component: CameraControlComponent;
  let fixture: ComponentFixture<CameraControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
		imports: [
			FontAwesomeModule,
			Ng5SliderModule
		],
      declarations: [
		  CameraControlComponent,
		  UiRangeSliderComponent,
		  UiSwitchOnoffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
