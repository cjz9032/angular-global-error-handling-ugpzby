import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@lenovo/material/dialog';
import {
	ExportLogExtensions,
	ExportLogErrorStatus,
	LogType,
	LanguageCode,
} from 'src/app/enums/export-log.enum';
import { DeviceService } from 'src/app/services/device/device.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { TimerService } from 'src/app/services/timer/timer.service';
import { HardwareScanFinishedHeaderType } from '../../../enums/hardware-scan.enum';
import { ExportResultsService } from '../../../services/export-results.service';
import { HardwareScanMetricsService } from '../../../services/hardware-scan-metrics.service';
import { HardwareScanService } from '../../../services/hardware-scan.service';
import { ModalExportLogComponent } from '../../modal/modal-export-log/modal-export-log.component';

@Component({
	selector: 'vtr-hardware-scan-export-log',
	templateUrl: './hardware-scan-export-log.component.html',
	styleUrls: ['./hardware-scan-export-log.component.scss'],
})
export class HardwareScanExportLogComponent {
	@Input() componentId: string;
	@Input() metricsItem: string;
	@Input() metricsParent: string;
	@Input() metricsParam: string;
	@Input() isDisabled = false;

	public exportExtensions = Object.keys(ExportLogExtensions);
	public isOnExportLog = false;
	private isExportLogFocused = false;
	private isInList = false;

	constructor(
		private exportService: ExportResultsService,
		private timerService: TimerService,
		private hardwareScanMetricsService: HardwareScanMetricsService,
		private logger: LoggerService,
		private dialog: MatDialog,
		private hardwareScanService: HardwareScanService,
		private deviceService: DeviceService
	) {}

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
	public isLastElementFocused(): void {
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

	public getExportIcon(): string {
		if (this.isDisabled) {
			return 'assets/icons/hardware-scan/icon_hardware_export-log_disabled.svg';
		} else {
			return 'assets/icons/hardware-scan/icon_hardware_export-log.svg';
		}
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
				exportLogType = this.exportService.exportLog(LogType.scan);
			} else if (
				this.hardwareScanService.getScanFinishedHeaderType() ===
				HardwareScanFinishedHeaderType.RecoverBadSectors
			) {
				exportLogType = this.exportService.exportLog(LogType.rbs);
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
