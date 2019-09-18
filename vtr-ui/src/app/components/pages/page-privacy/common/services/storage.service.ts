import { Injectable } from '@angular/core';

export const HASH_FOR_TOKEN_NAME = 'hashForToken';
export const ALLOW_MAP__NAME = 'allowMap';
export const USER_EMAIL_HASH = 'privacy-user-email-hash';

@Injectable({
	providedIn: 'root'
})
export class StorageService {

	constructor() {
	}

	setItem(key: string, value: string) {
		localStorage.setItem(key, value);
	}

	getItem(key: string): string {
		return localStorage.getItem(key);
	}

	removeItem(key: string) {
		localStorage.removeItem(key);
	}
}
