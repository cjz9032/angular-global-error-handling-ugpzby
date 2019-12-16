import { Injectable } from '@angular/core';
import { MockWindows } from '../../utils/moked-api';

const RESOURCE = 'figleaf-privacy-tab';

@Injectable({
	providedIn: 'root'
})
export class SafeStorageService {

	windows = window['Windows'] || MockWindows;
	vault = new this.windows.Security.Credentials.PasswordVault();

	constructor() {
	}

	private setPassword(username, password) {
		const credentials = new this.windows.Security.Credentials.PasswordCredential();
		credentials.resource = RESOURCE;
		credentials.userName = username;
		credentials.password = password;
		this.vault.add(credentials);
	}

	private getPassword(username) {
		let password: string;
		try {
			password = this.vault.retrieve(RESOURCE, username).password;
		} catch (error) {
			password = null;
		}
		return password;
	}

	private removePassword(username) {
		try {
			const credential = this.vault.retrieve(RESOURCE, username);
			if (credential) {
				this.vault.remove(credential);
			}
		} catch (error) {
			console.error('removePassword error', error);
		}
	}

	setAccessToken(accessToken) {
		this.setPassword('figleaf-accessToken', accessToken);
	}

	getAccessToken() {
		return this.getPassword('figleaf-accessToken');
	}

	removeAccessToken() {
		this.removePassword('figleaf-accessToken');
	}

	setEmail(email) {
		this.setPassword('figleaf-userEmail', email);
	}

	getEmail() {
		return this.getPassword('figleaf-userEmail');
	}

	removeEmail() {
		this.removePassword('figleaf-userEmail');
	}
}
