import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { delay, share, tap } from 'rxjs/operators';
import { BreachedAccount } from '../common-ui/breached-account/breached-account.component';
import { StorageService } from '../shared/services/storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccessTokenService } from './access-token.service';
import { PRIVACY_ENVIRONMENT } from '../shared/injection-tokens';

interface GetBreachedAccountsResponse {
	type: string;
	status: number;
	payload: { breaches?: BreachedAccount[] };
}

interface ConfirmationCodeValidationResponse {
	status: string;
	token: string;
}

@Injectable()
export class EmailScannerService {
	private _userEmail$ = new BehaviorSubject<string>('');
	userEmail$ = this._userEmail$.asObservable();

	private validationStatusChanged = new Subject<ConfirmationCodeValidationResponse>();
	validationStatusChanged$ = this.validationStatusChanged.asObservable();

	private loadingStatusChanged = new Subject<boolean>();
	loadingStatusChanged$ = this.loadingStatusChanged.asObservable();

	constructor(
		private storageService: StorageService,
		private accessTokenService: AccessTokenService,
		private http: HttpClient,
		@Inject(PRIVACY_ENVIRONMENT) private environment
	) {
	}

	setUserEmail(userEmail) {
		this._userEmail$.next(userEmail);
	}

	sendConfirmationCode() {
		this.loadingStatusChanged.next(true);
		const headers = new HttpHeaders({
			'Content-Type': 'text/plain;charset=UTF-8',
		});
		return this.http.post(`${this.environment.backendUrl}/api/v1/vantage/auth/init`, {
			'email': this._userEmail$.getValue(),
		}, {headers: headers});
	}

	validateVerificationCode(code) {
		this.loadingStatusChanged.next(true);
		const headers = new HttpHeaders({
			'Content-Type': 'text/plain;charset=UTF-8',
		});
		return this.http.post<ConfirmationCodeValidationResponse>(
			`${this.environment.backendUrl}/api/v1/vantage/auth/finish`,
			{
				'email': this._userEmail$.getValue(),
				'code': code,
			}, {headers: headers}
		)
			.pipe(
				tap((response) => {
					this.loadingStatusChanged.next(false);
					this.accessTokenService.setAccessToken(response.token);
					this.validationStatusChanged.next();
				}, (error) => {
					console.log('Confirmation Error', error);
				}),
			);
	}

	getAccessToken() {
		return this.accessTokenService.getAccessToken();
	}

	getBreachedAccountsByEmail(): Observable<GetBreachedAccountsResponse> {
		const accessToken = this.accessTokenService.getAccessToken();
		if (accessToken) {
			return this.http.get('/assets/privacy-json/breachedAccounts.json')
				.pipe(
					share(),
					delay(100),
					tap((response: GetBreachedAccountsResponse) => {
						this.loadingStatusChanged.next(false);
					}),
				);
		} else {
			return throwError('no accessToken');
		}
	}
}
