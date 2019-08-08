import { NotificationItem } from './home-security-notification-item.model';
import { CHSNotificationType, CHSNotifications } from '@lenovo/tan-client-bridge';
import { TranslateService } from '@ngx-translate/core';

export class HomeSecurityNotifications {
	// notification: CHSNotifications;
	notificationItem: NotificationItem[];
	constructor(private translateService: TranslateService, notification?: CHSNotifications) {
		this.notificationItem = [];
		if (!notification || !notification.value) { return; }
		notification.value.forEach(value => {
			let iconName: string;
			let color: string;
			let title: string;
			switch (value.type) {
				case CHSNotificationType.connectedUnsafeNetwork: {
					iconName = 'wifi';
					color = 'red';
					title = 'homeSecurity.notification.unsafeNetworkConnection';
					break;
				}
				case CHSNotificationType.applianceDisconnected: {
					iconName = 'wifi-slash';
					color = 'grey';
					title = 'homeSecurity.notification.deviceDisconnected';
					break;
				}
				case CHSNotificationType.homeNetworkUnsafe: {
					iconName = 'exclamation-circle';
					color = 'red';
					title = 'homeSecurity.notification.networkUnsafe';
					break;
				}
				case CHSNotificationType.unknownDeviceConnected: {
					iconName = 'question-circle';
					color = 'orange';
					title = 'homeSecurity.notification.newDeviceDetected';
					break;
				}
				case CHSNotificationType.vulnerableDeviceDetected: {
					iconName = 'laptop';
					color = 'blue';
					title = 'homeSecurity.notification.unsafeDeviceDetected';
					break;
				}
			}
			this.notificationItem.push(new NotificationItem({
				iconName,
				color,
				title,
				notificationDetail: value.content.content,
				date: this.getTime(value.time)
			}, this.translateService));
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
