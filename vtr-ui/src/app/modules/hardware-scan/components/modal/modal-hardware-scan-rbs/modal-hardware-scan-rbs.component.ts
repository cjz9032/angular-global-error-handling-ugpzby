import { Component, Output, EventEmitter, OnDestroy, OnInit, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HardwareScanService } from 'src/app/modules/hardware-scan/services/hardware-scan.service';
import { HardwareScanTestResult } from 'src/app/modules/hardware-scan/enums/hardware-scan.enum';
import { ModalRecoverConfirmComponent } from '../modal-recover-confirm/modal-recover-confirm.component';
import { MatDialog, MatDialogRef } from '@lenovo/material/dialog';

@Component({
	selector: 'vtr-modal-hardware-scan-rbs',
	templateUrl: './modal-hardware-scan-rbs.component.html',
	styleUrls: ['./modal-hardware-scan-rbs.component.scss'],
})
export class ModalHardwareScanRbsComponent implements OnDestroy, OnInit {
	devices: any[];
	failedDevicesList = [];
	private isSuccessful = false;

	// Used to signalize to a subscriber that the rbs will start.
	// It emits the selected devices to be recovered.
	@Output() recoverStart: EventEmitter<any> = new EventEmitter();

	// Used to signalize to the caller that the modal is being closed.
	// It emits true when the modal is closed in a successful way,
	// e.g. user clicked in the OK button or false otherwise.
	@Output() modalClosing: EventEmitter<boolean> = new EventEmitter();

	constructor(
		public dialogRef: MatDialogRef<ModalHardwareScanRbsComponent>,
		private translate: TranslateService,
		private hardwareScanService: HardwareScanService,
		private dialog: MatDialog
	) { }

	// Used to close modal when press 'ESC' key
	@HostListener('document:keydown', ['$event'])
	onKeyDownHandler(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			this.closeModal();
		}
	}

	public ngOnInit() {
		this.getItemsToRecoverBadSectors();
	}

	public ngOnDestroy() {
		this.modalClosing.emit(this.isSuccessful);
	}

	public closeModal() {
		this.dialogRef.close('close');
	}

	public onClickRun() {
		let selectedDevices: any[];

		if (this.devices) {
			selectedDevices = this.devices.filter((x) => x.isSelected);
		}

		this.closeModal();

		const modal = this.dialog.open(ModalRecoverConfirmComponent, {
			maxWidth: '50rem',
			autoFocus: true,
			hasBackdrop: true,
			disableClose: true,
			ariaLabelledBy: 'hwscan-recover-title',
			panelClass: 'hardware-scan-modal-size',
		});
		modal.componentInstance.confirmClicked.subscribe(() => {
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
				isSelected: this.failedDevicesList.some((p) => p === group.id),
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
