import { BatteryConditionTranslation } from './battery-condition-translations.model';

export class BatteryConditionModel {
    batteryCondition: BatteryConditionTranslation;
    constructor(
        public quality: number,
        public condition: number
    ) { }

    getBatteryCondition(condition: string) : BatteryConditionTranslation {
        switch(condition) {
           case 'Good':
                return new BatteryConditionTranslation(
                    'device.deviceSettings.batteryGauge.condition.Good.title',
                    '', '', '');
            case 'Bad':
                return new BatteryConditionTranslation(
                    'device.deviceSettings.batteryGauge.condition.Bad.title',
                    'device.deviceSettings.batteryGauge.condition.Bad.description', '', '');
            case 'Illegal':
                return new BatteryConditionTranslation(
                    'device.deviceSettings.batteryGauge.condition.Illegal.title',
                    'device.deviceSettings.batteryGauge.condition.Illegal.description',
                    'device.deviceSettings.batteryGauge.condition.Illegal.description1',
                    'device.deviceSettings.batteryGauge.condition.Illegal.description2');
            case 'NotGood':
                return new BatteryConditionTranslation(
                    'device.deviceSettings.batteryGauge.condition.NotGood.title',
                    '', '', '');
            case 'StoreLimitation':
                return new BatteryConditionTranslation(
                    'device.deviceSettings.batteryGauge.condition.StoreLimitation.title', '',
                    'device.deviceSettings.batteryGauge.condition.StoreLimitation.description1',
                    'device.deviceSettings.batteryGauge.condition.StoreLimitation.description2');
            case 'Exhaution':
                return new BatteryConditionTranslation(
                    'device.deviceSettings.batteryGauge.condition.Exhaution.title',
                    'device.deviceSettings.batteryGauge.condition.Exhaution.description', '', '');
            case 'NotDetected':
                return new BatteryConditionTranslation(
                    'device.deviceSettings.batteryGauge.condition.NotDetected.title',
                    'device.deviceSettings.batteryGauge.condition.NotDetected.description', '', '');
            case 'MissingDriver':
                return new BatteryConditionTranslation(
                    'device.deviceSettings.batteryGauge.condition.MissingDriver.title',
                    'device.deviceSettings.batteryGauge.condition.MissingDriver.description', '', '');
            case 'NotSupportACAdapter':
                return new BatteryConditionTranslation(
                    'device.deviceSettings.batteryGauge.condition.NotSupportACAdapter.title',
                    '', '', '');
            case 'EnoughPowerACAdapter':
                return new BatteryConditionTranslation(
                    'device.deviceSettings.batteryGauge.condition.EnoughPowerACAdapter.title',
                    'device.deviceSettings.batteryGauge.condition.EnoughPowerACAdapter.description', '', '');
            case 'ACAdapterNotSupported':
                return new BatteryConditionTranslation(
                    'device.deviceSettings.batteryGauge.condition.ACAdapterNotSupported.title',
                    'device.deviceSettings.batteryGauge.condition.ACAdapterNotSupported.description', '', '');
            case 'LimitedACAdapterSupport':
                return new BatteryConditionTranslation(
                    'device.deviceSettings.batteryGauge.condition.LimitedACAdapterSupport.title',
                    '', '', '');
        }
    }
}