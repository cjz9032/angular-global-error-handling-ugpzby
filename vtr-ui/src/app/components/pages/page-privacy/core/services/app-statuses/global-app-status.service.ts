import { Injectable } from '@angular/core';
import { AppStatuses, FeaturesStatuses } from '../../../userDataStatuses';
import { FigleafOverviewService, FigleafStatus, licenseTypes } from '../figleaf-overview.service';
import { CommunicationWithFigleafService } from '../../../utils/communication-with-figleaf/communication-with-figleaf.service';
import { UserDataStateService } from './user-data-state.service';
import { GetFeaturesConsentService } from './get-features-consent.service';

@Injectable({
	providedIn: 'root'
})
export class GlobalAppStatusService {
	licenseTypes = licenseTypes;
	isFigleafReadyForCommunication = false;
	isFigleafInExit = false;
	figleafStatus: FigleafStatus;

	constructor(
		private communicationWithFigleafService: CommunicationWithFigleafService,
		private figleafOverviewService: FigleafOverviewService,
		private userDataStateService: UserDataStateService,
		private getFeaturesConsentService: GetFeaturesConsentService
	) {
		this.communicationWithFigleafService.isFigleafReadyForCommunication$.subscribe((isFigleafReadyForCommunication) => {
			this.isFigleafReadyForCommunication = isFigleafReadyForCommunication;
		});

		this.communicationWithFigleafService.isFigleafInExit$.subscribe((isFigleafInExit) => {
			this.isFigleafInExit = isFigleafInExit;
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

		const getFeaturesConsent = this.getFeaturesConsentService.getFeaturesConsent();
		const isConsentGiven = Object.values(getFeaturesConsent).includes(true);

		if (!isConsentGiven && this.isFigleafInExit || getFeaturesConsent.breachedAccountsResult && this.isFigleafInExit) {
			return AppStatuses.figleafInExitWithoutScan;
		}

		if (isConsentGiven) {
			return AppStatuses.scanPerformed;
		}

		return AppStatuses.firstTimeVisitor;
	}

	private calculateAppStatuses() {
        let appStatus = AppStatuses.figLeafInstalled;
        const isTrialLicense = this.figleafStatus && this.figleafStatus.licenseType === this.licenseTypes.Trial;
        const isSubscriptionLicense = this.figleafStatus && this.figleafStatus.licenseType === this.licenseTypes.Subscription;
        const isExpiredSoon = this.figleafStatus && this.figleafStatus.daysToExpiration <= 1;
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

        return appStatus;
    }
}
