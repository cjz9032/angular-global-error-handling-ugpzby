import { Component, OnDestroy, OnInit } from '@angular/core';
import { ServerCommunicationService } from '../../common-services/server-communication.service';
import { FormBuilder, Validators } from '@angular/forms';
import { filter, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../shared/custom-rxjs-operators/instance-destroyed';
import { EmailScannerService } from '../../common-services/email-scanner.service';
import { CommonPopupService } from '../../common-services/popups/common-popup.service';

@Component({
	selector: 'vtr-check-breaches-form',
	templateUrl: './check-breaches-form.component.html',
	styleUrls: ['./check-breaches-form.component.scss'],
})
export class CheckBreachesFormComponent implements OnInit, OnDestroy {
	emailForm = this.formBuilder.group({
		email: ['', [Validators.required, Validators.email]],
	});
	isLoading = this.emailScannerService.loadingStatusChanged$;
	lenovoId: string;
	islenovoIdOpen = false;
	isFormFocused = false;
	isServerError = false; // change to 'true' to see all error styles
	confirmationPopupId = 'confirmation-popup'; // change to 'true' to see all error styles

	constructor(
		private serverCommunication: ServerCommunicationService,
		private formBuilder: FormBuilder,
		private emailScannerService: EmailScannerService,
		private commonPopupService: CommonPopupService,
	) {
	}

	ngOnInit() {
		this.serverCommunication.getLenovoId();
		this.serverCommunication.onGetLenovoId.pipe(
			takeUntil(instanceDestroyed(this)),
		).subscribe(
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

	handleEmailScan() {
		if (this.emailForm.invalid) {
			return;
		}

		this.emailScannerService.setUserEmail(this.emailForm.value.email);

		this.emailScannerService.sendConfirmationCode().pipe(
			takeUntil(instanceDestroyed(this)),
		).subscribe((response) => {
			this.commonPopupService.open(this.confirmationPopupId);
		}, (error) => {
			console.log('confirmation error', error);
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
