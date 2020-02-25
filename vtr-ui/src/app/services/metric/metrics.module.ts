import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MetricsDirective } from 'src/app/services/metric/metrics.directive';
import { PageLoadedDetectorDirective } from './page-loaded-detector.directive';

@NgModule({
	declarations: [
		MetricsDirective,
		PageLoadedDetectorDirective
	],
	exports: [
		MetricsDirective,
		PageLoadedDetectorDirective
	],
	imports: [
		CommonModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class MetricsModule { }
