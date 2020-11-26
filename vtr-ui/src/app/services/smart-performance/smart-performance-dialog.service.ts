import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalSmartPerformanceSubscribeComponent } from 'src/app/components/modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SmartPerformanceService } from './smart-performance.service';

@Injectable({
	providedIn: 'root',
})
export class SmartPerformanceDialogService {
	getSmartPerformance: any;
	modalStatus = { initiatedTime: '', isGettingStatus: false };
	public isShellAvailable = false;
	scanningStopped = new Subject<boolean>();

	isScanning = false;
	isScanningCompleted = false;
	scheduleScanObj = null;
	nextScheduleScan: any;

	constructor(
		private smartPerformanceService: SmartPerformanceService,
		private modalService: NgbModal
	) {}

	async openSubscribeModal() {
		const modalRef = this.modalService.open(ModalSmartPerformanceSubscribeComponent, {
			backdrop: 'static',
			size: 'lg',
			centered: true,
			windowClass: 'subscribe-modal',
		});

		const res = await modalRef.result;
		if (res) {
			this.smartPerformanceService.scanningStopped.next();
		}
	}
}
