import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackFormComponent } from 'src/app/components/feedback-form/feedback-form/feedback-form.component';
import { WidgetFeedbackComponent } from 'src/app/components/widgets/widget-feedback/widget-feedback.component';
import { TranslationModule } from '../translation.module';
import { CommonPipeModule } from '../common/common-pipe.module';
import { UiButtonModule } from 'src/app/components/ui/ui-button/ui-button.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WidgetOfflineModule } from 'src/app/components/widgets/widget-offline-info/widget-offline.module';

@NgModule({
  declarations: [
    FeedbackFormComponent,
    WidgetFeedbackComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule.forChild(),
    FeedbackRoutingModule,
    CommonPipeModule,
    UiButtonModule,
    NgbDropdownModule,
    WidgetOfflineModule,
    FontAwesomeModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
  ],
  exports: [
    FeedbackFormComponent,
    WidgetFeedbackComponent,
  ],
  providers: [],
  entryComponents: [
    FeedbackFormComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class FeedbackModule { }
