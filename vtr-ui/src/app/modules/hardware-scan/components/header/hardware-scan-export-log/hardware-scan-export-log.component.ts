import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@lenovo/material/dialog';
import { DeviceService } from 'src/app/services/device/device.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { TimerService } from 'src/app/services/timer/timer.service';
import {
	ExportLogErrorStatus,
	ExportLogExtensions,
	HardwareScanFinishedHeaderType,
} from '../../../enums/hardware-scan.enum';
import { ExportResultsService } from '../../../services/export-results.service';
import { HardwareScanMetricsService } from '../../../services/hardware-scan-metrics.service';
import { HardwareScanService } from '../../../services/hardware-scan.service';
import { ModalExportLogComponent } from '../../modal/modal-export-log/modal-export-log.component';

@Component({
	selector: 'vtr-hardware-scan-export-log',
	templateUrl: './hardware-scan-export-log.component.html',
	styleUrls: ['./hardware-scan-export-log.component.scss'],
})
export class HardwareScanExportLogComponent implements OnInit {
	@Input() componentId: string;
	@Input() metricsItem: string;
	@Input() metricsParent: string;
	@Input() metricsParam: string;
	@Input() isDisabled;

	public exportExtensions = Object.keys(ExportLogExtensions);
	public isOnExportLog = false;
	private isExportLogFocused = false;
	private isInList = false;

	constructor(
		private deviceService: DeviceService,
		private exportService: ExportResultsService,
		private timerService: TimerService,
		private hardwareScanMetricsService: HardwareScanMetricsService,
		private logger: LoggerService,
		private dialog: MatDialog,
		private hardwareScanService: HardwareScanService
	) {}

	ngOnInit() {
		this.isPdfAvailable();
	}

	// Necessary to control navigation through tab key
	public onExportClick(): void {
		this.isExportLogFocused = true;
		this.exportButtonSelected();
	}

	// Necessary to control navigation through tab key
	public onExportClickDismissed() {
		this.isExportLogFocused = false;
		this.exportButtonDismissed();
	}

	// Necessary to control navigation through tab key
	public isInExtensionList(): void {
		this.isInList = true;
	}

	// Necessary to control navigation through tab key
	public isLastElementFocused(index: number): void {
		this.isInList = false;

		// Timeout to check if the next element is inside list
		setTimeout(() => {
			// This validation is to control if tab navigation is inside list
			if (!this.isInList) {
				this.onExportClickDismissed();
			}
		}, 10);
	}

	public exportButtonSelected(): void {
		// Timeout used to avoid mouse flick that lets card open involuntarily
		setTimeout(() => {
			this.isOnExportLog = true;
		}, 50);
	}

	public exportButtonDismissed(): void {
		// Timeout used to avoid mouse flick that lets card open involuntarily
		setTimeout(() => {
			if (!this.isExportLogFocused || !this.isInList) {
				this.isOnExportLog = false;
			}
		}, 50);
	}

	public exportLog(extension: string) {
		this.exportService.setExportExtensionSelected(ExportLogExtensions[extension]);

		this.exportResults();
	}

	private isPdfAvailable() {
		const supportedLanguage = 'en';

		this.deviceService
			.getMachineInfo()
			.then((value: any) => {
				if (value.locale !== supportedLanguage) {
					this.exportExtensions.splice(
						this.exportExtensions.indexOf(ExportLogExtensions.pdf),
						1
					);
				}
			})
			.catch((error) => {
				this.logger.exception('[ExportLogComponent] isPdfAvailable', error);
			});
	}

	private exportResults() {
		if (this.exportService) {
			let exportLogType: Promise<[ExportLogErrorStatus, string]>;
			let statusExport = ExportLogErrorStatus.LoadingExport;
			let filePath = '';
			const exportModal = this.openExportLogComponentsModal();

			if (
				this.hardwareScanService.getScanFinishedHeaderType() ===
					HardwareScanFinishedHeaderType.Scan ||
				this.hardwareScanService.getScanFinishedHeaderType() ===
					HardwareScanFinishedHeaderType.ViewResults
			) {
				exportLogType = this.exportService.exportScanResults();
			} else if (
				this.hardwareScanService.getScanFinishedHeaderType() ===
				HardwareScanFinishedHeaderType.RecoverBadSectors
			) {
				exportLogType = this.exportService.exportRbsResults();
			}

			this.timerService.start();
			let result = HardwareScanMetricsService.FAIL_RESULT;
			exportLogType
				.then((status) => {
					result = HardwareScanMetricsService.SUCCESS_RESULT;
					[statusExport, filePath] = status;
				})
				.catch((error) => {
					this.logger.exception(
						'[ExportLogComponent] Export Scan Results rejected',
						error
					);
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

	private openExportLogComponentsModal(): MatDialogRef<ModalExportLogComponent> {
		const modal = this.dialog.open(ModalExportLogComponent, {
			autoFocus: true,
			hasBackdrop: true,
			disableClose: true,
			panelClass: 'hardware-scan-modal-size',
		});

		this.updateExportLogComponentsModal(modal);

		return modal;
	}

	private updateExportLogComponentsModal(
		modal: MatDialogRef<ModalExportLogComponent>,
		error: ExportLogErrorStatus = ExportLogErrorStatus.LoadingExport,
		logPath: string = ''
	) {
		(modal.componentInstance as ModalExportLogComponent).logPath = logPath;
		(modal.componentInstance as ModalExportLogComponent).errorStatus = error;
	}
}
