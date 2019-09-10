import { Injectable } from '@angular/core';
import { ALLOW_MAP__NAME, StorageService } from './storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserAllowService {
	allowToShow = new BehaviorSubject(JSON.parse(this.storageService.getItem(ALLOW_MAP__NAME)) || {
		trackingMap: false,
	});

	constructor(private storageService: StorageService) {
	}

	setShowTrackingMap(allow: boolean) {
		this.allowToShow.next({...this.allowToShow.getValue(), trackingMap: allow});
		this.saveToStorage(this.allowToShow.value);
	}

	private saveToStorage(allowMap) {
		this.storageService.setItem(ALLOW_MAP__NAME, JSON.stringify(allowMap));
	}
}
