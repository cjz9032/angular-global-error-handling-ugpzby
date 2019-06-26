import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root'
})
export class NetworkBoostService {
	private gamingNetworkBoost: any;
	public isShellAvailable = false;

	constructor(private shellService: VantageShellService) {
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
}
