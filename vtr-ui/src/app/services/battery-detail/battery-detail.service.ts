import { Injectable } from '@angular/core';
import BatteryDetail from 'src/app/data-models/battery/battery-detail.model';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { BatteryGaugeReset } from 'src/app/data-models/device/battery-gauge-reset.model';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { ChargeThreshold } from 'src/app/data-models/device/charge-threshold.model';
import { FeatureStatus } from 'src/app/data-models/common/feature-status.model';
import { LoggerService } from '../logger/logger.service';
import { PowerService } from '../power/power.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from '../common/common.service';
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
	constructor(shellService: VantageShellService,
		private logger: LoggerService,
		private powerService: PowerService,
		private commonService: CommonService) {
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

	// public setChargeThresholdInfo(info: ChargeThreshold[]) {
	// 	this.chargeThresholdInfo.next(info);
	// }

	public getChargeThresholdInfo() {
		return this.chargeThresholdInfo.asObservable();
	}

	public getAirplaneMode() {
		return this.airplaneModeSubject.asObservable();
	}

	// public setAirplaneMode(value) {
	// 	this.airplaneModeSubject.next(value);
	// }

	public getExpressCharging() {
		return this.expressChargingSubject.asObservable();
	}

	// public setExpressCharging(value) {
	// 	this.expressChargingSubject.next(value);
	// }

	public getBatterySettings() {
		const isThinkPad = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType) === 1;
		if (isThinkPad) {
			this.getBatteryThresholdInformation();
			this.getAirplaneModeCapabilityThinkPad();
		} else {
			// this.getConservationModeStatusIdeaPad();
			this.getRapidChargeModeStatusIdeaPad();
		}
	}

	public getBatteryThresholdInformation() {
		this.logger.info('Before getBatteryThresholdInformation');
		if (this.powerService.isShellAvailable) {
			this.powerService.getChargeThresholdInfo().then((response) => {
				this.logger.info('getBatteryThresholdInformation.then', response);
				// this.onPowerBatteryStatusEvent(response);
				// this.setChargeThresholdInfo(response);
				this.chargeThresholdInfo.next(response);
				this.commonService.setLocalStorageValue(LocalStorageKey.BatteryChargeThresholdCapability, response);
			}).catch ((error) => {
				this.logger.error('getBatteryThresholdInformation :: error', error.message);
				return EMPTY;
			});
		}
	}

	private getAirplaneModeCapabilityThinkPad() {
		this.logger.info('Before getAirplaneModeCapabilityThinkPad.then ');
		if (this.powerService.isShellAvailable) {
			this.powerService.getAirplaneModeCapabilityThinkPad().then((value) => {
				this.logger.info('getAirplaneModeCapabilityThinkPad.then ==>', value);
				if (value) {
					this.getAirplaneModeThinkPad()
				} else {
					const airplaneMode = new FeatureStatus(false, false);
					// this.setAirplaneMode(airplaneMode);
					this.airplaneModeSubject.next(airplaneMode);
				}
			}).catch((error) => {
				this.logger.error('getAirplaneModeCapabilityThinkPad Error ==> ', error.message);
				return EMPTY;
			});
		}
	}

	private getAirplaneModeThinkPad() {
		if (this.powerService.isShellAvailable) {
			this.powerService.getAirplaneModeThinkPad().then((value: any) => {
				this.logger.info('getAirplaneModeThinkPad.then', value);
				// this.batteryIndicator.isAirplaneMode = value;
				const airplaneMode = new FeatureStatus(true, value);
				// this.setAirplaneMode(airplaneMode)
				this.airplaneModeSubject.next(airplaneMode);
			}).catch(error => {
				this.logger.error('getAirplaneModeThinkPad', error.message);
				return EMPTY;
			});
		}
	}

	// private getConservationModeStatusIdeaPad() {
	// 	this.logger.info('Before getConservationModeStatusIdeaNoteBook');
	// 	if (this.powerService.isShellAvailable) {
	// 		this.powerService.getConservationModeStatusIdeaNoteBook().then((featureStatus) => {
	// 			this.logger.info('getConservationModeStatusIdeaNoteBook.then', featureStatus);
	// 			this.commonService.sendNotification('ConservationModeStatus', {available: featureStatus.available, status: featureStatus.status});
	// 			// this.conservationModeStatus = featureStatus;
	// 			// this.updateBatteryLinkStatus(this.conservationModeStatus.available);

	// 			// this.conservationModeCache = featureStatus;
	// 			// this.conservationModeCache.isLoading = this.conservationModeLock;
	// 			// this.commonService.setLocalStorageValue(LocalStorageKey.ConservationModeCapability, this.conservationModeCache);
	// 		}).catch((error) => {
	// 			this.logger.error('getConservationModeStatusIdeaNoteBook', error.message);
	// 			return EMPTY;
	// 		});
	// 	}
	// }

	private getRapidChargeModeStatusIdeaPad() {
		this.logger.info('Before getRapidChargeModeStatusIdeaNoteBook');
		if (this.powerService.isShellAvailable) {
			this.powerService.getRapidChargeModeStatusIdeaNoteBook().then((featureStatus) => {
				this.logger.info('getRapidChargeModeStatusIdeaNoteBook.then', featureStatus);
				const expressCharging = new FeatureStatus(featureStatus.available, featureStatus.status);
				// this.setExpressCharging(expressCharging);
				this.expressChargingSubject.next(expressCharging);
			}).catch((error) => {
				this.logger.error('getRapidChargeModeStatusIdeaNoteBook', error.message);
				return EMPTY;
			});
		}
	}
}
