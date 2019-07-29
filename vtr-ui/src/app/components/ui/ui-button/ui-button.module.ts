import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { UiButtonComponent } from './ui-button.component';
import { MetricsModule } from 'src/app/directives/metrics.module';

@NgModule({
	declarations: [
		UiButtonComponent
	],
	exports: [
		UiButtonComponent
	],
	imports: [
		CommonModule,
		MetricsModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class UiButtonModule { }
