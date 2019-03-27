import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

@Component({
	selector: 'vtr-modal-wifi-security-invitation',
	templateUrl: './modal-wifi-security-invitation.component.html',
	styleUrls: ['./modal-Wifi-security-invitation.component.scss']
})
export class ModalWifiSecurityInvitationComponent implements OnInit {

	@Input() emitter: EventEmitter<any>;
	securityAdvisor: any;

	header = 'Enter your connection code';
	description = 'Add Home';

	OkText = 'Ok';
	CancelText = 'Cancel';

	startJoin = false;
	joinSuccess = false;
	joinFailed = false;

	constructor(public activeModal: NgbActiveModal, vantageShellService: VantageShellService) {
		this.securityAdvisor = vantageShellService.getSecurityAdvisor();
	}

	ngOnInit() {
	}

	closeModal() {
		this.activeModal.close('close');
	}

	KeyPress(e) {
		// console.log(e.target.value);
		const value = e.target.value.replace(/[^0-9a-zA-Z]+/ig, '');
		e.target.value = value;
	}

	joinGroupBy(code: any) {
		code = code.toUpperCase();
		// console.log(`Code: ${code}`);
		this.startJoin = true;
		this.joinSuccess = false;
		this.joinFailed = false;
		if (this.securityAdvisor) {
			this.securityAdvisor.homeProtection.joinGroupBy(code)
				.then((result) => {
					this.startJoin = false;
					if (result) {
						this.joinSuccess = true;
						this.emitter.emit('invitationsuccess');
						// console.log('Join success!');
					} else {
						this.joinFailed = true;
						// console.log('Join failed!');
					}
				});
		} else {
			this.startJoin = false;
			this.joinFailed = true;
		}
	}

	onCancelClick($event: any) {
		this.activeModal.close(false);
	}

}
