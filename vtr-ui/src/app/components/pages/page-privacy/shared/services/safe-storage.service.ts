import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SafeStorageService {

	windows = window["Windows"];
	vault = new this.windows.Security.Credentials.PasswordVault();

	constructor() {
		// usage example below
		// this.setPassword('testResource', 'testUsername', 'testPassword');
		// console.log('getPassword', this.getPassword('testResource', 'testUsername'));
	}

	setPassword(resource, username, password) {
		const credentials = new this.windows.Security.Credentials.PasswordCredential();
		credentials.resource = resource;
		credentials.userName = username;
		credentials.password = password;
		this.vault.add(credentials);
	}

	getPassword(resource, username) {
		return this.vault.retrieve(resource, username).password
	}
}