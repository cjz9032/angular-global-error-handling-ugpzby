import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UiButtonComponent } from '../components/ui/ui-button/ui-button.component';
import { UiHeaderSubpageComponent } from '../components/ui/ui-header-subpage/ui-header-subpage.component';
import { UiListCheckboxComponent } from '../components/ui/ui-list-checkbox/ui-list-checkbox.component';
import { UiListChevronComponent } from '../components/ui/ui-list-chevron/ui-list-chevron.component';
import { UiRangeSliderComponent } from '../components/ui/ui-range-slider/ui-range-slider.component';
import { UiRectangleRadioComponent } from '../components/ui/ui-rectangle-radio/ui-rectangle-radio.component';
import { UiRowSwitchComponent } from '../components/ui/ui-row-switch/ui-row-switch.component';
import { UiSwitchTristateComponent } from '../components/ui/ui-switch-tristate/ui-switch-tristate.component';
import { UiDropDownComponent } from '../components/ui/ui-dropdown/ui-dropdown.component';
import { UiChsStatusbarComponent } from '../components/ui/ui-chs-statusbar/ui-chs-statusbar.component';
import { UiApsSliderComponent } from '../components/ui/ui-aps-slider/ui-aps-slider.component';
import { UiCheckboxComponent } from '../components/ui/ui-checkbox/ui-checkbox.component';
import { UiFeatureItemComponent } from '../components/ui/ui-feature-item/ui-feature-item.component';
import { UiLandingFeatureComponent } from '../components/ui/ui-landing-feature/ui-landing-feature.component';
import { UiNumberButtonComponent } from '../components/ui/ui-number-button/ui-number-button.component';
import { UiObjectTitleComponent } from '../components/ui/ui-object-title/ui-object-title.component';
import { UiRoundedRectangleRadioComponent } from '../components/ui/ui-rounded-rectangle-radio/ui-rounded-rectangle-radio.component';
import { UiSecurityStatusbarComponent } from '../components/ui/ui-security-statusbar/ui-security-statusbar.component';
import { UiSwitchOnoffComponent } from '../components/ui/ui-switch-onoff/ui-switch-onoff.component';
import { UiTimePickerComponent } from '../components/ui/ui-time-picker/ui-time-picker.component';
import { UiCircleRadioWithCheckboxComponent } from '../components/ui/ui-circle-radio-with-checkbox/ui-circle-radio-with-checkbox.component';
import { SharedModule } from './shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [
		UiButtonComponent,
		UiHeaderSubpageComponent,
		UiHeaderSubpageComponent,
		UiHeaderSubpageComponent,
		UiListCheckboxComponent,
		UiListChevronComponent,
		UiListChevronComponent,
		UiRangeSliderComponent,
		UiRectangleRadioComponent,
		UiRowSwitchComponent,
		UiSwitchTristateComponent,
		UiSwitchTristateComponent,
		UiDropDownComponent,
		UiChsStatusbarComponent,
		UiApsSliderComponent,
		UiCheckboxComponent,
		UiFeatureItemComponent,
		UiLandingFeatureComponent,
		UiNumberButtonComponent,
		UiObjectTitleComponent,
		UiRoundedRectangleRadioComponent,
		UiSecurityStatusbarComponent,
		UiSwitchOnoffComponent,
		UiTimePickerComponent,
		UiCircleRadioWithCheckboxComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class CommonUiModule { }
