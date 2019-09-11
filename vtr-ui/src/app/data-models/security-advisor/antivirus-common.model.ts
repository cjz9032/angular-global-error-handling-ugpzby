import { Antivirus } from '@lenovo/tan-client-bridge';
import { AppNotification } from '../common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';

export class AntivirusCommon {
	antivirus: Antivirus;
	startTrialDisabled = false;
	isOnline: boolean;

	constructor(
		antivirus: Antivirus,
		isOnline: boolean,
		) {
			if (antivirus) {
				this.antivirus = antivirus;
			}
			this.isOnline = isOnline;
	}

	launch() {
		this.antivirus.mcafee.launch();
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
