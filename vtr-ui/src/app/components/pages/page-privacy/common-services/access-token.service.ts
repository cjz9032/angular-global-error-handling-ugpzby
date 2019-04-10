import { Injectable } from '@angular/core';
import { SafeStorageService } from '../shared/services/safe-storage.service';

@Injectable({
	providedIn: 'root'
})
export class AccessTokenService {

	constructor(private safeStorageService: SafeStorageService) {
	}

	setAccessToken(accessToken) {
		this.safeStorageService.setPassword('figleaf-privacy-tab', 'figleaf-accessToken', accessToken);
	}

	getAccessToken() {
		return this.safeStorageService.getPassword('figleaf-privacy-tab', 'figleaf-accessToken');
	}

	removeAccessToken() {
		this.safeStorageService.removePassword('figleaf-privacy-tab', 'figleaf-accessToken');
	}
}
