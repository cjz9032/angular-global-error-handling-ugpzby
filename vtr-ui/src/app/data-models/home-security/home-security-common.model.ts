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

	openCornet(feature?: string) {
		this.connectedHomeSecurity.visitWebConsole(feature);
	}

	upgrade() {
		this.connectedHomeSecurity.purchase();
	}

	startTrial() {
		let alreadyLoggedIn = this.connectedHomeSecurity.account.lenovoId.loggedIn;
		if (alreadyLoggedIn) {
			this.startTrialDisabled = true;
			if (this.isOnline) {
				this.connectedHomeSecurity.createAndGetAccount().then((result) => {
					this.startTrialDisabled = result ;
				}).catch((err: Error) => {
					this.startTrialDisabled = false;
					if (err instanceof LocationPermissionOffError) {
						this.dialogService.openCHSPermissionModal();
					}
				});
			} else {
				this.dialogService.homeSecurityOfflineDialog();
				this.startTrialDisabled = false;
			}
		} else {
			const callback = (loggedIn: boolean) => {
				if (loggedIn && !alreadyLoggedIn) {
					this.connectedHomeSecurity.createAndGetAccount().then((result) => {
						this.startTrialDisabled = result ;
					}).catch((err: Error) => {
						this.startTrialDisabled = false;
						if (err instanceof LocationPermissionOffError) {
							this.dialogService.openCHSPermissionModal();
						}
					});
					alreadyLoggedIn = true;
				}
			};
			this.lenovoIdDialogService.openLenovoIdDialog('ConnectedHomeSecurity').then(() => {
				this.connectedHomeSecurity.off(EventTypes.lenovoIdStatusChange, callback);
			}).catch(() => {
				this.connectedHomeSecurity.off(EventTypes.lenovoIdStatusChange, callback);
			});
			this.connectedHomeSecurity.on(EventTypes.lenovoIdStatusChange, callback);
		}
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
