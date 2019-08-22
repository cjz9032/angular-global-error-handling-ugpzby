import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root'
})
export class LocalInfoService {

	private sysInfo: any;
	private localInfo: any;
	private defaultInfo = {
		Lang: 'en',
		GEO: 'us',
		OEM: 'Lenovo',
		OS: 'Windows',
		Segment: 'SMB',
		Brand: 'Lenovo'
	};
	supportLanguages = ['en', 'zh-hans', 'ar', 'cs', 'da', 'de', 'el', 'es', 'fi', 'fr', 'he', 'hr', 'hu', 'it', 'ja', 'ko', 'nb', 'nl', 'pl', 'pt-br', 'pt', 'ro', 'ru', 'sk', 'sl', 'sr-latn', 'sv', 'tr', 'uk', 'zh-hant'];

	constructor(
		private shellService: VantageShellService,
	) {
		this.sysInfo = shellService.getSysinfo();
	}

	async getLocalInfo() {
		if (this.localInfo) {
			return this.localInfo;
		} else {
			if (this.sysInfo) {
				return this.sysInfo.getMachineInfo().then(result => {
					let osName = 'Windows';
					if (result.os &&
						result.os.toLowerCase().indexOf('android') > -1) {
						osName = 'Android';
					}
					let lang = 'en';
					if (result.locale) {
						lang = result.locale.toLowerCase();
						if (this.supportLanguages.indexOf(lang) === -1) {
							lang = 'en';
						}
					}
					this.localInfo = {
						Lang: lang,
						GEO: result.country.toLowerCase() ? result.country.toLowerCase() : 'us',
						OEM: result.manufacturer ? result.manufacturer : 'Lenovo',
						OS: osName ? osName : 'Windows',
						Segment: result.isGaming ? 'Gaming' : 'Consumer',
						Brand: result.brand ? result.brand : 'Lenovo',
					};
					return this.localInfo;
				});
			}
			throw new Error('Error: sysInfo not found');
		}
	}
}
