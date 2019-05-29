import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { BreachedAccountsService } from './breached-accounts.service';
import { BrowserAccountsService } from './browser-accounts.service';
import { TrackingMapService } from '../../feature/tracking-map/services/tracking-map.service';
import { filter } from 'rxjs/operators';
import { typeData } from '../../feature/tracking-map/services/tracking-map.interface';
import { AppStatuses, FeaturesStatuses } from '../../userDataStatuses';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';

interface UserStatuses {
	appState: AppStatuses;
	breachedAccountsResult: FeaturesStatuses;
	websiteTrackersResult: FeaturesStatuses;
	nonPrivatePasswordResult: FeaturesStatuses;
}

@Injectable()
export class UserDataGetStateService {
	breachedAccountsResult = new BehaviorSubject<FeaturesStatuses>(FeaturesStatuses.undefined);
	websiteTrackersResult = new BehaviorSubject<FeaturesStatuses>(FeaturesStatuses.undefined);
	nonPrivatePasswordResult = new BehaviorSubject<FeaturesStatuses>(FeaturesStatuses.undefined);
	isFigleafReadyForCommunication = false;
	userDataStatus = new ReplaySubject<UserStatuses>();
	userDataStatus$ = this.userDataStatus.asObservable();

	constructor(
		private breachedAccountsService: BreachedAccountsService,
		private browserAccountsService: BrowserAccountsService,
		private trackingMapService: TrackingMapService,
		private communicationWithFigleafService: CommunicationWithFigleafService) {

		this.updateUserDataSubject();

		// TODO add combineLatest instead of 3 subscribers

		this.breachedAccountsService.onGetBreachedAccounts$.subscribe((breachesState) => {
			let status = breachesState.breaches.length ? FeaturesStatuses.exist : FeaturesStatuses.none;
			if (breachesState.error) {
				status = FeaturesStatuses.error;
			}
			this.breachedAccountsResult.next(status);
			this.updateUserDataSubject();
		});

		this.browserAccountsService.installedBrowsersData$.subscribe((installedBrowsersData) => {
			const storagesCount = installedBrowsersData.browserData.filter((installedBrowser) => installedBrowser.accountsCount !== null).length; // accountsCount set to 'null' before user gave concent
			let status = FeaturesStatuses.undefined;
			if (storagesCount) {
				const unsafeStoragesCount = installedBrowsersData.browserData.filter((installedBrowser) => installedBrowser.accountsCount).length;
				status = unsafeStoragesCount ? FeaturesStatuses.exist : FeaturesStatuses.none;
			}
			if (installedBrowsersData.error) {
				status = FeaturesStatuses.error;
			}
			this.nonPrivatePasswordResult.next(status);
			this.updateUserDataSubject();
		});

		this.trackingMapService.trackingData$.pipe(
			filter((trackingData) => trackingData.typeData === typeData.Users),
		).subscribe((trackingData) => {
			const trackersCount = Object.keys(trackingData.trackingData.trackers).length;
			let status = trackersCount ? FeaturesStatuses.exist : FeaturesStatuses.none;
			if (trackingData.error) {
				status = FeaturesStatuses.error;
			}
			this.websiteTrackersResult.next(status);
			this.updateUserDataSubject();
		});

		this.communicationWithFigleafService.isFigleafReadyForCommunication$.subscribe((isFigleafReadyForCommunication) => {
			this.isFigleafReadyForCommunication = isFigleafReadyForCommunication;
		});
	}

	getUserDataStatus() {
		return {
			appState: this.getGlobalAppStatus(),
			...this.getFeatureStatus()
		};
	}

	private getFeatureStatus() {
		return {
			breachedAccountsResult: this.breachedAccountsResult.getValue(),
			websiteTrackersResult: this.websiteTrackersResult.getValue(),
			nonPrivatePasswordResult: this.nonPrivatePasswordResult.getValue(),
		};
	}

	private getGlobalAppStatus() {
		if (this.isFigleafReadyForCommunication) {
			return AppStatuses.figLeafInstalled;
		}
		const userDataStatus = this.getFeatureStatus();
		for (const dataState of Object.keys(userDataStatus)) {
			if (userDataStatus[dataState] !== FeaturesStatuses.undefined) {
				return AppStatuses.scanPerformed;
			}
		}
		return AppStatuses.firstTimeVisitor;
	}

	private updateUserDataSubject() {
		this.userDataStatus.next(this.getUserDataStatus());
	}
}
