import { Injectable } from '@angular/core';
import { SafeStorageService } from './safe-storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AccessTokenService {
	private accessTokenIsExist = new BehaviorSubject<boolean>(!!this.getAccessToken());
	accessTokenIsExist$ = this.accessTokenIsExist.asObservable();

	constructor(private safeStorageService: SafeStorageService) {
	}

	setAccessToken(accessToken) {
		this.accessTokenIsExist.next(!!accessToken);
		this.safeStorageService.setPassword('figleaf-privacy-tab', 'figleaf-accessToken', accessToken);
	}

	getAccessToken() {
		return this.safeStorageService.getPassword('figleaf-privacy-tab', 'figleaf-accessToken');
	}

	removeAccessToken() {
		this.accessTokenIsExist.next(false);
		this.safeStorageService.removePassword('figleaf-privacy-tab', 'figleaf-accessToken');
	}
}
