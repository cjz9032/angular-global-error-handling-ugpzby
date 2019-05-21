import { TranslateService } from '@ngx-translate/core';
export class WidgetItem {
	status: number;
	id: string;
	title: string;
	detail: string;
	path: string;
	type: string;

	constructor(arg: any = {}, translateService: TranslateService) {
		this.status = arg.status;
		this.id = arg.id;
		this.title = arg.title;
		this.detail = arg.detail;
		this.path = arg.path;
		this.type = arg.type;
		this.status = 4;
		translateService.stream('common.securityAdvisor.loading').subscribe((value) => {
			if (!this.detail) {
				this.detail = value;
			}
		});
	}
}