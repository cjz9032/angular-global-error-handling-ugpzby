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
					this.localInfo = {
						Lang: result.locale.toLowerCase() || 'en',
						GEO: result.country.toLowerCase() || 'us',
						OEM: result.manufacturer || 'Lenovo',
						OS: osName || 'Windows',
						Segment: result.isGaming ? 'Gaming' : 'Consumer',
						Brand: result.brand || 'Lenovo',
					};
					return this.localInfo;
				});
			}
			throw new Error('Error: sysInfo not found');
		}
	}
}
