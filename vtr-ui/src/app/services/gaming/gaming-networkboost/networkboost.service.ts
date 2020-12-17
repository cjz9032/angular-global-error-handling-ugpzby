import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { LocalCacheService } from '../../local-cache/local-cache.service';
import { WindowsVersionService } from 'src/app/services/windows-version/windows-version.service';
import { GAMING_DATA } from './../../../../testing/gaming-data';

@Injectable({
	providedIn: 'root',
})
export class NetworkBoostService {
	public isShellAvailable = false;
	public cardContentPositionF: any = GAMING_DATA.buildFeatureImage(
		this.windowsVerisonService.isNewerThanRS4()
			? 'assets/cms-cache/content-card-4x4-support.webp'
			: 'assets/cms-cache/content-card-4x4-support.jpg'
	);
	public cardContentPositionB: any = GAMING_DATA.buildFeatureImage(
		this.windowsVerisonService.isNewerThanRS4()
			? 'assets/cms-cache/Security4x3-zone2.webp'
			: 'assets/cms-cache/Security4x3-zone2.jpg'
	);
	private gamingNetworkBoost: any;

	constructor(
		private shellService: VantageShellService,
		private localCacheService: LocalCacheService,
		private windowsVerisonService: WindowsVersionService
	) {
		this.gamingNetworkBoost = shellService.getNetworkBoost();
		if (this.gamingNetworkBoost) {
			this.isShellAvailable = true;
		}
	}

	getNetworkBoostStatus(): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.gamingNetworkBoost.getStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error);
		}
	}

	getNetworkBoostList(): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.gamingNetworkBoost.getProcessesInNetworkBoost();
			}
			return undefined;
		} catch (error) {
			throw new Error(error);
		}
	}
	getNetUsingProcesses(): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.gamingNetworkBoost.getNetUsingProcesses();
			}
			return undefined;
		} catch (error) {
			throw new Error(error);
		}
	}
	setNetworkBoostStatus(value: boolean): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.gamingNetworkBoost.setStatus(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error);
		}
	}

	addProcessToNetworkBoost(value: string): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.gamingNetworkBoost.addProcessToNetBoost(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error);
		}
	}

	deleteProcessInNetBoost(value: string): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.gamingNetworkBoost.deleteProcessInNetBoost(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error);
		}
	}

	getNeedToAsk(): any {
		try {
			return this.localCacheService.getLocalCacheValue(
				LocalStorageKey.NetworkBoosNeedToAskPopup
			);
		} catch (error) {
			throw new Error(error);
		}
	}

	setNeedToAsk(value: boolean) {
		try {
			value = value === undefined ? false : value;
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.NetworkBoosNeedToAskPopup,
				value
			);
		} catch (error) {
			throw new Error(error);
		}
	}
}
