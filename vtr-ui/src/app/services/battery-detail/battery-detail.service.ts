import { Injectable } from '@angular/core';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { BaseVantageShellService } from '../vantage-shell/base-vantage-shell.service';
@Injectable({
	providedIn: 'root'
})
export class BatteryDetailService {

	private battery: any;
	public isShellAvailable = false;
	constructor(shellService: BaseVantageShellService) {
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
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
