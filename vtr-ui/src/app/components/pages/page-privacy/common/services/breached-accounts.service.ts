import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, merge, ReplaySubject, Subject, Subscription } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { EmailScannerService } from '../../feature/check-breached-accounts/services/email-scanner.service';

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
	details: string;
	isFixed?: boolean;
	link?: string;
}

@Injectable()
export class BreachedAccountsService {

	onGetBreachedAccounts$ = new ReplaySubject<BreachedAccount[]>(1);
	onGetBreachedAccountsCompleted$ = new BehaviorSubject(false);

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
			tap(() => this.onGetBreachedAccountsCompleted$.next(false)),
			switchMap((isFigleafInstalled) => {
				if (isFigleafInstalled) {
					return this.communicationWithFigleafService.sendMessageToFigleaf({type: 'getFigleafBreachedAccounts'})
						.pipe(
							map((response: GetBreachedAccountsResponse) => {
								return response.payload.breaches;
							}),
							catchError((error) => {
								console.error('getFigleafBreachedAccounts error: ', error);
								this.onGetBreachedAccountsCompleted$.next(true);
								return EMPTY;
							}),
						);
				} else {
					return this.emailScannerService.getBreachedAccountsByEmail()
						.pipe(
							catchError((error) => {
								console.error('getBreachedAccountsByEmail error', error);
								this.onGetBreachedAccountsCompleted$.next(true);
								return EMPTY;
							})
						);
				}
			}),
			map((breachedAccounts) => {
				const breaches = breachedAccounts.filter(x => x.domain !== 'n/a');
				const unknownBreaches = breachedAccounts.filter(x => x.domain === 'n/a');
				return [...breaches, ...unknownBreaches];
			})
		).subscribe((response: BreachedAccount[]) => {
			this.onGetBreachedAccounts$.next(response);
			this.onGetBreachedAccountsCompleted$.next(true);
		}, (error) => {
			console.error('error', error);
			this.onGetBreachedAccountsCompleted$.next(true);
		});
	}
}
