import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { SharedModule } from './shared.module';
import { SanitizeModule } from './sanitize.module';
import { ModalCommonConfirmationComponent } from '../components/modal/modal-common-confirmation/modal-common-confirmation.component';
import { ModalArticleDetailComponent } from '../components/modal/modal-article-detail/modal-article-detail.component';
import { FeedbackFormComponent } from '../components/feedback-form/feedback-form/feedback-form.component';

@NgModule({
	declarations: [
		ModalCommonConfirmationComponent,
		ModalArticleDetailComponent,
		FeedbackFormComponent,
	],
	imports: [
		CommonModule,
		SharedModule
	],
	exports: [
	],
	providers: [
		SanitizeModule,

	],
	entryComponents: [
		ModalCommonConfirmationComponent,
		ModalArticleDetailComponent,
		FeedbackFormComponent,
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class HardwareDashboardModule { }
