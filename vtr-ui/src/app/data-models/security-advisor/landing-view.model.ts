export class LandingView {
	public statusList: Array < StatusInfo > ;
	public subject: string;
	public subjectStatus: number;
	public type: string;
	public imgUrl: string;
}

export interface StatusInfo {
	status: number;
	detail: string;
	path: string;
	title: string;
	type: string;
}
