import { TranslateLoader } from '@ngx-translate/core';
import { from, of, Observable } from 'rxjs';

import en from '../../assets/i18n/en.json';
import ptbr from '../../assets/i18n/pt-br.json';
import ja from '../../assets/i18n/ja.json';
import es from '../../assets/i18n/es.json';
import ru from '../../assets/i18n/ru.json';
import zhhans from '../../assets/i18n/zh-hans.json';
import de from '../../assets/i18n/de.json';
import fr from '../../assets/i18n/fr.json';

// this loader will convert JSON files to JS and add HASH during deployment
export class WebpackTranslateLoader implements TranslateLoader {

	getTranslation(lang: string): Observable<any> {

		switch (lang) {
			case 'en':
				return of(en as any);
			case 'pt-br':
				return of(ptbr as any);
			case 'ja':
				return of(ja as any);
			case 'es':
				return of(es as any);
			case 'ru':
				return of(ru as any);
			case 'zh-hans':
				return of(zhhans as any);
			case 'de':
				return of(de as any);
			case 'fr':
				return of(fr as any);
			default:
				return from(import(`../../../assets/i18n/${lang}.json`));
		}
	}
}
