import { Injectable } from '@angular/core';
import { VantageShellService } from './../../vantage-shell/vantage-shell.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LocalCacheService } from '../../local-cache/local-cache.service';

@Injectable({
	providedIn: 'root',
})
export class GamingAdvancedOCService {
	public isShellAvailable = false;
	private gamingAdvancedOC: any;

	constructor(
		private shellService: VantageShellService,
		private localCacheService: LocalCacheService
	) {
		this.gamingAdvancedOC = shellService.getGamingAdvancedOC();
		if (this.gamingAdvancedOC) {
			this.isShellAvailable = true;
		}
	}
	getAdvancedOCInfo(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingAdvancedOC.getAdvancedOCInfo();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setAdvancedOCInfo(value: any): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingAdvancedOC.setAdvancedOCInfo(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error);
		}
	}

	getAdvancedOCInfoCache() {
		return this.localCacheService.getLocalCacheValue(LocalStorageKey.AdvancedOCInfo);
	}

	setAdvancedOCInfoCache(advancedOCInfo: any) {
		this.localCacheService.setLocalCacheValue(LocalStorageKey.AdvancedOCInfo, advancedOCInfo);
	}
}
