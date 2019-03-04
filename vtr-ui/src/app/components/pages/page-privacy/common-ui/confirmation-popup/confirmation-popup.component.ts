import { Component, OnInit } from '@angular/core';
import { ConfirmationPopupService } from "../../common-services/popups/confirmation-popup.service";
import { ServerCommunicationService } from "../../common-services/server-communication.service";

@Component({
	selector: 'vtr-confirmation-popup',
	templateUrl: './confirmation-popup.component.html',
	styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent implements OnInit {
	public isPopupOpen: boolean;
	public verificationCode: string = '';
	public isError = false; // change on 'true' to see all styles for errors

	constructor(private confirmationPopupService: ConfirmationPopupService, private serverCommunicationService: ServerCommunicationService) {}

	ngOnInit() {
		this.isPopupOpen = this.confirmationPopupService.isPopupOpen;
		this.confirmationPopupService.popupOpenStateUpdated.subscribe((isOpen) => {
			this.isPopupOpen = isOpen;
			if (!isOpen) {
				this.resetVerificationCode();
			}
		});
	}

	closePopup() {
		this.confirmationPopupService.closePopup();
		this.resetVerificationCode();
	}

	onInput(ev) {
		this.verificationCode = ev.target.value;
	}

	resendConfirmationCode() {
		this.serverCommunicationService.sendConfirmationCode();
	}

	resetVerificationCode() {
		this.verificationCode = '';
	}

	confirm(ev) {
		ev.preventDefault();
		this.serverCommunicationService.validateVerificationCode(this.verificationCode);
		this.serverCommunicationService.validationStatusChanged.subscribe((validationResponse) => {
			if (validationResponse.status === 0) {
				this.confirmationPopupService.closePopup();
			} else {
				// handle errors
			}
		})
	}
}
