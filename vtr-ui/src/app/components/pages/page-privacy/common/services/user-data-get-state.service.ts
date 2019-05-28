import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { BreachedAccountsService } from './breached-accounts.service';
import { BrowserAccountsService } from './browser-accounts.service';
import { TrackingMapService } from '../../feature/tracking-map/services/tracking-map.service';
import { filter } from 'rxjs/operators';
import { typeData } from '../../feature/tracking-map/services/tracking-map.interface';
import { UserDataStatuses } from '../../userDataStatuses';

interface UserStatuses {
	breachedAccountsResult: UserDataStatuses;
	websiteTrackersResult: UserDataStatuses;
	nonPrivatePasswordResult: UserDataStatuses;
}

@Injectable()
export class UserDataGetStateService {
	breachedAccountsResult = new BehaviorSubject<UserDataStatuses>(UserDataStatuses.undefined);
	websiteTrackersResult = new BehaviorSubject<UserDataStatuses>(UserDataStatuses.undefined);
	nonPrivatePasswordResult = new BehaviorSubject<UserDataStatuses>(UserDataStatuses.undefined);
	userDataStatus = new ReplaySubject<UserStatuses>();
	userDataStatus$ = this.userDataStatus.asObservable();

	constructor(
		private breachedAccountsService: BreachedAccountsService,
		private browserAccountsService: BrowserAccountsService,
		private trackingMapService: TrackingMapService) {

		this.updateUserDataSubject();

		// TODO add combineLatest instead of 3 subscribers

		this.breachedAccountsService.onGetBreachedAccounts$.subscribe((breachesState) => {
			let status = breachesState.breaches.length ? UserDataStatuses.exist : UserDataStatuses.none;
			if (breachesState.error) {
				status = UserDataStatuses.error;
			}
			this.breachedAccountsResult.next(status);
			this.updateUserDataSubject();
		});

		this.browserAccountsService.installedBrowsersData$.subscribe((installedBrowsersData) => {
			const storagesCount = installedBrowsersData.browserData.filter((installedBrowser) => installedBrowser.accountsCount !== null).length; // accountsCount set to 'null' before user gave concent
			let status = UserDataStatuses.undefined;
			if (storagesCount) {
				const unsafeStoragesCount = installedBrowsersData.browserData.filter((installedBrowser) => installedBrowser.accountsCount).length;
				status = unsafeStoragesCount ? UserDataStatuses.exist : UserDataStatuses.none;
			}
			if (installedBrowsersData.error) {
				status = UserDataStatuses.error;
			}
			this.nonPrivatePasswordResult.next(status);
			this.updateUserDataSubject();
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
			this.updateUserDataSubject();
		});
	}

	getUserDataStatus() {
		return {
			breachedAccountsResult: this.breachedAccountsResult.getValue(),
			websiteTrackersResult: this.websiteTrackersResult.getValue(),
			nonPrivatePasswordResult: this.nonPrivatePasswordResult.getValue(),
		};
	}

	private updateUserDataSubject() {
		this.userDataStatus.next(this.getUserDataStatus());
	}
}
