import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { SharedModule } from './shared.module';
// import { FeedbackFormComponent } from '../components/feedback-form/feedback-form/feedback-form.component';
// import { PageUserComponent } from '../components/pages/page-user/page-user.component';
// import { PageDashboardComponent } from '../components/pages/page-dashboard/page-dashboard.component';
import { PageDeviceGamingComponent } from '../components/pages/page-device-gaming/page-device-gaming.component';
import { GamingDashboardRoutingModule } from './gaming-dashboard-routing.module';
import { MockService } from '../services/mock/mock.service';
import { CommonUiModule } from './common-ui.module';
import { CommonWidgetModule } from './common-widget.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from './translation.module';
import { HttpClient } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { WidgetLegionEdgeComponent } from '../components/widgets/widget-legion-edge/widget-legion-edge.component';
import { ModalGamingLegionedgeComponent } from '../components/modal/modal-gaming-legionedge/modal-gaming-legionedge.component';
import { WidgetSystemToolsComponent } from '../components/widgets/widget-system-tools/widget-system-tools.component';
import { WidgetSystemMonitorComponent } from '../components/widgets/widget-system-monitor/widget-system-monitor.component';
import { WidgetQuicksettingsListComponent } from '../components/widgets/widget-quicksettings-list/widget-quicksettings-list.component';
import { WidgetLightingComponent } from '../components/widgets/widget-lighting/widget-lighting.component';

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
		GamingDashboardRoutingModule,
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [ HttpClient ]
			}
		}),
		FontAwesomeModule
	],
	exports: [ TranslateModule ],
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
