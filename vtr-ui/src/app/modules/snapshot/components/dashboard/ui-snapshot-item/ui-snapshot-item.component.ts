import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
	SnapshotHardwareComponents,
	SnapshotSoftwareComponents,
	SnapshotComponentStatus,
	SnapshotStatus,
} from 'src/app/modules/snapshot/enums/snapshot.enum';
import { FormatLocaleDateTimePipe } from 'src/app/pipe/format-locale-datetime/format-locale-datetime.pipe';
import { SnapshotService } from '../../../services/snapshot.service';

@Component({
	selector: 'vtr-ui-snapshot-item',
	templateUrl: './ui-snapshot-item.component.html',
	styleUrls: ['./ui-snapshot-item.component.scss'],
})
export class UiSnapshotItemComponent implements OnInit, OnDestroy {
	@Input() name: string;
	@Input() component: any;
	@Input() componentIndex: number;
	@Input() isLastElement: boolean;

	public detailsExpanded: boolean;

	public array = Array;
	public itemsAttributes = new Array();
	public snapshotStatus: any;
	public baselineDate: Date;
	public lastSnapshotDate: Date;

	constructor(private snapshotService: SnapshotService,
				private formatDateTime: FormatLocaleDateTimePipe) {}

	ngOnInit(): void {
		this.itemsAttributes = new Array();
		this.snapshotStatus = SnapshotComponentStatus;
		this.detailsExpanded = false;
		this.convertBaselineAndLastSnapshotDate();
	}

	ngOnDestroy() {}

	public convertBaselineAndLastSnapshotDate() {
		const utcBaselineDate = new Date(this.component.info.BaselineDate + ' UTC');
		const utcLastSnapshotDate = new Date(this.component.info.LastSnapshotDate + ' UTC');
		this.baselineDate = this.formatDateTime.transform(utcBaselineDate);
		this.lastSnapshotDate = this.formatDateTime.transform(utcLastSnapshotDate);
	}

	public getModuleIcon(module: string): string {
		if (
			SnapshotHardwareComponents[SnapshotHardwareComponents[module]] === undefined &&
			SnapshotSoftwareComponents[SnapshotSoftwareComponents[module]] === undefined
		) {
			return '';
		}

		if (this.component.info.Items.length <= 0) {
			return 'assets/icons/snapshot/disabled/icon_' + module.toLowerCase() + '_disabled.svg';
		}
		return 'assets/icons/snapshot/icon_' + module.toLowerCase() + '.svg';
	}

	public async updateSnapshot() {
		this.snapshotService.snapshotStatus = SnapshotStatus.individualSnapshotInProgress;
		await this.snapshotService.updateSnapshotInfo(this.name);
		this.convertBaselineAndLastSnapshotDate();
		if (!this.snapshotService.anyIndividualSnapshotInProgress()) {
			this.snapshotService.snapshotStatus = SnapshotStatus.snapshotCompleted;
		}
	}

	public isUpdateEnabled() {
		const statesToEnable = [
			SnapshotStatus.notStarted,
			SnapshotStatus.snapshotCompleted,
			SnapshotStatus.baselineCompleted,
			SnapshotStatus.individualSnapshotInProgress,
		];
		return statesToEnable.includes(this.snapshotService.snapshotStatus);
	}
}
