import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { BreachedAccountsService } from './breached-accounts.service';
import { BrowserAccountsService } from './browser-accounts.service';
import { TrackingMapService } from '../../feature/tracking-map/services/tracking-map.service';
import { debounceTime, distinctUntilChanged, filter, shareReplay } from 'rxjs/operators';
import { typeData } from '../../feature/tracking-map/services/tracking-map.interface';
import { AppStatuses, FeaturesStatuses } from '../../userDataStatuses';
import { CommunicationWithFigleafService } from '../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { FigleafOverviewService, FigleafStatus, licenseTypes } from './figleaf-overview.service';

export interface UserStatuses {
	appState: AppStatuses;
	breachedAccountsResult: FeaturesStatuses;
	websiteTrackersResult: FeaturesStatuses;
	nonPrivatePasswordResult: FeaturesStatuses;
}

export const TIME_TO_SHOW_EXPIRED_PITCH_MS = 24 * 60 * 60 * 1000;

@Injectable()
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
	isTrackersBlocked = false;
	figleafStatus: FigleafStatus;
	licenseTypes = licenseTypes;

	constructor(
		private breachedAccountsService: BreachedAccountsService,
		private browserAccountsService: BrowserAccountsService,
		private trackingMapService: TrackingMapService,
		private figleafOverviewService: FigleafOverviewService,
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

		this.trackingMapService.trackingData$.pipe(
			filter((trackingData) => trackingData.typeData === typeData.Users),
		).subscribe((trackingData) => {
			const trackersCount = Object.keys(trackingData.trackingData.trackers).length;
			let status = trackersCount ? FeaturesStatuses.exist : FeaturesStatuses.none;
			if (trackingData.error) {
				status = FeaturesStatuses.error;
			}
			if (this.isTrackersBlocked) {
				status = FeaturesStatuses.none;
			}
			this.websiteTrackersResult = status;
			this.updateUserDataSubject();
		});

		this.trackingMapService.isTrackersBlocked$.subscribe((isTrackersBlocked) => {
			this.isTrackersBlocked = isTrackersBlocked;
			if (isTrackersBlocked) {
				this.websiteTrackersResult = FeaturesStatuses.none;
				this.updateUserDataSubject();
			}
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
		const isTrialExpiredSoon = this.figleafStatus && this.figleafStatus.expirationDate <= Math.floor( (Date.now() + TIME_TO_SHOW_EXPIRED_PITCH_MS) / 1000);
		const isTrialExpired = this.figleafStatus && this.figleafStatus.expirationDate < Math.floor( Date.now() / 1000);

		if (isTrialLicense && isTrialExpiredSoon) {
			appStatus = AppStatuses.trialSoonExpired;
		}

		if (isTrialLicense && isTrialExpired) {
			appStatus = AppStatuses.trialExpired;
		}

		return appStatus;
	}
}
