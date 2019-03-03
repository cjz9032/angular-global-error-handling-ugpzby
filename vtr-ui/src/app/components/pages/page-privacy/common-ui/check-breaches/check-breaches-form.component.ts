import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerCommunicationService } from '../../common-services/server-communication.service';
import { ConfirmationPopupService } from '../../common-services/popups/confirmation-popup.service';

@Component({
	selector: 'vtr-check-breaches-form',
	templateUrl: './check-breaches-form.component.html',
	styleUrls: ['./check-breaches-form.component.scss'],
})
export class CheckBreachesFormComponent implements OnInit {
	public isLoading: boolean;
	public lenovoId: string;
	public islenovoIdOpen: boolean;
	public isFormFocused: boolean;
	public inputValue: string;
	public isValidationError = false; // change to 'true' to see all error styles
	public isServerError = false; // change to 'true' to see all error styles

	constructor(public router: Router, private serverCommunication: ServerCommunicationService, private confirmationPopupService: ConfirmationPopupService) {
		this.isLoading = false;
		this.islenovoIdOpen = false;
		this.isFormFocused = false;
		this.inputValue = '';
	}

	ngOnInit() {
		this.serverCommunication.getLenovoId();
		this.serverCommunication.onGetLenovoId.subscribe((lenovoIdResponse: {emails: Array<string>}) => {
			this.lenovoId = lenovoIdResponse.emails[0];
		});
	}

	changeInputValue(event) {
		this.inputValue = event.target.value;
		if (this.lenovoId && this.lenovoId.includes(this.inputValue)) {
			this.openLenovoId();
		} else {
			this.closeLenovoId();
		}
	}

	handleFocus() {
		this.isFormFocused = true;
		this.openLenovoId();
	}

	handleBlur() {
		this.isFormFocused = false;
		setTimeout(() => {
			this.closeLenovoId();
		}, 200); // added because blur event should be after 'id' selection by click
	}

	openLenovoId() {
		this.islenovoIdOpen = true;
	}

	closeLenovoId() {
		this.islenovoIdOpen = false;
	}

	setLenovoId() {
		this.inputValue = this.lenovoId;
		this.closeLenovoId();
	}

	scanEmail(event) {
		event.preventDefault();
		// TODO validate this.inputValue here
		this.isLoading = true;
		this.serverCommunication.getBreachedAccounts(this.inputValue);
		this.serverCommunication.onGetBreachedAccountsResponse.subscribe((response) => {
			this.isLoading = false;
			if (response.status === 0) {
				this.router.navigate(['privacy/result']);
			} else if (response.status === 300) {
				this.serverCommunication.sendVerificationCode();
				this.confirmationPopupService.openPopup();
			} else if (response.status === 400) {
				this.isServerError = true;
			}
		});

		this.serverCommunication.validationStatusChanged.subscribe((isResultPositive) => {
			if (isResultPositive) {
				this.isLoading = true;
				this.serverCommunication.getBreachedAccounts(this.inputValue)
			}
		})

	}
}
