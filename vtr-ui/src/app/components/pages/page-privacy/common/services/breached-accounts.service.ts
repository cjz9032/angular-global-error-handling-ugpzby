import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, merge, ReplaySubject, Subject, Subscription } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { EmailScannerService, ErrorNames } from '../../feature/check-breached-accounts/services/email-scanner.service';
import { BrowserListType } from './vantage-communication.service';

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
	hasPassword?: boolean;
	hasEmail?: boolean;
}

interface GetBreachedAccountsState {
	breaches: BreachedAccount[];
	error: string | null;
}

export enum KeyForShow {
	email = 'email',
	password = 'password'
}

export type KeysForShow = keyof typeof KeyForShow;
export type KeyOfBreachedAccounts = {
	[value in KeysForShow]: string;
};

@Injectable()
export class BreachedAccountsService {

	onGetBreachedAccounts$ = new ReplaySubject<GetBreachedAccountsState>(1);
	onGetBreachedAccountsCompleted$ = new BehaviorSubject(false);

	taskStartedTime = 0;
	scanBreachesAction$ = new Subject<{ TaskDuration: number }>();

	constructor(
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private emailScannerService: EmailScannerService) {
		this.getBreachedAccounts();
	}

	getBreachedAccounts(): Subscription {
		return merge(
			this.emailScannerService.scanNotifier$,
			this.emailScannerService.validationStatusChanged$,
			this.communicationWithFigleafService.isFigleafReadyForCommunication$.pipe(
				distinctUntilChanged(),
			)
		).pipe(
			switchMapTo(this.communicationWithFigleafService.isFigleafReadyForCommunication$.pipe(take(1))),
			tap(() => this.onGetBreachedAccountsCompleted$.next(false)),
			switchMap((isFigleafInstalled) => {
				this.taskStartedTime = Date.now();
				return isFigleafInstalled ? this.getBreachedAccountsFromApp() : this.getBreachedAccountsFromBackend();
			}),
			map((breachedAccounts) => {
				const breaches = breachedAccounts.filter(x => x.domain !== 'n/a');
				const unknownBreaches = breachedAccounts.filter(x => x.domain === 'n/a');
				return [...breaches, ...unknownBreaches];
			})
		).subscribe((response: BreachedAccount[]) => {
			this.onGetBreachedAccounts$.next({breaches: response, error: null});
			this.onGetBreachedAccountsCompleted$.next(true);
			this.sendTaskAcrion();
		}, (error) => {
			this.onGetBreachedAccountsCompleted$.next(true);
			this.onGetBreachedAccounts$.next({breaches: [], error: error});
			this.sendTaskAcrion();
		});
	}

	private sendTaskAcrion() {
		const taskDuration = (Date.now() - this.taskStartedTime) / 1000;
		this.scanBreachesAction$.next({TaskDuration: taskDuration});
	}

	private getBreachedAccountsFromApp() {
		return this.communicationWithFigleafService.sendMessageToFigleaf({type: 'getFigleafBreachedAccounts'})
			.pipe(
				map((response: GetBreachedAccountsResponse) => {
					return response.payload.breaches;
				}),
				catchError((error) => {
					console.error('getFigleafBreachedAccounts error: ', error);
					this.onGetBreachedAccountsCompleted$.next(true);
					this.onGetBreachedAccounts$.next({breaches: [], error: error});
					this.sendTaskAcrion();
					return EMPTY;
				}),
			);
	}

	private getBreachedAccountsFromBackend() {
		return this.emailScannerService.getBreachedAccounts()
			.pipe(
				catchError((error) => {
					console.error('getBreachedAccountsByEmail error', error);
					this.onGetBreachedAccountsCompleted$.next(true);
					if (error !== ErrorNames.noAccessToken) {
						this.onGetBreachedAccounts$.next({breaches: [], error: error});
						this.sendTaskAcrion();
					}
					return EMPTY;
				})
			);
	}
}
