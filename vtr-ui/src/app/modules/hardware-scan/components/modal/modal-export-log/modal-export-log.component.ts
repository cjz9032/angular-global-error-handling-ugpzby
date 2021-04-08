import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatDialogRef } from '@lenovo/material/dialog';
import { ExportLogErrorStatus } from 'src/app/enums/export-log.enum';
import { DeviceService } from 'src/app/services/device/device.service';
import {
	disableBackgroundNavigation,
	reEnableBackgroundNavigation,
} from '../../../services/utils/ModalBackgroundNavigationUtils';

@Component({
	selector: 'vtr-modal-export-log',
	templateUrl: './modal-export-log.component.html',
	styleUrls: ['./modal-export-log.component.scss'],
})
export class ModalExportLogComponent implements OnInit, OnDestroy {
	@Input() logPath = '';
	@Input() errorStatus: ExportLogErrorStatus;

	public enumExportLogErrorStatus = ExportLogErrorStatus;

	constructor(
		public dialogRef: MatDialogRef<ModalExportLogComponent>,
		private deviceService: DeviceService
	) {}

	ngOnInit() {
		disableBackgroundNavigation(document);
	}

	ngOnDestroy() {
		reEnableBackgroundNavigation(document);
	}

	onClosing() {
		this.dialogRef.close();
	}

	openWindowsSettings() {
		this.deviceService.launchUri('ms-settings:privacy-broadfilesystemaccess');
	}
}
