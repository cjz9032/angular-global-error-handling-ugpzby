import { Injectable } from '@angular/core';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { BatteryGaugeReset } from 'src/app/data-models/device/battery-gauge-reset.model';
import { BehaviorSubject } from 'rxjs';
import { ChargeThreshold } from 'src/app/data-models/device/charge-threshold.model';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
@Injectable({
	providedIn: 'root'
})
export class BatteryDetailService {

	isBatteryModalShown = false;
	private battery: any;
	isAcAttached: boolean;
	gaugePercent:number;
	remainingPercentages: number[] = [];
	gaugeResetInfo: BatteryGaugeReset[];
	isPowerDriverMissing: boolean;
	isGaugeResetRunning: boolean;
	isInvalidBattery: boolean;

	chargeThresholdInfo = new BehaviorSubject([new ChargeThreshold()]);
	airplaneModeSubject = new BehaviorSubject(new FeatureStatus(false, false));
	expressChargingSubject = new BehaviorSubject(new FeatureStatus(false, false));

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

	public setChargeThresholdInfo(info: ChargeThreshold[]) {
		this.chargeThresholdInfo.next(info);
	}

	public getChargeThresholdInfo() {
		return this.chargeThresholdInfo.asObservable();
	}

	public getAirplaneMode() {
		return this.airplaneModeSubject.asObservable();
	}

	public setAirplaneMode(value) {
		this.airplaneModeSubject.next(value);
	}

	public getExpressCharging() {
		return this.expressChargingSubject.asObservable();
	}

	public setExpressCharging(value) {
		this.expressChargingSubject.next(value);
	}
}
