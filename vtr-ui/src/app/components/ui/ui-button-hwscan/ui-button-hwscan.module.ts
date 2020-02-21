import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { UiButtonHWScanComponent } from './ui-button-hwscan.component';
import { MetricsModule } from 'src/app/directives/metrics.module';
import { RouterModule } from '@angular/router';
@NgModule({
	declarations: [
		UiButtonHWScanComponent
	],
	exports: [
		UiButtonHWScanComponent
	],
	imports: [
		CommonModule,
		MetricsModule,
		RouterModule,
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class UiButtonModule { }
