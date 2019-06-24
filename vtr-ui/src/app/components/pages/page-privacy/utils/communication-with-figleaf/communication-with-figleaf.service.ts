import { Injectable, NgZone } from '@angular/core';
import { FigleafConnectorInstance as FigleafConnector, MessageToFigleaf } from './figleaf-connector';
import { EMPTY, from, ReplaySubject, timer } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';

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
	private isFigleafReadyForCommunication = new ReplaySubject<boolean>(1);
	isFigleafReadyForCommunication$ = this.isFigleafReadyForCommunication.asObservable();

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

		this.isFigleafInstalled$.pipe(
			filter((isFigleafInstalled) => !!isFigleafInstalled)
		).subscribe(() => {
			this.receiveFigleafReadyForCommunicationState();
		});
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
	}

	connect() {
		FigleafConnector.connect();
	}

	disconnect() {
		FigleafConnector.disconnect();
	}

	sendTestMessage() {
		return from(FigleafConnector.sendMessageToFigleaf({type: 'testfigleafStatus'}));
	}

	sendMessageToFigleaf(message: MessageToFigleaf) {
		return this.isFigleafReadyForCommunication.pipe(
			switchMap(isFigleafInstalled => {
				if (isFigleafInstalled) {
					return from(FigleafConnector.sendMessageToFigleaf(message));
				} else {
					console.error('figLeaf not installed');
					return EMPTY;
				}
			})
		);
	}
}
