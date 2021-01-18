import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog } from '@lenovo/material/dialog';

import { ModalSmartPerformanceSubscribeComponent } from 'src/app/components/modal/modal-smart-performance-subscribe/modal-smart-performance-subscribe.component';
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
		private dialog: MatDialog,
	) { }

	async openSubscribeModal() {
		const modalRef = this.dialog.open(ModalSmartPerformanceSubscribeComponent, {
			maxWidth: '50rem',
			autoFocus: true,
			hasBackdrop: true,
			disableClose: true,
			panelClass: 'subscribe-modal',
		});

		modalRef.afterClosed().subscribe(() => {
			this.smartPerformanceService.scanningStopped.next();
		});
	}
}
