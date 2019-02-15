class BatteryGaugeDetail {
	//#region UI related properties

	public heading: string;

	//#endregion

	//#region battery detail properties

	public barCode: string;
	public status: string;
	public remaining: number;
	public logDateTime: string;
	public lastRunStatus: string;

	//#endregion
}

export default BatteryGaugeDetail;
