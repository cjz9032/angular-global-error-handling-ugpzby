import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { LoggerService } from '../../logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class GamingAccessoryService {

  private gamingAccessory: any;
  public isShellAvailable = false;

  constructor(
    shellService: VantageShellService,
    private logger: LoggerService
  ) { 
    this.gamingAccessory = shellService.getGamingAccessory();
    if(this.gamingAccessory) {
      this.isShellAvailable = true;
    }
  }

  launchAccessory(): Promise<any> {
    try {
			if(this.isShellAvailable) {
				return this.gamingAccessory.setLaunch();
			}
			this.logger.error(`Service-GamingAccessory-LaunchAccessory: return undefined, shell Available: ${this.isShellAvailable}`);
			return undefined;
		} catch (error) {
			this.logger.error('Service-GamingAccessory-LaunchAccessory: get fail; Error message: ', error.message);
			throw new Error(error.message);
		}
  }
}
