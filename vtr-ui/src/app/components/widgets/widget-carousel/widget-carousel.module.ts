import { CommonModule } from '@angular/common';
import { CommonPipeModule } from 'src/app/modules/common/common-pipe.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MetricsModule } from 'src/app/directives/metrics.module';
import { WidgetCarouselComponent } from './widget-carousel.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { AppSearchModule } from 'src/app/beta/app-search/app-search.module';
import { TranslationModule } from 'src/app/modules/translation.module';
@NgModule({
	declarations: [
		WidgetCarouselComponent
	],
	exports: [
		WidgetCarouselComponent
	],
	imports: [
		CommonModule,
		TranslationModule.forChild(),
		CommonPipeModule,
		MetricsModule,
		NgbCarouselModule,
		AppSearchModule
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class WidgetCarouselModule { }
