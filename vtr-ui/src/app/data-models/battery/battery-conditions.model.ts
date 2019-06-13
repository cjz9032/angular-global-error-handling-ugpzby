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
            case BatteryConditionsEnum.Exhaution:
                return new BatteryConditionNote(
                    'device.deviceSettings.batteryGauge.condition.Exhaution.title',
                    'device.deviceSettings.batteryGauge.condition.Exhaution.description', '', '');
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
                    '', '', '');
            case BatteryConditionsEnum.LimitedACAdapterSupport:
                return new BatteryConditionNote(
                    'device.deviceSettings.batteryGauge.condition.LimitedACAdapterSupport.title',
                    '', '', '');
        }
    }
}
