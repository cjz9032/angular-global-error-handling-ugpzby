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

	getNeedToAsk(): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.gamingNetworkBoost.getNeedToAsk();
			}
			return undefined;
		} catch (error) {
			throw new Error(error);
		}
	}

	setNeedToAsk(value: boolean): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.gamingNetworkBoost.setNeedToAsk(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error);
		}
	}
}
