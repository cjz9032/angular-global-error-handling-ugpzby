import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root',
})
export class GamingHybridModeService {
	public isShellAvailable = false;
	private gamingHybridMode: any;

	constructor(shellService: VantageShellService) {
		this.gamingHybridMode = shellService.getGamingHybridMode();
		if (this.gamingHybridMode) {
			this.isShellAvailable = true;
		}
	}

	getHybridModeStatus(): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.gamingHybridMode.getHybridModeStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setHybridModeStatus(value: boolean): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.gamingHybridMode.setHybridModeStatus(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
