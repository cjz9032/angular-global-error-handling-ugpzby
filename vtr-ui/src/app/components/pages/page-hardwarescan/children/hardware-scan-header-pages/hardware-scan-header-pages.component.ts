import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TaskType, TaskStep } from 'src/app/enums/hardware-scan-metrics.enum';
import { ModalWaitComponent } from '../../../../modal/modal-wait/modal-wait.component';
import { NgbModal, NgbModalRef, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { VantageShellService } from '../../../../../services/vantage-shell/vantage-shell.service';
import { HardwareScanService } from '../../../../../services/hardware-scan/hardware-scan.service';

@Component({
	selector: 'vtr-hardware-scan-header-pages',
	templateUrl: './hardware-scan-header-pages.component.html',
	styleUrls: ['./hardware-scan-header-pages.component.scss']
})

export class HardwareScanHeaderPagesComponent implements OnInit {
	// Inputs
	@Input() percent = 0;
	@Input() statusText: string;
	@Input() disableCancel: boolean;
	@Input() deviceInRecover: any; // Current device in Recover Bad Sectors

	// Metrics
	@Input() itemParentCancel: string;
	@Input() itemNameCancel: string;

	// Emitters
	@Output() startQuickScan = new EventEmitter();
	@Output() checkAnchor = new EventEmitter();
	@Output() checkCancel = new EventEmitter();

	constructor(
		private hardwareScanService: HardwareScanService,
		private translate: TranslateService
		) {
		}

	ngOnInit() { }

	onAnchor() {
		this.checkAnchor.emit();
	}

	onQuickScan() {
		this.startQuickScan.emit();
	}

	onCancel() {
		this.checkCancel.emit();
	}

	public getDeviceTitle() {
		if (this.hardwareScanService) {
			if (this.hardwareScanService.isRecoverExecuting()) {
				return this.deviceInRecover;
			} else {
				return this.translate.instant('hardwareScan.title');
			}
		}
	}

	public getDeviceSubTitle() {
		if (this.hardwareScanService) {
			if (this.hardwareScanService.isRecoverExecuting()) {
				return this.translate.instant('hardwareScan.recoverBadSectors.moreInfo');
			} else {
				return this.translate.instant('hardwareScan.subtitle');
			}
		}
	}

	public isExecutingAnyScan(){
		if (this.hardwareScanService) {
			return (
				this.hardwareScanService.isScanExecuting() ||
				this.hardwareScanService.isRecoverExecuting()
			);
		}
	}
}
