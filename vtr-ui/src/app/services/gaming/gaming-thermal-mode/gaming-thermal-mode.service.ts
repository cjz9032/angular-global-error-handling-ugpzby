import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';

@Injectable({
  providedIn: 'root'
})
export class GamingThermalModeService {
  private gamingThermalMode: any;
	public isShellAvailable = false;

	constructor(shellService: VantageShellService) {
		this.gamingThermalMode = shellService.getGamingThermalMode();
		if (this.gamingThermalMode === undefined) {
		}
		if (this.gamingThermalMode) {
			this.isShellAvailable = true;
		}
	}

	getThermalModeSettingStatus(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingThermalMode.getThermalModeStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setThermalModeSettingStatus(value: number): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingThermalMode.setThermalModeStatus(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	regThermalModeChangeEvent(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingThermalMode.regThermalModeEvent();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	// Vantage 3.2, Thermal Mode 2.0
	getThermalModeRealStatus(): Promise<any> {
		try {
			if(this.isShellAvailable) {
				return this.gamingThermalMode.getThermalModeRealStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	getAutoSwitchStatus(): Promise<any> {
		try {
			if(this.isShellAvailable) {
				return this.gamingThermalMode.getAutoSwitchStatus();
			}
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setAutoSwitchStatus(value: Boolean): Promise<any> {
		try {
			if(this.isShellAvailable) {
				return this.gamingThermalMode.setAutoSwitchStatus(value);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	}

	regThermalModeRealStatusChangeEvent(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingThermalMode.regThermalModeRealStatusEvent();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
