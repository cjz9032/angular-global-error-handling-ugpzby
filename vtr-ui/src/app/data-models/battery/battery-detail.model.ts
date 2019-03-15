import BatteryGaugeDetail from './battery-gauge-detail-model';


class BatteryDetail {

	//#region UI related properties

	public heading: string;

	//#endregion

	//#region battery detail properties

	public chargeStatus: string;
	public remainingPercent: number;
	public remainingTime: string;
	public remainingCapacity: number;
	public fullChargeCapacity: number;
	public voltage: number;
	public wattage: number;
	public temperature: number;
	public cycleCount: number;
	public manufacturer: string;
	public manufactureDate: string;
	public firstUseDate: string;
	public barCode: string;
	public deviceChemistry: string;
	public designCapacity: number;
	public designVoltage: number;
	public firmwareVersion: string;
	public fruPartNumber: string;

	//#endregion

	public batteryGaugeDetail: BatteryGaugeDetail;
}

export default BatteryDetail;
