import { BatteryQuality } from 'src/app/enums/battery-conditions.enum';

class BatteryIndicator {
	constructor() { }
	public percent = 0;
	public charging: boolean;
	public voltageError = false;
	public batteryNotDetected = false;
	public expressCharging = false;
	public hours = 0;
	public minutes = 0;
	public timeText = '';
	public isAirplaneMode = false;
	public isChargeThresholdOn = false;
	public convertMin(totalMin: number) {
		this.hours = Math.trunc(totalMin / 60);
		this.minutes = Math.trunc(totalMin % 60);
	}
}
export default BatteryIndicator;
