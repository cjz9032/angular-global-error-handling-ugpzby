import { TranslateLoader } from '@ngx-translate/core';
import { from } from 'rxjs/internal/observable/from';
import { Observable } from 'rxjs/internal/Observable';

// this loader will convert JSON files to JS and add HASH during deployment
export class WebpackTranslateLoader implements TranslateLoader {
	getTranslation(lang: string): Observable<any> {
		return from(import(`../../assets/i18n/${lang}.json`));
	}
}
