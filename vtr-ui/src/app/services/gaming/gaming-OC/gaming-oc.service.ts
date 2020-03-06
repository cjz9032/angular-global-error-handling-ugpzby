import { Injectable } from '@angular/core';
import { VantageShellService } from './../../vantage-shell/vantage-shell.service';
import { LoggerService } from '../../logger/logger.service';

@Injectable({
	providedIn: 'root'
})
export class GamingOCService {
	private gamingOverClock: any;
	public isShellAvailable = false;

	constructor(
		shellService: VantageShellService,
		private logger: LoggerService
	) {
		// performance OC is a sub-feature of thermal mode 2
		this.gamingOverClock = shellService.getGamingThermalMode();
		if (this.gamingOverClock) {
			this.isShellAvailable = true;
		} else {
			this.logger.error(`Service-GamingThermalMode-Constructor: gamingOverClock is undefined, shell Available: ${this.isShellAvailable}`);
		}
	}

	getPerformanceOCSetting(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingOverClock.getPerformanceOCSetting();
			}
			this.logger.error(`Service-GamingOC-GetPerformanceOCSetting: return undefined, shell Available: ${this.isShellAvailable}`);
			return undefined;
		} catch (error) {
			this.logger.error('Service-GamingOC-GetPerformanceOCSetting: get fail; Error message: ', error.message);
			throw new Error(error.message);
		}
	}

	setPerformanceOCSetting(value: Boolean): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingOverClock.setPerformanceOCSetting(value);
			}
			this.logger.error(`Service-GamingOC-SetPerformanceOCSetting: return undefined, shell Available: ${this.isShellAvailable}`);
			return undefined;
		} catch (error) {
			this.logger.error('Service-GamingOC-SetPerformanceOCSetting: set fail; Error message: ', error.message);
			throw new Error(error.message);
		}
	}
}
