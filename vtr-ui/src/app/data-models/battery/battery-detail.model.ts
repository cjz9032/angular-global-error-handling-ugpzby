import BatteryGaugeDetail from './battery-gauge-detail-model';


class BatteryDetail {

	//#region UI related properties

	public heading: string;

	//#endregion

	//#region battery detail properties

	public chargeStatus: number;
	public chargeStatusString: string;
	public mainBatteryPercent: number;
	public remainingPercent: number;
	public remainingTime: number;
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
	public isVoltageError: boolean; 
	public isExpressCharging: boolean;
	//#endregion

	public batteryGaugeDetail: BatteryGaugeDetail;
}

export default BatteryDetail;
