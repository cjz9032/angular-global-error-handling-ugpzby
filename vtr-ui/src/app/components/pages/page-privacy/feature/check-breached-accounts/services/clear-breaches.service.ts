import { Injectable } from '@angular/core';
import { ClearData } from '../../../core/components/clear-data-tooltip/clear-data';
import { BreachedAccountsService } from './breached-accounts.service';
import { HASH_FOR_TOKEN_NAME, StorageService, USER_EMAIL_HASH } from '../../../core/services/storage.service';
import { AccessTokenService } from '../../../core/services/access-token.service';
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

	getText() {
		return {
			text: 'Clear my breach results',
			content: 'Are you sure you want to clear the information about found breaches?'
		};
	}
}
