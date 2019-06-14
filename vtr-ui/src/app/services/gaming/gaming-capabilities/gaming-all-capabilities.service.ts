import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
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
	public macrokey: any;
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
		this.commonService.setLocalStorageValue(LocalStorageKey.macroKeyFeature, capabilities.macroKeyFeature);
		this.commonService.setLocalStorageValue(LocalStorageKey.cpuOCFeature, capabilities.cpuOCFeature);
		this.commonService.setLocalStorageValue(LocalStorageKey.memOCFeature, capabilities.memOCFeature);
		this.commonService.setLocalStorageValue(LocalStorageKey.networkBoostFeature, capabilities.networkBoostFeature);
		this.commonService.setLocalStorageValue(LocalStorageKey.hybridModeFeature, capabilities.hybridModeFeature);
		this.commonService.setLocalStorageValue(LocalStorageKey.touchpadLockFeature, capabilities.touchpadLockFeature);
	}

	getCapabilityFromCache(storageKey: any) {
		return this.commonService.getLocalStorageValue(storageKey);
	}
}
