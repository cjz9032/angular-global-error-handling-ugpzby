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
		if(this.gamingThermalMode === undefined) {
		}
		if (this.gamingThermalMode) {
			this.isShellAvailable = true;
		}
  }
  
  getThermalModeStatus(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingThermalMode.getThermalModeStatus();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	setThermalModeStatus(value: number): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingThermalMode.setThermalModeStatus(value);
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
  }

  regThermalModeEvent(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingThermalMode.regThermalModeEvent();
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}
  

}
