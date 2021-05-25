import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import {
	NgbTooltipModule,
	NgbCollapseModule,
	NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
import { UiCheckboxComponent } from 'src/app/components/ui/ui-checkbox/ui-checkbox.component';
import { UiCircleRadioComponent } from 'src/app/components/ui/ui-circle-radio/ui-circle-radio.component';
import { UiCircleRadioWithCheckboxComponent } from 'src/app/components/ui/ui-circle-radio-with-checkbox/ui-circle-radio-with-checkbox.component';
import { UiGamingCollapsibleContainerComponent } from 'src/app/components/ui/ui-gaming-collapsible-container/ui-gaming-collapsible-container.component';
import { UiGamingDriverPopupComponent } from './../../components/ui/ui-gaming-driver-popup/ui-gaming-driver-popup.component';
import { UiNumberButtonComponent } from 'src/app/components/ui/ui-number-button/ui-number-button.component';
import { UiProgressBarComponent } from 'src/app/components/ui/ui-progress-bar/ui-progress-bar.component';
import { UiRectangleRadioComponent } from 'src/app/components/ui/ui-rectangle-radio/ui-rectangle-radio.component';
import { UiRoundedRectangleRadioComponent } from 'src/app/components/ui/ui-rounded-rectangle-radio/ui-rounded-rectangle-radio.component';
import { UiRowSwitchComponent } from 'src/app/components/ui/ui-row-switch/ui-row-switch.component';
import { UiSwitchOnoffComponent } from 'src/app/components/ui/ui-switch-onoff/ui-switch-onoff.component';
import { UiSwitchTristateComponent } from 'src/app/components/ui/ui-switch-tristate/ui-switch-tristate.component';
import { UiTooltipsComponent } from 'src/app/components/ui/ui-tooltips/ui-tooltips.component';
import { UiToggleComponent } from 'src/app/components/ui/ui-toggle/ui-toggle.component';
import { ContainerCollapsibleComponent } from 'src/app/components/container-collapsible/container-collapsible.component';
import { UiBrightnessSliderComponent } from 'src/app/components/ui/ui-brightness-slider/ui-brightness-slider.component';
import { UiAddReduceButtonComponent } from 'src/app/components/ui/ui-add-reduce-button/ui-add-reduce-button.component';
import { UiGamingSliderComponent } from 'src/app/components/ui/ui-gaming-slider/ui-gaming-slider.component';
import { UiGamingMonitorTooltipComponent } from 'src/app/components/ui/gaming/ui-gaming-monitor-tooltip/ui-gaming-monitor-tooltip.component';
import { UiLightingProfileToggleComponent } from 'src/app/components/ui/ui-lighting-profile-toggle/ui-lighting-profile-toggle.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons/faCheckCircle';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faCircle as falCircle } from '@fortawesome/free-regular-svg-icons/faCircle';
import { faChevronDown as falChevronDown } from '@fortawesome/pro-light-svg-icons/faChevronDown';
import { faChevronUp as falChevronUp } from '@fortawesome/pro-light-svg-icons/faChevronUp';
import { UiCustomSwitchModule } from 'src/app/components/ui/ui-custom-switch/ui-custom-switch.module';
import { SpinnerModule } from 'src/app/components/common/spinner/spinner.module';
import { UiRoundedRectangleCustomRadioListModule } from 'src/app/components/ui/ui-rounded-rectangle-custom-radio-list/ui-rounded-rectangle-custom-radio-list.module';
import { UiCircleRadioWithCheckBoxListModule } from 'src/app/components/ui/ui-circle-radio-with-checkbox-list/ui-circle-radio-with-checkbox-list.module';
import { SafePipeModule } from 'safe-pipe';
import { UiGroupCardComponent } from 'src/app/components/ui/ui-group-card/ui-group-card.component';
import { UiDeviceinfoItemComponent } from 'src/app/components/ui/ui-deviceinfo-item/ui-deviceinfo-item.component';
import { faRedo } from '@fortawesome/free-solid-svg-icons/faRedo';
import { MaterialModule } from './material.module';
import { MatTooltipModule } from '@lenovo/material/tooltip';
import { MatButtonModule } from '@lenovo/material/button';


@NgModule({
	declarations: [
		UiCheckboxComponent,
		UiCircleRadioComponent,
		UiCircleRadioWithCheckboxComponent,
		UiNumberButtonComponent,
		UiRectangleRadioComponent,
		UiRoundedRectangleRadioComponent,
		UiRowSwitchComponent,
		UiSwitchOnoffComponent,
		UiSwitchTristateComponent,
		UiGamingCollapsibleContainerComponent,
		UiGamingDriverPopupComponent,
		UiProgressBarComponent,
		UiTooltipsComponent,
		UiToggleComponent,
		ContainerCollapsibleComponent,
		UiBrightnessSliderComponent,
		UiAddReduceButtonComponent,
		UiGroupCardComponent,
		UiDeviceinfoItemComponent,
		UiGamingSliderComponent,
		UiGamingMonitorTooltipComponent,
		UiLightingProfileToggleComponent,
	],
	exports: [
		UiCheckboxComponent,
		UiCircleRadioComponent,
		UiCircleRadioWithCheckboxComponent,
		UiNumberButtonComponent,
		UiRectangleRadioComponent,
		UiRoundedRectangleRadioComponent,
		UiRowSwitchComponent,
		UiSwitchOnoffComponent,
		UiSwitchTristateComponent,
		UiGamingCollapsibleContainerComponent,
		UiGamingDriverPopupComponent,
		NgbProgressbarModule,
		UiProgressBarComponent,
		MetricsModule,
		UiTooltipsComponent,
		UiToggleComponent,
		ContainerCollapsibleComponent,
		UiBrightnessSliderComponent,
		UiAddReduceButtonComponent,
		UiCustomSwitchModule,
		UiRoundedRectangleCustomRadioListModule,
		UiCircleRadioWithCheckBoxListModule,
		UiGroupCardComponent,
		UiDeviceinfoItemComponent,
		UiGamingSliderComponent,
		UiGamingMonitorTooltipComponent,
		UiLightingProfileToggleComponent,
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule,
		MetricsModule,
		NgbTooltipModule,
		NgbCollapseModule,
		NgbProgressbarModule,
		FontAwesomeModule,
		UiCustomSwitchModule,
		SpinnerModule,
		UiRoundedRectangleCustomRadioListModule,
		UiCircleRadioWithCheckBoxListModule,
		SafePipeModule,
		MatTooltipModule,
		MaterialModule,
		MatButtonModule,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
		library.addIcons(faRedo);
	}
}
