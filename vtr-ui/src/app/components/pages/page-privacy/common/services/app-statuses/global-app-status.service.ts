import { Injectable } from '@angular/core';
import { AppStatuses, FeaturesStatuses } from '../../../userDataStatuses';
import { FigleafOverviewService, FigleafStatus, licenseTypes } from '../figleaf-overview.service';
import { CommunicationWithFigleafService } from '../../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { UserDataStateService } from './user-data-state.service';

export const MS_IN_DAY = 24 * 60 * 60 * 1000;

@Injectable({
	providedIn: 'root'
})
export class GlobalAppStatusService {
	licenseTypes = licenseTypes;
	isFigleafReadyForCommunication = false;
	figleafStatus: FigleafStatus;

	constructor(
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private figleafOverviewService: FigleafOverviewService,
		private userDataStateService: UserDataStateService
	) {
		this.communicationWithFigleafService.isFigleafReadyForCommunication$.subscribe((isFigleafReadyForCommunication) => {
			this.isFigleafReadyForCommunication = isFigleafReadyForCommunication;
		});

		this.figleafOverviewService.figleafStatus$.subscribe((figleafStatus) => {
			this.figleafStatus = figleafStatus;
		});
	}

	getGlobalAppStatus() {
		if (this.isFigleafReadyForCommunication) {
			return this.calculateAppStatuses();
		}
		const userDataStatus = this.userDataStateService.getFeatureStatus();
		for (const dataState of Object.keys(userDataStatus)) {
			if (userDataStatus[dataState] !== FeaturesStatuses.undefined && userDataStatus[dataState] !== FeaturesStatuses.error) {
				return AppStatuses.scanPerformed;
			}
		}
		return AppStatuses.firstTimeVisitor;
	}

	private calculateAppStatuses() {
		let appStatus = AppStatuses.figLeafInstalled;
		const isTrialLicense = this.figleafStatus && this.figleafStatus.licenseType === this.licenseTypes.Trial;
		const isSubscriptionLicense = this.figleafStatus && this.figleafStatus.licenseType === this.licenseTypes.Subscription;
		const daysToNotifyTrialExpired = (this.figleafStatus && this.figleafStatus.daysToNotifyTrialExpired) ? this.figleafStatus.daysToNotifyTrialExpired : 1;
		const timeToShowExpiredPitchMs = daysToNotifyTrialExpired * MS_IN_DAY;
		const isExpiredSoon = this.figleafStatus && this.figleafStatus.expirationDate <= Math.floor((Date.now() + timeToShowExpiredPitchMs) / 1000);
		const isTrialExpired = this.figleafStatus && this.figleafStatus.licenseType === this.licenseTypes.TrialExpired;
		const isSubscriptionExpired = this.figleafStatus && this.figleafStatus.licenseType === this.licenseTypes.SubscriptionExpired;

		if (isTrialLicense && isExpiredSoon) {
			appStatus = AppStatuses.trialSoonExpired;
		}

		if (isSubscriptionLicense && isExpiredSoon) {
			appStatus = AppStatuses.subscriptionSoonExpired;
		}

		if (isTrialExpired) {
			appStatus = AppStatuses.trialExpired;
		}

		if (isSubscriptionExpired) {
			appStatus = AppStatuses.subscriptionExpired;
		}

		console.log('calculateAppStatuses', appStatus);

		return appStatus;
	}
}
