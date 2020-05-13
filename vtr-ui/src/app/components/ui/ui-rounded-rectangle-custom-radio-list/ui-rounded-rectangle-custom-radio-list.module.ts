import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { FormsModule } from '@angular/forms';
import { UiRoundedRectangleCustomRadioListComponent } from './ui-rounded-rectangle-custom-radio-list.component';
import { TranslateModule, TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';
import { WebpackTranslateLoader } from 'src/app/i18n/loader/webpack-translate-loader.loader';
import { HttpClient } from '@angular/common/http';
import { MissingTranslationDefaultHandler } from 'src/app/i18n/handler/missing-tranlsation-default-handler';

@NgModule({
	declarations: [
		UiRoundedRectangleCustomRadioListComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		MetricsModule,
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useClass: WebpackTranslateLoader,
				deps: [ HttpClient ]
			},
			missingTranslationHandler: {
				provide: MissingTranslationHandler,
				useClass: MissingTranslationDefaultHandler
			},
		}),
	],
	exports: [
		UiRoundedRectangleCustomRadioListComponent
	]
})
export class UiRoundedRectangleCustomRadioListModule { }
