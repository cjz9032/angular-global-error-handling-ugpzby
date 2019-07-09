import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppEventDirective } from '../directives/app-event.directive';
import { OutsideclickDirective } from '../directives/outsideclick.directive';
import { TranslateDirective } from '../directives/translate.directive';
import { MetricsDirective } from '../directives/metrics.directive';

@NgModule({
	declarations: [
		AppEventDirective,
		MetricsDirective,
		OutsideclickDirective,
		TranslateDirective,
	],
	exports: [
		AppEventDirective,
		MetricsDirective,
		OutsideclickDirective,
		TranslateDirective,
	],
	imports: [
		CommonModule
	],
	providers: [
	],
	bootstrap: [
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	],
	entryComponents: [
	]
})
export class CommonDirectiveModule { }
