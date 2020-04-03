import { Component, OnInit, Input, NgZone, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HardwareScanService } from '../../../../../../services/hardware-scan/hardware-scan.service';

@Component({
  selector: 'vtr-hardware-scan-executing-header',
  templateUrl: './hardware-scan-executing-header.component.html',
  styleUrls: ['./hardware-scan-executing-header.component.scss']
})
export class HardwareScanExecutingHeaderComponent implements OnInit {

	@Input() percent;
	@Input() title = '';
	@Input() subTitle = '';

	constructor(
		private hardwareScanService: HardwareScanService,
		private translate: TranslateService) { }

	ngOnInit() { }

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
