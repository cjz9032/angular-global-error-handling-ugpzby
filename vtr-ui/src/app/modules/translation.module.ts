
import { NgModule } from '@angular/core';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {Observable, forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';
@NgModule({
	declarations: [],
	imports: [
		HttpClientModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		})
	],
	exports: [TranslateModule]
})
export class TranslationModule { }

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

