import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { CommonService } from '../../common/common.service';
import { Gaming } from 'src/app/enums/gaming.enum';
import { LocalCacheService } from '../../local-cache/local-cache.service';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
	providedIn: 'root',
})
export class GamingAllCapabilitiesService {
	public isShellAvailable = false;
	public macrokey: any;
	private gamingAllCapabilities: any;
	public gamingThermalMode: any = new Subject();
	constructor(
		shellService: VantageShellService,
		private localCacheService: LocalCacheService,
		private commonService: CommonService
	) {
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
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.macroKeyFeature,
			capabilities.macroKeyFeature
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.cpuOCFeature,
			capabilities.cpuOCFeature
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.memOCFeature,
			capabilities.memOCFeature
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.optimizationFeature,
			capabilities.optimizationFeature
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.networkBoostFeature,
			capabilities.networkBoostFeature
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.hybridModeFeature,
			capabilities.hybridModeFeature
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.touchpadLockFeature,
			capabilities.touchpadLockFeature
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.xtuService,
			capabilities.xtuService
		);
		// Version 3.2: thermal mode version 2 on 191101 by Guo Jing
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.desktopType,
			capabilities.desktopType
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.liteGaming,
			capabilities.liteGaming
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.thermalModeVersion,
			capabilities.thermalModeVersion
		);
		// Version 3.2: prevent error of SupporttedThermalMode on 191227 by Guo Jing
		if (capabilities.supporttedThermalMode.length > 1) {
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.supporttedThermalMode,
				capabilities.supporttedThermalMode
			);
		}
		// Version 3.2: performance oc on 191101 by Guo Jing
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.gpuOCFeature,
			capabilities.gpuOCFeature
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.advanceCPUOCFeature,
			capabilities.advanceCPUOCFeature
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.advanceGPUOCFeature,
			capabilities.advanceGPUOCFeature
		);
		this.localCacheService.setLocalCacheValue(LocalStorageKey.nvDriver, capabilities.nvDriver);
		// X50 lighting layout
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.ledLayoutVersion,
			capabilities.ledLayoutVersion
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.LedSwitchButtonFeature,
			capabilities.ledSwitchButtonFeature
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.smartFanFeature,
			capabilities.smartFanFeature
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.ledSetFeature,
			capabilities.ledSetFeature
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.ledDriver,
			capabilities.ledDriver
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.fbNetFilter,
			capabilities.fbnetFilter
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.winKeyLockFeature,
			capabilities.winKeyLockFeature
		);
		// Version 3.3: over drive supported on 200317 by Guo Jing
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.overDriveFeature,
			capabilities.overDriveFeature
		);
		// Version 3.6: cpu-gpu-vram over clock versioin info
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.cpuInfoVersion,
			capabilities.cpuInfoVersion
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.gpuInfoVersion,
			capabilities.gpuInfoVersion
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.diskInfoVersion,
			capabilities.diskInfoVersion
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.gpuCoreOCFeature,
			capabilities.gpuCoreOCFeature
		);
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.gpuVramOCFeature,
			capabilities.gpuVramOCFeature
		);

		this.commonService.sendGamingCapabilitiesNotification(
			Gaming.GamingCapabilities,
			capabilities
		);
	}

	getCapabilityFromCache(storageKey: any) {
		return this.localCacheService.getLocalCacheValue(storageKey);
	}

	// Version 3.7 app search for gaming
	public getGamingThermalModeNotification(): Observable<any> {
		return this.gamingThermalMode.asObservable();
	}
	public sendGamingThermalModeNotification(action, payload) {
		this.gamingThermalMode.next({ type: action, payload });
	}
}
