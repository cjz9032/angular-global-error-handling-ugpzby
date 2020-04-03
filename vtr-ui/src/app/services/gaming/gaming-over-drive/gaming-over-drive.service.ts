import { Injectable } from '@angular/core';
import { VantageShellService } from '../../vantage-shell/vantage-shell.service';
import { LoggerService } from '../../logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class GamingOverDriveService {
  private gamingOverDrive: any;
  public isShellAvailable = false;

  constructor(
    shellService: VantageShellService,
    private logger: LoggerService
  ) { 
    this.gamingOverDrive = shellService.getGamingOverDrive();
    if(this.gamingOverDrive) {
      this.isShellAvailable = true;
    }
  }

  getOverDriveStatus(): Promise<any> {
		try {
			if(this.isShellAvailable) {
				return this.gamingOverDrive.getOverDriveStatus();
			}
			this.logger.error(`Service-GamingOverDrive-SetOverDriveStatus: return undefined, shell Available: ${this.isShellAvailable}`);
			return undefined;
		} catch (error) {
			this.logger.error('Service-GamingOverDrive-SetOverDriveStatus: get fail; Error message: ', error.message);
			throw new Error(error.message);
		}
	}

	setOverDriveStatus(value: Boolean): Promise<any> {
		try {
			if(this.isShellAvailable) {
				return this.gamingOverDrive.setOverDriveStatus(value);
			}
			this.logger.error(`Service-GamingOverDrive-SetOverDriveStatus: return undefined, shell Available: ${this.isShellAvailable}`);
			return undefined;
		} catch (error) {
			this.logger.error('Service-GamingOverDrive-SetOverDriveStatus: set fail; Error message: ', error.message);
			throw new Error(error.message);
		}
	}
}
