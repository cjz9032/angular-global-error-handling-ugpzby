import { Injectable } from '@angular/core';

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
}
