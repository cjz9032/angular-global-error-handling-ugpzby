import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoggerService } from '../logger/logger.service';
import { CommonService } from '../common/common.service';
import { DashboardLocalStorageKey } from 'src/app/enums/dashboard-local-storage-key.enum';
import { DeviceInfo } from 'src/app/data-models/common/device-info.model';

@Injectable({
	providedIn: 'root'
})
export class LanguageService {
	public readonly isLanguageLoaded: boolean;
	private readonly defaultLanguage = 'en';

	constructor(
		private translate: TranslateService,
		private logger: LoggerService,
		private commonService: CommonService
	) {
		// singleton service will call it once
		this.setupTranslation(translate);
		this.isLanguageLoaded = true;
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

		this.useLocaleAvailableInCache();
	}

	public useLanguageByLocale(deviceLocale: string) {
		try {
			if (!deviceLocale) {
				throw new Error('parameter must be device locale');
			}

			let langCode = this.defaultLanguage;
			const locale = deviceLocale.toLowerCase();
			if (locale && !['zh', 'pt'].includes(locale.substring(0, 2))) {
				langCode = locale.substring(0, 2);
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
			this.translate.use(locale);
		}
	}

	private useLocaleAvailableInCache(): boolean {
		// check cache for locale, if available then use it.
		const deviceInfo: DeviceInfo = this.commonService.getLocalStorageValue(DashboardLocalStorageKey.DeviceInfo, undefined);
		if (deviceInfo && deviceInfo.locale) {
			this.useLanguage(deviceInfo.locale);
			return true;
		}
		return false;
	}
}
