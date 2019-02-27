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

	confirm() {
		this.serverCommunicationService.validateVerificationCode('123455').then(() => {
			this.confirmationPopupService.closePopup();
		})
	}

}
