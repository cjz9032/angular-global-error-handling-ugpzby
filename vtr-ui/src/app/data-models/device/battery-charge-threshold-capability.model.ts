import { ChargeThreshold } from './charge-threshold.model';

export class BatteryChargeThresholdCapability {
	chargeThresholdCapability = false;
	chargeThresholdStatus = false;
	thresholdInfo: ChargeThreshold[];
}
