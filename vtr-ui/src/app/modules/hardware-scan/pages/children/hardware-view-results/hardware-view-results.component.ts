import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { TranslateService } from '@ngx-translate/core';
import {
	HardwareScanTestResult,
	HardwareScanFinishedHeaderType,
	ExportLogErrorStatus,
} from 'src/app/modules/hardware-scan/enums/hardware-scan.enum';
import { HardwareScanService } from '../../../services/hardware-scan.service';
import { PreviousResultService } from '../../../services/previous-result.service';
import { ExportResultsService } from '../../../services/export-results.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { TimerService } from 'src/app/services/timer/timer.service';
import { HardwareScanMetricsService } from '../../../services/hardware-scan-metrics.service';
import { HardwareScanFeaturesService } from '../../../services/hardware-scan-features.service';
import { CommonService } from 'src/app/services/common/common.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { ModalExportLogComponent } from '../../../components/modal/modal-export-log/modal-export-log.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'vtr-hardware-view-results',
	templateUrl: './hardware-view-results.component.html',
	styleUrls: ['./hardware-view-results.component.scss'],
})
export class HardwareViewResultsComponent implements OnInit, OnDestroy {
	public item: any;
	public resultCodeText = this.translate.instant('hardwareScan.resultCode');
	public detailsText = this.translate.instant('hardwareScan.details');
	public showProgress = false;
	public isLoadingDone = false;

	// "Wrapper" value to be accessed from the HTML
	public testResultEnum = HardwareScanTestResult;

	constructor(
		public deviceService: DeviceService,
		private hardwareScanService: HardwareScanService,
		private previousResultService: PreviousResultService,
		private translate: TranslateService,
		private exportService: ExportResultsService,
		private logger: LoggerService,
		private timerService: TimerService,
		private hardwareScanMetricsService: HardwareScanMetricsService,
		private hardwareScanFeaturesService: HardwareScanFeaturesService,
		private commonService: CommonService,
		private modalService: NgbModal
	) {}

	ngOnInit() {
		// Get the view result information
		this.item = this.previousResultService.getViewResultItems();

		// Validates if the view result information has failured tests and update this value
		this.previousResultService.updateLastFailuredTest(this.item.items);

		// Sets the Header with the type "View Results"
		this.hardwareScanService.setScanFinishedHeaderType(
			HardwareScanFinishedHeaderType.ViewResults
		);
	}

	ngOnDestroy() {
		// Ensure that the homepage will be shown,
		// in case of reaching here from the results page
		this.hardwareScanService.setScanOrRBSFinished(false);

		// Sets the Header with the type "None"
		this.hardwareScanService.setScanFinishedHeaderType(HardwareScanFinishedHeaderType.None);
	}

	public get isFeatureExportAvailable(): boolean {
		return (
			this.hardwareScanFeaturesService.isExportLogAvailable &&
			this.commonService.getSessionStorageValue(SessionStorageKey.HwScanHasExportLogData) &&
			this.previousResultService.getLastFinalResultCode()
		); // Uses this validation to avoid cases that CLI doesn't send final result code (Abort CLI error)
	}

	private openExportLogComponentsModal(): NgbModalRef {
		const modal: NgbModalRef = this.modalService.open(ModalExportLogComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'hardware-scan-modal-size',
		});

		this.updateExportLogComponentsModal(modal);

		return modal;
	}

	private updateExportLogComponentsModal(
		modal: NgbModalRef,
		error: ExportLogErrorStatus = ExportLogErrorStatus.LoadingExport,
		logPath: string = ''
	) {
		(modal.componentInstance as ModalExportLogComponent).logPath = logPath;
		(modal.componentInstance as ModalExportLogComponent).errorStatus = error;
	}

	public exportResults() {
		if (this.exportService) {
			let statusExport = ExportLogErrorStatus.LoadingExport;
			let filePath = '';
			const exportModal = this.openExportLogComponentsModal();

			this.timerService.start();
			let result = HardwareScanMetricsService.FAIL_RESULT;
			this.exportService
				.exportScanResults()
				.then((status) => {
					result = HardwareScanMetricsService.SUCCESS_RESULT;
					[statusExport, filePath] = status;
				})
				.catch((error) => {
					this.logger.error('Export Scan Results rejected');
					statusExport = error;
				})
				.finally(() => {
					this.updateExportLogComponentsModal(exportModal, statusExport, filePath);
					this.hardwareScanMetricsService.sendTaskActionMetrics(
						HardwareScanMetricsService.EXPORT_LOG_TASK_NAME,
						result === HardwareScanMetricsService.SUCCESS_RESULT ? 1 : 0,
						'',
						result,
						this.timerService.stop()
					);
				});
		}
	}
}
