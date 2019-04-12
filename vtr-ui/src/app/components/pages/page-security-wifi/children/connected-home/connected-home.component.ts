import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { WifiHomeViewModel } from 'src/app/data-models/security-advisor/wifisecurity.model';
import { WinRT } from '@lenovo/tan-client-bridge';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalWifiSecurityInvitationComponent } from '../../../../modal/modal-wifi-security-invitation/modal-wifi-security-invitation.component';
import { SecurityService } from 'src/app/services/security/security.service';

@Component({
	selector: 'vtr-connected-home',
	templateUrl: './connected-home.component.html',
	styleUrls: ['./connected-home.component.scss']
})
export class ConnectedHomeComponent implements OnInit {

	@Input() data: WifiHomeViewModel;
	@Input() isShowInvitationCode: boolean;
	emitter = new EventEmitter();
	showDescribe = false;


	constructor(
		private modalService: NgbModal,
		public securityService: SecurityService
	) { }

	ngOnInit() {
	}

	tryNow(event) {
		console.log('tryNow', event);
		WinRT.launchUri(this.data.tryNowUrl);
	}

	//  to popup invitation modal dialog
	OpenInvitationModal() {
		const invitationmodal = this.modalService.open(ModalWifiSecurityInvitationComponent, {
			backdrop: 'static',
			windowClass: 'wifi-security-invitation-modal',
		});
		invitationmodal.componentInstance.emitter = this.emitter;
	}

	enterActivationCode(event) {
		console.log('enterActivationCode', event);
		this.emitter.subscribe((name: string) => {
			if (name === 'invitationsuccess') {
				this.data.homeStatus = 'joined';
			}
		});
		if (this.data.homeStatus !== 'joined') {
			this.showDescribe = false;
			if (this.data.wifiSecurity.isLocationServiceOn !== undefined) {
				if (this.data.wifiSecurity.isLocationServiceOn) {
					this.OpenInvitationModal();
				} else {
					this.securityService.wifiSecurityLocationDialog(this.data.wifiSecurity);
				}
			} else {
				console.log('this.data.wifiSecurity.isLocationServiceOn is undefined!');
			}
		} else {
			this.showDescribe = true;
		}
	}
}
