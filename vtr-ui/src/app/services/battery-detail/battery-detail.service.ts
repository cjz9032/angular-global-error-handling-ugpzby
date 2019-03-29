import { Injectable } from '@angular/core';
import { BaseBatteryDetail } from './base-battery-detail';
import { Observable } from 'rxjs';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
@Injectable({
	providedIn: 'root'
})
export class BatteryDetailService {

	private battery: any;
	public isShellAvailable = false;
	constructor(shellService: VantageShellService) {
		this.battery = shellService.getBatteryInfo();
		if (this.battery) {
			this.isShellAvailable = true;
		}
	}

	getBatteryDetail(): Promise<BatteryDetail[]> {
		try {
			if (this.isShellAvailable) {
				return this.battery.getBatteryInformation();
			}
			return undefined;
		}
		catch (error) {
			throw new Error(error.message);
		}
	}

	getMainBatteryPercentage(): number {
		if (this.isShellAvailable) {
			return this.battery.mainBatteryPercentage;
		}
	}
}
