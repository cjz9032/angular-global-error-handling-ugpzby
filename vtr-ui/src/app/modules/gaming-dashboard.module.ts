import { GamingCommonModule } from './gaming/gaming.common.module';
import { CommonWidgetModule } from './common/common-widget.module';
import { CommonUiModule } from './common/common-ui.module';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { SharedModule } from './shared.module';
// import { FeedbackFormComponent } from '../components/feedback-form/feedback-form/feedback-form.component';
// import { PageUserComponent } from '../components/pages/page-user/page-user.component';
// import { PageDashboardComponent } from '../components/pages/page-dashboard/page-dashboard.component';
import { PageDeviceGamingComponent } from '../components/pages/page-device-gaming/page-device-gaming.component';
import { GamingDashboardRoutingModule } from './gaming-dashboard-routing.module';
import { MockService } from '../services/mock/mock.service';
import { TranslateModule, TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';
import { HttpLoaderFactory } from './translation.module';
import { HttpClient } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { GamingRoutingModule } from './gaming-routing.module';
import { WidgetLegionEdgeComponent } from '../components/widgets/widget-legion-edge/widget-legion-edge.component';
import { ModalGamingLegionedgeComponent } from '../components/modal/modal-gaming-legionedge/modal-gaming-legionedge.component';
import { WidgetSystemToolsComponent } from '../components/widgets/widget-system-tools/widget-system-tools.component';
import { WidgetSystemMonitorComponent } from '../components/widgets/widget-system-monitor/widget-system-monitor.component';
import { WidgetQuicksettingsListComponent } from '../components/widgets/widget-quicksettings-list/widget-quicksettings-list.component';
import { WidgetLightingComponent } from '../components/widgets/widget-lighting/widget-lighting.component';
import { ContainerCardModule } from '../components/container-card/container-card.module';
import { MetricsModule } from '../directives/metrics.module';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faQuestionCircle } from '@fortawesome/pro-light-svg-icons/faQuestionCircle';
import { faKeyboard } from '@fortawesome/pro-light-svg-icons/faKeyboard';
import { faWindows } from '@fortawesome/free-brands-svg-icons';
import { faCheck } from '@fortawesome/pro-light-svg-icons/faCheck';
import { faDesktopAlt } from '@fortawesome/pro-light-svg-icons/faDesktopAlt';
import { faBatteryBolt } from '@fortawesome/pro-light-svg-icons/faBatteryBolt';
import { faArrowAltToTop } from '@fortawesome/pro-light-svg-icons/faArrowAltToTop';
import { faCog } from '@fortawesome/pro-light-svg-icons/faCog';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons/faChevronDown';
import { WidgetOfflineModule } from 'src/app/components/widgets/widget-offline-info/widget-offline.module';
import { MissingTranslationDefaultHandler } from '../i18n/handler/missing-tranlsation-default-handler';

library.add(faKeyboard);
library.add(faQuestionCircle);
library.add(faWindows);
library.add(faChevronDown);
library.add(faDesktopAlt);
library.add(faBatteryBolt);
library.add(faArrowAltToTop);
library.add(faCog);
library.add(faCheck);

@NgModule({
	declarations: [
		PageDeviceGamingComponent,
		WidgetLegionEdgeComponent,
		ModalGamingLegionedgeComponent,
		WidgetSystemToolsComponent,
		WidgetSystemMonitorComponent,
		WidgetQuicksettingsListComponent,
		WidgetLightingComponent
	],
	imports: [
		CommonModule,
		CommonUiModule,
		CommonWidgetModule,
		SharedModule,
		GamingCommonModule,
		GamingDashboardRoutingModule,
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [ HttpClient ]
			},
			missingTranslationHandler: {
				provide: MissingTranslationHandler,
				useClass: MissingTranslationDefaultHandler
			},
		}),
		FontAwesomeModule,
		ContainerCardModule,
		MetricsModule,
		WidgetOfflineModule
	],
	exports: [ TranslateModule, ContainerCardModule, MetricsModule, WidgetOfflineModule ],
	providers: [ MockService ],
	entryComponents: [
		WidgetLegionEdgeComponent,
		ModalGamingLegionedgeComponent,
		WidgetSystemToolsComponent,
		WidgetSystemMonitorComponent,
		WidgetQuicksettingsListComponent,
		WidgetLightingComponent
	],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
})
export class GamingDashboardModule {}
