import { Injectable } from '@angular/core';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { BatteryGaugeReset } from 'src/app/data-models/device/battery-gauge-reset.model';
@Injectable({
	providedIn: 'root'
})
export class BatteryDetailService {

	private battery: any;
	isAcAttached: boolean;
	remainingPercentages: number[] = [];
	gaugeResetInfo: BatteryGaugeReset[];
	isPowerDriverMissing: boolean;
	isEmDriverInstalled: boolean;
	isGaugeResetRunning: boolean;

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
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public startMonitor(handler: any) {
		try {
			if (this.isShellAvailable) {
				this.battery.startBatteryMonitor((handler));
			}
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public stopMonitor() {
		if (this.isShellAvailable) {
			this.battery.stopBatteryMonitor((response: boolean) => { });
		}
	}
}
