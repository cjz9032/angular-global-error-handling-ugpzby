import { Injectable } from '@angular/core';

const Windows = window["Windows"];

@Injectable({
	providedIn: 'root'
})
export class SettingsStorageService {

	applicationData = Windows.Storage.ApplicationData.current;
	localSettings = this.applicationData.localSettings;

	constructor() {
		// example of usage below
		// this.setValue('figleaf-isBrowserConcentGiven', 'true');
		// console.log('value', this.getValue('figleaf-isBrowserConcentGiven'));
	}

	setValue(key, value) {
		this.localSettings.values[key] = value;
	}

	getValue(key) {
		return this.localSettings.values[key];
	}

	deleteValue(key) {
		this.localSettings.values.remove(key);
	}

}
