import { Injectable } from '@angular/core';
import { ClearData } from '../../../common/components/clear-data-tooltip/clear-data-strategy/clear-data';
import { BreachedAccountsService } from './breached-accounts.service';
import { HASH_FOR_TOKEN_NAME, StorageService, USER_EMAIL_HASH } from '../../../common/services/storage.service';
import { AccessTokenService } from '../../../common/services/access-token.service';
import { UserEmailService } from './user-email.service';

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
