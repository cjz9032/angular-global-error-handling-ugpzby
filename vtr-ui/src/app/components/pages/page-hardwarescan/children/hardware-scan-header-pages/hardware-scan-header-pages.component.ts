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

	@Input() percent;
	public deviceInRecover: any; // Current device in Recover Bad Sectors
	public culture: any;
	public metrics: any

	constructor(
		private hardwareScanService: HardwareScanService,
		private shellService: VantageShellService,
		private translate: TranslateService
		) {
			this.metrics = this.shellService.getMetrics();
		}

	ngOnInit() {
		this.culture = this.hardwareScanService.getCulture();
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
