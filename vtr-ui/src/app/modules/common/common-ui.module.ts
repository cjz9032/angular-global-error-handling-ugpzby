import { UiGamingDriverPopupComponent } from './../../components/ui/ui-gaming-driver-popup/ui-gaming-driver-popup.component';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UiApsSliderComponent } from 'src/app/components/ui/ui-aps-slider/ui-aps-slider.component';
import { UiCheckboxComponent } from 'src/app/components/ui/ui-checkbox/ui-checkbox.component';
import { UiCircleRadioComponent } from 'src/app/components/ui/ui-circle-radio/ui-circle-radio.component';
import { UiCircleRadioWithCheckboxComponent } from 'src/app/components/ui/ui-circle-radio-with-checkbox/ui-circle-radio-with-checkbox.component';
import { UiDaysPickerComponent } from 'src/app/components/ui/ui-days-picker/ui-days-picker.component';
import { UiDropDownComponent } from 'src/app/components/ui/ui-dropdown/ui-dropdown.component';
import { UiHeaderSubpageComponent } from 'src/app/components/ui/ui-header-subpage/ui-header-subpage.component';
import { UiListCheckboxComponent } from 'src/app/components/ui/ui-list-checkbox/ui-list-checkbox.component';
import { UiListChevronComponent } from 'src/app/components/ui/ui-list-chevron/ui-list-chevron.component';
import { UiListSupportComponent } from 'src/app/components/ui/ui-list-support/ui-list-support.component';
import { UiNumberButtonComponent } from 'src/app/components/ui/ui-number-button/ui-number-button.component';
import { UiRangeSliderComponent } from 'src/app/components/ui/ui-range-slider/ui-range-slider.component';
import { UiRectangleRadioComponent } from 'src/app/components/ui/ui-rectangle-radio/ui-rectangle-radio.component';
import { UiRoundedRectangleRadioComponent } from 'src/app/components/ui/ui-rounded-rectangle-radio/ui-rounded-rectangle-radio.component';
import { UiRowSwitchComponent } from 'src/app/components/ui/ui-row-switch/ui-row-switch.component';
import { UiSwitchOnoffComponent } from 'src/app/components/ui/ui-switch-onoff/ui-switch-onoff.component';
import { UiSwitchTristateComponent } from 'src/app/components/ui/ui-switch-tristate/ui-switch-tristate.component';
import { UiTimePickerComponent } from 'src/app/components/ui/ui-time-picker/ui-time-picker.component';
import { UiHeaderWarrantyComponent } from 'src/app/components/ui/ui-header-warranty/ui-header-warranty.component';
import { SharedModule } from '../shared.module';
import { RouterModule } from '@angular/router';
import { UiGamingCollapsibleContainerComponent } from 'src/app/components/ui/ui-gaming-collapsible-container/ui-gaming-collapsible-container.component';
import { UiPopoverComponent } from 'src/app/components/ui/ui-popover/ui-popover.component';
import { UiTooltipsComponent } from 'src/app/components/ui/ui-tooltips/ui-tooltips.component';

@NgModule({
	declarations: [
		UiApsSliderComponent,
		UiCheckboxComponent,
		UiCircleRadioComponent,
		UiCircleRadioWithCheckboxComponent,
		UiDaysPickerComponent,
		UiDropDownComponent,
		UiHeaderSubpageComponent,
		UiHeaderSubpageComponent,
		UiHeaderSubpageComponent,
		UiListCheckboxComponent,
		UiListChevronComponent,
		UiListChevronComponent,
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
		UiHeaderWarrantyComponent,

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
		UiHeaderSubpageComponent,
		UiHeaderSubpageComponent,
		UiHeaderSubpageComponent,
		UiListCheckboxComponent,
		UiListChevronComponent,
		UiListChevronComponent,
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
		UiHeaderWarrantyComponent,

		UiGamingCollapsibleContainerComponent,
		UiGamingDriverPopupComponent,
		UiPopoverComponent,
		UiTooltipsComponent
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
