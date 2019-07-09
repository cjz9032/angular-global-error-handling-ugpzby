import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { SharedModule } from './shared.module';
import { FeedbackFormComponent } from '../components/feedback-form/feedback-form/feedback-form.component';
import { PageUserComponent } from '../components/pages/page-user/page-user.component';
import { PageDashboardComponent } from '../components/pages/page-dashboard/page-dashboard.component';
import { HardwareDashboardRoutingModule } from './hardware-dashboard-routing.module';
import { MockService } from '../services/mock/mock.service';
import { CommonUiModule } from './common-ui.module';
import { CommonWidgetModule } from './common-widget.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from './translation.module';
import { HttpClient } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
	declarations: [
		FeedbackFormComponent,
		PageUserComponent,
		PageDashboardComponent,
	],
	imports: [
		CommonModule,
		CommonUiModule,
		CommonWidgetModule,
		SharedModule,
		HardwareDashboardRoutingModule,
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		FontAwesomeModule
	],
	exports: [
		TranslateModule
	],
	providers: [
		MockService
	],
	entryComponents: [
		FeedbackFormComponent,
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class HardwareDashboardModule { }
