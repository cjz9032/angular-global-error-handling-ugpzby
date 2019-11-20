import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraBackgroundBlurComponent } from './camera-background-blur.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslationModule } from 'src/app/modules/translation.module';
import { FormsModule } from '@angular/forms';
import { TranslateStore } from '@ngx-translate/core';
import { CameraBlur } from 'src/app/data-models/camera/camera-blur-model';
import { UiRoundedRectangleRadioComponent } from '../ui/ui-rounded-rectangle-radio/ui-rounded-rectangle-radio.component';
import { MetricsDirective } from 'src/app/directives/metrics.directive';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CameraBackgroundBlurComponent', () => {
  const option: CameraBlur = {
    available: false,
    currentMode: 'blur',
    enabled: false,
    errorCode: 0,
    supportedModes: ['Support Mode A']
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CameraBackgroundBlurComponent, UiRoundedRectangleRadioComponent],
      imports: [FontAwesomeModule, TranslationModule, FormsModule],
      providers: [TranslateStore],
      schemas: [NO_ERRORS_SCHEMA] //for derictives
    }).compileComponents();
  }));

  describe(':', () => {

    function setup() {
      const fixture = TestBed.createComponent(CameraBackgroundBlurComponent);
      const component = fixture.debugElement.componentInstance;
      //const componentElement = fixture.debugElement.nativeElement; 

      return { fixture, component };
    }

    it('should create the app', (() => {
      const { component } = setup();
      expect(component).toBeTruthy();
    }));

    it('onChange called', async(() => {
      const { fixture, component } = setup();
      spyOn(component, 'onChange');
      fixture.detectChanges();

      let rradio = fixture.debugElement.nativeElement.querySelector('input[id="radio1"]');
      rradio.click();
      fixture.whenStable().then(() => {
        expect(component.onChange).toHaveBeenCalled();
      });
    }));

    it('should emit when the button is clicked', async() => {
      const { fixture, component } = setup();
      spyOn(component.onOptionChanged, 'emit');
      fixture.detectChanges();

      let rradio = fixture.debugElement.nativeElement.querySelector('input[id="radio1"]');
      rradio.click();
      fixture.whenStable().then(() => {
        expect(component.onOptionChanged.emit).toHaveBeenCalled();
      });
    });

  });

});