import { BatteryConditionsEnum } from 'src/app/enums/battery-conditions.enum';

export class BatteryConditionModel {
	constructor(
		public condition: number,
		public conditionStatus: number
	) { }

	getBatteryConditionTip(condition: number): string {
		switch (condition) {
			case BatteryConditionsEnum.Good:
				return 'device.deviceSettings.batteryGauge.condition.Good';
			case BatteryConditionsEnum.Bad:
				return 'device.deviceSettings.batteryGauge.condition.Bad';
			case BatteryConditionsEnum.Illegal:
				return 'device.deviceSettings.batteryGauge.condition.Illegal';
			case BatteryConditionsEnum.Exhaustion:
				return 'device.deviceSettings.batteryGauge.condition.Exhaustion';
			case BatteryConditionsEnum.NotDetected:
				return 'device.deviceSettings.batteryGauge.condition.NotDetected';
			case BatteryConditionsEnum.MissingDriver:
				return 'device.deviceSettings.batteryGauge.condition.MissingDriver';
			case BatteryConditionsEnum.NotSupportACAdapter:
				return 'device.deviceSettings.batteryGauge.condition.NotSupportACAdapter';
			case BatteryConditionsEnum.FullACAdapterSupport:
				return 'device.deviceSettings.batteryGauge.condition.FullACAdapterSupport';
			case BatteryConditionsEnum.LimitedACAdapterSupport:
				return 'device.deviceSettings.batteryGauge.condition.LimitedACAdapterSupport';
			case BatteryConditionsEnum.StoreLimitation:
				return 'device.deviceSettings.batteryGauge.condition.StoreLimitation';
			case BatteryConditionsEnum.HighTemperature:
				return 'device.deviceSettings.batteryGauge.condition.HighTemperature';
			case BatteryConditionsEnum.OverheatedBattery:
				return 'device.deviceSettings.batteryGauge.condition.OverheatedBattery';
			case BatteryConditionsEnum.TrickleCharge:
				return 'device.deviceSettings.batteryGauge.condition.TrickleCharge';
			case BatteryConditionsEnum.PermanentError:
				return 'device.deviceSettings.batteryGauge.condition.PermanentError';
			case BatteryConditionsEnum.UnsupportedBattery:
				return 'device.deviceSettings.batteryGauge.condition.Illegal';
			case BatteryConditionsEnum.EMDriverMissing:
				return 'device.deviceSettings.batteryGauge.condition.EMDriverMissing';
		}
	}
}
