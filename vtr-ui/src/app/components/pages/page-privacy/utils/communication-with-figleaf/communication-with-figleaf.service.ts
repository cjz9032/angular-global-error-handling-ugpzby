import { Injectable, NgZone } from '@angular/core';
import { FigleafConnectorInstance as FigleafConnector, MessageToFigleaf } from './figleaf-connector';
import { BehaviorSubject, EMPTY, from, Observable, ReplaySubject, Subscription, timer } from 'rxjs';
import { catchError, distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs/operators';
import {
	TaskActionWithTimeoutService,
	TasksName
} from '../../common/services/analytics/task-action-with-timeout.service';

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
				this.isFigleafInstalled$.next(false);
				this.isFigleafReadyForCommunication.next(false);
				this.isFigleafNotOnboarded.next(false);
			});
		});

		this.subscription.push(this.isFigleafInstalled$.pipe(
			filter((isFigleafInstalled) => !!isFigleafInstalled),
		).subscribe(() => {
			this.receiveFigleafReadyForCommunicationState();
		}));

		FigleafConnector.connect();
	}

	private receiveFigleafReadyForCommunicationState() {
		const figleafConnectSubscription = timer(0, 3000).pipe(
			switchMap(() => {
				return this.sendTestMessage().pipe(
					catchError((err) => {
						console.error('send test message error: ', err);
						this.isFigleafReadyForCommunication.next(false);
						this.isFigleafNotOnboarded.next(false);
						return EMPTY;
					})
				);
			}),
			distinctUntilChanged(),
			takeUntil(this.isFigleafInstalled$.pipe(
				filter((isFigleafInstalled) => !isFigleafInstalled),
			))
		).subscribe((figleafStatus: MessageFromFigleaf) => {
			const isFigleafReady = figleafStatus.status === 0;
			this.isFigleafReadyForCommunication.next(isFigleafReady);

			const isFigleafNotOnboarded = figleafStatus.status === 1;
			this.isFigleafNotOnboarded.next(isFigleafNotOnboarded);

			if (isFigleafReady) {
				this.taskActionWithTimeoutService.finishedAction(TasksName.privacyAppInstallationAction);
			}
		}, (error) => {
			console.error('send test message error: ', error);
			this.isFigleafReadyForCommunication.next(false);
		});

		this.subscription.push(figleafConnectSubscription);
	}

	connect() {
		FigleafConnector.connect();
	}

	disconnect() {
		FigleafConnector.disconnect();
		this.subscription.forEach((subs) => subs.unsubscribe());
	}

	private sendTestMessage() {
		return from(FigleafConnector.sendMessageToFigleaf({type: 'testfigleafStatus'}));
	}

	sendMessageToFigleaf<T>(message: MessageToFigleaf): Observable<T> {
		return this.isFigleafReadyForCommunication.pipe(
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
