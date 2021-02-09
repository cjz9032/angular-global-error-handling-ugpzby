import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import { faCheckCircle } from '@fortawesome/pro-light-svg-icons/faCheckCircle';
import { TranslateModule, TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';

import { MetricsModule } from 'src/app/services/metric/metrics.module';
import { CommonPipeModule } from 'src/app/modules/common/common-pipe.module';
import { CommonDirectiveModule } from 'src/app/modules/common/common-directive.module';

import { WebpackTranslateLoader } from 'src/app/i18n/loader/webpack-translate-loader.loader';
import { MissingTranslationDefaultHandler } from 'src/app/i18n/handler/missing-tranlsation-default-handler';
import { UiCircleRadioWithCheckBoxListComponent } from './ui-circle-radio-with-checkbox-list.component';

@NgModule({
	declarations: [UiCircleRadioWithCheckBoxListComponent],
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
				deps: [HttpClient],
			},
			missingTranslationHandler: {
				provide: MissingTranslationHandler,
				useClass: MissingTranslationDefaultHandler,
			},
		}),
		CommonDirectiveModule,
	],
	exports: [UiCircleRadioWithCheckBoxListComponent],
})
export class UiCircleRadioWithCheckBoxListModule {
	constructor(library: FaIconLibrary) {
		library.addIcons(faCircle);
		library.addIcons(faCheckCircle);
	}
}
