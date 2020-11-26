import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { RouterModule } from '@angular/router';
import { AppSearchModule } from 'src/app/beta/app-search/app-search.module';
import { UiCloseButtonComponent } from './ui-close-button.component';
import { TranslationModule } from 'src/app/modules/translation.module';
@NgModule({
	declarations: [UiCloseButtonComponent],
	exports: [UiCloseButtonComponent],
	imports: [CommonModule, MetricsModule, RouterModule, TranslationModule, AppSearchModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class UiCloseButtonModule {}
