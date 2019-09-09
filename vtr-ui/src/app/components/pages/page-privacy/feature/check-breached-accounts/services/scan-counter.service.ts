import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SafeStorageService } from '../../../common/services/safe-storage.service';

@Injectable({
	providedIn: 'root'
})
export class ScanCounterService {
	private scanCounter = new BehaviorSubject<number>(this.safeStorageService.getScanCounter());

	constructor(
		private safeStorageService: SafeStorageService
	) {
		this.safeStorageService.removeScanCounter();
	}

	setNewScan() {
		const newCounter = this.safeStorageService.getScanCounter() ? this.safeStorageService.getScanCounter() + 1 : 1;
		this.safeStorageService.setScanCounter(newCounter);
		this.scanCounter.next(newCounter);
	}

	getScanCounter() {
		return this.scanCounter.asObservable();
	}
}
