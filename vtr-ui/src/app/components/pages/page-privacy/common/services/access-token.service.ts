import { Injectable } from '@angular/core';
import { SafeStorageService } from './safe-storage.service';
import { BehaviorSubject } from 'rxjs';
import { getSha256Hash } from '../../utils/helpers';
import { StorageService, HASH_FOR_TOKEN_NAME } from './storage.service';

@Injectable({
	providedIn: 'root'
})
export class AccessTokenService {
	private accessTokenIsExist = new BehaviorSubject<boolean>(!!this.getAccessToken());
	accessTokenIsExist$ = this.accessTokenIsExist.asObservable();

	constructor(
		private safeStorageService: SafeStorageService,
		private storageService: StorageService,
	) {
	}

	setAccessToken(accessToken) {
		const hashForToken = getSha256Hash(accessToken).toString();
		this.storageService.setItem(HASH_FOR_TOKEN_NAME, hashForToken);
		this.safeStorageService.setAccessToken(accessToken);
		this.accessTokenIsExist.next(!!accessToken);
	}

	getAccessToken() {
		const tokenFromSafeStorage = this.safeStorageService.getAccessToken();
		const hashFromSafeStorage = getSha256Hash(tokenFromSafeStorage) ? getSha256Hash(tokenFromSafeStorage).toString() : '';
		const hashFromMainStorage = this.storageService.getItem(HASH_FOR_TOKEN_NAME);
		const isEqualHash = hashFromMainStorage === hashFromSafeStorage;

		return isEqualHash ? tokenFromSafeStorage : null;
	}

	removeAccessToken() {
		this.accessTokenIsExist.next(false);
		this.storageService.removeItem(HASH_FOR_TOKEN_NAME);
		this.safeStorageService.removeAccessToken();
	}
}
