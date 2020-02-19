import BatteryGaugeDetail from './battery-gauge-detail-model';


class BatteryDetail {

	//#region UI related properties

	public heading: string;

	// #end region

	//#region battery detail properties

	public chargeStatus: number;
	public chargeStatusString: string;
	public remainingPercent: number;
	public remainingTime: number;
	public remainingTimeText: string; // to show label on detail if 2 batteries with different charging status
	public remainingCapacity: number;
	public fullChargeCapacity: number;
	public voltage: number;
	public wattage: number;
	public temperature: number;
	public cycleCount: number;
	public manufacturer: string;
	public manufactureDate: Date;
	public firstUseDate: Date;
	public barCode: string;
	public deviceChemistry: string;
	public designCapacity: number;
	public designVoltage: number;
	public firmwareVersion: string;
	public fruPart: string;
	public batteryHealth: number;
	public batteryCondition: string[];
	public isTemporaryChargeMode: boolean;
	// #end region
}

export default BatteryDetail;
