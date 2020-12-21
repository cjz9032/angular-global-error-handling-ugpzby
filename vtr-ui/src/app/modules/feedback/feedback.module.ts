import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackFormComponent } from 'src/app/components/feedback-form/feedback-form/feedback-form.component';
import { SurveyFormComponent } from 'src/app/components/feedback-form/survey-form/survey-form.component';
import { WidgetFeedbackComponent } from 'src/app/components/widgets/widget-feedback/widget-feedback.component';
import { TranslationModule } from '../translation.module';
import { CommonPipeModule } from '../common/common-pipe.module';
import { UiButtonModule } from 'src/app/components/ui/ui-button/ui-button.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WidgetOfflineModule } from 'src/app/components/widgets/widget-offline-info/widget-offline.module';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { UiCloseButtonModule } from 'src/app/components/ui/ui-close-button/ui-close-button.module';
import { CommonDirectiveModule } from '../common/common-directive.module';

@NgModule({
	declarations: [FeedbackFormComponent, WidgetFeedbackComponent, SurveyFormComponent],
	imports: [
		CommonModule,
		TranslationModule.forChild(),
		FeedbackRoutingModule,
		CommonPipeModule,
		UiButtonModule,
		UiCloseButtonModule,
		NgbDropdownModule,
		WidgetOfflineModule,
		FontAwesomeModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModalModule,
		MetricsModule,
		CommonDirectiveModule
	],
	exports: [FeedbackFormComponent, WidgetFeedbackComponent, SurveyFormComponent],
	providers: [],
	entryComponents: [FeedbackFormComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class FeedbackModule {}
