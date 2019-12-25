import { Injectable } from '@angular/core';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { DeviceService } from '../device/device.service';
import { SelfSelectService, SegmentConst } from '../self-select/self-select.service';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

@Injectable({
	providedIn: 'root'
})
export class LocalInfoService {

	// private sysInfo: any;
	private localInfo: any;
	private supportLanguages = ['en', 'zh-hans', 'ar', 'cs', 'da', 'de', 'el', 'es', 'fi', 'fr', 'he', 'hr', 'hu', 'it', 'ja', 'ko', 'nb', 'nl', 'pl', 'pt-br', 'pt', 'ro', 'ru', 'sk', 'sl', 'sr', 'sv', 'tr', 'uk', 'zh-hant'];
	private readonly gamingTag = SegmentConst.Gaming;
	private selfSelectSegment = null;

	constructor(
		private shellService: VantageShellService,
		private commonService: CommonService,
		private deviceService: DeviceService,
		private selfSelectService: SelfSelectService
	) {
		// this.sysInfo = shellService.getSysinfo();
	}

	async getLocalInfo() {
		if (!this.selfSelectSegment || this.selfSelectSegment !== this.selfSelectService.savedSegment) {
			this.selfSelectSegment = await this.selfSelectService.getSegment();
		}
		if (this.localInfo) {
			if (this.localInfo.Segment !== this.gamingTag) {
				this.localInfo.Segment = this.selfSelectSegment;
			}
			return this.localInfo;
		} else {
			if (this.deviceService) {
				return this.deviceService.getMachineInfo().then(result => {
					if (result) {
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
							Segment: result.isGaming ? this.gamingTag : this.selfSelectSegment,
							Brand: result.brand ? result.brand : 'Lenovo',
						};
					} else {
						this.localInfo = {
							Lang: 'en',
							GEO: 'us',
							OEM: 'Lenovo',
							OS: 'Windows',
							Segment: SegmentConst.Consumer,
							Brand: 'Lenovo',
						};
					}
					return this.localInfo;
				});
			}
			throw new Error('Error: sysInfo not found');
		}
	}
}
