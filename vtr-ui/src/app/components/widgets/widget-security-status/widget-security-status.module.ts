import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { UiListChevronModule } from '../../ui/ui-list-chevron/ui-list-chevron.module';
import { WidgetQuestionsComponent } from '../widget-questions/widget-questions.component';
import { WidgetSecurityStatusComponent } from './widget-security-status.component';
import { WidgetStatusComponent } from '../widget-status/widget-status.component';

@NgModule({
	declarations: [WidgetStatusComponent, WidgetSecurityStatusComponent, WidgetQuestionsComponent],
	exports: [WidgetStatusComponent, WidgetSecurityStatusComponent, WidgetQuestionsComponent],
	imports: [CommonModule, TranslationModule.forChild(), UiListChevronModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class WidgetSecurityStatusModule {}
