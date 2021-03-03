import { CommonModule } from '@angular/common';
import { CommonPipeModule } from 'src/app/modules/common/common-pipe.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { TranslationModule } from 'src/app/modules/translation.module';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { MatTooltipModule } from '@lenovo/material/tooltip';
import { WidgetWarrantyDetailComponent } from './widget-warranty-detail.component';
import { UiWarrantyLineComponent } from './children/ui-warranty-line/ui-warranty-line.component';
import { UiWarrantyRoundComponent } from './children/ui-warranty-round/ui-warranty-round.component';
import { UiButtonModule } from '../../ui/ui-button/ui-button.module';
import { UiWarrantyIndicatorComponent } from './children/ui-warranty-indicator/ui-warranty-indicator.component';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
	declarations: [WidgetWarrantyDetailComponent, UiWarrantyLineComponent, UiWarrantyRoundComponent, UiWarrantyIndicatorComponent],
	exports: [WidgetWarrantyDetailComponent],
	providers: [
		{
			provide: HAMMER_GESTURE_CONFIG,
			useClass: HammerGestureConfig,
		},
	],
	imports: [
		CommonModule,
		UiButtonModule,
		TranslationModule.forChild(),
		CommonPipeModule,
		FontAwesomeModule,
		MetricsModule,
		MatTooltipModule,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class WidgetWarrantyDetailModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faArrowRight);
	}
}
