import { ConnectedHomeSecurity } from '@lenovo/tan-client-bridge';
import { DialogService } from 'src/app/services/dialog/dialog.service';

export class HomeSecurityCommon {
	connectedHomeSecurity: ConnectedHomeSecurity;
	startTrialDisabled = false;
	isOnline: boolean;

	constructor(
		connectedHomeSecurity: ConnectedHomeSecurity,
		isOnline: boolean,
		private dialogService: DialogService
		) {
			if (connectedHomeSecurity) {
				this.connectedHomeSecurity = connectedHomeSecurity;
			}
			this.isOnline = isOnline;
	}

	openCoronet() {
		if (!this.isOnline) {
			this.dialogService.homeSecurityOfflineDialog();
		} else {
			this.connectedHomeSecurity.visitWebConsole();
		}
	}

	upgrade() {
		this.connectedHomeSecurity.purchase();
	}

}
