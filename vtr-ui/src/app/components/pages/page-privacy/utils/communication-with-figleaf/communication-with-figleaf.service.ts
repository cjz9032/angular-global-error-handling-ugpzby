import { Injectable, NgZone } from '@angular/core';
import { FigleafConnectorInstance as FigleafConnector, MessageToFigleaf } from './figleaf-connector';
import { BehaviorSubject, EMPTY, from, Observable, Subscription, throwError, timer } from 'rxjs';
import {
	catchError,
	concatMap,
	delay,
	distinctUntilChanged,
	filter,
	first,
	map,
	retryWhen,
	shareReplay,
	switchMap,
	take, tap
} from 'rxjs/operators';
import {
	TaskActionWithTimeoutService,
	TasksName
} from '../../core/services/analytics/task-action-with-timeout.service';
import { CommunicationSwitcherService } from './communication-switcher.service';

export interface MessageFromFigleaf {
	type: string;
	status: number;
	payload?: string;
}

enum FigleafState {
	ready,
	notOnboarded,
	invalidRequest,
	missingParameters,
	unknown,
	exit
}

@Injectable({
	providedIn: 'root'
})

export class CommunicationWithFigleafService {
	private figleafState$ = new BehaviorSubject<FigleafState | null>(null);

	isFigleafReadyForCommunication$ = this.isStateEqual(FigleafState.ready);
	isFigleafNotOnboarded$ = this.isStateEqual(FigleafState.notOnboarded);
	isFigleafInExit$ = this.isStateEqual(FigleafState.exit).pipe(
		tap((isFigleafInExit) => {
			if (isFigleafInExit) {
				this.communicationSwitcherService.stopPulling();
			}
		})
	);

	subscription: Subscription[] = [];

	constructor(
		private ngZone: NgZone,
		private taskActionWithTimeoutService: TaskActionWithTimeoutService,
		private communicationSwitcherService: CommunicationSwitcherService,
	) {
		FigleafConnector.onConnect(() => {
			// this.ngZone.run(() => this.isFigleafInstalled$.next(true));
		});

		FigleafConnector.onDisconnect(() => {
			this.ngZone.run(() => {
				this.communicationSwitcherService.isPullingActive$.pipe(take(1)).pipe(
					switchMap((res) => {
						return res ? this.sendTestMessage().pipe(
							retryWhen((errors) => errors.pipe(delay(1000), take(5), concatMap(() => throwError(new Error('oops!')))))
						) : EMPTY;
					})).subscribe(() => {
					},
					(err) => {
						this.figleafState$.next(null);
						this.communicationSwitcherService.startPulling();
					}
				);
			});
		});

		this.isFigleafNotOnboarded$.pipe(
			filter((isFigleafNotOnboarded) => isFigleafNotOnboarded),
			first()
		).subscribe((res) => this.taskActionWithTimeoutService.finishedAction(TasksName.privacyAppInstallationAction));
	}

	private receiveFigleafReadyForCommunicationState() {
		const figleafConnectSubscription = timer(0, 3000).pipe(
			switchMap(() => this.communicationSwitcherService.isPullingActive$.pipe(take(1))),
			switchMap((res) => {
				return res ? this.sendTestMessage().pipe(catchError(() => EMPTY)) : this.checkIfFigleafInstalled().pipe(catchError(() => EMPTY));
			}),
			distinctUntilChanged()
		).subscribe((figleafStatus: MessageFromFigleaf) => {
			this.figleafState$.next(figleafStatus.status);
		}, (error) => {
			console.error('send test message error: ', error);
			this.figleafState$.next(null);
		});

		this.subscription.push(figleafConnectSubscription);
	}

	disconnect() {
		FigleafConnector.disconnect();
		this.subscription.forEach((subs) => subs.unsubscribe());
	}

	connect() {
		this.receiveFigleafReadyForCommunicationState();
	}

	private sendTestMessage() {
		return from(FigleafConnector.sendMessageToFigleaf({type: 'testfigleafStatus'}));
	}

	sendMessageToFigleaf<T>(message: MessageToFigleaf): Observable<T> {
		return this.isFigleafReadyForCommunication$.pipe(
			take(1),
			filter((isFigleafInstalled) => isFigleafInstalled),
			switchMap(() => from(FigleafConnector.sendMessageToFigleaf(message)) as Observable<T>),
			catchError((error) => {
				console.error('sendMessageToFigleaf error: ', error);
				return EMPTY;
			})
		);
	}

	get isFigleafInstalled() {
		return this.figleafState$.getValue() === FigleafState.ready;
	}

	private isStateEqual(state: FigleafState) {
		return this.figleafState$.pipe(
			map((figleafState) => figleafState === state),
			distinctUntilChanged(),
			shareReplay(1)
		);
	}

	private checkIfFigleafInstalled() {
		return from(FigleafConnector.checkIfFigleafInstalled()).pipe(
			map(([checkIfFigleafInstalled, isExitFlowActivate]) => checkIfFigleafInstalled > 0 || JSON.parse(isExitFlowActivate)),
			map((res) => res ? {type: 'testfigleafStatus', status: FigleafState.exit} : throwError('ooops'))
		);
	}
}
