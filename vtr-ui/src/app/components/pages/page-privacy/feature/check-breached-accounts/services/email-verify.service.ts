import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccessTokenService } from '../../../core/services/access-token.service';
import { UserEmailService } from './user-email.service';
import { PRIVACY_ENVIRONMENT } from '../../../utils/injection-tokens';

interface ConfirmationCodeValidationResponse {
	status: string;
	token: string;
}

export enum ErrorNames {
	noAccessToken = 'noAccessToken'
}

@Injectable({
	providedIn: 'root'
})
export class EmailVerifyService {
	private validationStatusChanged = new Subject<ConfirmationCodeValidationResponse>();
	validationStatusChanged$ = this.validationStatusChanged.asObservable();

	private loading = new Subject<boolean>();
	loading$ = this.loading.asObservable();

	constructor(
		private accessTokenService: AccessTokenService,
		private userEmailService: UserEmailService,
		private http: HttpClient,
		@Inject(PRIVACY_ENVIRONMENT) private environment
	) {}

	sendConfirmationCode() {
		this.loading.next(true);
		const headers = new HttpHeaders({
			'Content-Type': 'text/plain;charset=UTF-8',
		});
		return this.http.post(`${this.environment.backendUrl}/api/v1/vantage/auth/init`, {
			email: this.userEmailService.getUserEmailWithoutHash(),
		}, {headers})
			.pipe(
				catchError((error) => {
					this.loading.next(false);
					return throwError('start authorization error', error);
				})
			);
	}

	validateVerificationCode(code) {
		this.loading.next(true);
		const headers = new HttpHeaders({
			'Content-Type': 'text/plain;charset=UTF-8',
		});
		return this.http.post<ConfirmationCodeValidationResponse>(
			`${this.environment.backendUrl}/api/v1/vantage/auth/finish`,
			{
				email: this.userEmailService.getUserEmailWithoutHash(),
				code,
			}, {headers}
		).pipe(
			tap((response) => {
				this.loading.next(false);
				this.accessTokenService.removeAccessToken();
				this.accessTokenService.setAccessToken(response.token);
				this.validationStatusChanged.next();
			}, (error) => {}),
		);
	}
}
