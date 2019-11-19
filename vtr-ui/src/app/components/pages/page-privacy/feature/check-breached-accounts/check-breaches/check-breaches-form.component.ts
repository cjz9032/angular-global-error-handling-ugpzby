import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, mapTo, takeUntil } from 'rxjs/operators';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { EmailVerifyService } from '../services/email-verify.service';
import { combineLatest, from, merge } from 'rxjs';
import { UserService } from '../../../../../../services/user/user.service';
import { validateAllFormFields, validateEmail } from '../../../utils/helpers';
import { EMAIL_REGEXP } from '../../../utils/form-validators';
import { BreachedAccountsService } from '../services/breached-accounts.service';
import {
	TaskActionWithTimeoutService,
	TasksName
} from '../../../common/services/analytics/task-action-with-timeout.service';
import { AbTestsName } from '../../../utils/ab-test/ab-tests.type';
import { UserEmailService } from '../services/user-email.service';
import { GetBreachesService } from '../services/get-breaches.service';

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
	@Input() strategy: 'default' | 'emitEmail' = 'default';
	@Input() appearance: 'default' | 'small' = 'default';
	@Input() runAbTest = false;
	@Output() userEmail = new EventEmitter<string>();

	emailForm = this.formBuilder.group({
		email: ['', [Validators.required, Validators.pattern(EMAIL_REGEXP)]],
	});
	emailWasSubmitted = false;
	serverError$ = this.listenError();

	isLoading$ = combineLatest([
		this.emailScannerService.loading$,
		this.getBreachesService.loading$
	]).pipe(map(([emailVerifyLoading, getBreachesLoading]) => emailVerifyLoading && getBreachesLoading));

	lenovoId = '';
	islenovoIdOpen = false;
	isFormFocused = false;
	currentTests = AbTestsName;

	constructor(
		private formBuilder: FormBuilder,
		private emailScannerService: EmailVerifyService,
		private userService: UserService,
		private breachedAccountsService: BreachedAccountsService,
		private userEmailService: UserEmailService,
		private getBreachesService: GetBreachesService,
		private cdr: ChangeDetectorRef,
		private taskActionWithTimeoutService: TaskActionWithTimeoutService
	) {
	}

	ngOnInit() {
		this.handleStartTyping();
	}

	ngOnDestroy() {
	}

	handleFocus() {
		this.isFormFocused = true;
		this.updateLenovoId();
		this.openLenovoId();
	}

	handleBlur() {
		this.isFormFocused = false;
		this.closeLenovoId();
	}

	preventFireBlur(event) {
		event.preventDefault();
	}

	private openLenovoId() {
		this.islenovoIdOpen = true;
	}

	private closeLenovoId() {
		this.islenovoIdOpen = false;
	}

	setLenovoId() {
		this.emailForm.get('email').setValue(this.lenovoId);
		this.closeLenovoId();
	}

	handleEmailScan() {
		this.emailWasSubmitted = true;
		validateAllFormFields(this.emailForm);
		if (this.emailForm.invalid) {
			return;
		}

		const userEmail = this.emailForm.value.email;

		this.userEmailService.setUserEmail(userEmail);

		this.userEmail.emit(userEmail);

		if (this.strategy === 'default') {
			this.setScanBreachedAccounts();
		}
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
			this.emailForm.reset();
			this.openLenovoId();
		});
	}

	private setScanBreachedAccounts() {
		this.breachedAccountsService.scanNotifierEmit();
		this.taskActionWithTimeoutService.startAction(TasksName.scanBreachesAction);
	}

	private listenError() {
		return merge(
			this.emailForm.valueChanges.pipe(
				debounceTime(100),
				mapTo(false),
			),
			this.breachedAccountsService.onGetBreachedAccounts$.pipe(
				map((breachedAccounts) => breachedAccounts.error !== null)
			)
		).pipe(distinctUntilChanged());
	}

	private updateLenovoId() {
		if (!this.lenovoId) {
			from(this.userService.getUserProfile())
				.subscribe((result: UserProfile) => {
					this.lenovoId = validateEmail(result.userName) ? result.userName : '';
					this.cdr.detectChanges();
				});
		}
	}
}
