import { VantageShellService } from './../../vantage-shell/vantage-shell.service';
import { LoggerService } from '../../logger/logger.service';

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
		} catch (error) {
			this.logger.error('Service-GamingOC-setPerformanceOCSetting: set fail; Error message: ', error.message);
			throw new Error(error.message);
		}
	}
}
