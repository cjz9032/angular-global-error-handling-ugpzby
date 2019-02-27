import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ServerCommunicationService } from '../../common-services/server-communication.service';
import { ConfirmationPopupService } from '../../common-services/popups/confirmation-popup.service';

@Component({
	selector: 'vtr-check-breaches-form',
	templateUrl: './check-breaches-form.component.html',
	styleUrls: ['./check-breaches-form.component.scss'],
})
export class CheckBreachesFormComponent implements OnInit, OnDestroy {
	public isLoading: boolean;
	public lenovoId: string;
	public islenovoIdOpen: boolean;
	public isFormFocused: boolean;
	public inputValue: string;
	private validationStatusChanged;

	constructor(public router: Router, private serverCommunication: ServerCommunicationService, private confirmationPopupService: ConfirmationPopupService) {
		this.isLoading = false;
		this.islenovoIdOpen = false;
		this.isFormFocused = false;
		this.inputValue = '';
	}

	ngOnInit() {
		this.serverCommunication.getLenovoId().then((lenovoId: string) => {
			this.lenovoId = lenovoId;
		});
		this.validationStatusChanged = this.serverCommunication.validationStatusChanged;

		this.validationStatusChanged.subscribe((isResultPositive) => {
			this.isLoading = true;
			if (isResultPositive) {
				this.serverCommunication.getBreachedAccounts(this.inputValue).then((breachesArr) => {
					console.log('breachesArr', breachesArr);
					this.isLoading = false;
					this.validationStatusChanged.unsubscribe();
					this.router.navigate(['privacy/result']);
				});
			}
		})
	}

	ngOnDestroy() {
		this.validationStatusChanged.unsubscribe();
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
		this.serverCommunication.sendVerificationCode();
		this.confirmationPopupService.openPopup();
	}
}
