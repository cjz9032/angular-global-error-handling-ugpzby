import { Injectable } from '@angular/core';
import { combineLatest, of, Subject } from 'rxjs';
import { BreachedAccountsService } from '../../../feature/check-breached-accounts/services/breached-accounts.service';
import { BrowserAccountsService } from '../browser-accounts.service';
import { TrackingMapService } from '../../../feature/tracking-map/services/tracking-map.service';
import { catchError, map } from 'rxjs/operators';
import { typeData } from '../../../feature/tracking-map/services/tracking-map.interface';
import { FeaturesStatuses } from '../../../userDataStatuses';
import { CommunicationWithFigleafService } from '../../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { FigleafOverviewService } from '../figleaf-overview.service';

@Injectable({
	providedIn: 'root'
})
export class UserDataStateService {
	breachedAccountsResult: FeaturesStatuses = FeaturesStatuses.undefined;
	websiteTrackersResult: FeaturesStatuses = FeaturesStatuses.undefined;
	nonPrivatePasswordResult: FeaturesStatuses = FeaturesStatuses.undefined;
	private isFigleafReadyForCommunication = false;

	private updateData = new Subject<boolean>();
	updateData$ = this.updateData.asObservable();

	constructor(
		private breachedAccountsService: BreachedAccountsService,
		private browserAccountsService: BrowserAccountsService,
		private trackingMapService: TrackingMapService,
		private figleafOverviewService: FigleafOverviewService,
		private communicationWithFigleafService: CommunicationWithFigleafService) {

		this.updateDataSubject();

		this.breachedAccountsService.onGetBreachedAccounts$.subscribe((breachesState) => {
			let status = breachesState.breaches !== null && breachesState.breaches.length ?
				FeaturesStatuses.exist :
				FeaturesStatuses.none;

			if (breachesState.error) {
				status = FeaturesStatuses.error;
			}

			if (breachesState.reset) {
				status = FeaturesStatuses.undefined;
			}

			this.breachedAccountsResult = status;
			this.updateDataSubject();
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
			this.nonPrivatePasswordResult = status;
			this.updateDataSubject();
		});

		combineLatest([
			this.trackingMapService.trackingData$,
			this.figleafOverviewService.figleafSettings$.pipe(
				map((settings) => settings.isAntitrackingEnabled),
				catchError((err) => of(false))
			),
			this.communicationWithFigleafService.isFigleafReadyForCommunication$
		]).subscribe(([trackingData, isTrackersBlocked, isFigleafReadyForCommunication]) => {
			let status: FeaturesStatuses;
			const isUserData = trackingData.typeData === typeData.Users;

			if (isUserData) {
				const trackersCount = Object.keys(trackingData.trackingData.trackers).length;
				status = trackersCount > 0 ? FeaturesStatuses.exist : FeaturesStatuses.none;
			}

			if (isFigleafReadyForCommunication && isTrackersBlocked) {
				status = FeaturesStatuses.none;
			}

			if (!isUserData && !isFigleafReadyForCommunication) {
				status = FeaturesStatuses.undefined;
			}

			if (trackingData.error) {
				status = FeaturesStatuses.error;
			}

			this.websiteTrackersResult = status;
			this.updateDataSubject();
		});

		this.communicationWithFigleafService.isFigleafReadyForCommunication$.subscribe((isFigleafReadyForCommunication) => {
			this.isFigleafReadyForCommunication = isFigleafReadyForCommunication;
		});
	}

	getFeatureStatus() {
		return {
			breachedAccountsResult: this.breachedAccountsResult,
			websiteTrackersResult: this.websiteTrackersResult,
			nonPrivatePasswordResult: this.nonPrivatePasswordResult,
		};
	}

	private updateDataSubject() {
		this.updateData.next(true);
	}
}
