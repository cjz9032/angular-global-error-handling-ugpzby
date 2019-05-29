import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BreachedAccountsService } from './breached-accounts.service';
import { BrowserAccountsService } from './browser-accounts.service';
import { TrackingMapService } from '../../feature/tracking-map/services/tracking-map.service';
import { filter } from 'rxjs/operators';
import { typeData } from '../../feature/tracking-map/services/tracking-map.interface';

@Injectable({
	providedIn: 'root'
})
export class CountNumberOfIssuesService {
	breachedAccountsCount = new BehaviorSubject<number>(0);
	websiteTrackersCount = new BehaviorSubject<number>(0);
	nonPrivatePasswordCount = new BehaviorSubject<number>(0);

	constructor(
		private breachedAccountsService: BreachedAccountsService,
		private browserAccountsService: BrowserAccountsService,
		private trackingMapService: TrackingMapService) {

		this.breachedAccountsService.onGetBreachedAccounts$.subscribe((breachesState) => {
			this.breachedAccountsCount.next(breachesState.breaches.length);
		});

		this.browserAccountsService.installedBrowsersData$.subscribe((installedBrowsersData) => {
			const nonPrivatePasswordcount = installedBrowsersData.browserData.reduce((acc, curr) => {
				acc += curr.accountsCount;
				return acc;
			}, 0);
			this.nonPrivatePasswordCount.next(nonPrivatePasswordcount);
		});

		this.trackingMapService.trackingData$.pipe(
			filter((trackingData) => trackingData.typeData === typeData.Users),
		).subscribe((trackingData) => {
			const trackersCount = Object.keys(trackingData.trackingData.trackers).length;
			this.websiteTrackersCount.next(trackersCount);
		});
	}

	getPrivacyIssuesCount() {
		return {
			breachedAccountsCount: this.breachedAccountsCount.getValue(),
			websiteTrackersCount: this.websiteTrackersCount.getValue(),
			nonPrivatePasswordCount: this.nonPrivatePasswordCount.getValue(),
		};
	}
}
