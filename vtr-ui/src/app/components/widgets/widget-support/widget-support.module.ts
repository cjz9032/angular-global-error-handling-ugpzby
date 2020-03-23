import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslationModule } from 'src/app/modules/translation.module';
import { WidgetSupportComponent } from './widget-support.component';
import { UiListSupportModule } from '../../ui/ui-list-support/ui-list-support.module';

@NgModule({
	declarations: [
		WidgetSupportComponent,
	],
	exports: [
		WidgetSupportComponent,
	],
	imports: [
		CommonModule,
		TranslationModule.forChild(),
		UiListSupportModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class WidgetSupportModule { }
