import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { EmailScannerService } from '../../common-services/email-scanner.service';
import { CommonPopupService } from '../../common-services/popups/common-popup.service';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'vtr-confirmation-popup',
	templateUrl: './confirmation-popup.component.html',
	styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent implements OnInit, OnDestroy, AfterViewInit {
	@Input() popupId: string;
	@ViewChild('confirmationInput') confirmationInput: ElementRef;

	confirmationForm = this.formBuilder.group({
		confirmationCode: ['', [Validators.required, Validators.minLength(6)]],
	});
	private isError = new BehaviorSubject(false);
	isError$ = this.isError.asObservable(); // change on 'true' to see all styles for errors

	constructor(
		private formBuilder: FormBuilder,
		private commonPopupService: CommonPopupService,
		private emailScannerService: EmailScannerService) {
	}

	ngOnInit() {
		this.commonPopupService.getOpenState(this.popupId)
			.pipe(
				filter((state) => !state.isOpenState)
			).subscribe(() => {
				this.emailScannerService.cancelVerification();
		});
	}

	ngAfterViewInit(): void {
		this.confirmationInput.nativeElement.focus();
	}

	ngOnDestroy() {
	}

	resendConfirmationCode() {
		this.emailScannerService.sendConfirmationCode().subscribe(() => {
			this.isError.next(false);
		}, (error) => {
			this.isError.next(true);
		});
	}

	confirmCode() {
		if (this.confirmationForm.valid) {
			this.emailScannerService.validateVerificationCode(this.confirmationForm.value.confirmationCode).pipe(
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
