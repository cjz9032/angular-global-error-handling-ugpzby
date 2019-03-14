import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpageDeviceSettingsAudioComponent } from './subpage-device-settings-audio.component';
import { UiHeaderSubpageComponent } from 'src/app/components/ui/ui-header-subpage/ui-header-subpage.component';
import { ContainerCollapsibleComponent } from 'src/app/components/container-collapsible/container-collapsible.component';
import { UiRowSwitchComponent } from 'src/app/components/ui/ui-row-switch/ui-row-switch.component';
import { UiRectangleRadioComponent } from 'src/app/components/ui/ui-rectangle-radio/ui-rectangle-radio.component';
import { UiRangeSliderComponent } from 'src/app/components/ui/ui-range-slider/ui-range-slider.component';

describe('SubpageDeviceSettingsAudioComponent', () => {
  let component: SubpageDeviceSettingsAudioComponent;
  let fixture: ComponentFixture<SubpageDeviceSettingsAudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
		  SubpageDeviceSettingsAudioComponent,
		  UiHeaderSubpageComponent,
		  ContainerCollapsibleComponent,
		  UiRowSwitchComponent,
		  UiRectangleRadioComponent,
		  UiRangeSliderComponent
		 ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubpageDeviceSettingsAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
