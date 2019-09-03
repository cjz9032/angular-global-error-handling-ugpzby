import { TranslateService } from '@ngx-translate/core';

export class NotificationItem {
	iconName: string;
	color: string;
	title: string;
	subText: string;
	date: string;
	path = 'home-security';

	constructor(arg: any = {}, translateService: TranslateService) {
		this.iconName = arg.iconName;
		this.color = arg.color;
		this.title = arg.title;
		this.subText = arg.notificationDetail;
		this.date = arg.date;
		translateService.stream(this.title).subscribe((result: string) => {
			this.title = result;
		});
	}
}
