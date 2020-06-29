import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HardwareScanService } from '../../../services/hardware-scan/hardware-scan.service';
import { PreviousResultService } from '../../../services/hardware-scan/previous-result.service';

@Component({
	selector: 'vtr-widget-hardware-scan-status',
	templateUrl: './widget-hardware-scan-status.component.html',
	styleUrls: ['./widget-hardware-scan-status.component.scss']
})
export class WidgetHardwareScanStatusComponent implements OnInit {
	public title = this.translate.instant('hardwareScan.previousResult');
	public description: string;
	public item: any;
	public viewResultsPath = '/hardware-scan/view-results';

	constructor(
		private hardwareScanService: HardwareScanService,
		private previousResultService: PreviousResultService,
		private translate: TranslateService,
	) { }

	ngOnInit() {
		if (!this.hardwareScanService.isScanExecuting() && !this.hardwareScanService.isRecoverExecuting()) {
			this.previousResultService.getLastResults().then(() => {
				this.item = this.previousResultService.getPreviousResultsWidget();
				this.description = this.previousResultService.getLastPreviousResultDate();
			});
		}
	}

	public onPreviousResults() {
		if (this.hardwareScanService) {
			const resultItems = this.previousResultService.getPreviousResults();
			this.previousResultService.setViewResultItems(resultItems);
		}
	}

	public hasPreviousResults() {
		if (this.hardwareScanService) {
			return this.previousResultService.hasPreviousResults();
		}
	}
}
