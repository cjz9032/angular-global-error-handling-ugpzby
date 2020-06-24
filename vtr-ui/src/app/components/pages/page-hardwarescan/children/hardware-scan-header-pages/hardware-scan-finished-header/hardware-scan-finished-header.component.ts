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

	// Inputs
	@Input() supportUrl: string;

	// Metrics
	@Input() itemParentCancel: string;
	@Input() itemNameCancel: string;

	// Emitters
	@Output() scanAgain = new EventEmitter();

	//Wrapper
	public enumScanTypeFinished = HardwareScanFinishedHeaderType;
	public numberTestsFailed: number;
	public dateDescription: string;

	constructor(private hardwareScanService: HardwareScanService,
				private previousResultService: PreviousResultService,
				private hardwareResultService: HardwareScanResultService,
				private lenovoSupportService: LenovoSupportService) { }

	ngOnInit() {
		this.configureSupportUrl();
		this.setupFailedTests();
		this.dateDescription = this.previousResultService.getLastPreviousResultDate();
	}

	private async configureSupportUrl() {
		await this.lenovoSupportService.getPremierUrl()
			.then((response) => {
					this.supportUrl = response;
			});
	}

	public setupFailedTests() {
		this.numberTestsFailed = 0;
		if (this.hardwareScanService) {
			this.numberTestsFailed = this.hardwareResultService.getFailedTests();
		}
	}

	public scanTypeFinished() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.getScanTypeFinished();
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
