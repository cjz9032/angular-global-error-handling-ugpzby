import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { DeviceService } from '../device/device.service';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { SegmentConst } from '../self-select/self-select.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { LocalCacheService } from '../local-cache/local-cache.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
	providedIn: 'root',
})
export class InitializerService {
	constructor(
		private vantageShellService: VantageShellService,
		private deviceService: DeviceService,
		private localCacheService: LocalCacheService,
		private translate: TranslateService,
		private commonService: CommonService
	) {}

	initialize(): Promise<any> {
		this.commonService.setSessionStorageValue(SessionStorageKey.FirstPageLoaded, false);
		return Promise.all([
			this.deviceService.initIsArm(),
			this.deviceService.getMachineInfo().then((info: any) => {
				this.initializeLanguage(info);
			}),
			this.localCacheService.loadCacheValues().then(() => {
				this.initializeAntivirus();
				this.deviceService.getMachineType();
			}),
		]);
	}

	initializeAntivirus() {
		if (this.vantageShellService.isShellAvailable) {
			const segment: SegmentConst = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.LocalInfoSegment
			);
			if (
				segment &&
				segment !== SegmentConst.Commercial &&
				segment !== SegmentConst.Gaming &&
				!this.deviceService.isArm &&
				!this.deviceService.isSMode
			) {
				const securityAdvisor = this.vantageShellService.getSecurityAdvisor();
				if (securityAdvisor && securityAdvisor.antivirus) {
					securityAdvisor.antivirus.refresh();
				}
			}
		}
	}

	initializeLanguage(info: any): Promise<any> {
		const supportedLanguages: Array<string> = [
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
			'zh-hant', // Chinese (Traditional)
		];

		this.translate.addLangs(supportedLanguages);

		let langCode = 'en';
		if (info && info.locale) {
			const locale = info.locale.toLowerCase();
			if (locale.substring(0, 2) === 'sr') {
				langCode = 'sr-latn';
			} else if (locale.substring(0, 2) === 'pt') {
				langCode = locale === 'pt-br' ? 'pt-br' : 'pt';
			} else if (locale.substring(0, 2) === 'zh') {
				langCode = locale;
			} else {
				langCode = locale.substring(0, 2);
			}
		}

		return this.translate
			.use(supportedLanguages.includes(langCode) ? langCode : 'en')
			.toPromise();
	}
}
