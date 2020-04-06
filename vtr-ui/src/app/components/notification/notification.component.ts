import { Component, Input } from '@angular/core';

export enum NotificationType {
	Banner = 'banner',
}

@Component({
  selector: 'vtr-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})

export class NotificationComponent {
	@Input() type: string;
	isClose = false;
	notificationType = NotificationType;

	close() {
		this.isClose = true;
	}
}