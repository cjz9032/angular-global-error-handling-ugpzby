import { Component, OnInit, Input } from '@angular/core';
import { HardwareScanService } from '../../../services/hardware-scan.service';
import { PreviousResultService } from '../../../services/previous-result.service';

@Component({
	selector: 'vtr-widget-hardware-scan-status',
	templateUrl: './widget-hardware-scan-status.component.html',
	styleUrls: ['./widget-hardware-scan-status.component.scss']
})
export class WidgetHardwareScanStatusComponent implements OnInit {
	@Input() widgetId: string;

	public previousResultsModules: any = undefined;
	public lastScanResultCompletionInfo: any = undefined;
	public viewResultsPath = '/hardware-scan/view-results';

	constructor(
		private hardwareScanService: HardwareScanService,
		private previousResultService: PreviousResultService
	) { }

	ngOnInit() {
		if (!this.hardwareScanService.isScanExecuting() && !this.hardwareScanService.isRecoverExecuting()) {
			this.previousResultService.getLastResults().then(() => {
				const previousResultsWidget: any = this.previousResultService.getPreviousResultsWidget();
				if (previousResultsWidget) {
					this.previousResultsModules = previousResultsWidget.modules;
					this.lastScanResultCompletionInfo = this.previousResultService.getLastPreviousResultCompletionInfo();
				}
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