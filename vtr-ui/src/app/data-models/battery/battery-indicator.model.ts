import { BatteryQuality } from 'src/app/enums/battery-conditions.enum';

class BatteryIndicator {
	constructor() { }
	public batteryHealth: string;
	public percent = 0;
	public charging: boolean;
	public voltageError = false;
	public expressCharging = false;
	public hours = 0;
	public minutes = 0;
	public timeText = '';
	public convertMin(totalMin: number) {
		this.hours = Math.trunc(totalMin / 60);
		this.minutes = Math.trunc(totalMin % 60);
	}

	getBatteryHealth(batteryHealth: number): string {
		switch (batteryHealth) {
			case 3:
				batteryHealth = 1;
				break;
			case 4:
				batteryHealth = 2;
				break;
			case 5:
				batteryHealth = 2;
				break;
		}
		return BatteryQuality[batteryHealth];
	}
}
export default BatteryIndicator;
