import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from '@angular/core';
// import { PageDeviceGamingComponent } from '../components/pages/page-device-gaming/page-device-gaming.component';
//import { WidgetLegionEdgeComponent } from '../components/widgets/widget-legion-edge/widget-legion-edge.component';
// import { WidgetSystemToolsComponent } from '../components/widgets/widget-system-tools/widget-system-tools.component';
// import { WidgetSystemMonitorComponent } from '../components/widgets/widget-system-monitor/widget-system-monitor.component';
// import { WidgetQuicksettingsListComponent } from '../components/widgets/widget-quicksettings-list/widget-quicksettings-list.component';
// import { WidgetLightingComponent } from '../components/widgets/widget-lighting/widget-lighting.component';
//import { ModalGamingLegionedgeComponent } from '../components/modal/modal-gaming-legionedge/modal-gaming-legionedge.component';
import { UiGamingCollapsibleContainerComponent } from '../components/ui/ui-gaming-collapsible-container/ui-gaming-collapsible-container.component';
import { PageMacrokeyComponent } from '../components/pages/page-macrokey/page-macrokey.component';
import { PageLightingcustomizeComponent } from '../components/pages/page-lightingcustomize/page-lightingcustomize.component';
import { PageAutocloseComponent } from '../components/pages/page-autoclose/page-autoclose.component';
import { PageNetworkBoostComponent } from '../components/pages/page-network-boost/page-network-boost.component';
import { UiPopoverComponent } from '../components/ui/ui-popover/ui-popover.component';
import { UiMacrokeyPopupComponent } from '../components/ui/ui-macrokey-popup/ui-macrokey-popup.component';
import { UiLightingProfileToggleComponent } from '../components/ui/ui-lighting-profile-toggle/ui-lighting-profile-toggle.component';
import { UiBrightnessSliderComponent } from '../components/ui/ui-brightness-slider/ui-brightness-slider.component';
import { UiLightingEffectComponent } from '../components/ui/ui-lighting-effect/ui-lighting-effect.component';
import { UiLightingSingleColorComponent } from '../components/ui/ui-lighting-single-color/ui-lighting-single-color.component';
import { UiLightingColorWheelComponent } from '../components/ui/ui-lighting-color-wheel/ui-lighting-color-wheel.component';
import { UiMacrokeyCollapsibleContainerComponent } from '../components/ui/ui-macrokey-collapsible-container/ui-macrokey-collapsible-container.component';
import { UiGamingDriverPopupComponent } from '../components/ui/ui-gaming-driver-popup/ui-gaming-driver-popup.component';
import { UiColorWheelComponent } from '../components/ui/ui-color-wheel/ui-color-wheel.component';
import { UiMacrokeyDetailsComponent } from '../components/ui/ui-macrokey-details/ui-macrokey-details.component';
import { UiLightingProfileComponent } from '../components/ui/ui-lighting-profile/ui-lighting-profile.component';
import { UiMacrokeyRecordedListComponent } from '../components/ui/ui-macrokey-recorded-list/ui-macrokey-recorded-list.component';
import { WidgetMacrokeySettingsComponent } from '../components/widgets/widget-macrokey-settings/widget-macrokey-settings.component';
import { SharedModule } from './shared.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { CommonUiModule } from './common-ui.module';
import { CommonWidgetModule } from './common-widget.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GamingRoutingModule } from '../modules/gaming-routing.module';

@NgModule({
	declarations: [
		//PageDeviceGamingComponent,
		//WidgetLegionEdgeComponent,
		// WidgetSystemToolsComponent,
		// WidgetSystemMonitorComponent,
		// WidgetQuicksettingsListComponent,
		// WidgetLightingComponent,
		//ModalGamingLegionedgeComponent,
		UiGamingCollapsibleContainerComponent,
		PageMacrokeyComponent,
		PageLightingcustomizeComponent,
		PageAutocloseComponent,
		PageNetworkBoostComponent,
		UiPopoverComponent,
		UiMacrokeyPopupComponent,
		UiLightingProfileToggleComponent,
		UiBrightnessSliderComponent,
		UiLightingEffectComponent,
		UiLightingSingleColorComponent,
		UiLightingColorWheelComponent,
		UiMacrokeyCollapsibleContainerComponent,
		UiGamingDriverPopupComponent,
		UiColorWheelComponent,
		UiMacrokeyDetailsComponent,
		UiLightingProfileComponent,
		UiMacrokeyRecordedListComponent,
		WidgetMacrokeySettingsComponent
	],
	imports: [
		CommonModule,
		CommonUiModule,
		CommonWidgetModule,
		SharedModule,
		GamingRoutingModule,
		FontAwesomeModule,
		ColorPickerModule
	],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
	entryComponents: []
})
export class GamingModule {}
