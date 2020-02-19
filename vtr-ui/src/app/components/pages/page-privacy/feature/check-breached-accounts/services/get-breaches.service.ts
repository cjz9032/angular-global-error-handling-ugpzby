import { Inject, Injectable } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { INVALID_TOKEN } from '../../../utils/error-codes';
import { EMPTY, Observable, of, Subject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorNames } from './email-verify.service';
import { AccessTokenService } from '../../../core/services/access-token.service';
import { PRIVACY_ENVIRONMENT } from '../../../utils/injection-tokens';
import { UserEmailService } from './user-email.service';

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

@Injectable({
	providedIn: 'root'
})
export class GetBreachesService {
	private loading = new Subject<boolean>();
	loading$ = this.loading.asObservable();

	constructor(
		private accessTokenService: AccessTokenService,
		private http: HttpClient,
		private userEmailService: UserEmailService,
		@Inject(PRIVACY_ENVIRONMENT) private environment
	) {	}

	getBreachedAccounts() {
		this.loading.next(true);
		const accessToken = this.accessTokenService.getAccessToken();

		const getBreachedAccounts = accessToken ? this.getBreachedAccountsByEmailWithToken() : this.getBreachedAccountsWithoutToken();

		return getBreachedAccounts.pipe(
			switchMap((breaches: BreachedAccountsFromServerResponse) => {
				this.loading.next(false);
				return [this.transformBreachesFromServer(breaches, accessToken)];
			}),
			catchError((error) => {
                this.loading.next(false);
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
				Authorization: 'Bearer ' + accessToken,
			});
			return this.http.get<BreachedAccountsFromServerResponse>(
				`${this.environment.backendUrl}/api/v1/vantage/emailbreaches`,
				{headers}
			);
		} else {
			return throwError(ErrorNames.noAccessToken);
		}
	}

	private getBreachedAccountsWithoutToken() {
		let response: Observable<never | BreachedAccountsFromServerResponse> = EMPTY;
		const SHA1HashFromEmail = this.userEmailService.getUserEmailHash();

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
			this.loading.next(false);
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
