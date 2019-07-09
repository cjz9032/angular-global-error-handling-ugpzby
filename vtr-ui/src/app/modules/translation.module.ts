import { NgModule, ModuleWithProviders } from '@angular/core';

import { TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
	imports: [
		HttpClientModule,
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
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
