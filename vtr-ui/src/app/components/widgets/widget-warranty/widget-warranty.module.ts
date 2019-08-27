import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {WidgetWarrantyComponent} from './widget-warranty.component';
import { TranslationModule } from 'src/app/modules/translation.module';

@NgModule({
	declarations: [
		WidgetWarrantyComponent
	],
	exports: [
		WidgetWarrantyComponent,
	],
	imports: [
		CommonModule,
		TranslationModule.forChild(),
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class WidgetWarrantyModule { }
