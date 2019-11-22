import { Injectable, NgZone } from '@angular/core';
import { FigleafConnectorInstance as FigleafConnector, MessageToFigleaf } from './figleaf-connector';
import { BehaviorSubject, EMPTY, from, Observable, ReplaySubject, Subscription, throwError, timer } from 'rxjs';
import { catchError, concatMap, delay, distinctUntilChanged, map, retryWhen, switchMap, take } from 'rxjs/operators';
import {
	TaskActionWithTimeoutService,
	TasksName
} from '../../core/services/analytics/task-action-with-timeout.service';

export interface MessageFromFigleaf {
	type: string;
	status: number;
	payload?: string;
}

@Injectable({
	providedIn: 'root'
})

export class CommunicationWithFigleafService {
	isFigleafInstalled$ = new ReplaySubject(1);
	private isFigleafReadyForCommunication = new BehaviorSubject<boolean>(false);
	isFigleafReadyForCommunication$ = this.isFigleafReadyForCommunication.pipe(distinctUntilChanged());

	private isFigleafNotOnboarded = new BehaviorSubject<boolean>(false);
	isFigleafNotOnboarded$ = this.isFigleafNotOnboarded.pipe(distinctUntilChanged());

	subscription: Subscription[] = [];

	constructor(
		private ngZone: NgZone,
		private taskActionWithTimeoutService: TaskActionWithTimeoutService
	) {
		FigleafConnector.onConnect(() => {
			this.ngZone.run(() => this.isFigleafInstalled$.next(true));
		});

		FigleafConnector.onDisconnect(() => {
			this.ngZone.run(() => {
				this.sendTestMessage().pipe(
					retryWhen((errors) => errors.pipe(delay(1000), take(5), concatMap(() => throwError(new Error('oops!'))))),
				).subscribe(() => {},
					(err) => {
						this.isFigleafInstalled$.next(false);
						this.isFigleafReadyForCommunication.next(false);
						this.isFigleafNotOnboarded.next(false);
					}
				);
			});
		});

		this.receiveFigleafReadyForCommunicationState();
	}

	private receiveFigleafReadyForCommunicationState() {
		const figleafConnectSubscription = timer(0, 3000).pipe(
			switchMap(() => this.sendTestMessage().pipe(catchError(() => EMPTY))),
			distinctUntilChanged()
		).subscribe((figleafStatus: MessageFromFigleaf) => {
			const isFigleafReady = figleafStatus.status === 0;
			this.isFigleafReadyForCommunication.next(isFigleafReady);

			const isFigleafNotOnboarded = figleafStatus.status === 1;
			this.isFigleafNotOnboarded.next(isFigleafNotOnboarded);

			if (isFigleafNotOnboarded) {
				this.taskActionWithTimeoutService.finishedAction(TasksName.privacyAppInstallationAction);
			}
		}, (error) => {
			console.error('send test message error: ', error);
			this.isFigleafReadyForCommunication.next(false);
		});

		this.subscription.push(figleafConnectSubscription);
	}

	disconnect() {
		FigleafConnector.disconnect();
		this.subscription.forEach((subs) => subs.unsubscribe());
	}

	private sendTestMessage() {
		return from(FigleafConnector.sendMessageToFigleaf({type: 'testfigleafStatus'}))
			.pipe(
				catchError(() => {
					return from(FigleafConnector.checkIfFigleafInstalled()).pipe(
						map((res) => res > 0 ? {type: 'testfigleafStatus', status: 1} : throwError('ooops'))
					);
				})
			);
	}

	sendMessageToFigleaf<T>(message: MessageToFigleaf): Observable<T> {
		return this.isFigleafReadyForCommunication.pipe(
			take(1),
			switchMap(isFigleafInstalled => {
				if (isFigleafInstalled) {
					return from(FigleafConnector.sendMessageToFigleaf(message)) as Observable<T>;
				} else {
					console.error('figLeaf not installed');
					return EMPTY;
				}
			}),
			catchError((error) => {
				console.error('sendMessageToFigleaf error: ', error);
				return EMPTY;
			})
		);
	}

	get isFigleafInstalled() {
		return this.isFigleafReadyForCommunication.getValue();
	}
}
