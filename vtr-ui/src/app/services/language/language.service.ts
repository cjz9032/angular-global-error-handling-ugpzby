import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import Translation from 'src/app/data-models/translation/translation';
import { TranslationSection } from 'src/app/enums/translation-section.enum';
import { LoggerService } from '../logger/logger.service';

@Injectable({
	providedIn: 'root'
})
export class LanguageService {
	public subscription: Observable<Translation>;
	private subject: BehaviorSubject<Translation>;
	public readonly isLanguageLoaded: boolean;

	constructor(
		private translate: TranslateService,
		private logger: LoggerService,
	) {
		this.setupTranslation(translate);
		this.translateStrings(translate);
		this.subject = new BehaviorSubject<Translation>(
			new Translation(TranslationSection.Unknown, undefined)
		);
		this.subscription = this.subject;
		this.isLanguageLoaded = true;
	}

	private translateStrings(translate: TranslateService) {
		// runtime change in language can be handled like below.
		// subscribe to top level object and update text in one go
		translate.get(TranslationSection.CommonMenu)
			.subscribe((changes: any) => {
				this.notifyChanges(TranslationSection.CommonMenu, changes);
			});

		translate.get(TranslationSection.CommonUi)
			.subscribe((changes: any) => {
				this.notifyChanges(TranslationSection.CommonUi, changes);

			});
	}

	private notifyChanges(type: TranslationSection, payload: any) {
		this.subject.next(new Translation(type, payload));
	}

	private setupTranslation(translate: TranslateService) {
		translate.addLangs([
			'en',
			'zh-Hans',
			'ar',
			'cs',
			'da',
			'de',
			'el',
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
			'pt-BR',
			'pt',
			'ro',
			'ru',
			'sk',
			'sl',
			'sr-Latn',
			'sv',
			'tr',
			'uk',
			'zh-Hant'
		]);
		this.translate.setDefaultLang('en');
	}

	public useLanguage(value: any) {
		try {
			if (value && !['zh', 'pt'].includes(value.locale.substring(0, 2).toLowerCase())) {
				this.translate.use(value.locale.substring(0, 2));
			} else {
				if (value && value.locale.substring(0, 2).toLowerCase() === 'pt') {
					value.locale.toLowerCase() === 'pt-br' ? this.translate.use('pt-BR') : this.translate.use('pt');
				}
				if (value && value.locale.toLowerCase() === 'zh-hans') {
					this.translate.use('zh-Hans');
				}
				if (value && value.locale.toLowerCase() === 'zh-hant') {
					this.translate.use('zh-Hant');
				}
			}
		} catch (e) {
			this.logger.error('exception in updateLanguageSettings', JSON.stringify(e));
		}
	}
}

