import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoggerService } from '../logger/logger.service';
import { CommonService } from '../common/common.service';
import { TranslationNotification } from 'src/app/data-models/translation/translation';
import { DeviceInfo } from 'src/app/data-models/common/device-info.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Injectable({
	providedIn: 'root'
})
export class LanguageService {
	public isLanguageLoaded = false;
	public currentLanguage: string;
	private readonly defaultLanguage = 'en';
	private readonly supportedLanguages: Array<string> = [
		'ar', // Arabic
		'cs', // Czech
		'da', // Danish
		'de', // German
		'el', // Greek
		'en', // English
		'es', // Spanish
		'fi', // Finnish
		'fr', // French
		'he', // Hebrew
		'hr', // Croatian
		'hu', // Hungarian
		'it', // Italian
		'ja', // Japanese
		'ko', // Korean
		'nb', // Norwegian
		'nl', // Dutch
		'pl', // Polish
		'pt', // Portuguese
		'pt-br', // Brazilian Portuguese
		'ro', // Romanian
		'ru', // Russian
		'sk', // Slovak
		'sl', // Slovenian
		'sr-latn', // Bosnian
		'sv', // Swedish
		'tr', // Turkish
		'uk', // Ukrainian
		'zh-hans', // Chinese (Simplified)
		'zh-hant' // Chinese (Traditional)
	];

	constructor(
		private translate: TranslateService,
		private logger: LoggerService,
		private commonService: CommonService
	) {
		translate.addLangs(this.supportedLanguages);
	}

	public useLanguageByLocale(deviceLocale: string) {
		try {
			if (!deviceLocale) {
				throw new Error('parameter must be device locale');
			}

			let langCode = this.defaultLanguage;
			const locale = deviceLocale.toLowerCase();
			if (locale && !['zh', 'pt'].includes(locale.substring(0, 2))) {
				if (locale && locale.substring(0, 2) === 'sr') {
					langCode = 'sr-Latn';
				} else {
					langCode = locale.substring(0, 2);
				}
			} else {
				if (locale && locale.substring(0, 2) === 'pt') {
					locale === 'pt-br' ? (langCode = 'pt-br') : (langCode = 'pt');
				} else if (locale && locale.substring(0, 2) === 'sr') {
					locale === 'sr-latn' ? (langCode = 'sr-latn') : (langCode = 'sr');
				} else {
					langCode = locale;
				}
			}
			this.useLanguage(langCode);
		} catch (error) {
			this.logger.error('LanguageService.useLanguageByLocale', error.message);
		}
	}

	/**
	 * Sets current translation lang to passed value. Default is English.
	 * @param lang pass supported language as string.
	 */
	public useLanguage(lang: string = this.defaultLanguage) {
		if (lang) {
			// don't load same language multiple times
			// if (this.isLanguageLoaded && this.isLocaleSame(lang)) {
			// 	return;
			// }
			let locale = lang.toLowerCase();
			const isLanguageSupported = this.isLanguageSupported(locale);
			locale = isLanguageSupported ? locale : this.defaultLanguage;
			this.logger.debug('LanguageService.useLanguage load translation for ', locale);
			this.currentLanguage = locale;
			this.translate.use(locale).subscribe(() => {
				// translation file loaded
				this.logger.debug('LanguageService.useLanguage translation loaded', locale);
				this.commonService.sendNotification(TranslationNotification.TranslationLoaded, locale);
				this.isLanguageLoaded = true;
			});
		}
	}

	private isLanguageSupported(lang: string): boolean {
		if (lang) {
			return this.supportedLanguages.includes(lang.toLowerCase());
		}
		return false;
	}

	public isLocaleSame(lang: string) {
		const cachedDeviceInfo: DeviceInfo = this.commonService.getLocalStorageValue(LocalStorageKey.DeviceInfo, undefined);
		if (cachedDeviceInfo && cachedDeviceInfo.locale && cachedDeviceInfo.locale.length > 0) {
			const isLocaleSame = cachedDeviceInfo.locale === lang.toLowerCase();
			return isLocaleSame;
		}
		return false;
	}
}
