import { BatteryConditionNote } from './battery-condition-translations.model';
import { BatteryConditionsEnum } from 'src/app/enums/battery-conditions.enum';

export class BatteryConditionModel {
	batteryCondition: BatteryConditionNote;
	constructor(
		public condition: number,
		public conditionStatus: number
	) { }

	getBatteryCondition(condition: number): BatteryConditionNote {
		switch (condition) {
			case BatteryConditionsEnum.Good:
				return new BatteryConditionNote(
					'device.deviceSettings.batteryGauge.condition.Good.title',
					'', '', '');
			case BatteryConditionsEnum.Bad:
				return new BatteryConditionNote(
					'device.deviceSettings.batteryGauge.condition.Bad.title',
					'device.deviceSettings.batteryGauge.condition.Bad.description', '', '');
			case BatteryConditionsEnum.Illegal:
				return new BatteryConditionNote(
					'device.deviceSettings.batteryGauge.condition.Illegal.title',
					'device.deviceSettings.batteryGauge.condition.Illegal.description',
					'device.deviceSettings.batteryGauge.condition.Illegal.description1',
					'device.deviceSettings.batteryGauge.condition.Illegal.description2');
			case BatteryConditionsEnum.Exhaustion:
				return new BatteryConditionNote(
					'device.deviceSettings.batteryGauge.condition.Exhaustion.title',
					'device.deviceSettings.batteryGauge.condition.Exhaustion.description', '', '');
			case BatteryConditionsEnum.NotDetected:
				return new BatteryConditionNote(
					'device.deviceSettings.batteryGauge.condition.NotDetected.title',
					'device.deviceSettings.batteryGauge.condition.NotDetected.description', '', '');
			case BatteryConditionsEnum.MissingDriver:
				return new BatteryConditionNote(
					'device.deviceSettings.batteryGauge.condition.MissingDriver.title',
					'device.deviceSettings.batteryGauge.condition.MissingDriver.description', '', '');
			case BatteryConditionsEnum.NotSupportACAdapter:
				return new BatteryConditionNote(
					'device.deviceSettings.batteryGauge.condition.NotSupportACAdapter.title',
					'device.deviceSettings.batteryGauge.condition.NotSupportACAdapter.description', '', '');
			case BatteryConditionsEnum.LimitedACAdapterSupport:
				return new BatteryConditionNote(
					'device.deviceSettings.batteryGauge.condition.LimitedACAdapterSupport.title',
					'device.deviceSettings.batteryGauge.condition.LimitedACAdapterSupport.description', '', '');
			case BatteryConditionsEnum.StoreLimitation:
				return new BatteryConditionNote(
					'device.deviceSettings.batteryGauge.condition.StoreLimitation.title', '',
					'device.deviceSettings.batteryGauge.condition.StoreLimitation.description1',
					'device.deviceSettings.batteryGauge.condition.StoreLimitation.description2');
			case BatteryConditionsEnum.HighTemperature:
				return new BatteryConditionNote(
					'device.deviceSettings.batteryGauge.condition.HighTemperature.title',
					'device.deviceSettings.batteryGauge.condition.HighTemperature.description',
					'device.deviceSettings.batteryGauge.condition.HighTemperature.description1', ''
				);
			case BatteryConditionsEnum.OverheatedBattery:
				return new BatteryConditionNote('',
					'device.deviceSettings.batteryGauge.condition.OverheatedBattery.description',
					'device.deviceSettings.batteryGauge.condition.OverheatedBattery.description1',
					'device.deviceSettings.batteryGauge.condition.OverheatedBattery.description2'
				);
			case BatteryConditionsEnum.TrickleCharge:
				return new BatteryConditionNote('',
					'device.deviceSettings.batteryGauge.condition.TrickleCharge.description',
					'device.deviceSettings.batteryGauge.condition.TrickleCharge.description1',
					'device.deviceSettings.batteryGauge.condition.TrickleCharge.description2'
				);
			case BatteryConditionsEnum.PermanentError:
				return new BatteryConditionNote('',
					'device.deviceSettings.batteryGauge.condition.PermanentError.description',
					'device.deviceSettings.batteryGauge.condition.PermanentError.description1',
					'device.deviceSettings.batteryGauge.condition.PermanentError.description2'
				);
			case BatteryConditionsEnum.HardwareAuthenticationError:
				return new BatteryConditionNote('',
					'device.deviceSettings.batteryGauge.condition.HardwareAuthenticationError.description',
					'device.deviceSettings.batteryGauge.condition.HardwareAuthenticationError.description1',
					'device.deviceSettings.batteryGauge.condition.HardwareAuthenticationError.description2'
				);

		}
	}
}
