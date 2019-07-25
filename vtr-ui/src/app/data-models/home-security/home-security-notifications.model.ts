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
	constructor(notification?: CHSNotifications) {
		this.notificationItem = [];
		if (!notification || !notification.value) { return; }
		notification.value.forEach(value => {
			let iconName: string;
			let color: string;
			switch (value.type) {
				case CHSNotificationType.connectedUnsafeNetwork: {
					iconName = 'wifi';
					color = 'red';
					break;
				}
				case CHSNotificationType.applianceDisconnected: {
					iconName = 'wifi-slash';
					color = 'grey';
					break;
				}
				case CHSNotificationType.homeNetworkUnsafe: {
					iconName = 'exclamation-circle';
					color = 'red';
					break;
				}
				case CHSNotificationType.unknownDeviceConnected: {
					iconName = 'question-circle';
					color = 'orange';
					break;
				}
				case CHSNotificationType.vulnerableDeviceDetected: {
					iconName = 'laptop';
					color = 'blue';
					break;
				}
			}
			this.notificationItem.push(new NotificationItem({
				iconName,
				color,
				title: value.content.title,
				notificationDetail: value.content.content,
				date: this.getTime(value.time)
			}));
		});
	}

	getTime(date: Date) {
		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth();
		const day = now.getDate();
		const notificationYear = date.getFullYear();
		const notificationMonth = date.getMonth();
		const notificationDay = date.getDate();
		if (year === notificationYear && month === notificationMonth && day === notificationDay) {
			let notificationHours = date.getHours();
			let ampm = 'am';
			if (notificationHours === 0) {
				notificationHours = 12;
				ampm = 'am';
			}
			if (notificationHours > 12) {
				notificationHours -= 12;
				ampm = 'pm';
			}
			let notificationMinutes: any = date.getMinutes();
			if (notificationMinutes < 10) {
				notificationMinutes = '0' + notificationMinutes;
			}
			if (notificationHours >= 10) {
				return `${notificationHours} : ${notificationMinutes} ${ampm}`;
			} else {
				return `0${notificationHours} : ${notificationMinutes} ${ampm}`;
			}

		} else {
			const days = now.getTime() - date.getTime();
			const time = Math.ceil(days / (1000 * 60 * 60 * 24));
			return `${time}d`;
		}

	}

}
