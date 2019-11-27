import { BatteryGaugeReset } from './battery-gauge-reset.model';

export class GaugeResetInfoCache {
	isAvailable = false;
	gaugeResetInfo: BatteryGaugeReset[] = [];
}
