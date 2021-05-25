import { PageSettingsAppTransitionComponent } from 'src/app/components/pages/page-settings-app-transition/page-settings-app-transition.component';
import { CommonModule } from '@angular/common';
import { CommonUiModule } from '../common/common-ui.module';
import { CommonWidgetModule } from '../common/common-widget.module';
import { ContainerCardModule } from 'src/app/components/container-card/container-card.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { HardwareSettingRoutingModule } from './hardware-settings-routing.module';
import { HeaderMainModule } from 'src/app/components/header-main/header-main.module';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { NgbDropdownModule, NgbTooltipModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { PageDeviceComponent } from 'src/app/components/pages/page-device/page-device.component';
import { PageQuestionsComponent } from 'src/app/components/pages/page-questions/page-questions.component';
import { PageSupportDetailModule } from 'src/app/components/pages/page-support-detail/page-support-detail.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';
import { WidgetOfflineModule } from 'src/app/components/widgets/widget-offline-info/widget-offline.module';
import { WidgetSecurityStatusModule } from 'src/app/components/widgets/widget-security-status/widget-security-status.module';
import { CommonModalModule } from '../common/common-modal.module';
import { PageLayoutModule } from 'src/app/components/page-layout/page-layout.module';

import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatTooltipModule } from '@lenovo/material/tooltip';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@lenovo/material/icon';
import { MatSlideToggleModule } from '@lenovo/material/slide-toggle';
import { MatCheckboxModule } from '@lenovo/material/checkbox';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faUsb } from '@fortawesome/free-brands-svg-icons/faUsb';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faBatteryThreeQuarters } from '@fortawesome/free-solid-svg-icons/faBatteryThreeQuarters';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faChevronCircleUp } from '@fortawesome/pro-light-svg-icons/faChevronCircleUp';
import { faPlane } from '@fortawesome/pro-light-svg-icons/faPlane';
import { faThumbtack } from '@fortawesome/pro-light-svg-icons/faThumbtack';
import { faBatteryHalf } from '@fortawesome/pro-light-svg-icons/faBatteryHalf';
import { faBatteryFull } from '@fortawesome/pro-light-svg-icons/faBatteryFull';
import { faBatteryBolt } from '@fortawesome/pro-light-svg-icons/faBatteryBolt';
import { faQuestionCircle, faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { faBatteryQuarter } from '@fortawesome/pro-light-svg-icons/faBatteryQuarter';
import { faTachometerFast } from '@fortawesome/pro-light-svg-icons/faTachometerFast';
import { faMicrophone } from '@fortawesome/pro-light-svg-icons/faMicrophone';
import { faKeyboard } from '@fortawesome/pro-light-svg-icons/faKeyboard';
import { faEye } from '@fortawesome/pro-light-svg-icons/faEye';
import { faTv } from '@fortawesome/pro-light-svg-icons/faTv';
import { faCamera } from '@fortawesome/pro-light-svg-icons/faCamera';
import { faGem } from '@fortawesome/pro-light-svg-icons/faGem';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/pro-light-svg-icons/faChevronUp';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons/faMinusCircle';
import { faCheck as falCheck } from '@fortawesome/pro-light-svg-icons/faCheck';
import { faTimes as falTimes } from '@fortawesome/pro-light-svg-icons/faTimes';
import { faCircle } from '@fortawesome/pro-light-svg-icons/faCircle';
import { faBriefcase } from '@fortawesome/pro-light-svg-icons/faBriefcase';
import { faCircle as falCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';
import { faSync } from '@fortawesome/pro-light-svg-icons/faSync';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight';
import { faPlusSquare } from '@fortawesome/pro-light-svg-icons/faPlusSquare';
import { faPlus } from '@fortawesome/pro-light-svg-icons/faPlus';


import { UiCustomSliderModule } from 'src/app/components/ui/ui-custom-slider/ui-custom-slider.module';
import { SpinnerModule } from 'src/app/components/common/spinner/spinner.module';
import { MaterialModule } from '../common/material.module';
import { SystemUpdateModule } from '../system-update/system-update.module';
import { MaterialChevronModule } from 'src/app/material/material-chevron/material-chevron.module';
import { WidgetQuestionsModule } from 'src/app/components/widgets/widget-questions/widget-questions.module';
import { AutoCloseModule } from 'src/app/feature/auto-close/auto-close.module';

@NgModule({
	declarations: [
		PageSettingsAppTransitionComponent,
		PageDeviceComponent,
		PageQuestionsComponent,
	],
	imports: [
		CommonModule,
		CommonUiModule,
		CommonWidgetModule,
		CommonModalModule,
		SharedModule,
		HardwareSettingRoutingModule,
		FontAwesomeModule,
		ContainerCardModule,
		MetricsModule,
		NgbTooltipModule,
		HeaderMainModule,
		WidgetOfflineModule,
		WidgetSecurityStatusModule,
		WidgetQuestionsModule,
		NgbDropdownModule,
		RouterModule,
		NgbCollapseModule,
		PageLayoutModule,
		UiCustomSliderModule,
		PageSupportDetailModule,
		SpinnerModule,
		MatTooltipModule,
		OverlayModule,
		CdkScrollableModule,
		MaterialModule,
		SystemUpdateModule,
		MatIconModule,
		MatSlideToggleModule,
		MaterialChevronModule,
		MatCheckboxModule,
		AutoCloseModule,
	],
	exports: [
		CommonModule,
		CommonUiModule,
		CommonModalModule,
		WidgetQuestionsModule,
		PageLayoutModule,
		RouterModule,
		HeaderMainModule,
		UiCustomSliderModule,
	],
	providers: [
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class HardwareSettingsModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faCheck);
		library.addIcons(faCheckCircle);
		library.addIcons(faChevronCircleUp);
		library.addIcons(faPlane);
		library.addIcons(faThumbtack);
		library.addIcons(faQuestionCircle);
		library.addIcons(faBatteryHalf);
		library.addIcons(faBatteryBolt);
		library.addIcons(faBatteryQuarter);
		library.addIcons(faUsb);
		library.addIcons(faTachometerFast);
		library.addIcons(faMicrophone);
		library.addIcons(faKeyboard);
		library.addIcons(faEye);
		library.addIcons(faTv);
		library.addIcons(faCamera);
		library.addIcons(faGem);
		library.addIcons(faBatteryThreeQuarters);
		library.addIcons(faBatteryFull);
		library.addIcons(faChevronDown);
		library.addIcons(faChevronUp);
		library.addIcons(faCaretUp);
		library.addIcons(faCaretDown);
		library.addIcons(faTimesCircle);
		library.addIcons(faPlusCircle);
		library.addIcons(faMinusCircle);
		library.addIcons(falCheck);
		library.addIcons(falTimes);
		library.addIcons(faCircle);
		library.addIcons(falCircle);
		library.addIcons(faSync);
		library.addIcons(faCircleNotch);
		library.addIcons(faAngleRight);
		library.addIcons(faCalendarAlt);
		library.addIcons(faBriefcase);
		library.addIcons(faPlusSquare);
		library.addIcons(faPlus);
	}
}
