/**
 * model for status widgets
 */
export class Status {
	constructor(
	) {
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
