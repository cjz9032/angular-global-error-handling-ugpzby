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

	constructor(private confirmationPopupService: ConfirmationPopupService, private serverCommunicationService: ServerCommunicationService) {}

	ngOnInit() {
		this.isPopupOpen = this.confirmationPopupService.isPopupOpen;
		this.confirmationPopupService.popupOpenStateUpdated.subscribe((isOpen) => {
			this.isPopupOpen = isOpen;
		});
	}

	closePopup() {
		this.confirmationPopupService.closePopup();
	}

	onInput(ev) {
		console.log('ev.target.value', ev.target.value);
		this.verificationCode = ev.target.value;
	}

	confirm() {
		this.serverCommunicationService.validateVerificationCode(this.verificationCode).then(() => {
			this.confirmationPopupService.closePopup();
		})
	}
}
