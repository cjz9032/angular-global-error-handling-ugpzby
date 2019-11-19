import { Injectable } from '@angular/core';
import { ClearData } from './clear-data';
import { BreachedAccountsService } from '../../../services/breached-accounts.service';
import { HASH_FOR_TOKEN_NAME, StorageService, USER_EMAIL_HASH } from '../../../services/storage.service';
import { AccessTokenService } from '../../../services/access-token.service';
import { EmailVerifyService } from '../../../../feature/check-breached-accounts/services/email-verify.service';
import { UserEmailService } from '../../../../feature/check-breached-accounts/services/user-email.service';

@Injectable({
	providedIn: 'root'
})
export class ClearBreachesService implements ClearData {

	constructor(
		private breachedAccountsService: BreachedAccountsService,
		private accessTokenService: AccessTokenService,
		private storageService: StorageService,
		private userEmailService: UserEmailService
	) {
	}

	clearData() {
		this.userEmailService.removeUserEmail();
		this.accessTokenService.removeAccessToken();
		this.storageService.removeItem(HASH_FOR_TOKEN_NAME);
		this.storageService.removeItem(USER_EMAIL_HASH);

		this.breachedAccountsService.resetBreachedAccounts(false);
	}
}
