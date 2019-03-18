import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerCommunicationService } from '../../common-services/server-communication.service';
import { ConfirmationPopupService } from '../../common-services/popups/confirmation-popup.service';
import { FormBuilder, Validators } from '@angular/forms';
import { filter, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../shared/custom-rxjs-operators/instance-destroyed';

@Component({
	selector: 'vtr-check-breaches-form',
	templateUrl: './check-breaches-form.component.html',
	styleUrls: ['./check-breaches-form.component.scss'],
})
export class CheckBreachesFormComponent implements OnInit, OnDestroy {
	emailForm = this.formBuilder.group({
		email: ['', [Validators.required, Validators.email]],
	});
	isLoading = false;
	lenovoId: string;
	islenovoIdOpen = false;
	isFormFocused = false;
	isServerError = false; // change to 'true' to see all error styles

	constructor(
		private router: Router,
		private serverCommunication: ServerCommunicationService,
		private confirmationPopupService: ConfirmationPopupService,
		private formBuilder: FormBuilder,
	) { }

	ngOnInit() {
		this.serverCommunication.getLenovoId();
		this.serverCommunication.onGetLenovoId.subscribe(
			(lenovoIdResponse: { emails: Array<string> }) => {
				this.lenovoId = lenovoIdResponse.emails[0];
			});

		this.handleStartTyping();
	}

	ngOnDestroy() {
	}

	handleFocus() {
		this.isFormFocused = true;
		this.openLenovoId();
	}

	handleBlur() {
		this.isFormFocused = false;
		this.closeLenovoId();
	}

	preventFireBlur(event) {
		event.preventDefault();
	}

	openLenovoId() {
		this.islenovoIdOpen = true;
	}

	closeLenovoId() {
		this.islenovoIdOpen = false;
	}

	setLenovoId() {
		this.emailForm.get('email').setValue(this.lenovoId);
		this.closeLenovoId();
	}

	scanEmail() {
		if (this.emailForm.invalid) {
			return;
		}

		this.isLoading = true;
		this.serverCommunication.getBreachedAccounts(this.emailForm.value.email).subscribe((
			(response) => {
				this.isLoading = false;
				if (response.status === 0) {
					this.router.navigate(['privacy/result']);
				} else if (response.status === 300) {
					this.serverCommunication.sendConfirmationCode();
					this.confirmationPopupService.openPopup();
				} else if (response.status === 400) {
					this.isServerError = true;
				}
			}
		));

		this.serverCommunication.validationStatusChanged.subscribe((validationResponse) => {
			if (validationResponse.status === 0) {
				this.isLoading = true;
				this.serverCommunication.getBreachedAccounts(this.emailForm.value.email);
			}
		});
	}

	private handleStartTyping() {
		this.emailForm.get('email').valueChanges.pipe(
			filter((val) => val.length > 0),
			takeUntil(instanceDestroyed(this))
		).subscribe(() => {
			this.closeLenovoId();
		});

		this.emailForm.get('email').valueChanges.pipe(
			filter((val) => val.length === 0),
			takeUntil(instanceDestroyed(this))
		).subscribe(() => {
			this.openLenovoId();
		});
	}
}
