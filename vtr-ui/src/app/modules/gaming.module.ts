import { GamingDashboardModule } from './gaming-dashboard.module';
import { PageNetworkboostComponent } from './../components/pages/page-networkboost/page-networkboost.component';
import { WidgetNetworkboostComponent } from './../components/widgets/widget-networkboost/widget-networkboost.component';
import { GamingCommonModule } from './gaming/gaming.common.module';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from '@angular/core';
import { PageMacrokeyComponent } from '../components/pages/page-macrokey/page-macrokey.component';
import { PageLightingcustomizeComponent } from '../components/pages/page-lightingcustomize/page-lightingcustomize.component';
import { PageAutocloseComponent } from '../components/pages/page-autoclose/page-autoclose.component';
import { UiMacrokeyPopupComponent } from '../components/ui/ui-macrokey-popup/ui-macrokey-popup.component';
import { UiLightingProfileToggleComponent } from '../components/ui/ui-lighting-profile-toggle/ui-lighting-profile-toggle.component';
import { UiBrightnessSliderComponent } from '../components/ui/ui-brightness-slider/ui-brightness-slider.component';
import { UiLightingEffectComponent } from '../components/ui/ui-lighting-effect/ui-lighting-effect.component';
import { UiLightingSingleColorComponent } from '../components/ui/ui-lighting-single-color/ui-lighting-single-color.component';
import { UiMacrokeyCollapsibleContainerComponent } from '../components/ui/ui-macrokey-collapsible-container/ui-macrokey-collapsible-container.component';
import { UiColorWheelComponent } from '../components/ui/ui-color-wheel/ui-color-wheel.component';
import { UiMacrokeyDetailsComponent } from '../components/ui/ui-macrokey-details/ui-macrokey-details.component';
import { UiLightingProfileComponent } from '../components/ui/ui-lighting-profile/ui-lighting-profile.component';
import { UiMacrokeyRecordedListComponent } from '../components/ui/ui-macrokey-recorded-list/ui-macrokey-recorded-list.component';
import { WidgetMacrokeySettingsComponent } from '../components/widgets/widget-macrokey-settings/widget-macrokey-settings.component';
import { SharedModule } from './shared.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { CommonUiModule } from './common/common-ui.module';
import { CommonWidgetModule } from './common/common-widget.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GamingRoutingModule } from '../modules/gaming-routing.module';
import { WidgetAutocloseComponent } from '../components/widgets/widget-autoclose/widget-autoclose.component';
import { ContainerCardModule } from '../components/container-card/container-card.module';
import { MetricsModule } from '../directives/metrics.module';
import { WidgetOfflineModule } from '../components/widgets/widget-offline-info/widget-offline.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalTurnOnComponent } from '../components/modal/modal-autoclose/modal-turn-on/modal-turn-on.component';
import { ModalAddAppsComponent } from '../components/modal/modal-autoclose/modal-add-apps/modal-add-apps.component';
import { NetworkboostAddAppsComponent } from '../components/modal/modal-network-boost/networkboost-add-apps/networkboost-add-apps.component';
import { NetworkboostTurnOnComponent } from '../components/modal/modal-network-boost/networkboost-turn-on/networkboost-turn-on.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PageLayoutModule } from 'src/app/components/page-layout/page-layout.module';

// Load Icons for Gaming
import { library } from '@fortawesome/fontawesome-svg-core';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons/faQuestionCircle';
import { faCog } from '@fortawesome/pro-light-svg-icons/faCog';
import { faCheck } from '@fortawesome/pro-light-svg-icons/faCheck';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faArrowAltToTop } from '@fortawesome/pro-light-svg-icons/faArrowAltToTop';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons/faChevronDown';
import { FeedbackModule } from './feedback/feedback.module';

library.add(faSpinner);
library.add(faCog);
library.add(faQuestionCircle);
library.add(faCheck);
library.add(faCheckCircle);
library.add(faChevronDown);
library.add(faArrowAltToTop);

@NgModule({
	declarations: [
		PageMacrokeyComponent,
		PageLightingcustomizeComponent,
		PageAutocloseComponent,
		UiMacrokeyPopupComponent,
		UiLightingProfileToggleComponent,
		UiBrightnessSliderComponent,
		UiLightingEffectComponent,
		UiLightingSingleColorComponent,
		UiMacrokeyCollapsibleContainerComponent,
		UiColorWheelComponent,
		UiMacrokeyDetailsComponent,
		UiLightingProfileComponent,
		UiMacrokeyRecordedListComponent,
		WidgetMacrokeySettingsComponent,
		WidgetAutocloseComponent,
		ModalTurnOnComponent,
		PageNetworkboostComponent,
		WidgetNetworkboostComponent,
		ModalAddAppsComponent,
		NetworkboostAddAppsComponent,
		NetworkboostTurnOnComponent
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
		PageLayoutModule
	],
	exports: [ ContainerCardModule, MetricsModule, WidgetOfflineModule ],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
	entryComponents: []
})
export class GamingModule {}
