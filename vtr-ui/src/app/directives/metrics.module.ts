import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MetricsDirective } from 'src/app/directives/metrics.directive';

@NgModule({
	declarations: [
		MetricsDirective
	],
	exports: [
		MetricsDirective
	],
	imports: [
		CommonModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class MetricsModule { }
