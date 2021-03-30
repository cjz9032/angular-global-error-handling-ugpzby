import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@lenovo/material/dialog';
import { DeviceService } from 'src/app/services/device/device.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { TimerService } from 'src/app/services/timer/timer.service';
import { ExportLogErrorStatus, ExportLogExtensions } from '../../enums/snapshot.enum';
import { ModalExportLogComponent } from '../../components/modal/modal-export-log/modal-export-log.component';
import { ExportSnapshotResultsService } from '../../services/export-snapshot-results.service';

@Component({
	selector: 'vtr-snapshot-export-log',
	templateUrl: './snapshot-export-log.component.html',
	styleUrls: ['./snapshot-export-log.component.scss'],
})
export class SnapshotExportLogComponent implements OnInit {
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
		private deviceService: DeviceService,
		private exportService: ExportSnapshotResultsService,
		private timerService: TimerService,
		private logger: LoggerService,
		private dialog: MatDialog
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
				this.logger.exception('[SnapshotExportLogComponent] isPdfAvailable', error);
			});
	}

	public getExportIcon(): string {
		if (this.isDisabled) {
			return 'assets/icons/snapshot/disabled/icon_snapshot_export-log_disabled.svg';
		} else {
			return 'assets/icons/snapshot/icon_snapshot_export-log.svg';
		}
	}

	private exportResults() {
		if (this.exportService) {
			let statusExport;
			let filePath;

			const exportModal = this.openExportLogComponentsModal();

			this.timerService.start();
			let result = ExportSnapshotResultsService.METRICS_FAIL_RESULT;
			this.exportService
				.exportSnapshotResults()
				.then((status) => {
					result = ExportSnapshotResultsService.METRICS_SUCCESS_RESULT;
					[statusExport, filePath] = status;
				})
				.catch((error) => {
					this.logger.exception(
						'[SnapshotExportLogComponent] Export Scan Results rejected',
						error
					);
					statusExport = error;
				})
				.finally(() => {
					this.updateExportLogComponentsModal(exportModal, statusExport, filePath);
					this.exportService.sendTaskActionMetrics(
						result === ExportSnapshotResultsService.METRICS_SUCCESS_RESULT ? 1 : 0,
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
