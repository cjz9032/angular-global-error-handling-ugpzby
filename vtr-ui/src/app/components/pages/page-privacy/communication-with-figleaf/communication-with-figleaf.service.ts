import { Injectable } from '@angular/core';
import { FigleafConnectorInstance as FigleafConnector, MessageToFigleaf } from './figleaf-connector'
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class CommunicationWithFigleafService {
	isFigleafInstalled$ = new BehaviorSubject(false);
	messageToFigleafUnresolved = [];

	// TODO move to components
	getFigleafSettingsMessage: MessageToFigleaf = {
		type: "getFigleafSettings",
	};
	getFigleafDashboardMessage: MessageToFigleaf = {
		type: "getFigleafDashboard",
	};
	getFigleafBreachedAccountsMessage: MessageToFigleaf = {
		type: "getFigleafBreachedAccounts",
	};

	constructor() {
		this.sendMessageToFigleaf(this.getFigleafSettingsMessage);
		this.sendMessageToFigleaf(this.getFigleafDashboardMessage);
		this.sendMessageToFigleaf(this.getFigleafBreachedAccountsMessage);

		FigleafConnector.onConnect(() => {
			this.isFigleafInstalled$.next(true);
			this.messageToFigleafUnresolved.forEach((message) => {
				this.sendMessageToFigleaf(message);
			});
		});

		FigleafConnector.onDisconnect(() => {
			this.isFigleafInstalled$.next(false);
		});

		FigleafConnector.connect();
	}

	disconnect() {
		FigleafConnector.disconnect();
	}

	sendMessageToFigleaf(message) {
		if (this.isFigleafInstalled$.getValue()) {
			FigleafConnector.sendMessageToFigleaf(message);
		} else {
			this.messageToFigleafUnresolved.push(message);
		}
	}
}
