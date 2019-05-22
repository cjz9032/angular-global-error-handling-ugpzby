import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { EmailScannerService } from '../services/email-scanner.service';
import { CommonPopupService } from '../../../common/services/popups/common-popup.service';
import { BehaviorSubject, from } from 'rxjs';
import { AccessTokenService } from '../../../common/services/access-token.service';
import { VantageShellService } from '../../../../../../services/vantage-shell/vantage-shell.service';
import { UserService } from '../../../../../../services/user/user.service';
import { validateEmail } from '../../../utils/helpers';

interface UserProfile {
	addressList: string[];
	emailList: string[];
	firstName: string;
	lastName: string;
	phoneList: string[];
	status: number;
	success: boolean;
	userName: string;
}

@Component({
	selector: 'vtr-check-breaches-form',
	templateUrl: './check-breaches-form.component.html',
	styleUrls: ['./check-breaches-form.component.scss'],
})
export class CheckBreachesFormComponent implements OnInit, OnDestroy {
	@Input() size: 'default' | 'small' = 'default';
	@Output() openConfirmationCode = new EventEmitter<boolean>();
	emailWasScanned$ = this.accessTokenService.accessTokenIsExist$;

	emailForm = this.formBuilder.group({
		email: ['', [Validators.required, Validators.email]],
	});
	serverError$ = new BehaviorSubject(false);
	isLoading$ = this.emailScannerService.loadingStatusChanged$;
	lenovoId: string;
	islenovoIdOpen = false;
	isFormFocused = false;
	confirmationPopupId = 'confirmation-popup';

	constructor(
		private formBuilder: FormBuilder,
		private emailScannerService: EmailScannerService,
		private commonPopupService: CommonPopupService,
		private accessTokenService: AccessTokenService,
		private vantageShellService: VantageShellService,
		private userService: UserService
	) {
	}

	ngOnInit() {
		this.emailForm.valueChanges.pipe(
			debounceTime(100),
			takeUntil(instanceDestroyed(this)),
		).subscribe(() => {
			this.serverError$.next(false);
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
		from(this.userService.getUserProfile())
			.subscribe((result: UserProfile) => {
				this.lenovoId = validateEmail(result.userName) ? result.userName : '';
			});

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
			this.size === 'default' ?
				this.commonPopupService.open(this.confirmationPopupId) :
				this.openConfirmationCode.emit(true);
		}, (error) => {
			this.serverError$.next(true);
			console.error('auth error:', error);
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
