import { Injectable } from '@angular/core';
import { StorageService, USER_EMAIL_HASH } from '../../../common/services/storage.service';
import { getSha1Hash } from '../../../utils/helpers';
import { AccessTokenService } from '../../../common/services/access-token.service';
import { HttpClient } from '@angular/common/http';
import { SafeStorageService } from '../../../common/services/safe-storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserEmailService {
	private userEmail = new BehaviorSubject<string>(this.getUserEmail());
	userEmail$ = this.userEmail.asObservable();

	constructor(
		private storageService: StorageService,
		private accessTokenService: AccessTokenService,
		private http: HttpClient,
		private safeStorageService: SafeStorageService,
	) {
	}

	setUserEmail(userEmail) {
		this.userEmail.next(userEmail);
		this.safeStorageService.setEmail(userEmail);
	}

	getUserEmailHash() {
		return this.storageService.getItem(USER_EMAIL_HASH);
	}

	getUserEmailWithoutHash() {
		return this.safeStorageService.getEmail();
	}

	removeUserEmail() {
		this.userEmail.next('');
		this.safeStorageService.removeEmail();
	}

	saveUser() {
		this.storageService.setItem(USER_EMAIL_HASH, getSha1Hash(this.userEmail.getValue()));
		this.safeStorageService.setEmail(this.userEmail.getValue());
	}

	private getUserEmail() {
		const emailFromSafeStorage = this.safeStorageService.getEmail() || '';
		const hashFromLocalStorage = this.storageService.getItem(USER_EMAIL_HASH);
		return getSha1Hash(emailFromSafeStorage).toString() === hashFromLocalStorage ? emailFromSafeStorage : '';
	}
}
