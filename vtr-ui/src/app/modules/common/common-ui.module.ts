import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { NgbTooltipModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
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
import { UiToggleComponent } from 'src/app/components/ui/ui-toggle/ui-toggle.component';
import { ContainerCollapsibleComponent } from 'src/app/components/container-collapsible/container-collapsible.component';
import { UiBrightnessSliderComponent } from 'src/app/components/ui/ui-brightness-slider/ui-brightness-slider.component';
import { UiAddReduceButtonComponent } from 'src/app/components/ui/ui-add-reduce-button/ui-add-reduce-button.component';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons/faCheckCircle';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faCircle as falCircle } from '@fortawesome/free-regular-svg-icons/faCircle';
import { faChevronDown as falChevronDown } from '@fortawesome/pro-light-svg-icons/faChevronDown';
import { faChevronUp as falChevronUp } from '@fortawesome/pro-light-svg-icons/faChevronUp';
import { UiDpmDropdownComponent } from 'src/app/components/ui/ui-dpm-dropdown/ui-dpm-dropdown.component';
import { SpinnerComponent } from 'src/app/components/common/spinner/spinner.component';


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
		SpinnerComponent,
		UiSwitchTristateComponent,
		UiSwitchTristateComponent,
		UiTimePickerComponent,
		ContainerCollapsibleComponent,
		UiGamingCollapsibleContainerComponent,
		UiGamingDriverPopupComponent,
		UiPopoverComponent,
		UiTooltipsComponent,
		UiToggleComponent,
		ContainerCollapsibleComponent,
		UiDpmDropdownComponent,
		UiBrightnessSliderComponent,
		UiAddReduceButtonComponent
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
		SpinnerComponent,
		UiSwitchTristateComponent,
		UiSwitchTristateComponent,
		UiTimePickerComponent,
		ContainerCollapsibleComponent,
		UiGamingCollapsibleContainerComponent,
		UiGamingDriverPopupComponent,
		UiPopoverComponent,
		MetricsModule,
		UiTooltipsComponent,
		UiToggleComponent,
		ContainerCollapsibleComponent,
		UiDpmDropdownComponent,
		UiBrightnessSliderComponent,
		UiAddReduceButtonComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule,
		MetricsModule,
		NgbTooltipModule,
		NgbCollapseModule,
		FontAwesomeModule
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CommonUiModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faCircle);
		library.addIcons(faCheckCircle);
		library.addIcons(faChevronDown);
		library.addIcons(falCircle);
		library.addIcons(faExclamationCircle);
		library.addIcons(falChevronDown);
		library.addIcons(falChevronUp);
		library.addIcons(faChevronUp);
	}
}
