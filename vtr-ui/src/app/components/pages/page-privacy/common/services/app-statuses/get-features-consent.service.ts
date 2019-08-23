import { Injectable } from '@angular/core';
import { featuresResult } from './app-statuses.service';
import { USER_EMAIL_HASH } from '../../../feature/check-breached-accounts/services/email-scanner.service';
import { StorageService } from '../storage.service';
import { AccessTokenService } from '../access-token.service';
import { UserAllowService } from '../user-allow.service';

@Injectable({
	providedIn: 'root'
})
export class GetFeaturesConsentService {

	constructor(
		private storageService: StorageService,
		private accessTokenService: AccessTokenService,
		private userAllowService: UserAllowService,
	) {
	}

	getFeaturesConsent(): { [feature in featuresResult]: boolean } {
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
