import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { TranslateModule, TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';
import { WebpackTranslateLoader } from 'src/app/i18n/loader/webpack-translate-loader.loader';
import { HttpClient } from '@angular/common/http';
import { MissingTranslationDefaultHandler } from 'src/app/i18n/handler/missing-tranlsation-default-handler';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonPipeModule } from 'src/app/modules/common/common-pipe.module';
import { UiCircleRadioWithCheckBoxListComponent } from './ui-circle-radio-with-checkbox-list.component';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faCheckCircle } from '@fortawesome/pro-light-svg-icons/faCheckCircle';

@NgModule({
	declarations: [
		UiCircleRadioWithCheckBoxListComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		MetricsModule,
		FontAwesomeModule,
		CommonPipeModule,
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useClass: WebpackTranslateLoader,
				deps: [HttpClient]
			},
			missingTranslationHandler: {
				provide: MissingTranslationHandler,
				useClass: MissingTranslationDefaultHandler
			},
		}),
	],
	exports: [
		UiCircleRadioWithCheckBoxListComponent
	]
})
export class UiCircleRadioWithCheckBoxListModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faCircle);
		library.addIcons(faCheckCircle);
	}
}
