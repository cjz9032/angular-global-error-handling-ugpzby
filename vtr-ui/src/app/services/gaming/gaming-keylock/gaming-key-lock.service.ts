import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root',
})
export class GamingKeyLockService {
	public isShellAvailable = false;
	private gamingKeyLock: any;

	constructor(shellService: VantageShellService) {
		this.gamingKeyLock = shellService.getGamingKeyLock();
		if (this.gamingKeyLock) {
			this.isShellAvailable = true;
		}
	}

	getKeyLockStatus(): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.gamingKeyLock.getKeyLockStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setKeyLockStatus(value: boolean): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.gamingKeyLock.setKeyLockStatus(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
