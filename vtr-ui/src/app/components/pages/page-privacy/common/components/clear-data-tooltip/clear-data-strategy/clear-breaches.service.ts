import { Injectable } from '@angular/core';
import { ClearData } from './clear-data';
import { BreachedAccountsService } from '../../../services/breached-accounts.service';
import { HASH_FOR_TOKEN_NAME, StorageService, USER_EMAIL_HASH } from '../../../services/storage.service';
import { AccessTokenService } from '../../../services/access-token.service';
import { EmailScannerService } from '../../../../feature/check-breached-accounts/services/email-scanner.service';

@Injectable({
	providedIn: 'root'
})
export class ClearBreachesService implements ClearData {

	constructor(
		private breachedAccountsService: BreachedAccountsService,
		private accessTokenService: AccessTokenService,
		private storageService: StorageService,
		private emailScannerService: EmailScannerService
	) {
	}

	clearData() {
		this.emailScannerService.removeUserEmail();
		this.accessTokenService.removeAccessToken();
		this.storageService.removeItem(HASH_FOR_TOKEN_NAME);
		this.storageService.removeItem(USER_EMAIL_HASH);

		this.breachedAccountsService.resetBreachedAccounts(false);
	}
}
