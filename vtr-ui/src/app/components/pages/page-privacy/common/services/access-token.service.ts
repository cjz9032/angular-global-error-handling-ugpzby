import { Injectable } from '@angular/core';
import { SafeStorageService } from './safe-storage.service';
import { BehaviorSubject } from 'rxjs';
import { getHashCode } from '../../utils/helpers';
import { StorageService } from './storage.service';

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
		const hashForToken = getHashCode(accessToken).toString();
		this.storageService.setItem('hashForToken', hashForToken);
		this.accessTokenIsExist.next(!!accessToken);
		this.safeStorageService.setPassword('figleaf-privacy-tab', 'figleaf-accessToken', accessToken);
	}

	getAccessToken() {
		const tokenFromSafeStorage = this.safeStorageService.getPassword('figleaf-privacy-tab', 'figleaf-accessToken');
		const hashFromSafeStorage = getHashCode(tokenFromSafeStorage).toString();
		const hashFromMainStorage = this.storageService.getItem('hashForToken');
		const isEqualHash = hashFromMainStorage === hashFromSafeStorage;

		return isEqualHash ? tokenFromSafeStorage : null;
	}

	removeAccessToken() {
		this.accessTokenIsExist.next(false);
		this.safeStorageService.removePassword('figleaf-privacy-tab', 'figleaf-accessToken');
	}
}
