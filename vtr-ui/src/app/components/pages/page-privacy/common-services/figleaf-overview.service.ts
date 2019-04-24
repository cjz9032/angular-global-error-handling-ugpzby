import { Injectable } from '@angular/core';
import { CommunicationWithFigleafService } from '../communication-with-figleaf/communication-with-figleaf.service';
import { ReplaySubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

interface FigleafSettingsMessageResponse {
	type: 'getFigleafSettings';
	status: number;
	payload: FigleafSettings;
}

interface FigleafSettings {
	isAntitrackingEnabled: boolean;
	isBreachMonitoringEnabled: boolean;
}

interface FigleafDashboardMessageResponse {
	type: 'getFigleafDashboard';
	status: number;
	payload: FigleafDashboard;
}

interface FigleafDashboard {
	totalAccounts: number;
	maskedAccounts: number;
	blockedTrackers: number;
	websitesConnectedPrivately: number;
}

@Injectable({
	providedIn: 'root'
})
export class FigleafOverviewService {

	figleafSettings$ = new ReplaySubject<FigleafSettings>(1);
	figleafDashboard$ = new ReplaySubject<FigleafDashboard>(1);

	constructor(
		private communicationWithFigleafService: CommunicationWithFigleafService
	) {
		this.communicationWithFigleafService.isFigleafReadyForCommunication$
			.pipe(
				filter(isFigleafReadyForCommunication => !!isFigleafReadyForCommunication)
			)
			.subscribe(() => {
				this.getFigleafSettings();
				this.getFigleafDashboard();
			});
	}

	getFigleafSettings() {
		this.communicationWithFigleafService.sendMessageToFigleaf({type: 'getFigleafSettings'})
			.pipe(
				take(1),
			)
			.subscribe((response: FigleafSettingsMessageResponse) => {
				this.figleafSettings$.next(response.payload);
			});
	}

	getFigleafDashboard() {
		this.communicationWithFigleafService.sendMessageToFigleaf({type: 'getFigleafDashboard'})
			.pipe(
				take(1),
			)
			.subscribe((response: FigleafDashboardMessageResponse) => {
				this.figleafDashboard$.next(response.payload);
			});
	}
}
