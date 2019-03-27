import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { WifiHomeViewModel } from '../../page-security-wifi.component';
import { WinRT } from '@lenovo/tan-client-bridge';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalWifiSecurityInvitationComponent } from '../../../../modal/modal-wifi-security-invitation/modal-wifi-security-invitation.component';

@Component({
	selector: 'vtr-connected-home',
	templateUrl: './connected-home.component.html',
	styleUrls: ['./connected-home.component.scss']
})
export class ConnectedHomeComponent implements OnInit {

	@Input() data: WifiHomeViewModel;
	@Input() isShowInvitationCode = false;
	emitter = new EventEmitter();


	constructor(
		private modalService: NgbModal,
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
				this.isShowInvitationCode = false;
			}
		});
		this.OpenInvitationModal();
	}
}
