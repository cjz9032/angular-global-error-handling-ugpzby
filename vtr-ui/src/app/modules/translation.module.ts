import { NgModule, ModuleWithProviders } from '@angular/core';

import { TranslateLoader, TranslateModule, TranslatePipe, MissingTranslationHandler } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MissingTranslationDefaultHandler } from '../i18n/handler/missing-tranlsation-default-handler';
import { WebpackTranslateLoader } from '../i18n/loader/webpack-translate-loader.loader';

@NgModule({
	imports: [
		HttpClientModule,
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
			isolate: false
		})
	],
	exports: [TranslateModule, TranslatePipe]
})
export class TranslationModule {
	static forChild(): ModuleWithProviders {
		return {
			ngModule: TranslationModule
		};
	}
}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http);
}
