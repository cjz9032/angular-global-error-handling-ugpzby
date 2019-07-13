import { NgModule, ModuleWithProviders } from '@angular/core';

import { TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {Observable, forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';
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
	return new MultiTranslateHttpLoader(http, [
		{prefix: './assets/i18n/', suffix: '.json'},
		{prefix: './assets/i18n/metrics-', suffix: '.json'}
	]);
}




export class MultiTranslateHttpLoader implements TranslateLoader {

	constructor(private http: HttpClient,
				public resources: { prefix: string, suffix: string }[] = [{
					prefix: '/assets/i18n/',
					suffix: '.json'
				}]) {}

	public getTranslation(lang: string): any {

		return forkJoin(this.resources.map(config => {
			return this.http.get(`${config.prefix}${lang}${config.suffix}`);
		})).pipe(map(response => {
			return response.reduce((a, b) => {
				return Object.assign(a, b);
			});
		}));
	}
}

