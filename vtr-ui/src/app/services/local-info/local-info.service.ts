import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { DeviceService } from '../device/device.service';
import { SelfSelectService } from '../self-select/self-select.service';

@Injectable({
	providedIn: 'root'
})
export class LocalInfoService {

	// private sysInfo: any;
	private localInfo: any;
	private supportLanguages = ['en', 'zh-hans', 'ar', 'cs', 'da', 'de', 'el', 'es', 'fi', 'fr', 'he', 'hr', 'hu', 'it', 'ja', 'ko', 'nb', 'nl', 'pl', 'pt-br', 'pt', 'ro', 'ru', 'sk', 'sl', 'sr-latn', 'sv', 'tr', 'uk', 'zh-hant'];
	private readonly gamingTag = 'Gaming';

	constructor(
		private shellService: VantageShellService,
		private deviceService: DeviceService,
		private selfSelectService: SelfSelectService
	) {
		// this.sysInfo = shellService.getSysinfo();
	}

	async getLocalInfo() {
		if (this.localInfo) {
			if (this.localInfo.segment !== this.gamingTag) {
				this.localInfo.segment = this.selfSelectService.usageType;
			}
			return this.localInfo;
		} else {
			if (this.deviceService) {
				return this.deviceService.getMachineInfo().then(result => {
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
						OS: osName,
						Segment: result.isGaming ? this.gamingTag : this.selfSelectService.usageType,
						Brand: result.brand ? result.brand : 'Lenovo',
					};
					return this.localInfo;
				});
			}
			throw new Error('Error: sysInfo not found');
		}
	}
}
