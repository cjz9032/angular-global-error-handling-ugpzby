import { Component, OnInit, Input, NgZone, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HardwareScanService } from '../../../../../../services/hardware-scan/hardware-scan.service';

@Component({
  selector: 'vtr-hardware-scan-executing-header',
  templateUrl: './hardware-scan-executing-header.component.html',
  styleUrls: ['./hardware-scan-executing-header.component.scss']
})
export class HardwareScanExecutingHeaderComponent implements OnInit {
	// Inputs
	@Input() percent = 0;
	@Input() title = '';
	@Input() subTitle = '';
	@Input() statusText: string;
	@Input() disableCancel: boolean;
	@Input() finalResultCode = '';

	// Metrics
	@Input() itemParentCancel: string;
	@Input() itemNameCancel: string;

	// Emitters
	@Output() checkCancel = new EventEmitter();
	@Output() updateProgress = new EventEmitter();

	constructor(
		private hardwareScanService: HardwareScanService,
		private translate: TranslateService) { }

	ngOnInit() { }

	onCancel() {
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
}
