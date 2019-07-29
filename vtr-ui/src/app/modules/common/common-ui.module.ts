import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MetricsModule } from 'src/app/directives/metrics.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
import { UiApsSliderComponent } from 'src/app/components/ui/ui-aps-slider/ui-aps-slider.component';
import { UiCheckboxComponent } from 'src/app/components/ui/ui-checkbox/ui-checkbox.component';
import { UiCircleRadioComponent } from 'src/app/components/ui/ui-circle-radio/ui-circle-radio.component';
import { UiCircleRadioWithCheckboxComponent } from 'src/app/components/ui/ui-circle-radio-with-checkbox/ui-circle-radio-with-checkbox.component';
import { UiDaysPickerComponent } from 'src/app/components/ui/ui-days-picker/ui-days-picker.component';
import { UiDropDownComponent } from 'src/app/components/ui/ui-dropdown/ui-dropdown.component';
import { UiGamingCollapsibleContainerComponent } from 'src/app/components/ui/ui-gaming-collapsible-container/ui-gaming-collapsible-container.component';
import { UiGamingDriverPopupComponent } from './../../components/ui/ui-gaming-driver-popup/ui-gaming-driver-popup.component';
import { UiListCheckboxComponent } from 'src/app/components/ui/ui-list-checkbox/ui-list-checkbox.component';
import { UiListSupportComponent } from 'src/app/components/ui/ui-list-support/ui-list-support.component';
import { UiNumberButtonComponent } from 'src/app/components/ui/ui-number-button/ui-number-button.component';
import { UiPopoverComponent } from 'src/app/components/ui/ui-popover/ui-popover.component';
import { UiRangeSliderComponent } from 'src/app/components/ui/ui-range-slider/ui-range-slider.component';
import { UiRectangleRadioComponent } from 'src/app/components/ui/ui-rectangle-radio/ui-rectangle-radio.component';
import { UiRoundedRectangleRadioComponent } from 'src/app/components/ui/ui-rounded-rectangle-radio/ui-rounded-rectangle-radio.component';
import { UiRowSwitchComponent } from 'src/app/components/ui/ui-row-switch/ui-row-switch.component';
import { UiSwitchOnoffComponent } from 'src/app/components/ui/ui-switch-onoff/ui-switch-onoff.component';
import { UiSwitchTristateComponent } from 'src/app/components/ui/ui-switch-tristate/ui-switch-tristate.component';
import { UiTimePickerComponent } from 'src/app/components/ui/ui-time-picker/ui-time-picker.component';
import { UiTooltipsComponent } from 'src/app/components/ui/ui-tooltips/ui-tooltips.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons/faCheckCircle';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faCircle as falCircle } from '@fortawesome/free-regular-svg-icons/faCircle';
import { faChevronDown as falChevronDown } from '@fortawesome/pro-light-svg-icons/faChevronDown';
import { faChevronUp as falChevronUp } from '@fortawesome/pro-light-svg-icons/faChevronUp';

library.add(faCircle);
library.add(faCheckCircle);
library.add(faChevronDown);
library.add(falCircle);
library.add(faExclamationCircle);
library.add(falChevronDown);
library.add(falChevronUp);
library.add(faChevronUp);

@NgModule({
	declarations: [
		UiApsSliderComponent,
		UiCheckboxComponent,
		UiCircleRadioComponent,
		UiCircleRadioWithCheckboxComponent,
		UiDaysPickerComponent,
		UiDropDownComponent,
		UiListCheckboxComponent,
		UiListSupportComponent,
		UiNumberButtonComponent,
		UiRangeSliderComponent,
		UiRectangleRadioComponent,
		UiRoundedRectangleRadioComponent,
		UiRowSwitchComponent,
		UiSwitchOnoffComponent,
		UiSwitchTristateComponent,
		UiSwitchTristateComponent,
		UiTimePickerComponent,

		UiGamingCollapsibleContainerComponent,
		UiGamingDriverPopupComponent,
		UiPopoverComponent,
		UiTooltipsComponent
	],
	exports: [
		UiApsSliderComponent,
		UiCheckboxComponent,
		UiCircleRadioComponent,
		UiCircleRadioWithCheckboxComponent,
		UiDaysPickerComponent,
		UiDropDownComponent,
		UiListCheckboxComponent,
		UiListSupportComponent,
		UiNumberButtonComponent,
		UiRangeSliderComponent,
		UiRectangleRadioComponent,
		UiRoundedRectangleRadioComponent,
		UiRowSwitchComponent,
		UiSwitchOnoffComponent,
		UiSwitchTristateComponent,
		UiSwitchTristateComponent,
		UiTimePickerComponent,

		UiGamingCollapsibleContainerComponent,
		UiGamingDriverPopupComponent,
		UiPopoverComponent,
		MetricsModule,
		UiTooltipsComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule,
		MetricsModule,
		NgbTooltipModule,
		FontAwesomeModule
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CommonUiModule { }
