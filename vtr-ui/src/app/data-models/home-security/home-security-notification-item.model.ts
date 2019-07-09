export class NotificationItem {
	iconName: string;
	color: string;
	title: string;
	subText: string;
	date: string;
	path: string="#";

	constructor(arg: any={}) {
		this.iconName = arg.iconName;
		this.color = arg.color;
		this.title = arg.title;
		this.subText = arg.notificationDetail;
		this.date = arg.date;

	}
}
