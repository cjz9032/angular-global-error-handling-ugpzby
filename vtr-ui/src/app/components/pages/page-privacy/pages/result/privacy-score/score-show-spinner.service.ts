import { Injectable } from '@angular/core';
import { StorageService } from '../../../common/services/storage.service';
import { AccessTokenService } from '../../../common/services/access-token.service';
import { USER_EMAIL_HASH } from '../../../feature/check-breached-accounts/services/email-scanner.service';
import { AppStatusesService, featuresResult } from '../../../common/services/app-statuses/app-statuses.service';
import { UserAllowService } from '../../../common/services/user-allow.service';
import { map } from 'rxjs/operators';
import { AppStatuses, FeaturesStatuses } from '../../../userDataStatuses';

@Injectable({
	providedIn: 'root'
})
export class ScoreShowSpinnerService {
	constructor(
		private storageService: StorageService,
		private accessTokenService: AccessTokenService,
		private userAllowService: UserAllowService,
		private appStatusesService: AppStatusesService
	) {
	}

	isShow$ = this.getFeaturesForWaiting().pipe(
		map((featuresStatuses: {[feature in featuresResult]: FeaturesStatuses}) => {
			return Object.values(featuresStatuses).every((status) => status !== FeaturesStatuses.undefined);
		})
	);

	getFeaturesForWaiting() {
		return this.appStatusesService.globalStatus$.pipe(
			map((globalStatus) => {
				const consentGiven = this.getFeaturesConsent(globalStatus.appState);
				const consents = Object.keys(consentGiven).filter((feature) => consentGiven[feature]);
				return consents.reduce((prev, featureName) => ({...prev, [featureName]: globalStatus[featureName]}), {});
			})
		);
	}

	private getFeaturesConsent(appState: AppStatuses): { [feature in featuresResult]: boolean } {
		return ({
			breachedAccountsResult: this.getBreachedAccountConsent(),
			websiteTrackersResult: this.getTrackersConsent(),
			nonPrivatePasswordResult: this.getNonPrivatePasswordConsent(),
		});
	}

	private getBreachedAccountConsent(): boolean {
		return Boolean(this.storageService.getItem(USER_EMAIL_HASH) || this.accessTokenService.getAccessToken());
	}

	private getTrackersConsent(): boolean {
		return Boolean(this.userAllowService.allowToShow.getValue().trackingMap);
	}

	private getNonPrivatePasswordConsent(): boolean {
		return Boolean(this.storageService.getItem('isConsentGiven'));
	}
}
