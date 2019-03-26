import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EmailScannerService } from '../../common-services/email-scanner.service';
import { CommonPopupService } from '../../common-services/popups/common-popup.service';
import { filter, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../shared/custom-rxjs-operators/instance-destroyed';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'vtr-confirmation-popup',
	templateUrl: './confirmation-popup.component.html',
	styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent implements OnInit, OnDestroy {
	@Input() popupId: string;

	confirmationForm = this.formBuilder.group({
		confirmationCode: ['', [Validators.required, Validators.minLength(6)]],
	});
	verificationCode = '';
	isError = false; // change on 'true' to see all styles for errors

	constructor(
		private formBuilder: FormBuilder,
		private commonPopupService: CommonPopupService,
		private emailScannerService: EmailScannerService) {
	}

	ngOnInit() {
		this.commonPopupService.getOpenState(this.popupId).pipe(
			takeUntil(instanceDestroyed(this)),
			filter(state => !state.isOpenState)
		).subscribe(() => this.resetVerificationCode());
	}

	ngOnDestroy() {
	}

	onInput(ev) {
		this.verificationCode = ev.target.value;
	}

	resendConfirmationCode() {
		this.emailScannerService.sendConfirmationCode();
	}

	resetVerificationCode() {
		this.verificationCode = '';
	}

	confirm() {
		if (this.confirmationForm.valid) {
			this.emailScannerService.validationStatusChanged$.pipe(
				takeUntil(instanceDestroyed(this)),
			).subscribe((validationResponse) => {
				if (validationResponse.status === 0) {
					return this.commonPopupService.close(this.popupId);
				} else {
					// handle errors
				}
			});
			this.emailScannerService.validateVerificationCode(this.verificationCode);
		}
	}
}
