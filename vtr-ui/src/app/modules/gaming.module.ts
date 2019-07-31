import { GamingCommonModule } from './gaming/gaming.common.module';
import { UiPopoverComponent } from './../components/ui/ui-popover/ui-popover.component';
import { UiGamingDriverPopupComponent } from './../components/ui/ui-gaming-driver-popup/ui-gaming-driver-popup.component';
import { UiGamingCollapsibleContainerComponent } from './../components/ui/ui-gaming-collapsible-container/ui-gaming-collapsible-container.component';
import { ModalGamingLegionedgeComponent } from './../components/modal/modal-gaming-legionedge/modal-gaming-legionedge.component';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from '@angular/core';
import { PageMacrokeyComponent } from '../components/pages/page-macrokey/page-macrokey.component';
import { PageLightingcustomizeComponent } from '../components/pages/page-lightingcustomize/page-lightingcustomize.component';
import { PageAutocloseComponent } from '../components/pages/page-autoclose/page-autoclose.component';
import { PageNetworkBoostComponent } from '../components/pages/page-network-boost/page-network-boost.component';
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
import { faCheck } from '@fortawesome/pro-light-svg-icons/faCheck';
import { library } from '@fortawesome/fontawesome-svg-core';
import { WidgetOfflineModule } from '../components/widgets/widget-offline-info/widget-offline.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalTurnOnComponent } from '../components/modal/modal-autoclose/modal-turn-on/modal-turn-on.component';
import { ModalAddAppsComponent } from '../components/modal/modal-autoclose/modal-add-apps/modal-add-apps.component';

library.add(faCheck);

@NgModule({
	declarations: [
		PageMacrokeyComponent,
		PageLightingcustomizeComponent,
		PageAutocloseComponent,
		PageNetworkBoostComponent,
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
		ModalAddAppsComponent
	],
	imports: [
		CommonModule,
		CommonUiModule,
		CommonWidgetModule,
		GamingCommonModule,
		SharedModule,
		GamingRoutingModule,
		FontAwesomeModule,
		ColorPickerModule,
		ContainerCardModule,
		MetricsModule,
		WidgetOfflineModule,
		NgbModalModule
	],
	exports: [ContainerCardModule, MetricsModule, WidgetOfflineModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	entryComponents: [ModalTurnOnComponent, ModalAddAppsComponent]
})
export class GamingModule { }
