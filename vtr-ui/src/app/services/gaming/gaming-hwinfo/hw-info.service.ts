import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';

@Injectable({
	providedIn: 'root',
})
export class HwInfoService {
	public isShellAvailable = false;
	private gamingHwInfo: any;

	constructor(shellService: VantageShellService) {
		this.gamingHwInfo = shellService.getGamingHwInfo();
		if (this.gamingHwInfo) {
			this.isShellAvailable = true;
		}
	}

	getDynamicInformation(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingHwInfo.getDynamicInformation();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getMachineInfomation(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingHwInfo.getMachineInfomation();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getHwOverClockState(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingHwInfo.getHwOverClockState();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getMachineInfomationForGpuVram(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingHwInfo.getMachineInfomationForGpuVram();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getDynamicInformationForGpuVram(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingHwInfo.getDynamicInformationForGpuVram();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
