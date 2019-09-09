import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../../../common/services/storage.service';

const SCAN_STORAGE_NAME = 'scanCounter';

@Injectable({
	providedIn: 'root'
})
export class ScanCounterService {
	private scanCounter = new BehaviorSubject<number>(Number(this.storageService.getItem(SCAN_STORAGE_NAME)));

	constructor(
		private storageService: StorageService
	) {
	}

	setNewScan() {
		const newCounter = Number(this.storageService.getItem(SCAN_STORAGE_NAME)) ? Number(this.storageService.getItem(SCAN_STORAGE_NAME)) + 1 : 1;
		this.storageService.setItem(SCAN_STORAGE_NAME, newCounter.toString());
		this.scanCounter.next(newCounter);
	}

	getScanCounter() {
		return this.scanCounter.asObservable();
	}
}
