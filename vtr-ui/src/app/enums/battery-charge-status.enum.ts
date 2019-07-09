import { ERROR_COLLECTOR_TOKEN } from '@angular/platform-browser-dynamic/src/compiler_factory';

export class BatteryChargeStatus {
	public static ERROR = { str: 'Error', id: -1 };
	public static NOT_INSTALLED = { str: 'Not installed', id: -2 };
	public static NO_ACTIVITY = { str: 'No activity', id: 0 };
	public static CHARGING = { str: 'Charging', id: 1 };
	public static DISCHARGING = { str: 'Discharging', id: 2 };
	public static DISCHARGING_WITH_AC = { str: 'Discharging (with ac)', id: 3 };
	public static getBatteryChargeStatus(id: number): string {
		switch (id) {
			case BatteryChargeStatus.ERROR.id:
				return 'device.deviceSettings.batteryGauge.details.chargeStatusString.error';

			case BatteryChargeStatus.NOT_INSTALLED.id:
				return 'device.deviceSettings.batteryGauge.details.chargeStatusString.notinstalled';

			case BatteryChargeStatus.NO_ACTIVITY.id:
				return 'device.deviceSettings.batteryGauge.details.chargeStatusString.noactivity';

			case BatteryChargeStatus.CHARGING.id:
				return 'device.deviceSettings.batteryGauge.details.chargeStatusString.charging';

			case BatteryChargeStatus.DISCHARGING.id:
				return 'device.deviceSettings.batteryGauge.details.chargeStatusString.discharging';

			case BatteryChargeStatus.DISCHARGING_WITH_AC.id:
				return 'device.deviceSettings.batteryGauge.details.chargeStatusString.acdischarging';
		}
	}
}
