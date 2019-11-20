import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, EMPTY, merge, Observable, ReplaySubject, Subject } from 'rxjs';
import {
	catchError,
	debounceTime,
	distinctUntilChanged,
	filter,
	map,
	switchMap,
	take,
	takeUntil,
	tap
} from 'rxjs/operators';
import { CommunicationWithFigleafService } from '../../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { EmailVerifyService, ErrorNames } from './email-verify.service';
import { instanceDestroyed } from '../../../utils/custom-rxjs-operators/instance-destroyed';
import { TaskActionWithTimeoutService, TasksName } from '../../../common/services/analytics/task-action-with-timeout.service';
import { UpdateTriggersService } from '../../../common/services/update-triggers.service';
import { ScanCounterService } from './scan-counter.service';
import { NetworkStatus } from '../../../../../../enums/network-status.enum';
import { CommonService } from '../../../../../../services/common/common.service';
import { GetBreachesService } from './get-breaches.service';
import { UserEmailService } from './user-email.service';

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

	private scanNotifier = new BehaviorSubject<boolean>(false);
	scanNotifier$ = this.scanNotifier.asObservable();

	private getNewBreachedAccounts$ = new Subject<boolean>();

	constructor(
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private taskActionWithTimeoutService: TaskActionWithTimeoutService,
		private updateTriggersService: UpdateTriggersService,
		private scanCounterService: ScanCounterService,
		private commonService: CommonService,
		private userEmailService: UserEmailService,
		private getBreachesService: GetBreachesService,
		private emailScannerService: EmailVerifyService) {
		this.getBreachedAccounts();
	}

	getNewBreachedAccounts() {
		this.getNewBreachedAccounts$.next(true);
	}

	private getBreachedAccounts() {
		return merge(
			this.scanNotifier$.pipe(map(() => ({type: 'scanNotifier'}))),
			this.emailScannerService.validationStatusChanged$.pipe(distinctUntilChanged()),
			this.communicationWithFigleafService.isFigleafReadyForCommunication$.pipe(
				tap((isFigleafReadyForCommunication) => this.resetBreachedAccounts(isFigleafReadyForCommunication)),
				distinctUntilChanged()
			),
			this.getNewBreachedAccounts$,
			this.updateTriggersService.shouldUpdate$.pipe(
				switchMap(() => this.communicationWithFigleafService.isFigleafReadyForCommunication$.pipe(take(1))),
				filter((isFigleafReadyForCommunication) => isFigleafReadyForCommunication),
			),
			this.commonService.notification.pipe(
				filter((notification) => notification.type === NetworkStatus.Online || notification.type === NetworkStatus.Offline)
			)
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
		return this.getBreachesService.getBreachedAccounts().pipe(
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

	resetBreachedAccounts(isFigleafReadyForCommunication) {
		if (!isFigleafReadyForCommunication) {
			this.onGetBreachedAccounts.next({breaches: [], error: null, reset: true});
		}
	}

	scanNotifierEmit() {
		this.userEmailService.saveUser();
		this.scanNotifier.next(true);
	}

	private getBreachedAccountsFromDifferentSource(): Observable<BreachedAccount[]> {
		return this.communicationWithFigleafService.isFigleafReadyForCommunication$.pipe(
			take(1),
			switchMap((isFigleafInstalled) => {
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
