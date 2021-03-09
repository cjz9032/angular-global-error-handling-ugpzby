import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';

import { CommonDirectiveModule } from 'src/app/modules/common/common-directive.module';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { UiRoundedRectangleCustomRadioListComponent } from './ui-rounded-rectangle-custom-radio-list.component';
import { WebpackTranslateLoader } from 'src/app/i18n/loader/webpack-translate-loader.loader';
import { MissingTranslationDefaultHandler } from 'src/app/i18n/handler/missing-tranlsation-default-handler';

@NgModule({
	declarations: [UiRoundedRectangleCustomRadioListComponent],
	imports: [
		CommonModule,
		FormsModule,
		MetricsModule,
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useClass: WebpackTranslateLoader,
				deps: [HttpClient],
			},
			missingTranslationHandler: {
				provide: MissingTranslationHandler,
				useClass: MissingTranslationDefaultHandler,
			},
		}),
		CommonDirectiveModule,
	],
	exports: [UiRoundedRectangleCustomRadioListComponent],
})
export class UiRoundedRectangleCustomRadioListModule { }
