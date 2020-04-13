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
		this.commonService.setLocalStorageValue(LocalStorageKey.macroKeyFeature, capabilities.macroKeyFeature);
		this.commonService.setLocalStorageValue(LocalStorageKey.cpuOCFeature, capabilities.cpuOCFeature);
		this.commonService.setLocalStorageValue(LocalStorageKey.memOCFeature, capabilities.memOCFeature);
		this.commonService.setLocalStorageValue(LocalStorageKey.optimizationFeature, capabilities.optimizationFeature);
		this.commonService.setLocalStorageValue(LocalStorageKey.networkBoostFeature, capabilities.networkBoostFeature);
		this.commonService.setLocalStorageValue(LocalStorageKey.hybridModeFeature, capabilities.hybridModeFeature);
		this.commonService.setLocalStorageValue(LocalStorageKey.touchpadLockFeature, capabilities.touchpadLockFeature);
		this.commonService.setLocalStorageValue(LocalStorageKey.xtuService, capabilities.xtuService);
		// Version 3.2: thermal mode version 2 on 191101 by Guo Jing
		this.commonService.setLocalStorageValue(LocalStorageKey.desktopType, capabilities.desktopType);
		this.commonService.setLocalStorageValue(LocalStorageKey.liteGaming, capabilities.liteGaming);
		this.commonService.setLocalStorageValue(LocalStorageKey.thermalModeVersion, capabilities.thermalModeVersion);
		// Version 3.2: prevent error of SupporttedThermalMode on 191227 by Guo Jing
		if (capabilities.supporttedThermalMode.length > 1) {
			this.commonService.setLocalStorageValue(LocalStorageKey.supporttedThermalMode, capabilities.supporttedThermalMode);
		}
		// Version 3.2: performance oc on 191101 by Guo Jing
		this.commonService.setLocalStorageValue(LocalStorageKey.gpuOCFeature, capabilities.gpuOCFeature);
		this.commonService.setLocalStorageValue(LocalStorageKey.advanceCPUOCFeature, capabilities.advanceCPUOCFeature);
		this.commonService.setLocalStorageValue(LocalStorageKey.advanceGPUOCFeature, capabilities.advanceGPUOCFeature);
		this.commonService.setLocalStorageValue(LocalStorageKey.nvDriver, capabilities.nvDriver);
		// X50 lighting layout
		this.commonService.setLocalStorageValue(LocalStorageKey.ledLayoutVersion, capabilities.ledLayoutVersion);
		this.commonService.setLocalStorageValue(LocalStorageKey.LedSwitchButtonFeature, capabilities.ledSwitchButtonFeature);
		this.commonService.setLocalStorageValue(LocalStorageKey.smartFanFeature, capabilities.smartFanFeature);
		this.commonService.setLocalStorageValue(LocalStorageKey.ledSetFeature, capabilities.ledSetFeature);
		this.commonService.setLocalStorageValue(LocalStorageKey.ledDriver, capabilities.ledDriver);
		this.commonService.setLocalStorageValue(LocalStorageKey.fbNetFilter, capabilities.fbnetFilter);
		this.commonService.setLocalStorageValue(LocalStorageKey.winKeyLockFeature, capabilities.winKeyLockFeature);
		// Version 3.3: over drive supported on 200317 by Guo Jing
		this.commonService.setLocalStorageValue(LocalStorageKey.overDriveFeature, capabilities.overDriveFeature)
		this.commonService.setLocalStorageValue(LocalStorageKey.accessoryFeature, capabilities.accessoryFeature)
		this.commonService.sendGamingCapabilitiesNotification(Gaming.GamingCapabilities, capabilities);
	}

	getCapabilityFromCache(storageKey: any) {
		return this.commonService.getLocalStorageValue(storageKey);
	}
}
