import { ConnectedHomeSecurity } from '@lenovo/tan-client-bridge';
import { AppNotification } from '../common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';

export class HomeSecurityCommon {
	connectedHomeSecurity: ConnectedHomeSecurity;
	startTrialDisabled = false;
	isOnline: boolean;

	constructor(
		connectedHomeSecurity: ConnectedHomeSecurity,
		isOnline: boolean,
		) {
			if (connectedHomeSecurity) {
				this.connectedHomeSecurity = connectedHomeSecurity;
			}
			this.isOnline = isOnline;
	}

	openCornet() {
		this.connectedHomeSecurity.visitWebConsole();
	}

	upgrade() {
		this.connectedHomeSecurity.purchase();
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					break;
				default:
					break;
			}
		}
	}

}
