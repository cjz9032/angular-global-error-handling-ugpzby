import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { CommonService } from '../../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CPUOCStatus } from 'src/app/data-models/gaming/cpu-overclock-status.model';
import { RamOCSatus } from 'src/app/data-models/gaming/ram-overclock-status.model';
import { HybridModeStatus } from 'src/app/data-models/gaming/hybrid-mode-status.model';
import { TouchpadLockStatus } from 'src/app/data-models/gaming/touchpad-lock-status.model';


@Injectable({
	providedIn: 'root'
})
export class GamingSystemUpdateService {
	private gamingOverClock: any;
	public isShellAvailable = false;

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
