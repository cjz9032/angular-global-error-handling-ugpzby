import { Injectable } from '@angular/core';
import { EMPTY, merge, ReplaySubject, Subscription } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap, switchMapTo, take } from 'rxjs/operators';
import { CommunicationWithFigleafService } from '../communication-with-figleaf/communication-with-figleaf.service';
import { EmailScannerService } from './email-scanner.service';

interface GetBreachedAccountsResponse {
	type: string;
	status: number;
	payload: { breaches?: BreachedAccount[] };
}

export interface BreachedAccount {
	domain: string;
	image: string;
	email: string;
	password: string;
	date: string;
	name: string;
	description: string;
	isFixed?: boolean;
}

@Injectable()
export class BreachedAccountsService {

	onGetBreachedAccounts$ = new ReplaySubject<BreachedAccount[]>(1);

	constructor(
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private emailScannerService: EmailScannerService) {
	}

	getBreachedAccounts(): Subscription {
		return merge(
			this.emailScannerService.validationStatusChanged$,
			this.communicationWithFigleafService.isFigleafReadyForCommunication$.pipe(
				distinctUntilChanged(),
			)
		).pipe(
			switchMapTo(this.communicationWithFigleafService.isFigleafReadyForCommunication$
				.pipe(
					take(1)
				)
			),
			switchMap((isFigleafInstalled) => {
				if (isFigleafInstalled) {
					return this.communicationWithFigleafService.sendMessageToFigleaf({type: 'getFigleafBreachedAccounts'})
						.pipe(
							map((response: GetBreachedAccountsResponse) => {
								return response.payload.breaches;
							}),
							catchError((error) => {
								console.error('getFigleafBreachedAccounts error: ', error);
								return EMPTY;
							}),
						);
				} else {
					return this.emailScannerService.getBreachedAccountsByEmail()
						.pipe(
							catchError((error) => {
								console.error('getBreachedAccountsByEmail error', error);
								return EMPTY;
							})
						);
				}
			})
		).subscribe((response: BreachedAccount[]) => {
			this.onGetBreachedAccounts$.next(response);
		}, (error) => {
			console.error('error', error);
		});
	}
}
