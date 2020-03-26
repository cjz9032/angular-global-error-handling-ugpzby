import { VantageShellService } from './../../vantage-shell/vantage-shell.service';
import { LoggerService } from '../../logger/logger.service';
import { Injectable } from '@angular/core';

@Injectable()
export class GamingOCService {
  private gamingOverClock: any;
  public isShellAvailable = false;

  constructor(
	shellService: VantageShellService,
	private logger: LoggerService
  ) {
	this.gamingOverClock = shellService.getGamingThermalMode();
	if(this.gamingOverClock) {
		this.isShellAvailable = true;
	}
  }

	getPerformanceOCSetting(): Promise<any> {
		try {
			if(this.isShellAvailable) {
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
			if(this.isShellAvailable) {
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
