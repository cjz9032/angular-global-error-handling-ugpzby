import { NgModule, ModuleWithProviders } from '@angular/core';

import { TranslateLoader, TranslateModule, TranslatePipe, MissingTranslationHandler, TranslateStore } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from 'src/app/providers/net/http-interceptors';
import { MissingTranslationDefaultHandler } from '../i18n/handler/missing-tranlsation-default-handler';
import { WebpackTranslateLoader } from '../i18n/loader/webpack-translate-loader.loader';
import { TranslateDefaultValueIfNotFoundPipe } from '../pipe/translate-default-value-if-not-found/translate-default-value-if-not-found.pipe';

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
	exports: [TranslateModule, TranslatePipe],
	providers: [
		httpInterceptorProviders,
		TranslatePipe,
		TranslateDefaultValueIfNotFoundPipe
	]
})
export class TranslationModule {
	static forChild(): ModuleWithProviders<TranslationModule> {
		return {
			ngModule: TranslationModule
		};
	}
}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http);
}
