import { CommonModule } from '@angular/common';
import { CommonPipeModule } from 'src/app/modules/common/common-pipe.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA, Injectable } from '@angular/core';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { WidgetCarouselComponent } from './widget-carousel.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslationModule } from 'src/app/modules/translation.module';

import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

import { MatTooltipModule } from '@lenovo/material/tooltip';

@Injectable()
export class HammerConfig extends HammerGestureConfig {
	overrides = <any>{
		swipe: { direction: Hammer.DIRETION_ALLL },
	};
}
@NgModule({
	declarations: [WidgetCarouselComponent],
	exports: [WidgetCarouselComponent],
	providers: [
		{
			provide: HAMMER_GESTURE_CONFIG,
			useClass: HammerGestureConfig,
		},
	],
	imports: [
		CommonModule,
		TranslationModule.forChild(),
		CommonPipeModule,
		MetricsModule,
		NgbCarouselModule,
		MatTooltipModule,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class WidgetCarouselModule { }
