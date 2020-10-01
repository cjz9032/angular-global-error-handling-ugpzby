import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HardwareScanService } from '../../services/hardware-scan.service';
import { HardwareScanState } from 'src/app/enums/hardware-scan-state';

@Component({
	selector: 'vtr-hardware-scan-header-pages',
	templateUrl: './hardware-scan-header-pages.component.html',
	styleUrls: ['./hardware-scan-header-pages.component.scss']
})

export class HardwareScanHeaderPagesComponent implements OnInit {
	// Inputs
	@Input() percent = 0;
	@Input() completed: boolean | undefined;
	@Input() disableCancel: boolean;
	@Input() deviceInRecover: any; // Current device in Recover Bad Sectors
	@Input() disableButtonScan: boolean;

	// Metrics
	@Input() itemParentCancel: string;
	@Input() itemNameCancel: string;

	// Emitters
	@Output() startQuickScan = new EventEmitter();
	@Output() checkAnchor = new EventEmitter();
	@Output() checkCancel = new EventEmitter();
	@Output() scanAgain = new EventEmitter();

	// "Wrapper" value to be accessed from the HTML
	public scanStateEnum = HardwareScanState;

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

	onScanAgain() {
		this.scanAgain.emit();
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

	public getCurrentScanState(){
		if (this.hardwareScanService) {
			if (this.hardwareScanService.isScanExecuting() || this.hardwareScanService.isRecoverExecuting()) {
				if (this.hardwareScanService.isScanOrRBSFinished()) {
					return HardwareScanState.StateFinished;
				} else {
					return HardwareScanState.StateExecuting;
				}
			}
			else { // main screen
				return HardwareScanState.StateHome;
			}
		}
	}
}
