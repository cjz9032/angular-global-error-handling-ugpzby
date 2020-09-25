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
import { LocalCacheService } from '../local-cache/local-cache.service';
import { CommonService } from '../common/common.service';
@Injectable({
	providedIn: 'root'
})
export class BatteryDetailService {

	isBatteryModalShown = false;
	private battery: any;
	isAcAttached: boolean;
	gaugePercent: number;
	remainingPercentages: number[] = [];
	gaugeResetInfo: BatteryGaugeReset[];
	isPowerDriverMissing: boolean;
	isGaugeResetRunning: boolean;
	isInvalidBattery: boolean;
	isTemporaryChargeMode: boolean;
	isDlsPiCapable: boolean;
	currentOpenModal: string;

	chargeThresholdInfo = new BehaviorSubject([new ChargeThreshold()]);
	airplaneModeSubject = new BehaviorSubject(new FeatureStatus(false, false));
	expressChargingSubject = new BehaviorSubject(new FeatureStatus(false, false));
	setGaugeResetSectionSubject = new BehaviorSubject(false);

	public isShellAvailable = false;
	constructor(
		shellService: VantageShellService,
		private logger: LoggerService,
		private powerService: PowerService,
		private localCacheService: LocalCacheService,
		private commonService: CommonService) {
		this.battery = shellService.getBatteryInfo();
		if (this.battery) {
			this.isShellAvailable = true;
		}
	}

	// move this method to here from CommonService,
	// the feature related logic should not included in CommonService
	checkPowerPageFlagAndHide() {
		// Solution to fix the issue VAN-14826.
		const isPowerPageAvailable = this.localCacheService.getLocalCacheValue(LocalStorageKey.IsPowerPageAvailable, true);
		if (!isPowerPageAvailable) {
			this.commonService.sendNotification(LocalStorageKey.IsPowerPageAvailable, { available: isPowerPageAvailable, link: false });
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

	public getChargeThresholdInfo() {
		return this.chargeThresholdInfo.asObservable();
	}

	public getAirplaneMode() {
		return this.airplaneModeSubject.asObservable();
	}

	public getExpressCharging() {
		return this.expressChargingSubject.asObservable();
	}

	public getBatterySettings() {
		const isThinkPad = this.localCacheService.getLocalCacheValue(LocalStorageKey.MachineType) === 1;
		if (isThinkPad) {
			this.getBatteryThresholdInformation();
			this.getAirplaneModeCapabilityThinkPad();
		} else {
			// this.getConservationModeStatusIdeaPad();
			this.getRapidChargeModeStatusIdeaPad();
		}
	}

	public getBatteryThresholdInformation(): Promise<any> {
		this.logger.info('Before getBatteryThresholdInformation');
		if (this.powerService.isShellAvailable) {
			return this.powerService.getChargeThresholdInfo().then((response) => {
				this.logger.info('getBatteryThresholdInformation.then', response);
				this.chargeThresholdInfo.next(response);
				this.localCacheService.setLocalCacheValue(LocalStorageKey.BatteryChargeThresholdCapability, response);
			}).catch((error) => {
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
					this.getAirplaneModeThinkPad();
				} else {
					const airplaneMode = new FeatureStatus(false, false);
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
				const airplaneMode = new FeatureStatus(true, value);
				this.airplaneModeSubject.next(airplaneMode);
			}).catch(error => {
				this.logger.error('getAirplaneModeThinkPad', error.message);
				return EMPTY;
			});
		}
	}

	private getRapidChargeModeStatusIdeaPad() {
		this.logger.info('Before getRapidChargeModeStatusIdeaNoteBook');
		if (this.powerService.isShellAvailable) {
			this.powerService.getRapidChargeModeStatusIdeaNoteBook().then((featureStatus) => {
				this.logger.info('getRapidChargeModeStatusIdeaNoteBook.then', featureStatus);
				const expressCharging = new FeatureStatus(featureStatus.available, featureStatus.status);
				this.expressChargingSubject.next(expressCharging);
			}).catch((error) => {
				this.logger.error('getRapidChargeModeStatusIdeaNoteBook', error.message);
				return EMPTY;
			});
		}
	}
}
