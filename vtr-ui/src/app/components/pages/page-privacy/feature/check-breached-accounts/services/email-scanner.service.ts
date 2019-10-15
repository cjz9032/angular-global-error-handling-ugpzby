import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { StorageService, USER_EMAIL_HASH } from '../../../common/services/storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccessTokenService } from '../../../common/services/access-token.service';
import { PRIVACY_ENVIRONMENT } from '../../../utils/injection-tokens';
import { INVALID_TOKEN } from '../../../utils/error-codes';
import { getSha1Hash } from '../../../utils/helpers';
import { SafeStorageService } from '../../../common/services/safe-storage.service';

interface ConfirmationCodeValidationResponse {
	status: string;
	token: string;
}

export interface BreachedAccountsFromServerResponse {
	status: string;
	userEmail: string;
	data: BreachData[];
}

export interface BreachData {
	document_id: string;
	domain: string;
	email: string;
	password_plaintext: string;
	publish_date: number;
	record_has_password: boolean;
	source_id: number;
	username?: string;
	breach: {
		breach_date: number;
		breach_id: number;
		description: string;
		num_records: number;
		site: string;
		site_description: string;
		title: string;
		updated_date: number;
	};
}

export enum ErrorNames {
	noAccessToken = 'noAccessToken'
}


@Injectable({
	providedIn: 'root'
})
export class EmailScannerService {
	private _userEmail$ = new BehaviorSubject<string>(this.getUserEmail());
	userEmail$ = this._userEmail$.asObservable();

	private validationStatusChanged = new Subject<ConfirmationCodeValidationResponse>();
	validationStatusChanged$ = this.validationStatusChanged.asObservable();

	private scanNotifier = new BehaviorSubject<boolean>(false);
	scanNotifier$ = this.scanNotifier.asObservable();

	private loadingStatusChanged = new Subject<boolean>();
	loadingStatusChanged$ = this.loadingStatusChanged.asObservable();

	constructor(
		private storageService: StorageService,
		private accessTokenService: AccessTokenService,
		private http: HttpClient,
		private safeStorageService: SafeStorageService,
		@Inject(PRIVACY_ENVIRONMENT) private environment
	) {
	}

	private getUserEmail() {
		const emailFromSafeStorage = this.safeStorageService.getEmail() || '';
		const hashFromLocalStorage = this.storageService.getItem(USER_EMAIL_HASH);
		return getSha1Hash(emailFromSafeStorage) === hashFromLocalStorage ? emailFromSafeStorage : '';
	}

	setUserEmail(userEmail) {
		this._userEmail$.next(userEmail);
		this.safeStorageService.setEmail(userEmail);
	}

	removeUserEmail() {
		this._userEmail$.next('');
		this.safeStorageService.removeEmail();
	}

	scanNotifierEmit() {
		this.storageService.setItem(USER_EMAIL_HASH, getSha1Hash(this._userEmail$.getValue()));
		this.safeStorageService.setEmail(this._userEmail$.getValue());
		this.scanNotifier.next(true);
	}

	cancelVerification() {
		this.loadingStatusChanged.next(false);
	}

	sendConfirmationCode() {
		this.loadingStatusChanged.next(true);
		const headers = new HttpHeaders({
			'Content-Type': 'text/plain;charset=UTF-8',
		});
		return this.http.post(`${this.environment.backendUrl}/api/v1/vantage/auth/init`, {
			'email': this.safeStorageService.getEmail(),
		}, {headers: headers})
			.pipe(
				catchError((error) => {
					this.loadingStatusChanged.next(false);
					return throwError('start authorization error', error);
				})
			);
	}

	validateVerificationCode(code) {
		this.loadingStatusChanged.next(true);
		const headers = new HttpHeaders({
			'Content-Type': 'text/plain;charset=UTF-8',
		});
		return this.http.post<ConfirmationCodeValidationResponse>(
			`${this.environment.backendUrl}/api/v1/vantage/auth/finish`,
			{
				'email': this.safeStorageService.getEmail(),
				'code': code,
			}, {headers: headers}
		)
			.pipe(
				tap((response) => {
					this.loadingStatusChanged.next(false);
					this.accessTokenService.removeAccessToken();
					this.accessTokenService.setAccessToken(response.token);
					this.validationStatusChanged.next();
				}, (error) => {
					console.error('Confirmation Error', error);
				}),
			);
	}

	getBreachedAccounts() {
		this.loadingStatusChanged.next(true);
		const accessToken = this.accessTokenService.getAccessToken();

		const getBreachedAccounts = accessToken ? this.getBreachedAccountsByEmailWithToken() : this.getBreachedAccountsWithoutToken();

		return getBreachedAccounts.pipe(
			switchMap((breaches: BreachedAccountsFromServerResponse) => {
				this.loadingStatusChanged.next(false);
				return [this.transformBreachesFromServer(breaches, accessToken)];
			}),
			catchError((error) => {
				console.error('Confirmation Error', error);
				this.loadingStatusChanged.next(false);
				if (error.status === INVALID_TOKEN) {
					this.accessTokenService.removeAccessToken();
					return of([]);
				}
				return throwError('get breaches from server error');
			})
		);
	}

	private getBreachedAccountsByEmailWithToken() {
		const accessToken = this.accessTokenService.getAccessToken();
		if (accessToken) {
			const headers = new HttpHeaders({
				'Authorization': 'Bearer ' + accessToken,
			});
			return this.http.get<BreachedAccountsFromServerResponse>(
				`${this.environment.backendUrl}/api/v1/vantage/emailbreaches`,
				{headers: headers}
			);
		} else {
			return throwError(ErrorNames.noAccessToken);
		}
	}

	private getBreachedAccountsWithoutToken() {
		let response: Observable<never | BreachedAccountsFromServerResponse> = EMPTY;
		const SHA1HashFromEmail = this.storageService.getItem(USER_EMAIL_HASH);

		if (SHA1HashFromEmail) {
			response = this.http.get<BreachedAccountsFromServerResponse>(
				`${this.environment.backendUrl}/api/v1/vantage/public/emailbreaches?email_hash=${SHA1HashFromEmail}`,
				{
					headers: new HttpHeaders({
						'Accept-Version': 'v1.1'
					})
				}
			);
		}

		if (!SHA1HashFromEmail) {
			this.loadingStatusChanged.next(false);
		}

		return response;
	}

	private transformBreachesFromServer(breaches: BreachedAccountsFromServerResponse, isHaveToken: string) {
		return breaches.data.reduce((acc, breachData) => {
			const date = new Date(breachData.publish_date * 1000);
			const newData = {
				domain: breachData.breach.site,
				date: date.toDateString(),
				email: breachData.email,
				password: breachData.password_plaintext || '',
				name: breachData.username,
				details: breachData.breach.description,
				image: '',
				hasPassword: breachData.record_has_password,
				isEmailConfirmed: !!isHaveToken
			};
			acc.push(newData);
			return acc;
		}, []);
	}
}
