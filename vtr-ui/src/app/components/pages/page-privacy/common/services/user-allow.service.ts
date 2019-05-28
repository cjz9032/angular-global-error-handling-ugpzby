import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserAllowService {
	allowToShow = new BehaviorSubject(JSON.parse(this.storageService.getItem('allowMap')) || {
		trackingMap: false,
	});

	constructor(private storageService: StorageService) {
	}

	setShowTrackingMap(allow: boolean) {
		this.allowToShow.next({...this.allowToShow.getValue(), trackingMap: allow});
		this.saveToStorage(this.allowToShow.value);
	}

	private saveToStorage(allowMap) {
		this.storageService.setItem('allowMap', JSON.stringify(allowMap));
	}
}
