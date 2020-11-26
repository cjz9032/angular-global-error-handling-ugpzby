import { Injectable } from '@angular/core';
import { VantageShellService } from './../../vantage-shell/vantage-shell.service';
import { LoggerService } from '../../logger/logger.service';

@Injectable({
	providedIn: 'root',
})
export class GamingOCService {
	private gamingOverClock: any;
	private gamingPerformanceOC: any;
	public isShellAvailable = false;

	constructor(shellService: VantageShellService, private logger: LoggerService) {
		// performance OC is a sub-feature of thermal mode 2
		this.gamingPerformanceOC = shellService.getGamingThermalMode();
		// original OC & thermal mode 3.0 OC are over-clock-feature
		this.gamingOverClock = shellService.getGamingOverClock();
		if (this.gamingPerformanceOC && this.gamingOverClock) {
			this.isShellAvailable = true;
		} else {
			this.logger.error(
				`Service-gamingOC-Constructor: gamingOC is undefined, shell Available: ${this.isShellAvailable}`
			);
		}
	}

	getPerformanceOCSetting(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingPerformanceOC.getPerformanceOCSetting();
			}
			this.logger.error(
				`Service-GamingOC-GetPerformanceOCSetting: return undefined, shell Available: ${this.isShellAvailable}`
			);
			return undefined;
		} catch (error) {
			this.logger.error(
				'Service-GamingOC-GetPerformanceOCSetting: get fail; Error message: ',
				error.message
			);
			throw new Error(error.message);
		}
	}

	setPerformanceOCSetting(value: Boolean): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingPerformanceOC.setPerformanceOCSetting(value);
			}
			this.logger.error(
				`Service-GamingOC-SetPerformanceOCSetting: return undefined, shell Available: ${this.isShellAvailable}`
			);
			return undefined;
		} catch (error) {
			this.logger.error(
				'Service-GamingOC-SetPerformanceOCSetting: set fail; Error message: ',
				error.message
			);
			throw new Error(error.message);
		}
	}

	// Version 3.5
	regOCRealStatusChangeEvent(): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.gamingOverClock.regOCStatusEvent();
			}
			this.logger.error(
				`Service-GamingOC-regOCRealStatusChangeEvent: return undefined, shell Available: ${this.isShellAvailable}`
			);
			return undefined;
		} catch (error) {
			this.logger.error(
				'Service-GamingOC-regOCRealStatusChangeEvent: register fail; Error message: ',
				error.message
			);
			throw new Error(error.message);
		}
	}
}
