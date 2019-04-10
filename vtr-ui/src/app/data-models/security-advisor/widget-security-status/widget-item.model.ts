export class WidgetItem {
	status: number;
	id: string;
	title: string;
	detail: string;
	path: string;
	type: string;

	constructor(arg: any = {}) {
		this.status = arg.status;
		this.id = arg.id;
		this.title = arg.title;
		this.detail = arg.detail;
		this.path = arg.path;
		this.type = arg.type;
	}
}