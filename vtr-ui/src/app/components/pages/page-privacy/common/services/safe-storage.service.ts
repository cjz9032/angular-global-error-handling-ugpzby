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

	setPassword(username, password) {
		const credentials = new this.windows.Security.Credentials.PasswordCredential();
		credentials.resource = RESOURCE;
		credentials.userName = username;
		credentials.password = password;
		this.vault.add(credentials);
	}

	getPassword(username) {
		var password: string;
		try {
			password = this.vault.retrieve(RESOURCE, username).password;
		} catch (error) {
			password = null;
		}
		return password;
	}

	removePassword(username) {
		try {
			const credential = this.vault.retrieve(RESOURCE, username);
			if (credential) {
				this.vault.remove(credential);
			}
		} catch (error) {
			console.error('removePassword error', error);
		}
	}
}
