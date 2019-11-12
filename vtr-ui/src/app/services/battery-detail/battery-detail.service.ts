import { Injectable } from '@angular/core';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
@Injectable({
	providedIn: 'root'
})
export class BatteryDetailService {

	private battery: any;
	isAcAttached: boolean;
	remainingPercentages: number[] = [];

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

	public startMonitor(handler: any): Promise<any> {
		try {
			if (this.isShellAvailable) {
				return this.battery.startBatteryMonitor((handler));
			}
			return undefined;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	public stopMonitor() {
		if (this.isShellAvailable) {
			this.battery.stopBatteryMonitor((response: boolean) => {
				// this.commonService.sendNotification(DeviceMonitorStatus.MicrophoneStatus, response);
			});
		}
	}
}
