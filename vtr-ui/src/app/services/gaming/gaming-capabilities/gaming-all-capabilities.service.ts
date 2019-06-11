import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { CommonService } from '../../common/common.service';
import { Gaming } from 'src/app/enums/gaming.enum';

@Injectable({
	providedIn: 'root'
})
export class GamingAllCapabilitiesService {
	private gamingAllCapabilities: any;
	public isShellAvailable = false;

	constructor(shellService: VantageShellService, private commonService: CommonService) {
		this.gamingAllCapabilities = shellService.getGamingAllCapabilities();
		if (this.gamingAllCapabilities) {
			this.isShellAvailable = true;
		}
	}

	getCapabilities(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingAllCapabilities.getCapabilities();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setCapabilityValuesGlobally(capabilities: any) {
		this.commonService.sendNotification(Gaming.GamingCapablities, capabilities);
		// TODO: Set capability values to local storage.
		// this.commonService.setLocalStorageValue(LocalStorageKey.<keyName>, capabilities.<keyValue>);
	}

	getCapablityFromCache(LocalStorageKey) {
		return this.commonService.getLocalStorageValue(LocalStorageKey);
	}
}
