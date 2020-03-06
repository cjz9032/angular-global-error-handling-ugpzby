import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class GamingThermalModeService {
  private gamingThermalMode: any;
	public isShellAvailable = false;

	constructor(
		shellService: VantageShellService,
		private logger: LoggerService
	) {
		this.gamingThermalMode = shellService.getGamingThermalMode();
		if (this.gamingThermalMode === undefined) {
			this.logger.error(`Service-GamingThermalMode-Constructor: gamingThermalMode is undefined, shell Available: ${this.isShellAvailable}`);
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
			this.logger.error(`Service-GamingThermalMode-GetThermalModeSettingStatus: return undefined, shell Available: ${this.isShellAvailable}`);
			return undefined;
		} catch (error) {
			this.logger.error('Service-GamingThermalMode-GetThermalModeSettingStatus: get fail; Error message: ', error.message);
			throw new Error(error.message);
		}
	}

	setThermalModeSettingStatus(value: number): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingThermalMode.setThermalModeStatus(value);
			}
			this.logger.error(`Service-GamingThermalMode-SetThermalModeSettingStatus: return undefined, shell Available: ${this.isShellAvailable}`);
			return undefined;
		} catch (error) {
			this.logger.error('Service-GamingThermalMode-SetThermalModeSettingStatus: set fail; Error message: ', error.message);
			throw new Error(error.message);
		}
	}

	regThermalModeChangeEvent(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingThermalMode.regThermalModeEvent();
			}
			this.logger.error(`Service-GamingThermalMode-RegThermalModeChangeEvent: return undefined, shell Available: ${this.isShellAvailable}`);
			return undefined;
		} catch (error) {
			this.logger.error('Service-GamingThermalMode-RegThermalModeChangeEvent: register fail; Error message: ', error.message);
			throw new Error(error.message);
		}
	}

	// Vantage 3.2, Thermal Mode 2.0
	getThermalModeRealStatus(): Promise<any> {
		try {
			if(this.isShellAvailable) {
				return this.gamingThermalMode.getThermalModeRealStatus();
			}
			this.logger.error(`Service-GamingThermalMode-GetThermalModeRealStatus: return undefined, shell Available: ${this.isShellAvailable}`);
			return undefined;
		} catch (error) {
			this.logger.error('Service-GamingThermalMode-GetThermalModeRealStatus: get fail; Error message: ', error.message);
			throw new Error(error.message);
		}
	}

	getAutoSwitchStatus(): Promise<any> {
		try {
			if(this.isShellAvailable) {
				return this.gamingThermalMode.getAutoSwitchStatus();
			}
			this.logger.error(`Service-GamingThermalMode-GetAutoSwitchStatus: return undefined, shell Available: ${this.isShellAvailable}`);
			return undefined;
		} catch (error) {
			this.logger.error('Service-GamingThermalMode-GetAutoSwitchStatus: get fail; Error message: ', error.message);
			throw new Error(error.message);
		}
	}

	setAutoSwitchStatus(value: Boolean): Promise<any> {
		try {
			if(this.isShellAvailable) {
				return this.gamingThermalMode.setAutoSwitchStatus(value);
			}
			this.logger.error(`Service-GamingThermalMode-SetAutoSwitchStatus: return undefined, shell Available: ${this.isShellAvailable}`);
			return undefined;
		} catch (error) {
			this.logger.error('Service-GamingThermalMode-SetAutoSwitchStatus: set fail; Error message: ', error.message);
			throw new Error(error.message);
		}
	}

	regThermalModeRealStatusChangeEvent(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingThermalMode.regThermalModeRealStatusEvent();
			}
			this.logger.error(`Service-GamingThermalMode-RegThermalModeRealStatusChangeEvent: return undefined, shell Available: ${this.isShellAvailable}`);
			return undefined;
		} catch (error) {
			this.logger.error('Service-GamingThermalMode-RegThermalModeRealStatusChangeEvent: register fail; Error message: ', error.message);
			throw new Error(error.message);
		}
	}
}
