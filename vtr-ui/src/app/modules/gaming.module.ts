import { GamingDashboardModule } from './gaming-dashboard.module';
import { GamingCommonModule } from './gaming/gaming.common.module';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from '@angular/core';
import { PageMacrokeyComponent } from '../components/pages/page-macrokey/page-macrokey.component';
import { PageLightingcustomizeComponent } from '../components/pages/page-lightingcustomize/page-lightingcustomize.component';
import { UiLightingEffectComponent } from '../components/ui/ui-lighting-effect/ui-lighting-effect.component';
import { UiLightingSingleColorComponent } from '../components/ui/ui-lighting-single-color/ui-lighting-single-color.component';
import { UiColorWheelComponent } from '../components/ui/ui-color-wheel/ui-color-wheel.component';
import { UiMacrokeyDetailsComponent } from '../components/ui/ui-macrokey-details/ui-macrokey-details.component';
import { UiLightingProfileComponent } from '../components/ui/ui-lighting-profile/ui-lighting-profile.component';
import { UiMacrokeyRecordedListComponent } from '../components/ui/ui-macrokey-recorded-list/ui-macrokey-recorded-list.component';
import { UiColorPickerComponent } from '../components/ui/ui-color-picker/ui-color-picker.component';
import { WidgetLightingDeskComponent } from '../components/widgets/widget-lighting-desk/widget-lighting-desk.component';
import { WidgetLightingNotebookComponent } from '../components/widgets/widget-lighting-notebook/widget-lighting-notebook.component';
import { UiLightingKeyboardLNBx50Component } from '../components/ui/ui-lighting-keyboard-lnbx50/ui-lighting-keyboard-lnbx50.component';
import { WidgetMacrokeySettingsComponent } from '../components/widgets/widget-macrokey-settings/widget-macrokey-settings.component';
import { SharedModule } from './shared.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { CommonUiModule } from './common/common-ui.module';
import { CommonWidgetModule } from './common/common-widget.module';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { GamingRoutingModule } from '../modules/gaming-routing.module';
import { ContainerCardModule } from '../components/container-card/container-card.module';
import { MetricsModule } from '../services/metric/metrics.module';
import { WidgetOfflineModule } from '../components/widgets/widget-offline-info/widget-offline.module';
import { NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PageLayoutModule } from 'src/app/components/page-layout/page-layout.module';
import { PageAutocloseComponent } from '../components/pages/page-autoclose/page-autoclose.component';
import { PageNetworkboostComponent } from './../components/pages/page-networkboost/page-networkboost.component';
import { WidgetAddedAppListComponent } from '../components/widgets/widget-added-app-list/widget-added-app-list.component';

// Load Icons for Gaming
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons/faQuestionCircle';
import { faCog } from '@fortawesome/pro-light-svg-icons/faCog';
import { faCheck } from '@fortawesome/pro-light-svg-icons/faCheck';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faArrowAltToTop } from '@fortawesome/pro-light-svg-icons/faArrowAltToTop';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons/faChevronDown';
import { FeedbackModule } from './feedback/feedback.module';

@NgModule({
	declarations: [
		PageMacrokeyComponent,
		PageLightingcustomizeComponent,
		PageAutocloseComponent,
		UiLightingEffectComponent,
		UiLightingSingleColorComponent,
		UiColorWheelComponent,
		UiMacrokeyDetailsComponent,
		UiLightingProfileComponent,
		UiMacrokeyRecordedListComponent,
		UiColorPickerComponent,
		WidgetLightingDeskComponent,
		WidgetLightingNotebookComponent,
		WidgetMacrokeySettingsComponent,
		WidgetAddedAppListComponent,
		PageNetworkboostComponent,
		UiLightingKeyboardLNBx50Component,
	],
	imports: [
		CommonModule,
		CommonUiModule,
		CommonWidgetModule,
		GamingCommonModule,
		GamingDashboardModule,
		SharedModule,
		GamingRoutingModule,
		FontAwesomeModule,
		ColorPickerModule,
		ContainerCardModule,
		MetricsModule,
		WidgetOfflineModule,
		NgbModalModule,
		NgbTooltipModule,
		FeedbackModule,
		PageLayoutModule,
	],
	exports: [ContainerCardModule, MetricsModule, WidgetOfflineModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	entryComponents: [],
})
export class GamingModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faSpinner);
		library.addIcons(faCog);
		library.addIcons(faQuestionCircle);
		library.addIcons(faCheck);
		library.addIcons(faCheckCircle);
		library.addIcons(faChevronDown);
		library.addIcons(faArrowAltToTop);
	}
}
