import { EventTypes, ConnectedHomeSecurity, LocationPermissionOffError } from '@lenovo/tan-client-bridge';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppNotification } from '../common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { LenovoIdDialogService } from 'src/app/services/dialog/lenovoIdDialog.service';

export class HomeSecurityCommon {
	connectedHomeSecurity: ConnectedHomeSecurity;
	startTrialDisabled = false;
	isOnline: boolean;

	constructor(
		connectedHomeSecurity: ConnectedHomeSecurity,
		isOnline: boolean,
		private modalService: NgbModal,
		private dialogService: DialogService,
		private lenovoIdDialogService: LenovoIdDialogService,
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
