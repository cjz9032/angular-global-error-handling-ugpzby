import { Component, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HardwareScanService } from 'src/app/services/hardware-scan/hardware-scan.service';
import { HardwareScanTestResult } from 'src/app/enums/hardware-scan-test-result.enum';
import { ModalRecoverConfirmComponent } from '../modal-recover-confirm/modal-recover-confirm.component';

@Component({
	selector: 'vtr-modal-hardware-scan-rbs',
	templateUrl: './modal-hardware-scan-rbs.component.html',
	styleUrls: ['./modal-hardware-scan-rbs.component.scss']
})
export class ModalHardwareScanRbsComponent implements OnDestroy, OnInit {
	public devices: any[];
	private failedDevicesList = [];
	private isSuccessful = false;

	// Used to signalize to a subscriber that the rbs will start.
	// It emits the selected devices to be recovered.
	@Output() recoverStart: EventEmitter<any> = new EventEmitter();

	// Used to signalize to the caller that the modal is being closed.
	// It emits true when the modal is closed in a successful way,
	// e.g. user clicked in the OK button or false otherwise.
	@Output() modalClosing: EventEmitter<boolean> = new EventEmitter();

	constructor(
		public activeModal: NgbActiveModal,
		private translate: TranslateService,
		private hardwareScanService: HardwareScanService,
		private modalService: NgbModal,
	) {
		this.hardwareScanService.setLoadingStatus(true);
		this.hardwareScanService.setScanExecutionStatus(false);
		this.hardwareScanService.setRecoverExecutionStatus(false);
		this.hardwareScanService.setIsScanDone(false);
	}

	public ngOnInit() {
		this.getItemsToRecoverBadSectors();
	}

	public ngOnDestroy() {
		this.modalClosing.emit(this.isSuccessful);
	}

	public closeModal() {
		this.activeModal.close('close');
	}

	public onClickRun() {
		let selectedDevices: any[];

		if (this.devices) {
			selectedDevices = this.devices.filter(x => x.isSelected);
		}

		this.closeModal();

		const modalRef = this.modalService.open(ModalRecoverConfirmComponent, {
			size: '500px',
			centered: true,
		});
		modalRef.componentInstance.confirmClicked.subscribe(() => {
			this.onConfirmClick(selectedDevices);
		});
	}

	private onConfirmClick(selectedDevices: any[]) {
		this.isSuccessful = true;
		this.recoverStart.emit(selectedDevices);
		this.closeModal();
	}

	private getItemsToRecoverBadSectors() {
		const devices = this.hardwareScanService.getDevicesToRecoverBadSectors();
		if (devices) {
			this.buildDevicesRecoverList(devices.groupList);
		}
	}

	private buildDevicesRecoverList(groupList: any) {
		const devices = [];

		for (const group of groupList) {
			devices.push({
				id: group.id,
				title: this.translate.instant('hardwareScan.pluginTokens.STORAGE'),
				name: group.name,
				status: HardwareScanTestResult.NotStarted,
				isSelected: this.failedDevicesList.some(p => p === group.id),
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
