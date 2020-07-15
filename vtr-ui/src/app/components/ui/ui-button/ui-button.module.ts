import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { UiButtonComponent } from './ui-button.component';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { RouterModule } from '@angular/router';
import { AppSearchModule } from 'src/app/beta/app-search/app-search.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MetricsDirective } from 'src/app/services/metric/metrics.directive';
@NgModule({
	declarations: [
		UiButtonComponent, MetricsDirective
	],
	exports: [
		UiButtonComponent
	],
	imports: [
		CommonModule,
		MetricsModule,
		RouterModule,
		AppSearchModule,
		NgbTooltipModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class UiButtonModule { }
