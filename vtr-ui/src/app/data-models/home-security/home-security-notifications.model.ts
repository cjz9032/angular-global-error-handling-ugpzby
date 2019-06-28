import { NotificationItem } from './home-security-notification-item.model';
import { CHSNotificationType, CHSNotifications } from '@lenovo/tan-client-bridge';

export class HomeSecurityNotifications {
	iconName: string;
	color: string;
	title: string;
	subText: string;
	date: string;
	// notification: CHSNotifications;
	notificationItem: NotificationItem[];
	constructor(notification: CHSNotifications) {
		this.notificationItem = [];
		notification.value.forEach(value => {
			switch (value.type) {
				case CHSNotificationType.connectedUnsafeNetwork: {
					this.iconName = 'wifi';
					this.color = "red";
					break;
				}
				case CHSNotificationType.applianceDisconnected: {
					this.iconName = 'wifi-slash';
					this.color = "grey";
					break;
				}
				case CHSNotificationType.homeNetworkUnsafe: {
					this.iconName = 'exclamation-circle';
					this.color = "red";
					break;
				}
				case CHSNotificationType.unknownDeviceConnected: {
					this.iconName = 'question-circle';
					this.color = "orange";
					break;
				}
				case CHSNotificationType.vulnerableDeviceDetected: {
					this.iconName = 'laptop';
					this.color = "blue";
					break;
				}
			};
			this.title = value.content.title;
			this.subText = value.content.content;
			this.date = this.getTime(value.time);
			let item = new NotificationItem({
				iconName: this.iconName, color: this.color,
				title: this.title, notificationDetail: this.subText, date: this.date
			});
			this.notificationItem.push(item);

		})
	}
	getTime(date: Date) {
		let now = new Date();
		let year = now.getFullYear();
		let month = now.getMonth();
		let day = now.getDate();
		let notificationYear = date.getFullYear();
		let notificationMonth = date.getMonth();
		let notificationDay = date.getDate()
		if (year === notificationYear && month === notificationMonth && day === notificationDay) {
			let notificationHours = date.getHours();
			let ampm = 'am';
			if (notificationHours === 0) {
				notificationHours = 12;
				ampm = 'am'
			}
			if (notificationHours > 12) {
				notificationHours -= 12;
				ampm = 'pm'
			}
			let notificationMinutes: any = date.getMinutes();
			if (notificationMinutes < 10) {
				notificationMinutes = '0' + notificationMinutes;
			}
			if (notificationHours >= 10) {
				return `${notificationHours} : ${notificationMinutes} ${ampm}`
			} else {
				return `0${notificationHours} : ${notificationMinutes} ${ampm}`
			}

		} else {
			let days = now.getTime() - date.getTime();
			let time = Math.ceil(days / (1000 * 60 * 60 * 24));
			return `${time}d`
		}

	}

}
