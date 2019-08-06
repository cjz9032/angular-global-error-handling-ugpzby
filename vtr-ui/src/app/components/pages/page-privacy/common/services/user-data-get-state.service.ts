import { Injectable } from '@angular/core';
import { combineLatest, of, ReplaySubject } from 'rxjs';
import { BreachedAccountsService } from './breached-accounts.service';
import { BrowserAccountsService } from './browser-accounts.service';
import { TrackingMapService } from '../../feature/tracking-map/services/tracking-map.service';
import { catchError, debounceTime, distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';
import { typeData } from '../../feature/tracking-map/services/tracking-map.interface';
import { AppStatuses, FeaturesStatuses } from '../../userDataStatuses';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { FigleafOverviewService, FigleafStatus, licenseTypes } from './figleaf-overview.service';
import { UpdateTriggersService } from './update-triggers.service';

export interface UserStatuses {
	appState: AppStatuses;
	breachedAccountsResult: FeaturesStatuses;
	websiteTrackersResult: FeaturesStatuses;
	nonPrivatePasswordResult: FeaturesStatuses;
}

export const TIME_TO_SHOW_EXPIRED_PITCH_MS = 24 * 60 * 60 * 1000;
export const MS_IN_DAY = 24 * 60 * 60 * 1000;

@Injectable({
	providedIn: 'root'
})
export class UserDataGetStateService {
	breachedAccountsResult: FeaturesStatuses = FeaturesStatuses.undefined;
	websiteTrackersResult: FeaturesStatuses = FeaturesStatuses.undefined;
	nonPrivatePasswordResult: FeaturesStatuses = FeaturesStatuses.undefined;
	isFigleafReadyForCommunication = false;
	private userDataStatus = new ReplaySubject<UserStatuses>();
	userDataStatus$ = this.userDataStatus.asObservable().pipe(
		debounceTime(100),
		distinctUntilChanged(),
		shareReplay(1)
	);
	figleafStatus: FigleafStatus;
	licenseTypes = licenseTypes;

	isFigleafTrialSoonExpired$ = this.isAppStatusesEqual(AppStatuses.trialSoonExpired);
	isFigleafTrialExpired$ = this.isAppStatusesEqual(AppStatuses.trialExpired);
	isFigleafInstalled$ = this.isAppStatusesEqual(AppStatuses.figLeafInstalled);

	constructor(
		private breachedAccountsService: BreachedAccountsService,
		private browserAccountsService: BrowserAccountsService,
		private trackingMapService: TrackingMapService,
		private figleafOverviewService: FigleafOverviewService,
		private updateTriggersService: UpdateTriggersService,
		private communicationWithFigleafService: CommunicationWithFigleafService) {

		this.updateUserDataSubject();

		// TODO add combineLatest instead of 3 subscribers

		this.breachedAccountsService.onGetBreachedAccounts$.subscribe((breachesState) => {
			let status = breachesState.breaches !== null && breachesState.breaches.length ?
				FeaturesStatuses.exist :
				FeaturesStatuses.none;
			if (breachesState.error) {
				status = FeaturesStatuses.error;
			}
			this.breachedAccountsResult = status;
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
			this.nonPrivatePasswordResult = status;
			this.updateUserDataSubject();
		});

		combineLatest([
			this.trackingMapService.trackingData$,
			this.figleafOverviewService.figleafSettings$.pipe(
				map((settings) => settings.isAntitrackingEnabled),
				catchError((err) => of(false))
			)
		]).pipe(
			filter(([trackingData, isTrackersBlocked]) => trackingData.typeData === typeData.Users),
		).subscribe(([trackingData, isTrackersBlocked]) => {
			const trackersCount = Object.keys(trackingData.trackingData.trackers).length;
			let status = trackersCount ? FeaturesStatuses.exist : FeaturesStatuses.none;
			if (trackingData.error) {
				status = FeaturesStatuses.error;
			}
			if (isTrackersBlocked) {
				status = FeaturesStatuses.none;
			}
			this.websiteTrackersResult = status;
			this.updateUserDataSubject();
		});

		this.communicationWithFigleafService.isFigleafReadyForCommunication$.subscribe((isFigleafReadyForCommunication) => {
			this.isFigleafReadyForCommunication = isFigleafReadyForCommunication;
		});

		this.figleafOverviewService.figleafStatus$.subscribe((figleafStatus) => {
			this.figleafStatus = figleafStatus;
			this.updateUserDataSubject();
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
			breachedAccountsResult: this.breachedAccountsResult,
			websiteTrackersResult: this.websiteTrackersResult,
			nonPrivatePasswordResult: this.nonPrivatePasswordResult,
		};
	}

	private getGlobalAppStatus() {
		if (this.isFigleafReadyForCommunication) {
			return this.calculateAppStatuses();
		}
		const userDataStatus = this.getFeatureStatus();
		for (const dataState of Object.keys(userDataStatus)) {
			if (userDataStatus[dataState] !== FeaturesStatuses.undefined && userDataStatus[dataState] !== FeaturesStatuses.error) {
				return AppStatuses.scanPerformed;
			}
		}
		return AppStatuses.firstTimeVisitor;
	}

	private updateUserDataSubject() {
		this.userDataStatus.next(this.getUserDataStatus());
	}

	private calculateAppStatuses() {
		let appStatus = AppStatuses.figLeafInstalled;
		const isTrialLicense = this.figleafStatus && this.figleafStatus.licenseType === this.licenseTypes.Trial;
		console.log('calculateAppStatuses calculateAppStatuses', this.figleafStatus);
		const timeToShowExpiredPitchMs = this.figleafStatus.daysToNotifyTrialExpired * 2 * MS_IN_DAY;
		const isTrialExpiredSoon = this.figleafStatus && this.figleafStatus.expirationDate <= Math.floor( (Date.now() + timeToShowExpiredPitchMs) / 1000);
		const isTrialExpired = this.figleafStatus && this.figleafStatus.licenseType === this.licenseTypes.TrialExpired;

		if (isTrialLicense && isTrialExpiredSoon) {
			appStatus = AppStatuses.trialSoonExpired;
		}

		if (isTrialExpired) {
			appStatus = AppStatuses.trialExpired;
		}

		console.log('calculateAppStatuses', appStatus);

		return appStatus;
	}

	private isAppStatusesEqual(appStatus: AppStatuses) {
		return this.userDataStatus$.pipe(
			map((userDataStatus) => userDataStatus.appState === appStatus)
		);
	}
}
