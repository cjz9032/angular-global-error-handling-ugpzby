import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import Translation from 'src/app/data-models/translation/translation';
import { TranslationSection } from 'src/app/enums/translation-section.enum';
import { LoggerService } from '../logger/logger.service';
import { CommonService } from '../common/common.service';
import { DashboardLocalStorageKey } from 'src/app/enums/dashboard-local-storage-key.enum';

@Injectable({
	providedIn: 'root'
})
export class LanguageService {
	public subscription: Observable<Translation>;
	private subject: BehaviorSubject<Translation>;
	public readonly isLanguageLoaded: boolean;
	private readonly defaultLanguage = 'en';

	constructor(
		private translate: TranslateService,
		private logger: LoggerService,
		private commonService: CommonService
	) {
		// singleton service will call it once
		this.setupTranslation(translate);
		this.translateStrings(translate);
		this.subject = new BehaviorSubject<Translation>(new Translation(TranslationSection.Unknown, undefined));
		this.subscription = this.subject;
		this.isLanguageLoaded = true;
	}

	private translateStrings(translate: TranslateService) {
		// runtime change in language can be handled like below.
		// subscribe to top level object and update text in one go
		translate.get(TranslationSection.CommonMenu).subscribe((changes: any) => {
			this.notifyChanges(TranslationSection.CommonMenu, changes);
		});

		translate.get(TranslationSection.CommonUi).subscribe((changes: any) => {
			this.notifyChanges(TranslationSection.CommonUi, changes);
		});
	}

	private notifyChanges(type: TranslationSection, payload: any) {
		this.subject.next(new Translation(type, payload));
	}

	private setupTranslation(translate: TranslateService) {
		translate.addLangs([
			'ar',
			'cs',
			'da',
			'de',
			'el',
			'en',
			'es',
			'fi',
			'fr',
			'he',
			'hr',
			'hu',
			'it',
			'ja',
			'ko',
			'nb',
			'nl',
			'pl',
			'pt',
			'pt-br',
			'ro',
			'ru',
			'sk',
			'sl',
			'sr-latn',
			'sv',
			'tr',
			'uk',
			'zh-hans',
			'zh-hant'
		]);
		this.translate.setDefaultLang(this.defaultLanguage);
	}

	public useLanguageByLocale(deviceLocale: string) {
		try {
			if (!deviceLocale) {
				throw new Error('parameter must be device locale');
			}

			let langCode = this.defaultLanguage;
			const locale = deviceLocale.toLowerCase();
			if (locale && ![ 'zh', 'pt' ].includes(locale.substring(0, 2))) {
				langCode = locale.substring(0, 2);
			} else {
				if (locale && locale.substring(0, 2) === 'pt') {
					locale === 'pt-br' ? (langCode = 'pt-br') : (langCode = 'pt');
				} else {
					langCode = locale;
				}
			}
			this.useLanguage(langCode);
		} catch (e) {
			this.logger.error('exception in updateLanguageSettings', JSON.stringify(e));
		}
	}

	/**
	 * Sets current translation lang to passed value. Default is English.
	 * @param lang pass supported language as string.
	 */
	public useLanguage(lang: string = this.defaultLanguage) {
		if (lang) {
			const locale = lang.toLowerCase();
			this.commonService.setLocalStorageValue(DashboardLocalStorageKey.DeviceLocale, locale);
			this.translate.use(locale);
			//this.translate.use('sr');
		}
	}

	public useLocaleAvailableInCache(): boolean {
		// check cache for locale, if available then use it.
		const locale = this.commonService.getLocalStorageValue(DashboardLocalStorageKey.DeviceLocale, undefined);
		if (locale) {
			this.useLanguage(locale);
			return true;
		}
		return false;
	}
}
