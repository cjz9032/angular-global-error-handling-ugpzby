import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HardwareScanTestResult } from 'src/app/beta/hardware-scan/enums/hardware-scan-test-result.enum';
import { HardwareScanService } from '../../services/hardware-scan/hardware-scan.service';

@Component({
	selector: 'vtr-widget-hardware-scan-status',
	templateUrl: './widget-hardware-scan-status.component.html',
	styleUrls: ['./widget-hardware-scan-status.component.scss']
})
export class WidgetHardwareScanStatusComponent implements OnInit {
	public title = this.translate.instant('hardwareScan.previousResult');
	public description: string;
	public item: any;
	public buttonText = this.translate.instant('hardwareScan.viewDetailsLog');
	public viewResultsPath = '/beta/hardware-scan/view-results';

	constructor(
		private hardwareScanService: HardwareScanService,
		private translate: TranslateService,
	) { }

	ngOnInit() {
		if (!this.hardwareScanService.isScanExecuting() && !this.hardwareScanService.isRecoverExecuting()) {
			this.hardwareScanService.getLastResults().then(() => {
				this.item = this.hardwareScanService.getPreviousResultsWidget();
				this.descriptionFormatter();
			});
		}
	}

	public onPreviousResults() {
		if (this.hardwareScanService) {
			const resultItems = this.hardwareScanService.getPreviousResults();
			this.hardwareScanService.setViewResultItems(resultItems);
		}
	}

	public descriptionFormatter() {
		if (this.hardwareScanService.hasPreviousResults()) {
			const lastScan = this.translate.instant('hardwareScan.lastScanOn') + ' ' + this.item.date;

			let result;
			const existsNotPass = this.item.modules.filter(i => i.resultIcon !== HardwareScanTestResult.Pass);

			if (existsNotPass && existsNotPass.length === 0) {
				result = ' - ' + this.translate.instant('hardwareScan.result') + ': ' + this.translate.instant('hardwareScan.complete');
			} else {
				result = ' - ' + this.translate.instant('hardwareScan.result') + ': ' + this.translate.instant('hardwareScan.incomplete');
			}

			this.description = lastScan + result;
		}
	}

	public hasPreviousResults() {
		if (this.hardwareScanService) {
			return this.hardwareScanService.hasPreviousResults();
		}
	}
}
