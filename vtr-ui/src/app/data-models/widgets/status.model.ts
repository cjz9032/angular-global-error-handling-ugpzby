/**
 * model for status widgets
 */
export class Status {
	constructor() {
		this.status = 4;
	}
	public status: number;
	public id: string;
	public title: string;
	public systemDetails: string;
	public detail: string;
	public path: string;
	public asLink: boolean;
	public isSystemLink: boolean;
	public type: string;
	public description: string;
	public metricsItemName: string;
	public isHidden?: boolean;
}

export class DeviceStatus {
	constructor() {}
	public id: string;
	public icon: string;
	public title: string;
	public subtitle: string;
	public link: string;
	public total: string;
	public used: string;
	public percent: number;
	public checkedDate: string;
	public showSepline: boolean;
}

export enum DeviceCondition {
	Loading = 0,
	Good = 1,
	NeedRunSU = 2,
	NeedRunSMPScan = 3,
	NeedRunHWScan = 4,
}
