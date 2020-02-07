import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { HardwareScanTestResult } from 'src/app/beta/hardware-scan/enums/hardware-scan-test-result.enum';
import { DeviceService } from 'src/app/services/device/device.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { HardwareScanService } from '../../../services/hardware-scan/hardware-scan.service';
import { ModalRecoverConfirmComponent } from '../../../modal/modal-recover-confirm/modal-recover-confirm.component';

@Component({
	selector: 'vtr-recover-bad-sectors',
	templateUrl: './recover-bad-sectors.component.html',
	styleUrls: ['./recover-bad-sectors.component.scss']
})
export class RecoverBadSectorsComponent implements OnInit, OnChanges, OnDestroy {

	public title: string;
	public devices: any[];
	public progress: number;
	public enableViewResults = false;
	public errorMessage: string;

	public textButton = this.translate.instant('hardwareScan.recoverBadSectors.title');
	recoverInProgress = false;

	constructor(
		public deviceService: DeviceService,
		private hardwareScanService: HardwareScanService,
		private translate: TranslateService,
		private modalService: NgbModal,
		private router: Router,
	) {
		this.hardwareScanService.setLoadingStatus(true);
		this.hardwareScanService.setScanExecutionStatus(false);
		this.hardwareScanService.setRecoverExecutionStatus(false);
		this.hardwareScanService.setIsScanDone(false);
	}

	ngOnInit() {
		this.getItemsToRecoverBadSectors();
		this.setTitle();
	}

	ngOnDestroy() {
		this.hardwareScanService.setRecoverInProgress(false);
		// Clearing the last response received from Scan/RBS to ensure that
		// the Hardware Components page will be shown, since user just clicked
		// in the back button from the Recover Bad Sectors page.
		this.hardwareScanService.clearLastResponse();
	}

	ngOnChanges() {
		this.setTitle();
	}

	setTitle() {
		if (this.devices) {
			this.title = this.translate.instant('hardwareScan.recoverBadSectors.localDevices');
		} else {
			this.title = this.translate.instant('hardwareScan.loadingDevices');
		}
	}

	startRecover() {
		const leastOneSelected = this.devices.find(device => device.isSelected);
		if (leastOneSelected !== undefined) {

			const modal: NgbModalRef = this.modalService.open(ModalRecoverConfirmComponent, {
				backdrop: 'static',
				size: 'lg',
				centered: true,
				windowClass: 'hardware-scan-modal-size'
			});
			
			modal.componentInstance.ItemParent = "HardwareScan.ConfirmRecoverBadSectors";
			modal.componentInstance.CancelItemName = "ConfirmRecoverBadSectors.Close";
			modal.componentInstance.ConfirmItemName = "ConfirmRecoverBadSectors.Confirm";

			modal.result.then((result) => {
				const devicesSelected = this.devices.filter(device => device.isSelected);
				this.hardwareScanService.setDevicesRecover(devicesSelected);
				this.hardwareScanService.setRecoverInit(true);
				this.hardwareScanService.setRecoverInProgress(true);
				this.hardwareScanService.setRecoverExecutionStatus(true);
				this.hardwareScanService.setIsScanDone(false);
				this.router.navigateByUrl('/beta/hardware-scan');
			}, (reason) => {
				// do nothing
			});
			// This fix avoids the invisible popup when the screen is set to 500x500 size and the time to render the modal is not enough.
			// The translate(0px, 0px) was needed to rebuild the modal and problem doesn't occur anymore.
			setTimeout(() => {
				(document.querySelector('.modal.show .modal-dialog') as HTMLElement).style.transform = "translate(0px, 0px)";
			}, 1);
		} else {
			this.errorMessage = this.translate.instant('hardwareScan.errorDeviceChoose');
		}
	}

	public getItemsToRecoverBadSectors() {
		console.log('[Start] Get Items to Recover Bad Sectors');
		const devices = this.hardwareScanService.getDevicesToRecoverBadSectors();
		this.buildDevicesRecoverList(devices.groupList);
		console.log('[End] Get Items to Recover Bad Sectors');
	}

	private buildDevicesRecoverList(groupList: any) {
		const devices = [];
		for (const group of groupList) {
			devices.push({
				id: group.id,
				title: group.name,
				name: group.name,
				status: HardwareScanTestResult.NotStarted,
				isSelected: false,
				percent: 0,
				numberOfSectors: 0,
				numberOfBadSectors: 0,
				numberOfFixedSectors: 0,
				numberOfNonFixedSectors: 0,
				elapsedTime: 0,
			});
		}
		this.devices = devices;
	}

	public isSelectedItem() {
		return this.hardwareScanService.getHasDevicesToRecover();
	}
}
