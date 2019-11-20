import { Injectable } from '@angular/core';
import { ALLOW_MAP__NAME, StorageService } from './storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserAllowService {
	allowToShow = new BehaviorSubject(this.getAllowMap());

	constructor(private storageService: StorageService) {
	}

	setShowTrackingMap(allow: boolean) {
		this.allowToShow.next({...this.allowToShow.getValue(), trackingMap: allow});
		this.saveToStorage(this.allowToShow.value);
	}

	setConsentForVulnerablePassword(allow: boolean) {
		this.allowToShow.next({...this.allowToShow.getValue(), consentForVulnerablePassword: allow});
		this.saveToStorage(this.allowToShow.value);
	}

	private saveToStorage(allowMap) {
		this.storageService.setItem(ALLOW_MAP__NAME, JSON.stringify(allowMap));
	}

	private getAllowMap() {
		const defaultAllowMap = {
			trackingMap: false,
			consentForVulnerablePassword: false
		};

		try {
			return JSON.parse(this.storageService.getItem(ALLOW_MAP__NAME)) || defaultAllowMap;
		} catch (e) {
			return defaultAllowMap;
		}
	}
}
