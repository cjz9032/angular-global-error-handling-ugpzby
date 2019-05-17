import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BreachedAccountsService } from './breached-accounts.service';
import { BrowserAccountsService } from './browser-accounts.service';
import { TrackingMapService } from '../../feature/tracking-map/services/tracking-map.service';
import { filter } from 'rxjs/operators';
import { typeData } from '../../feature/tracking-map/services/tracking-map.interface';
import { UserDataStatuses } from '../../userDataStatuses';

@Injectable()
export class UserDataGetStateService {
	breachedAccountsResult = new BehaviorSubject<string>(UserDataStatuses.undefined);
	websiteTrackersResult = new BehaviorSubject<string>(UserDataStatuses.undefined);
	nonPrivatePasswordResult = new BehaviorSubject<string>(UserDataStatuses.undefined);

	constructor(
		private breachedAccountsService: BreachedAccountsService,
		private browserAccountsService: BrowserAccountsService,
		private trackingMapService: TrackingMapService) {

		// TODO add combineLatest instead of 3 subscribers

		this.breachedAccountsService.onGetBreachedAccounts$.subscribe((breachesState) => {
			let status = breachesState.breaches.length ? UserDataStatuses.exist : UserDataStatuses.none;
			if (breachesState.error) {
				status = UserDataStatuses.error;
			}
			this.breachedAccountsResult.next(status);
		});

		this.browserAccountsService.installedBrowsersData$.subscribe((installedBrowsersData) => {
			const unsafeStoragesCount = installedBrowsersData.browserData.filter((installedBrowser) => installedBrowser.accountsCount).length;
			let status = unsafeStoragesCount ? UserDataStatuses.exist : UserDataStatuses.none;
			if (installedBrowsersData.error) {
				status = UserDataStatuses.error;
			}
			this.nonPrivatePasswordResult.next(status);
		});

		this.trackingMapService.trackingData$.pipe(
			filter((trackingData) => trackingData.typeData === typeData.Users),
		).subscribe((trackingData) => {
			const trackersCount = Object.keys(trackingData.trackingData.trackers).length;
			let status = trackersCount ? UserDataStatuses.exist : UserDataStatuses.none;
			if (trackingData.error) {
				status = UserDataStatuses.error;
			}
			this.websiteTrackersResult.next(status);
		});
	}

	getUserDataStatus() {
		return {
			breachedAccountsResult: this.breachedAccountsResult.getValue(),
			websiteTrackersResult: this.websiteTrackersResult.getValue(),
			nonPrivatePasswordResult: this.nonPrivatePasswordResult.getValue(),
		};
	}
}
