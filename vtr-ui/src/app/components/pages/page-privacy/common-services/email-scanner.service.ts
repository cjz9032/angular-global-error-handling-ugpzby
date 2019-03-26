import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { delay, share, tap } from 'rxjs/operators';
import { BreachedAccount } from '../common-ui/breached-account/breached-account.component';
import { StorageService } from '../shared/services/storage.service';
import { HttpClient } from '@angular/common/http';

interface GetBreachedAccountsResponse {
	type: string;
	status: number;
	payload: { breaches?: BreachedAccount[] };
}

interface ConfirmationCodeValidationResponse {
	type: string;
	status: number;
	payload: { accessToken?: string };
}

@Injectable({
	providedIn: 'root'
})
export class EmailScannerService {
	userEmail = '';

	breachedAccounts: BreachedAccount[] = [];
	onGetBreachedAccounts$ = new Subject<BreachedAccount[]>();

	validationStatusChanged$ = new Subject<ConfirmationCodeValidationResponse>();
	loadingStatusChanged = new Subject();
	loadingStatusChanged$ = this.loadingStatusChanged.asObservable();

	constructor(
		private storageService: StorageService,
		private http: HttpClient
	) {
	}

	scanEmail(accessToken) {
		this.loadingStatusChanged.next(true);
		return this.getBreachedAccounts(accessToken);
	}

	setUserEmail(userEmail) {
		this.userEmail = userEmail;
	}

	sendConfirmationCode() {
		return of({
			type: 'requestConfirmationCode',
			status: 0,
			payload: {}
		}).pipe(
			share(),
			delay(100),
			tap((response) => {
				if (response.status === 300) {
					return throwError('confirmationError');
				}
			}),
		);
	}

	validateVerificationCode(code) {
		this.loadingStatusChanged.next(true);
		setTimeout(() => {
			// send to server verification code and receive result if it's valid
			this.loadingStatusChanged.next(false);
			this.validationStatusChanged$.next({
				type: 'validateConfirmationCode',
				status: 0,
				payload: {accessToken: '932989234329091'}
			});
			this.setAccessTokenToStorage('932989234329091');
		}, 500);
	}

	setAccessTokenToStorage(accessToken) {
		this.storageService.setItem('accessToken', accessToken);
	}

	getAccessToken() {
		return this.storageService.getItem('accessToken');
	}

	getBreachedAccounts(accessToken): Observable<GetBreachedAccountsResponse> {

		return this.http.get('http://localhost:4200/assets/privacy-json/breachedAccounts.json').pipe(
			share(),
			delay(100),
			tap((response: GetBreachedAccountsResponse) => {
				// response.payload.breaches = []; // TODO Uncomment to see 'second scan' behaviour
				this.breachedAccounts = response.payload.breaches;
				this.onGetBreachedAccounts$.next(this.breachedAccounts);
				this.loadingStatusChanged.next(false);
			}),
		);
	}
}
