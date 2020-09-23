import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HardwareScanService } from 'src/app/services/hardware-scan/hardware-scan.service';
import { ModalHardwareScanRbsComponent } from '../../modal/modal-hardware-scan-rbs/modal-hardware-scan-rbs.component';

@Component({
	selector: 'vtr-widget-recover-bad-sectors',
	templateUrl: './widget-recover-bad-sectors.component.html',
	styleUrls: ['./widget-recover-bad-sectors.component.scss']
})
export class WidgetRecoverBadSectorsComponent implements OnInit {

	@Input() widgetId: string;
	@Input() title: string;
	@Input() description: string;
	@Input() recoverPath: string;
	@Input() disable = false;
	@Input() tooltipText: string;
	@Input() onClick: () => void;

	constructor(
		private modalService: NgbModal,
		private hardwareScanService: HardwareScanService
	) { }

	ngOnInit() {
		this.hardwareScanService.startRecoverFromFailed.subscribe((failedDevices) => {
			this.onRecoverBadSectors(failedDevices);
		});
	 }

	public onRecoverBadSectors(failedDevices = null) {
		const modalRef =  this.modalService.open(ModalHardwareScanRbsComponent, {
			size: 'lg',
			centered: true,
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
		}
	}
}
