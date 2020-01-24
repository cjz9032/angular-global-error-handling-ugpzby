import { Injectable } from '@angular/core';
import { AppStatusesService, featuresResult } from '../../../core/services/app-statuses/app-statuses.service';
import { map, withLatestFrom } from 'rxjs/operators';
import { AppStatuses, FeaturesStatuses } from '../../../userDataStatuses';
import { GetFeaturesConsentService } from '../../../core/services/app-statuses/get-features-consent.service';
import { CommunicationWithFigleafService } from '../../../utils/communication-with-figleaf/communication-with-figleaf.service';

@Injectable({
	providedIn: 'root'
})
export class ScoreShowSpinnerService {
	constructor(
		private appStatusesService: AppStatusesService,
		private getFeaturesConsentService: GetFeaturesConsentService,
		private communicationWithFigleafService: CommunicationWithFigleafService
	) {
	}

	isShow$ = this.getFeaturesForWaiting().pipe(
		map((featuresStatuses: { [feature in featuresResult]: FeaturesStatuses }) => {
			return Object.values(featuresStatuses).every((status) => status !== FeaturesStatuses.undefined);
		})
	);

	private getFeaturesForWaiting() {
		return this.appStatusesService.globalStatus$.pipe(
			withLatestFrom(this.communicationWithFigleafService.isFigleafInExit$),
			map(([globalStatus, isFigleafInExit]) => {
				const getFeaturesConsent = this.getFeaturesConsentService.getFeaturesConsent();
				const consentGiven = {
					...getFeaturesConsent,
					breachedAccountsResult: this.isFigleafInstalled(globalStatus.appState) ? true : getFeaturesConsent.breachedAccountsResult,
				};

				const consentGivenWithIgnore = this.setIgnoreConsent(consentGiven, isFigleafInExit);
				const consents = Object.keys(consentGivenWithIgnore).filter((feature) => consentGivenWithIgnore[feature]);
				return consents.reduce((prev, featureName) => ({
					...prev,
					[featureName]: globalStatus[featureName]
				}), {});
			})
		);
	}

	private isFigleafInstalled(appState: AppStatuses) {
		return [
			AppStatuses.subscriptionExpired,
			AppStatuses.subscriptionSoonExpired,
			AppStatuses.trialSoonExpired,
			AppStatuses.trialExpired,
			AppStatuses.figLeafInstalled,
		].includes(appState);
	}

	private setIgnoreConsent(consentGiven: { websiteTrackersResult: boolean; nonPrivatePasswordResult: boolean; breachedAccountsResult: boolean }, isFigleafInExit) {
		return {
			...consentGiven,
			breachedAccountsResult: isFigleafInExit ? false : consentGiven.breachedAccountsResult,
		};
	}
}
