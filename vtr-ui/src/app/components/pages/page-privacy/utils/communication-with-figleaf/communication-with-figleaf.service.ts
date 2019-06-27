import { Injectable, NgZone } from '@angular/core';
import { FigleafConnectorInstance as FigleafConnector, MessageToFigleaf } from './figleaf-connector';
import { EMPTY, from, Observable, ReplaySubject, Subscription, timer } from 'rxjs';
import { catchError, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

export interface MessageFromFigleaf {
	type: string;
	status: number;
	payload?: string;
}

@Injectable()

export class CommunicationWithFigleafService {
	isFigleafInstalled$ = new ReplaySubject(1);
	private isFigleafReadyForCommunication = new ReplaySubject<boolean>(1);
	isFigleafReadyForCommunication$ = this.isFigleafReadyForCommunication.pipe(distinctUntilChanged());

	subscription: Subscription[] = [];

	constructor(private ngZone: NgZone) {
		FigleafConnector.onConnect(() => {
			this.ngZone.run(() => this.isFigleafInstalled$.next(true));
		});

		FigleafConnector.onDisconnect(() => {
			this.ngZone.run(() => {
				this.isFigleafInstalled$.next(false);
				this.isFigleafReadyForCommunication.next(false);
			});
		});

		this.subscription.push(this.isFigleafInstalled$.pipe(
			filter((isFigleafInstalled) => !!isFigleafInstalled),
		).subscribe(() => {
			this.receiveFigleafReadyForCommunicationState();
		}));

		FigleafConnector.connect();
	}

	receiveFigleafReadyForCommunicationState() {
		const figleafConnectSubscription = timer(0, 3000).pipe(
			switchMap(() => {
				return this.sendTestMessage().pipe(
					catchError((err) => {
						console.error('send test message error: ', err);
						return EMPTY;
					}),
				);
			}),
		).subscribe((figleafStatus: MessageFromFigleaf) => {
			const figleafReadyForCommunicationState = figleafStatus.status === 0;
			this.isFigleafReadyForCommunication.next(figleafReadyForCommunicationState);
			if (figleafReadyForCommunicationState) {
				figleafConnectSubscription.unsubscribe();
			}
		}, (error) => {
			console.error('error', error);
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

	sendTestMessage() {
		return from(FigleafConnector.sendMessageToFigleaf({type: 'testfigleafStatus'}));
	}

	sendMessageToFigleaf<T>(message: MessageToFigleaf): Observable<T> {
		return this.isFigleafReadyForCommunication.pipe(
			switchMap(isFigleafInstalled => {
				if (isFigleafInstalled) {
					return from(FigleafConnector.sendMessageToFigleaf(message)) as Observable<T> ;
				} else {
					console.error('figLeaf not installed');
					return EMPTY;
				}
			})
		);
	}
}
