import { Injectable } from '@angular/core';
import { AppStatusesService, featuresResult } from '../../../core/services/app-statuses/app-statuses.service';
import { map } from 'rxjs/operators';
import { AppStatuses, FeaturesStatuses } from '../../../userDataStatuses';
import { GetFeaturesConsentService } from '../../../core/services/app-statuses/get-features-consent.service';

@Injectable({
	providedIn: 'root'
})
export class ScoreShowSpinnerService {
	constructor(
		private appStatusesService: AppStatusesService,
		private getFeaturesConsentService: GetFeaturesConsentService
	) {
	}

	isShow$ = this.getFeaturesForWaiting().pipe(
		map((featuresStatuses: { [feature in featuresResult]: FeaturesStatuses }) => {
			return Object.values(featuresStatuses).every((status) => status !== FeaturesStatuses.undefined);
		})
	);

	private getFeaturesForWaiting() {
		return this.appStatusesService.globalStatus$.pipe(
			map((globalStatus) => {
				const getFeaturesConsent = this.getFeaturesConsentService.getFeaturesConsent();
				const consentGiven = {
					breachedAccountsResult: this.isFigleafInstalled(globalStatus.appState) ? true : getFeaturesConsent.breachedAccountsResult,
					...getFeaturesConsent
				};

				const consents = Object.keys(consentGiven).filter((feature) => consentGiven[feature]);
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
}
