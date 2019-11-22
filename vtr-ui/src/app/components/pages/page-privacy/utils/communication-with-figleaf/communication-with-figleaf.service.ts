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
	switchMap,
	take
} from 'rxjs/operators';
import {
	TaskActionWithTimeoutService,
	TasksName
} from '../../core/services/analytics/task-action-with-timeout.service';

export interface MessageFromFigleaf {
	type: string;
	status: number;
	payload?: string;
}

enum FigleafState {
	ready,
	notOnboarded,
	exit
}

@Injectable({
	providedIn: 'root'
})

export class CommunicationWithFigleafService {
	private figleafState$ = new BehaviorSubject<FigleafState | null>(null);

	isFigleafReadyForCommunication$ = this.isStateEqual(FigleafState.ready);
	isFigleafNotOnboarded$ = this.isStateEqual(FigleafState.notOnboarded);
	isFigleafInExit$ = this.isStateEqual(FigleafState.exit);

	subscription: Subscription[] = [];

	constructor(
		private ngZone: NgZone,
		private taskActionWithTimeoutService: TaskActionWithTimeoutService
	) {
		FigleafConnector.onConnect(() => {
			// this.ngZone.run(() => this.isFigleafInstalled$.next(true));
		});

		FigleafConnector.onDisconnect(() => {
			this.ngZone.run(() => {
				this.sendTestMessage().pipe(
					retryWhen((errors) => errors.pipe(delay(1000), take(5), concatMap(() => throwError(new Error('oops!'))))),
				).subscribe(() => {},
					(err) => {
						this.figleafState$.next(null);
					}
				);
			});
		});

		this.receiveFigleafReadyForCommunicationState();

		this.isFigleafNotOnboarded$.pipe(
			filter((isFigleafNotOnboarded) => isFigleafNotOnboarded),
			first()
		).subscribe((res) => this.taskActionWithTimeoutService.finishedAction(TasksName.privacyAppInstallationAction));
	}

	private receiveFigleafReadyForCommunicationState() {
		const figleafConnectSubscription = timer(0, 3000).pipe(
			switchMap(() => this.sendTestMessage().pipe(catchError(() => EMPTY))),
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

	private sendTestMessage() {
		return from(FigleafConnector.sendMessageToFigleaf({type: 'testfigleafStatus'}))
			.pipe(switchMap(() => this.checkIfFigleafInstalled()));
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
		return this.figleafState$.pipe(map((figleafState) => figleafState === state), distinctUntilChanged());
	}

	private checkIfFigleafInstalled() {
		return from(FigleafConnector.checkIfFigleafInstalled()).pipe(
			map((res) => res > 0 ? {type: 'testfigleafStatus', status: FigleafState.exit} : throwError('ooops'))
		);
	}
}
