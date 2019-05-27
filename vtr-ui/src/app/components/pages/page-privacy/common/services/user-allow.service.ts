import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
	providedIn: 'root'
})
export class UserAllowService {
	allowToShow = JSON.parse(this.storageService.getItem('allowMap')) || {
		trackingMap: false,
	};

	constructor(private storageService: StorageService) {
	}

	setShowTrackingMap(allow: boolean) {
		this.allowToShow = {...this.allowToShow, trackingMap: allow};
		this.saveToStorage(this.allowToShow);
	}

	private saveToStorage(allowMap) {
		this.storageService.setItem('allowMap', JSON.stringify(allowMap));
	}
}
