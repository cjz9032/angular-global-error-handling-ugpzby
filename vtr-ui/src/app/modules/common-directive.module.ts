import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppEventDirective } from '../directives/app-event.directive';
import { OutsideclickDirective } from '../directives/outsideclick.directive';
import { TranslateDirective } from '../directives/translate.directive';
import { MetricsDirective } from '../directives/metrics.directive';
import { LinkStatusDirective } from '../directives/link-status.directive';

@NgModule({
	declarations: [
		AppEventDirective,
		MetricsDirective,
		OutsideclickDirective,
		TranslateDirective,
		LinkStatusDirective
	],
	exports: [
		AppEventDirective,
		MetricsDirective,
		OutsideclickDirective,
		TranslateDirective,
		LinkStatusDirective
	],
	imports: [
		CommonModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class CommonDirectiveModule { }
