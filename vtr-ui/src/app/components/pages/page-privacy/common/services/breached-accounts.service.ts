import { Injectable, OnDestroy } from '@angular/core';
import { EMPTY, merge, ReplaySubject, Subject, Subscription, timer } from 'rxjs';
import {
	catchError,
	debounceTime,
	distinctUntilChanged,
	map,
	switchMap,
	switchMapTo,
	take,
	takeUntil, tap
} from 'rxjs/operators';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { EmailScannerService, ErrorNames } from '../../feature/check-breached-accounts/services/email-scanner.service';
import { instanceDestroyed } from '../../utils/custom-rxjs-operators/instance-destroyed';
import { TaskActionWithTimeoutService, TasksName } from './analytics/task-action-with-timeout.service';

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

@Injectable()
export class BreachedAccountsService implements OnDestroy {
	onGetBreachedAccounts$ = new ReplaySubject<GetBreachedAccountsState>(1);

	private getNewBreachedAccounts$ = new Subject<boolean>();

	taskStartedTime = 0;
	scanBreachesAction$ = new Subject<{ TaskDuration: number }>();

	constructor(
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private taskActionWithTimeoutService: TaskActionWithTimeoutService,
		private emailScannerService: EmailScannerService) {
		this.getBreachedAccounts();
	}

	getNewBreachedAccounts() {
		this.getNewBreachedAccounts$.next(true);
	}

	private getBreachedAccounts(): Subscription {
		return merge(
			this.emailScannerService.scanNotifier$,
			this.emailScannerService.validationStatusChanged$,
			this.communicationWithFigleafService.isFigleafReadyForCommunication$.pipe(
				distinctUntilChanged(),
			),
			this.getNewBreachedAccounts$.asObservable(),
			timer(30000, 30000),
		).pipe(
			debounceTime(200),
			switchMapTo(this.communicationWithFigleafService.isFigleafReadyForCommunication$.pipe(take(1))),
			switchMap((isFigleafInstalled) => {
				return isFigleafInstalled ? this.getBreachedAccountsFromApp() : this.getBreachedAccountsFromBackend();
			}),
			map((breachedAccounts) => {
				const breaches = breachedAccounts.filter(x => x.domain !== 'n/a');
				const unknownBreaches = breachedAccounts.filter(x => x.domain === 'n/a');
				return [...breaches, ...unknownBreaches];
			}),
			catchError((error) => this.handleError(error)),
			takeUntil(instanceDestroyed(this))
		).subscribe((response: BreachedAccount[]) => {
			this.onGetBreachedAccounts$.next({breaches: response, error: null});
			this.sendTaskAcrion();
		});
	}

	ngOnDestroy() {	}

	private sendTaskAcrion() {
		this.taskActionWithTimeoutService.finishedAction(TasksName.scanBreachesAction);
	}

	private getBreachedAccountsFromApp() {
		return this.communicationWithFigleafService.sendMessageToFigleaf({type: 'getFigleafBreachedAccounts'})
			.pipe(map((response: GetBreachedAccountsResponse) => response.payload.breaches));
	}

	private getBreachedAccountsFromBackend() {
		return this.emailScannerService.getBreachedAccounts().pipe(
			catchError((error) => this.handleError(error))
		);
	}

	private handleError(error: any) {
		console.error('onGetBreachedAccounts', error);
		if (error !== ErrorNames.noAccessToken) {
			this.onGetBreachedAccounts$.next({breaches: null, error: error});
		}
		this.sendTaskAcrion();
		return EMPTY;
	}
}
