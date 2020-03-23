import { LocalStorageKey } from './../../../enums/local-storage-key.enum';
import { CommonService } from './../../common/common.service';
import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root'
})
export class NetworkBoostService {
	private gamingNetworkBoost: any;
	public isShellAvailable = false;

	public cardContentPositionF: any = {
		FeatureImage:
			'assets/cms-cache/content-card-4x4-support.jpg'
	};
	public cardContentPositionB: any = {
		FeatureImage: 'assets/cms-cache/Security4x3-zone2.jpg'
	};

	constructor(private shellService: VantageShellService, private commonService: CommonService) {
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
			return this.commonService.getLocalStorageValue(LocalStorageKey.NetworkBoosNeedToAskPopup);
		} catch (error) {
			throw new Error(error);
		}
	}

	setNeedToAsk(value: boolean) {
		try {
			value = value === undefined ? false : value;
			this.commonService.setLocalStorageValue(LocalStorageKey.NetworkBoosNeedToAskPopup, value);
		} catch (error) {
			throw new Error(error);
		}
	}
}
