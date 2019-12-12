class BatteryGaugeDetail {
	public percentage: number;
	public time: number;
	public timeType: string;
	public isAttached: boolean;
	public isAirplaneModeEnabled: boolean;
	public acAdapterStatus: string;
	public acWattage: number;
	public acAdapterType: string;
	public isPowerDriverMissing: boolean;
	public isExpressCharging: boolean;
	public isEmDriverInstalled: boolean;
}

export default BatteryGaugeDetail;
