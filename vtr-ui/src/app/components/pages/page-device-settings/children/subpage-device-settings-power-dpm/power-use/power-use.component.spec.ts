import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerUseComponent } from './power-use.component';

describe('PowerUseComponent', () => {
  let component: PowerUseComponent;
  let fixture: ComponentFixture<PowerUseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerUseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
<<<<<<< HEAD:vtr-ui/src/app/components/pages/page-device-settings/children/subpage-device-settings-power-dpm/power-use/power-use.component.spec.ts
    fixture = TestBed.createComponent(PowerUseComponent);
=======
    fixture = TestBed.createComponent(UiColorPickerComponent);
>>>>>>> develop:vtr-ui/src/app/components/ui/ui-color-picker/ui-color-picker.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
