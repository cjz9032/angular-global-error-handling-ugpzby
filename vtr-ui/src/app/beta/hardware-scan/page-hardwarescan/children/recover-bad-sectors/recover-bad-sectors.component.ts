import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { HardwareScanTestResult } from 'src/app/beta/hardware-scan/enums/hardware-scan-test-result.enum';
import { DeviceService } from 'src/app/services/device/device.service';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ModalScheduleScanCollisionComponent } from '../../../modal/modal-schedule-scan-collision/modal-schedule-scan-collision.component';
import { HardwareScanService } from '../../../services/hardware-scan/hardware-scan.service';

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
		this.hardwareScanService.setRecoverInProgress(true);
		this.hardwareScanService.setScanExecutionStatus(false);
		this.hardwareScanService.setRecoverExecutionStatus(false);
		this.hardwareScanService.setIsScanDone(false);
	}

	ngOnInit() {
		this.getItemsToRecoverBadSectors();
		this.setTitle();
	}

	ngOnDestroy() {
		// if (!this.hardwareScanService.isScanExecuting() && !this.hardwareScanService.isRecoverExecuting()) {
		// 	this.hardwareScanService.setLoadingStatus(false);
		// }
		this.hardwareScanService.setRecoverInProgress(false);
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

			const modal: NgbModalRef = this.modalService.open(ModalScheduleScanCollisionComponent, {
				backdrop: 'static',
				size: 'lg',
				centered: true,
				windowClass: 'schedule-new-modal-size'
			});

			(<ModalScheduleScanCollisionComponent>modal.componentInstance).error = this.translate.instant('hardwareScan.warning');
			(<ModalScheduleScanCollisionComponent>modal.componentInstance).description = this.translate.instant('hardwareScan.recoverBadSectors.popup.description');

			modal.result.then((result) => {
				const devicesSelected = this.devices.filter(device => device.isSelected);
				this.hardwareScanService.setDevicesRecover(devicesSelected);
				this.hardwareScanService.setRecoverInit(true);
				this.hardwareScanService.setRecoverExecutionStatus(true);
				this.hardwareScanService.setIsScanDone(false);
				this.router.navigateByUrl('/beta/hardware-scan');
			}, (reason) => {
				// do nothing
			});

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
