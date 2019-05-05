import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, share } from 'rxjs/operators';

export interface AccountsStoredByFigleaf {
	email: string;
	password: string;
	breaches: number;
}

interface ResponseMessage {
	type: string;
	status: number;
	payload: { figleaf_accounts: AccountsStoredByFigleaf[] };
}

@Injectable({
	providedIn: 'root'
})
export class FigleafAccountsService {

	constructor(private http: HttpClient) {
	}

	getAccountsStoredByFigleaf(): Observable<ResponseMessage> {
		const figleafAccountsMock = [
			{
				email: 'john_doe123@gmail.com',
				password: 'john*doe123secret',
				breaches: 0,
			},
			{
				email: 'john_doe123@gmail.com',
				password: 'john*doe123secret',
				breaches: 0,
			},
			{
				email: 'john_doe123@gmail.com',
				password: 'john*doe123secret',
				breaches: 0,
			}
		];

		// this.http.get('');

		return of({
			type: 'getAccountsStoredByFigleaf',
			status: 0,
			payload: {figleaf_accounts: figleafAccountsMock},
		}).pipe(
			share(),
			delay(200),
		);
	}


}
