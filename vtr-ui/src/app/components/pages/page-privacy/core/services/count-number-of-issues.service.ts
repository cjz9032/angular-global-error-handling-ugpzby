import { Injectable } from '@angular/core';
import { BreachedAccountsService } from '../../feature/check-breached-accounts/services/breached-accounts.service';
import { BrowserAccountsService } from '../../feature/non-private-password/services/browser-accounts.service';
import { TrackingMapService } from '../../feature/tracking-map/services/tracking-map.service';
import { filter, map, shareReplay, startWith, tap } from 'rxjs/operators';
import { typeData } from '../../feature/tracking-map/services/tracking-map.interface';

@Injectable({
	providedIn: 'root'
})
export class CountNumberOfIssuesService {
	breachedAccountsCount = this.breachedAccountsService.onGetBreachedAccounts$.pipe(
		filter((breachedAccounts) => breachedAccounts.error === null && !breachedAccounts.reset),
		map((breachesState) => breachesState.breaches.length),
		startWith(0),
		shareReplay(1)
	);
	nonPrivatePasswordCount = this.browserAccountsService.installedBrowsersData.pipe(
		map((installedBrowsersData) => {
				return installedBrowsersData.browserData.reduce((acc, curr) => {
					acc += curr.accountsCount;
					return acc;
				}, 0);
			}
		),
		startWith(0),
		shareReplay(1)
	);
	websiteTrackersCount = this.trackingMapService.trackingData$.pipe(
		filter((trackingData) => trackingData.typeData === typeData.Users),
		map((trackingData) => Object.keys(trackingData.trackingData.trackers).length),
		startWith(0),
		shareReplay(1)
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
