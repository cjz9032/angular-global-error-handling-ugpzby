import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root',
})
export class GamingSystemUpdateService {
	public isShellAvailable = false;
	private gamingOverClock: any;

	constructor(shellService: VantageShellService) {
		this.gamingOverClock = shellService.getGamingOverClock();
		if (this.gamingOverClock) {
			this.isShellAvailable = true;
		}
	}

	getCpuOCStatus(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingOverClock.getCpuOCStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setCpuOCStatus(value: number): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingOverClock.setCpuOCStatus(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getRamOCStatus(): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.gamingOverClock.getRamOCStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setRamOCStatus(value: boolean): Promise<boolean> {
		try {
			if (this.isShellAvailable) {
				return this.gamingOverClock.setRamOCStatus(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
