import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HardwareScanService } from 'src/app/services/hardware-scan/hardware-scan.service';
import { HardwareScanTestResult } from 'src/app/enums/hardware-scan-test-result.enum';

@Component({
	selector: 'vtr-modal-hardware-scan-rbs',
	templateUrl: './modal-hardware-scan-rbs.component.html',
	styleUrls: ['./modal-hardware-scan-rbs.component.scss']
})
export class ModalHardwareScanRbsComponent implements OnDestroy, OnInit {
	public modalTitle: string;
	public confirmDescription: string;
	public devices: any[];
	public isRunRbsClicked = false;
	private failedDevicesList: Array<string>;
	private isSuccessful = false;
	private selectedDevices: any[];

	@Output() passEntry: EventEmitter<any> = new EventEmitter();

	// Used to signalize to the caller that the modal is being closed.
	// It emits true when the modal is closed in a successful way,
	// e.g. user clicked in the OK button or false otherwise.
	@Output() modalClosing: EventEmitter<boolean> = new EventEmitter();

	constructor(
		public activeModal: NgbActiveModal,
		private translate: TranslateService,
		private hardwareScanService: HardwareScanService,
	) {
		this.hardwareScanService.setLoadingStatus(true);
		this.hardwareScanService.setScanExecutionStatus(false);
		this.hardwareScanService.setRecoverExecutionStatus(false);
		this.hardwareScanService.setIsScanDone(false);

		this.failedDevicesList = [];
	}

	public ngOnInit() {
		this.getItemsToRecoverBadSectors();
		this.getComponentTitle();
	}
	public ngOnDestroy() {
		this.modalClosing.emit(this.isSuccessful);
	}

	public closeModal() {
		this.activeModal.close('close');
	}

	public onClickRun() {
		this.isRunRbsClicked = true;
		this.modalTitle = this.translate.instant('hardwareScan.warning');
		this.confirmDescription = this.translate.instant('hardwareScan.recoverBadSectors.popup.description');
		this.selectedDevices = this.devices.filter(x => x.isSelected);
	}

	public onConfirmClick() {
		this.isSuccessful = true;
		this.passEntry.emit(this.selectedDevices);
		this.closeModal();
	}

	private getComponentTitle() {
		if (this.devices) {
			this.modalTitle = this.translate.instant('hardwareScan.recoverBadSectors.modalTitle');
		} else {
			this.modalTitle = this.translate.instant('hardwareScan.loadingDevices');
		}
	}

	public getItemsToRecoverBadSectors() {
		const devices = this.hardwareScanService.getDevicesToRecoverBadSectors();
		this.buildDevicesRecoverList(devices.groupList);
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
