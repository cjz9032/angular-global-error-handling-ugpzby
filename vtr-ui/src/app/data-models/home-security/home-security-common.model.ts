import { EventTypes, ConnectedHomeSecurity } from '@lenovo/tan-client-bridge';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalLenovoIdComponent } from 'src/app/components/modal/modal-lenovo-id/modal-lenovo-id.component';


export class HomeSecurityCommon {
	connectedHomeSecurity: ConnectedHomeSecurity;

	constructor(connectedHomeSecurity: ConnectedHomeSecurity, private modalService: NgbModal) {
		this.connectedHomeSecurity = connectedHomeSecurity;
	}

	openCornet(feature?: string) {
		this.connectedHomeSecurity.account.visitWebConsole(feature);
	}

	upgrade() {
		this.connectedHomeSecurity.account.purchase();
	}

	startTrial() {
		let alreadyLoggedIn = this.connectedHomeSecurity.account.lenovoId.loggedIn;
		if (alreadyLoggedIn) {
			this.connectedHomeSecurity.account.createAccount();
		} else {
			const callback = (loggedIn: boolean) => {
				if (loggedIn && !alreadyLoggedIn) {
					this.connectedHomeSecurity.account.createAccount();
					alreadyLoggedIn = true;
				}
			};
			this.modalService.open(ModalLenovoIdComponent, {
				backdrop: 'static',
				centered: true,
				windowClass: 'lenovo-id-modal-size'
			}).result.then(() => {
				this.connectedHomeSecurity.off(EventTypes.lenovoIdStatusChange, callback);
			}).catch(() => {
				this.connectedHomeSecurity.off(EventTypes.lenovoIdStatusChange, callback);
			});
			this.connectedHomeSecurity.on(EventTypes.lenovoIdStatusChange, callback);
		}
	}


}
