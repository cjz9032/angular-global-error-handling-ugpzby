import { Injectable } from '@angular/core';
import { FigleafConnectorInstance as FigleafConnector, MessageToFigleaf } from './figleaf-connector';
import { from, ReplaySubject, throwError, timer } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

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
	private isFigleafReadyForCommunication = new ReplaySubject(1);
	isFigleafReadyForCommunication$ = this.isFigleafReadyForCommunication.asObservable();
	messageToFigleafUnresolved = [];

	// TODO move to components
	getFigleafSettingsMessage: MessageToFigleaf = {
		type: 'getFigleafSettings',
	};
	getFigleafDashboardMessage: MessageToFigleaf = {
		type: 'getFigleafDashboard',
	};

	constructor() {
		this.sendMessageToFigleaf(this.getFigleafSettingsMessage);
		this.sendMessageToFigleaf(this.getFigleafDashboardMessage);

		FigleafConnector.onConnect(() => {
			this.isFigleafInstalled$.next(true);
			this.messageToFigleafUnresolved.forEach((message) => {
				this.sendMessageToFigleaf(message);
			});
		});

		FigleafConnector.onDisconnect(() => {
			this.isFigleafInstalled$.next(false);
			this.isFigleafReadyForCommunication.next(false);
		});

		this.isFigleafInstalled$.pipe(
			filter((isFigleafInstalled) => !!isFigleafInstalled)
		).subscribe(() => {
			this.receiveFigleafReadyForCommunicationState();
		});
		FigleafConnector.connect();
	}

	receiveFigleafReadyForCommunicationState() {
		const figleafConnectSubscription = timer(0, 1500).pipe(
			switchMap(() => {
				return this.sendTestMessage();
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

	disconnect() {
		FigleafConnector.disconnect();
	}

	sendTestMessage() {
		return from(FigleafConnector.sendMessageToFigleaf({type: 'getFigleafSettings'}));
	}

	sendMessageToFigleaf(message: MessageToFigleaf) {
		return this.isFigleafReadyForCommunication.pipe(
			switchMap(isFigleafInstalled => {
				if (isFigleafInstalled) {
					return from(FigleafConnector.sendMessageToFigleaf(message));
				} else {
					return throwError('figLeaf not installed');
				}
			})
		);
	}
}
