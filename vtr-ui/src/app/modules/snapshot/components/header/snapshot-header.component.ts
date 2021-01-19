import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@lenovo/material/dialog';
import { SnapshotStatus } from 'src/app/modules/snapshot/enums/snapshot.enum';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { SnapshotComponentsListByType } from '../../models/snapshot.interface';
import { SnapshotService } from '../../services/snapshot.service';
import { ModalSnapshotComponent } from '../modal/modal-snapshot/modal-snapshot.component';

@Component({
	selector: 'vtr-snapshot-header',
	templateUrl: './snapshot-header.component.html',
	styleUrls: ['./snapshot-header.component.scss'],
})
export class SnapshotHeaderComponent implements OnInit {
	public snapshotStatusEnum = SnapshotStatus;
	public snapshotComponentsByType: SnapshotComponentsListByType = {};

	private readonly mapStatusToText: any = {
		[SnapshotStatus.firstLoad]: 'titleNotStarted',
		[SnapshotStatus.individualSnapshotInProgress]: 'titleSnapshotInProgress',
		[SnapshotStatus.fullSnapshotInProgress]: 'titleSnapshotInProgress',
		[SnapshotStatus.snapshotCompleted]: 'titleSnapshotCompleted',
		[SnapshotStatus.baselineInProgress]: 'titleBaselineInProgress',
		[SnapshotStatus.baselineCompleted]: 'titleBaselineCompleted',
		[SnapshotStatus.notStarted]: 'titleNotStarted',
	};

	constructor(
		private snapshotService: SnapshotService,
		private loggerService: LoggerService,
		private dialog: MatDialog
	) {
		this.snapshotComponentsByType = {
			hardwareList: this.snapshotService.getHardwareComponentsList(),
			softwareList: this.snapshotService.getSoftwareComponentsList(),
		};
	}

	ngOnInit() { }

	onTakeSnapshot() {
		this.snapshotService.snapshotStatus = SnapshotStatus.fullSnapshotInProgress;

		const componentSnapshotPromises = [];
		this.snapshotService.getAllComponentsList().forEach((key) => {
			componentSnapshotPromises.push(this.snapshotService.updateSnapshotInfo(key));
		});

		Promise.all(componentSnapshotPromises)
			.then(() => {
				this.loggerService.info('Success on all promises');
			})
			.catch((error) => {
				this.loggerService.error(`Failure requesting snapshot data: ${error}`);
			})
			.finally(() => {
				this.snapshotService.snapshotStatus = SnapshotStatus.snapshotCompleted;
			});
	}

	onReplaceBaseline() {
		const modalRef = this.dialog.open(ModalSnapshotComponent, {
			maxWidth: '50rem',
			autoFocus: true,
			hasBackdrop: true,
			disableClose: true,
			panelClass: 'custom-modal-size',
		});
		modalRef.componentInstance.snapshotComponentsByType = this.snapshotComponentsByType;
		modalRef.componentInstance.passEntry.subscribe((modalResponse: Array<string>) => {
			this.snapshotService.snapshotStatus = SnapshotStatus.baselineInProgress;

			this.snapshotService
				.updateBaselineInfo(modalResponse)
				.then(() => {
					this.loggerService.info('Success on Replace Baseline');
				})
				.catch((error) => {
					this.loggerService.error(`Failure on Replace Baseline: ${error}`);
				})
				.finally(() => {
					this.snapshotService.snapshotStatus = SnapshotStatus.baselineCompleted;
				});
		});
	}

	public getHeaderText() {
		return this.mapStatusToText[this.snapshotService.snapshotStatus];
	}

	public getSnapshotStatus() {
		return this.snapshotService.snapshotStatus;
	}

	public isButtonEnabled() {
		const statesToEnable = [
			SnapshotStatus.notStarted,
			SnapshotStatus.snapshotCompleted,
			SnapshotStatus.baselineCompleted,
		];
		return statesToEnable.includes(this.snapshotService.snapshotStatus);
	}
}
