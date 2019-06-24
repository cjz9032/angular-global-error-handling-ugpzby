import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	OnDestroy,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { EmailScannerService } from '../services/email-scanner.service';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { SafeStorageService } from '../../../common/services/safe-storage.service';

@Component({
	selector: 'vtr-confirmation',
	templateUrl: './confirmation.component.html',
	styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild('confirmationInput') confirmationInput: ElementRef;
	@Output() confirmationSuccess = new EventEmitter<boolean>();

	userEmail = this.safeStorageService.getEmail();
	confirmationForm = this.formBuilder.group({
		confirmationCode: ['', [Validators.required, Validators.minLength(6)]],
	});
	private isError = new BehaviorSubject(false);
	isError$ = this.isError.asObservable(); // change on 'true' to see all styles for errors

	constructor(
		private formBuilder: FormBuilder,
		private safeStorageService: SafeStorageService,
		private emailScannerService: EmailScannerService) {
	}

	ngOnInit() {
		this.confirmationForm.valueChanges
			.pipe(
				debounceTime(100),
				takeUntil(instanceDestroyed(this)),
			)
			.subscribe(() => {
				this.isError.next(false);
			});

		this.emailScannerService.userEmail$
			.pipe(
				filter(Boolean),
				takeUntil(instanceDestroyed(this))
			)
			.subscribe((userEmail) => {
				this.userEmail = userEmail;
			});
	}

	ngAfterViewInit(): void {
		this.confirmationInput.nativeElement.focus();
	}

	ngOnDestroy() {
	}

	resendConfirmationCode() {
		this.emailScannerService.sendConfirmationCode()
			.pipe(
				takeUntil(instanceDestroyed(this)),
			)
			.subscribe(() => {
				this.isError.next(false);
			}, (error) => {
				this.isError.next(true);
			});
	}

	confirmCode() {
		this.confirmationForm.markAsDirty();
		if (this.confirmationForm.valid) {
			this.emailScannerService.validateVerificationCode(this.confirmationForm.value.confirmationCode).pipe(
			).subscribe(() => {
				this.isError.next(false);
				this.confirmationSuccess.emit(true);
			}, (error) => {
				this.isError.next(true);
				console.error('confirm code error', error);
			});
		}
	}
}
