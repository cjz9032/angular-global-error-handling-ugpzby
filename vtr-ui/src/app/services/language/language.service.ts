import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoggerService } from '../logger/logger.service';
import { CommonService } from '../common/common.service';
import { TranslationNotification } from 'src/app/data-models/translation/translation';
import { DashboardLocalStorageKey } from 'src/app/enums/dashboard-local-storage-key.enum';
import { DeviceInfo } from 'src/app/data-models/common/device-info.model';

@Injectable({
	providedIn: 'root'
})
export class LanguageService {
	public isLanguageLoaded = false;
	public currentLanguage: string;
	private readonly defaultLanguage = 'en';
	private readonly supportedLanguages: Array<string> = [
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
		const cachedDeviceInfo: DeviceInfo = this.commonService.getLocalStorageValue(DashboardLocalStorageKey.DeviceInfo, undefined);
		if (cachedDeviceInfo && cachedDeviceInfo.locale && cachedDeviceInfo.locale.length > 0) {
			const isLocaleSame = cachedDeviceInfo.locale === lang.toLowerCase();
			return isLocaleSame;
		}
		return false;
	}
}
