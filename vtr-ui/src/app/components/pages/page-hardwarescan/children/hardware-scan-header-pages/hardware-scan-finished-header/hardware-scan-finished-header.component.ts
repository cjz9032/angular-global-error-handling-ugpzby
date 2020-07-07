import { Component, OnInit, Input, NgZone, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { HardwareScanService } from '../../../../../../services/hardware-scan/hardware-scan.service';
import { PreviousResultService } from '../../../../../../services/hardware-scan/previous-result.service';
import { HardwareScanResultService } from '../../../../../../services/hardware-scan/hardware-scan-result.service';
import { LenovoSupportService } from 'src/app/services/hardware-scan/lenovo-support.service';
import { HardwareScanFinishedHeaderType } from 'src/app/enums/hardware-scan-finished-header-type.enum';

@Component({
  selector: 'vtr-hardware-scan-finished-header',
  templateUrl: './hardware-scan-finished-header.component.html',
  styleUrls: ['./hardware-scan-finished-header.component.scss']
})
export class HardwareScanFinishedHeaderComponent implements OnInit {

	supportUrl: string;
	contactusUrl: string;

	// Metrics
	@Input() itemParentCancel: string;
	@Input() itemNameCancel: string;

	// Emitters
	@Output() scanAgain = new EventEmitter();

	//Wrapper
	public enumScanHeaderTypeFinished = HardwareScanFinishedHeaderType;
	public numberTestsFailed: number;
	public lastScanResultCompletionInfo: any;

	constructor(private hardwareScanService: HardwareScanService,
				private previousResultService: PreviousResultService,
				private hardwareScanResultService: HardwareScanResultService,
				private lenovoSupportService: LenovoSupportService) { }

	ngOnInit() {
		this.lastScanResultCompletionInfo = this.previousResultService.getLastPreviousResultCompletionInfo();
		this.configureSupportUrl();
		this.configureContactusUrl();
		this.setupFailedTests();
	}

	private async configureSupportUrl() {
		await this.lenovoSupportService.getETicketUrl(this.lastScanResultCompletionInfo.date)
			.then((response) => {
				this.supportUrl = response;
			});
	}

	private async configureContactusUrl() {
		await this.lenovoSupportService.getContactusUrl().then((response) => {
			this.contactusUrl = response;
		});
	}

	public setupFailedTests() {
		this.numberTestsFailed = 0;
		if (this.hardwareScanService) {
			this.numberTestsFailed = this.hardwareScanResultService.getFailedTests();
		}
	}

	public scanHeaderTypeFinished() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.getScanFinishedHeaderType();
		}
		return HardwareScanFinishedHeaderType.None;
	}

	public getFinalResultCode() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.getFinalResultCode();
		}
		return '';
	}

	public getLastFinalResultCode() {
		return this.previousResultService.getLastFinalResultCode();
	}

	public onScanAgain() {
		this.scanAgain.emit();
	}
}
