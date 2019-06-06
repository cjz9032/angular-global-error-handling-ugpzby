import { Injectable } from '@angular/core';
import { BreachedAccountsService } from './breached-accounts.service';
import { BrowserAccountsService } from './browser-accounts.service';
import { TrackingMapService } from '../../feature/tracking-map/services/tracking-map.service';
import { filter, map, startWith } from 'rxjs/operators';
import { typeData } from '../../feature/tracking-map/services/tracking-map.interface';

@Injectable({
	providedIn: 'root'
})
export class CountNumberOfIssuesService {
	breachedAccountsCount = this.breachedAccountsService.onGetBreachedAccounts$.pipe(
		map((breachesState) =>
			breachesState.breaches.filter((breach) => breach.domain !== 'n/a')),
		map((breaches) => breaches.length > 0 ? breaches.length + 1 : breaches.length),
		startWith(0)
	);
	nonPrivatePasswordCount = this.browserAccountsService.installedBrowsersData.pipe(
		map((installedBrowsersData) => {
				return installedBrowsersData.browserData.reduce((acc, curr) => {
					acc += curr.accountsCount;
					return acc;
				}, 0);
			}
		),
		startWith(0)
	);
	websiteTrackersCount = this.trackingMapService.trackingData$.pipe(
		filter((trackingData) => trackingData.typeData === typeData.Users),
		map((trackingData) => {
			return Object.keys(trackingData.trackingData.trackers).length;
		}),
		startWith(0)
	);

	constructor(
		private breachedAccountsService: BreachedAccountsService,
		private browserAccountsService: BrowserAccountsService,
		private trackingMapService: TrackingMapService) {
	}

	getPrivacyIssuesCount() {
		return [
			this.breachedAccountsCount,
			this.websiteTrackersCount,
			this.nonPrivatePasswordCount,
		];
	}
}
