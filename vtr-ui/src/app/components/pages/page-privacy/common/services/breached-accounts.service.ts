import { Injectable, OnDestroy } from '@angular/core';
import { EMPTY, merge, Observable, ReplaySubject, Subject } from 'rxjs';
import {
	catchError,
	debounceTime,
	distinctUntilChanged,
	filter,
	map, pairwise,
	switchMap,
	take,
	takeUntil,
	tap
} from 'rxjs/operators';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { EmailScannerService, ErrorNames } from '../../feature/check-breached-accounts/services/email-scanner.service';
import { instanceDestroyed } from '../../utils/custom-rxjs-operators/instance-destroyed';
import { TaskActionWithTimeoutService, TasksName } from './analytics/task-action-with-timeout.service';
import { UpdateTriggersService } from './update-triggers.service';
import { ScanCounterService } from './scan-counter.service';

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
	isEmailConfirmed?: boolean;
}

interface GetBreachedAccountsState {
	breaches: BreachedAccount[];
	error: string | null;
	reset?: boolean;
}

@Injectable({
	providedIn: 'root'
})
export class BreachedAccountsService implements OnDestroy {
	private onGetBreachedAccounts = new ReplaySubject<GetBreachedAccountsState>(1);
	onGetBreachedAccounts$ = this.onGetBreachedAccounts.asObservable();

	private getNewBreachedAccounts$ = new Subject<boolean>();

	constructor(
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private taskActionWithTimeoutService: TaskActionWithTimeoutService,
		private updateTriggersService: UpdateTriggersService,
		private scanCounterService: ScanCounterService,
		private emailScannerService: EmailScannerService) {
		this.getBreachedAccounts();
	}

	getNewBreachedAccounts() {
		this.getNewBreachedAccounts$.next(true);
	}

	private getBreachedAccounts() {
		return merge(
			this.emailScannerService.scanNotifier$.pipe(map(() => ({type: 'scanNotifier'}))),
			this.emailScannerService.validationStatusChanged$.pipe(distinctUntilChanged()),
			this.communicationWithFigleafService.isFigleafReadyForCommunication$.pipe(
				tap((isFigleafReadyForCommunication) => this.resetBreachedAccounts(isFigleafReadyForCommunication)),
				distinctUntilChanged()
			),
			this.getNewBreachedAccounts$.asObservable().pipe(
				tap(() => this.resetBreachedAccounts(false)),
			),
			this.updateTriggersService.shouldUpdate$.pipe(
				switchMap(() => this.communicationWithFigleafService.isFigleafReadyForCommunication$
					.pipe(
						pairwise(),
						map(([prev, current]) => prev === true ? true : current),
						take(1))
				),
				filter((isFigleafReadyForCommunication) => isFigleafReadyForCommunication),
			),
		).pipe(
			debounceTime(200),
			switchMap((mergeValue) => this.getBreachedAccountsFromDifferentSource().pipe(
				map((response) => ([mergeValue, response])))
			),
			catchError((error) => this.handleError(error)),
			takeUntil(instanceDestroyed(this))
		).subscribe(([mergeValue, breaches]: [any, BreachedAccount[]]) => {
			this.onGetBreachedAccounts.next({breaches, error: null});
			this.sendTaskAcrion();

			if (mergeValue && mergeValue.type && mergeValue.type === 'scanNotifier') {
				this.scanCounterService.setNewScan();
			}
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
				catchError((err) => {
					console.error('getFigleafBreachedAccountsError', err);
					return EMPTY;
				})
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
			this.onGetBreachedAccounts.next({breaches: null, error});
		}
		this.sendTaskAcrion();
		return EMPTY;
	}

	private resetBreachedAccounts(isFigleafReadyForCommunication) {
		if (!isFigleafReadyForCommunication) {
			this.onGetBreachedAccounts.next({breaches: [], error: null, reset: true});
		}
	}

	private getBreachedAccountsFromDifferentSource(): Observable<BreachedAccount[]> {
		return this.communicationWithFigleafService.isFigleafReadyForCommunication$.pipe(
			take(1),
			switchMap((isFigleafInstalled) => {
				console.log('isFigleafInstalled', isFigleafInstalled);
				return isFigleafInstalled ? this.getBreachedAccountsFromApp() : this.getBreachedAccountsFromBackend();
			}),
			map((breachedAccounts) => breachedAccounts.filter(x => !x.isFixed)),
			map((breachedAccounts) => {
				const breaches = breachedAccounts.filter(x => x.domain !== 'n/a');
				const unknownBreaches = breachedAccounts.filter(x => x.domain === 'n/a');
				return [...breaches, ...unknownBreaches];
			})
		);
	}
}
