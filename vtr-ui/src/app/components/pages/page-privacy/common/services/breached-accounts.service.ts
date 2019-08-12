import { Injectable, OnDestroy } from '@angular/core';
import { EMPTY, merge, ReplaySubject, Subject } from 'rxjs';
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
import { UpdateTriggersService } from './update-triggers.service';

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

@Injectable({
	providedIn: 'root'
})
export class BreachedAccountsService implements OnDestroy {
	onGetBreachedAccounts$ = new ReplaySubject<GetBreachedAccountsState>(1);

	private getNewBreachedAccounts$ = new Subject<boolean>();

	constructor(
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private taskActionWithTimeoutService: TaskActionWithTimeoutService,
		private updateTriggersService: UpdateTriggersService,
		private emailScannerService: EmailScannerService) {
		this.getBreachedAccounts();
	}

	getNewBreachedAccounts() {
		this.getNewBreachedAccounts$.next(true);
	}

	private getBreachedAccounts() {
		return merge(
			this.emailScannerService.scanNotifier$.pipe(distinctUntilChanged()),
			this.emailScannerService.validationStatusChanged$.pipe(distinctUntilChanged()),
			this.communicationWithFigleafService.isFigleafReadyForCommunication$.pipe(distinctUntilChanged()),
			this.getNewBreachedAccounts$.asObservable().pipe(distinctUntilChanged()),
			this.updateTriggersService.shouldUpdate$,
		).pipe(
			debounceTime(200),
			switchMapTo(this.communicationWithFigleafService.isFigleafReadyForCommunication$.pipe(take(1))),
			switchMap((isFigleafInstalled) => {
				console.log('isFigleafInstalled', isFigleafInstalled);
				return isFigleafInstalled ? this.getBreachedAccountsFromApp() : this.getBreachedAccountsFromBackend();
			}),
			map((breachedAccounts) => breachedAccounts.filter(x => !x.isFixed)),
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
			.pipe(
				map((response: GetBreachedAccountsResponse) => response.payload.breaches),
				catchError((err) => EMPTY)
			);
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
