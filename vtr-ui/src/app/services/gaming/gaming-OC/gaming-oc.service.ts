import { VantageShellService } from './../../vantage-shell/vantage-shell.service';

export class GamingOCService {
  private gamingOverClock: any;
  public isShellAvailable = false;

  constructor(
    shellService: VantageShellService
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
			throw new Error(error.message);
		}
	}

	setPerformanceOCSetting(value: Boolean): Promise<any> {
		try {
			if(this.isShellAvailable) {
				return this.gamingOverClock.setPerformanceOCSetting(value);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
