import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceService } from 'src/app/services/device/device.service';
import { ExportLogErrorStatus } from '../../../enums/hardware-scan.enum';
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

	constructor(public activeModal: NgbActiveModal, private deviceService: DeviceService) {}

	ngOnInit() {
		disableBackgroundNavigation(document);
	}

	ngOnDestroy() {
		reEnableBackgroundNavigation(document);
	}

	onClosing() {
		this.activeModal.close();
	}

	openWindowsSettings() {
		this.deviceService.launchUri('ms-settings:privacy-broadfilesystemaccess');
	}
}
