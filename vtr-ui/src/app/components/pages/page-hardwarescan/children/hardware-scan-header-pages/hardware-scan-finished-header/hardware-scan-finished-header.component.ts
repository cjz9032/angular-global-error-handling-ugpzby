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
	headerType: HardwareScanFinishedHeaderType = HardwareScanFinishedHeaderType.None;
	numberTestsFailed: number = 0;
	lastScanResultCompletionInfo: any;

	// Metrics
	@Input() itemParentCancel: string;
	@Input() itemNameCancel: string;

	// Emitters
	@Output() scanAgain = new EventEmitter();

	//Wrapper
	public enumScanHeaderTypeFinished = HardwareScanFinishedHeaderType;

	constructor(private hardwareScanService: HardwareScanService,
				private previousResultService: PreviousResultService,
				private hardwareScanResultService: HardwareScanResultService,
				private lenovoSupportService: LenovoSupportService) { }

	ngOnInit() {
		this.headerType = this.hardwareScanService.getScanFinishedHeaderType();
		let scanDate: Date;
		let finalResultCode: string;

		if (this.headerType === HardwareScanFinishedHeaderType.Scan) {
			scanDate =  this.hardwareScanService.getFinalResultStartDate();
			finalResultCode = this.getFinalResultCode();
		} else if (this.headerType === HardwareScanFinishedHeaderType.ViewResults) {
			this.lastScanResultCompletionInfo = this.previousResultService.getLastPreviousResultCompletionInfo();
			scanDate = this.lastScanResultCompletionInfo.date;
			finalResultCode = this.getLastFinalResultCode();
		}

		this.configureSupportUrl(scanDate, finalResultCode);
		this.configureContactusUrl();
		this.setupFailedTests();
	}

	private async configureSupportUrl(scanDate: Date, finalResultCode: string) {
		await this.lenovoSupportService.getETicketUrl(scanDate, finalResultCode)
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
