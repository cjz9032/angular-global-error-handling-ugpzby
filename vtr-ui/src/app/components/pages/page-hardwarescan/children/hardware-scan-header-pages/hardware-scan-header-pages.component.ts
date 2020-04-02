import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TaskType, TaskStep } from 'src/app/enums/hardware-scan-metrics.enum';
import { ModalWaitComponent } from '../../../../modal/modal-wait/modal-wait.component';
import { NgbModal, NgbModalRef, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { HardwareScanService } from '../../../../../services/hardware-scan/hardware-scan.service';

@Component({
	selector: 'vtr-hardware-scan-header-pages',
	templateUrl: './hardware-scan-header-pages.component.html',
	styleUrls: ['./hardware-scan-header-pages.component.scss']
})

export class HardwareScanHeaderPagesComponent implements OnInit {

	// "Wrapper" value to be accessed from the HTML
	public taskTypeEnum = TaskType;
	public isScanDone = false;
	public progress = 0;
	completeStatusToken: string;
	public startScanClicked = false;

	public deviceInRecover: any; // Current device in Recover Bad Sectors
	public itemParentCancelScan: string;
	public itemNameCancelScan: string;

	@Input() title = '';
	@Input() subTitle = '';
	@Input() warningMessage = this.translate.instant('hardwareScan.warningMessage');
	@Input() finalResultCode = '';
	@Input() finalResultCodeText = '';
	@Input() buttonText = '';
	@Input() anchorText = '';
	@Input() completeText = this.translate.instant('hardwareScan.complete');
	@Input() statusText: string;
	@Input() lenovoSupport = '';
	@Input() percent = 0;
	@Input() showProgress = false;
	@Input() disableQuickScan: boolean;
	@Input() disableCancel: boolean;
	@Input() tooltipInformation: any;
	@Input() offlineText: string;
	@Input() isOnline = true;

	@Input() itemParentCancel: string;
	@Input() itemNameCancel: string;

	@Output() startQuickScan = new EventEmitter();
	@Output() updateProgress = new EventEmitter();
	@Output() checkCancel = new EventEmitter();
	@Output() checkAnchor = new EventEmitter();

	constructor(private hardwareScanService: HardwareScanService,
		private modalService: NgbModal, 
		private translate: TranslateService) { }

	ngOnInit() { }

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

	public isDisableCancel() {
		return this.hardwareScanService.isDisableCancel();
	}

	public isScanExecuting() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.isScanExecuting();
		}
	}

	public isRecoverExecuting() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.isRecoverExecuting();
		}
	}

	onQuickScan() {
		// this.showProgress = true;
		this.startQuickScan.emit();
	}

	onAnchor() {
		this.checkAnchor.emit();
	}

	onCancel() {
		this.showProgress = true;
		this.checkCancel.emit();
	}

	public isScanOrRBSFinished() {
		return this.hardwareScanService.isScanOrRBSFinished();
	}

	public getFinalResultCode() {
		if (this.hardwareScanService) {
		return this.hardwareScanService.getFinalResultCode();
		}
		return '';
	}

	public getTooltipInformation() {
		if (this.hardwareScanService) {
		return this.hardwareScanService.getFinalResultDescription();
		}
		return '';
	}

	public finalStatusToken() {
		return this.completeStatusToken;
	}
}
