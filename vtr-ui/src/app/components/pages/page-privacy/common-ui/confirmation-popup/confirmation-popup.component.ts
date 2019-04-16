import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EmailScannerService } from '../../common-services/email-scanner.service';
import { CommonPopupService } from '../../common-services/popups/common-popup.service';
import { filter, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../shared/custom-rxjs-operators/instance-destroyed';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

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
	private isError = new BehaviorSubject(false);
	isError$ = this.isError.asObservable(); // change on 'true' to see all styles for errors

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
		this.emailScannerService.sendConfirmationCode().subscribe(() => {
			this.isError.next(false);
		}, (error) => {
			this.isError.next(true);
		});
	}

	resetVerificationCode() {
		this.verificationCode = '';
	}

	confirmCode() {
		if (this.confirmationForm.valid) {
			this.emailScannerService.validateVerificationCode(this.verificationCode).pipe(
			).subscribe(() => {
				this.isError.next(false);
				return this.commonPopupService.close(this.popupId);
			}, (error) => {
				this.isError.next(true);
				console.error('confirm code error', error);
			});
		}
	}
}
