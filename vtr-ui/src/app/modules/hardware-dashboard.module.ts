import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { SharedModule } from './shared.module';
import { SanitizeModule } from './sanitize.module';
import { FeedbackFormComponent } from '../components/feedback-form/feedback-form/feedback-form.component';
import { PageUserComponent } from '../components/pages/page-user/page-user.component';
import { PageDashboardComponent } from '../components/pages/page-dashboard/page-dashboard.component';
import { HardwareDashboardRoutingModule } from './hardware-dashboard-routing.module';
import { MockService } from '../services/mock/mock.service';

@NgModule({
	declarations: [
		FeedbackFormComponent,
		PageUserComponent,
		PageDashboardComponent,

	],
	imports: [
		CommonModule,
		SharedModule,
		HardwareDashboardRoutingModule
	],
	exports: [
	],
	providers: [
		SanitizeModule,
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
