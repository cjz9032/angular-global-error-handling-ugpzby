import { Injectable } from '@angular/core';
import { MockWindows } from '../../utils/moked-api';

@Injectable({
	providedIn: 'root'
})
export class SafeStorageService {

	windows = window['Windows'] || MockWindows;
	vault = new this.windows.Security.Credentials.PasswordVault();

	constructor() {
	}

	setPassword(resource, username, password) {
		const credentials = new this.windows.Security.Credentials.PasswordCredential();
		credentials.resource = resource;
		credentials.userName = username;
		credentials.password = password;
		this.vault.add(credentials);
	}

	getPassword(resource, username) {
		var password: string;
		try {
			password = this.vault.retrieve(resource, username).password;
		} catch (error) {
			password = null;
		}
		return password;
	}

	removePassword(resource, username) {
		try {
			const credential = this.vault.retrieve(resource, username);
			if (credential) {
				this.vault.remove(credential);
			}
		} catch (error) {
			console.error('removePassword error', error);
		}
	}
}
