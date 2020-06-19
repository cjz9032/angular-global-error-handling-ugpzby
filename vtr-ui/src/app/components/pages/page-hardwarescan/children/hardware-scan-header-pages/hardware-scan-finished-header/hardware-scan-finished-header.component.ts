import { Component, OnInit, Input, NgZone, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { HardwareScanService } from '../../../../../../services/hardware-scan/hardware-scan.service';
import { LenovoSupportService } from 'src/app/services/hardware-scan/lenovo-support.service';
import { HardwareScanType } from 'src/app/enums/hardware-scan-type';

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
	public enumScanTypeFinished = HardwareScanType;
	public numberTestsFailed: number;

	constructor(private hardwareScanService: HardwareScanService,
				private lenovoSupportService: LenovoSupportService) { }

	ngOnInit() {
		this.configureSupportUrl();
		this.setupFailedTests();
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
			this.numberTestsFailed = this.hardwareScanService.getFailedTests();
		}
	}

	public scanTypeFinished() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.getScanTypeFinished();
		}
		return HardwareScanType.None;
	}

	public getFinalResultCode() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.getFinalResultCode();
		}
		return '';
	}

	public onScanAgain() {
		this.scanAgain.emit();
	}
}
