import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { StorageService } from '../shared/services/storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccessTokenService } from './access-token.service';
import { PRIVACY_ENVIRONMENT } from '../shared/injection-tokens';
import { BreachedAccount } from './breached-accounts.service';
import { INVALID_TOKEN } from './../error-codes';

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

	cancelVerification() {
		this.loadingStatusChanged.next(false);
	}

	sendConfirmationCode() {
		this.loadingStatusChanged.next(true);
		const headers = new HttpHeaders({
			'Content-Type': 'text/plain;charset=UTF-8',
		});
		return this.http.post(`${this.environment.backendUrl}/api/v1/vantage/auth/init`, {
			'email': this._userEmail$.getValue(),
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
				'email': this._userEmail$.getValue(),
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
					console.log('Confirmation Error', error);
				}),
			);
	}

	getBreachedAccountsByEmail(): Observable<BreachedAccount[]> {
		const accessToken = this.accessTokenService.getAccessToken();
		if (accessToken) {
			const headers = new HttpHeaders({
				'Authorization': 'Bearer ' + accessToken,
			});
			return this.http.get<BreachedAccountsFromServerResponse>(
				`${this.environment.backendUrl}/api/v1/vantage/emailbreaches`,
				{headers: headers}
			)
				.pipe(
					switchMap((breaches: BreachedAccountsFromServerResponse) => {
						this.loadingStatusChanged.next(false);
						this.setUserEmail(breaches.userEmail);
						return [this.transformBreachesFromServer(breaches)];
					}),
					catchError((error) => {
						console.error('Confirmation Error', error);
						if (error.status === INVALID_TOKEN) {
							this.accessTokenService.removeAccessToken();
						}
						return EMPTY;
					})
				);
		} else {
			return throwError('no accessToken');
		}
	}

	private transformBreachesFromServer(breaches: BreachedAccountsFromServerResponse) {
		return breaches.data.reduce((acc, breachData) => {
			const date = new Date(breachData.publish_date * 1000);
			const newData = {
				domain: breachData.breach.site,
				date: date.toDateString(),
				email: breachData.email,
				password: breachData.password_plaintext,
				name: breachData.username,
				description: breachData.breach.description,
				image: '',
			};
			acc.push(newData);
			return acc;
		}, []);
	}
}
