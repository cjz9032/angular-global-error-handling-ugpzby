import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@lenovo/material/dialog';
import { ModalHardwareScanRbsComponent } from 'src/app/modules/hardware-scan/components/modal/modal-hardware-scan-rbs/modal-hardware-scan-rbs.component';
import { HardwareScanTestResult } from 'src/app/modules/hardware-scan/enums/hardware-scan.enum';
import { HardwareScanService } from './hardware-scan.service';

@Injectable({
	providedIn: 'root',
})
export class RecoverBadSectorsService {
	private recoverBadSectorsLastResult;

	constructor(
		private hardwareScanService: HardwareScanService,
		private dialog: MatDialog,
		private router: Router
	) {}

	public getLastRecoverResultTitle() {
		return HardwareScanTestResult[this.recoverBadSectorsLastResult.resultModule];
	}

	public getLastRecoverResultStatus() {
		return this.recoverBadSectorsLastResult.resultModule;
	}

	public getRecoverResultItems() {
		return this.recoverBadSectorsLastResult;
	}

	public setRecoverResultItems(items: any) {
		this.recoverBadSectorsLastResult = items;
	}

	public openRecoverBadSectorsModal(failedDevices = null) {
		const modalRef = this.dialog.open(ModalHardwareScanRbsComponent, {
			maxWidth: '50rem',
			autoFocus: false,
			hasBackdrop: true,
			disableClose: true,
			panelClass: 'custom-modal-size',
		});

		if (failedDevices !== null) {
			modalRef.componentInstance.failedDevicesList = failedDevices;
		}

		modalRef.componentInstance.recoverStart.subscribe((devices) => {
			this.startRecover(devices);
		});
	}

	private startRecover(devices) {
		if (this.hardwareScanService) {
			this.hardwareScanService.setDevicesRecover(devices);
			this.hardwareScanService.setRecoverInit(true);
			this.hardwareScanService.setRecoverExecutionStatus(true);
			this.hardwareScanService.setIsScanDone(false);
			this.hardwareScanService.startRecover.emit();
			this.router.navigate(['/hardware-scan']);
		}
	}
}
