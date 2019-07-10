import { CommonModule } from '@angular/common';
import { CommonUiModule } from '../common/common-ui.module';
import { CommonWidgetModule } from '../common/common-widget.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FeedbackFormComponent } from 'src/app/components/feedback-form/feedback-form/feedback-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HardwareDashboardRoutingModule } from './hardware-dashboard-routing.module';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../translation.module';
import { MockService } from 'src/app/services/mock/mock.service';
import { PageDashboardComponent } from 'src/app/components/pages/page-dashboard/page-dashboard.component';
import { PageUserComponent } from 'src/app/components/pages/page-user/page-user.component';
import { SharedModule } from '../shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

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
		TranslateModule,
		CommonUiModule
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
