class BatteryIndicator {
    constructor() { }
    public percent: number = 0;
	public charging: boolean;
	public voltageError: boolean = false; 
    public expressCharging: boolean = false;
    public hours: number = 0;
    public minutes: number = 0;
    public convertMin(totalMin: number) {
        this.hours = Math.trunc(totalMin/60);
        this.minutes = Math.trunc(totalMin%60);
    }
}
export default BatteryIndicator;