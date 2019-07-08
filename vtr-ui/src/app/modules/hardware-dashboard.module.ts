import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { SharedModule } from './shared.module';
import { SanitizeModule } from './sanitize.module';
import { ModalCommonConfirmationComponent } from '../components/modal/modal-common-confirmation/modal-common-confirmation.component';
import { ModalArticleDetailComponent } from '../components/modal/modal-article-detail/modal-article-detail.component';
import { FeedbackFormComponent } from '../components/feedback-form/feedback-form/feedback-form.component';
import { AppComponent } from '../app.component';
import { NonGamingRoutingModule } from './non-gaming-routing.module';
import { CommsService } from '../services/comms/comms.service';

@NgModule({
	declarations: [
		AppComponent,
		// ModalCommonConfirmationComponent,
		// ModalArticleDetailComponent,
		// FeedbackFormComponent,
	],
	imports: [
		BrowserModule,
		// CommonModule,
		// SharedModule,
		NonGamingRoutingModule
	],
	exports: [
		// CommonModule
	],
	providers: [
		SanitizeModule,
		CommsService
	],
	entryComponents: [
		// ModalCommonConfirmationComponent,
		// ModalArticleDetailComponent,
		// FeedbackFormComponent,
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	],
	bootstrap: [AppComponent]
})
export class HardwareDashboardModule { }
