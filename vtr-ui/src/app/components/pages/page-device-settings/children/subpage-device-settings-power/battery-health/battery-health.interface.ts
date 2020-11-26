import {
	BatteryHealthLevel,
	BatteryHealthTip,
	BatteryLifeSpan,
	BatteryTemperatureStatus,
} from './battery-health.enum';

export interface BatteryHealthResponse {
	temperature: BatteryTemperatureStatus | number;
	isSupportSmartBatteryV2: boolean;
	batteryHealthLevel: BatteryHealthLevel;
	batteryHealthTip: BatteryHealthTip;
	predictedLifeSpan: BatteryLifeSpan;
	// Battery Capacity's percent
	lifePercent: number;
	fullChargeCapacity: number;
	designCapacity: number;
}

export interface Battery {
	getSmartBatteryInfo(): Promise<BatteryHealthResponse>;
}
