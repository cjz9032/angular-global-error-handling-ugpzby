import { TranslateService } from '@ngx-translate/core';

export class HomeSecurityAllDevicesItem {
	icon: number;
	count: number;
	type: string;

	constructor(arg: any = {}, translateService: TranslateService) {
		this.icon = arg.icon;
		this.count = arg.count;
		this.type = arg.type;
		translateService.stream(this.type).subscribe((result: string) => {
			this.type = result;
		});
	}
}
