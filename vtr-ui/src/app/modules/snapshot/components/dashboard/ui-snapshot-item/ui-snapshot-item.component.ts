import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
	SnapshotHardwareComponents,
	SnapshotSoftwareComponents,
	SnapshotComponentStatus,
	SnapshotStatus,
} from 'src/app/modules/snapshot/enums/snapshot.enum';
import { Subscription } from 'rxjs';
import { SnapshotService } from '../../../services/snapshot.service';

@Component({
	selector: 'vtr-ui-snapshot-item',
	templateUrl: './ui-snapshot-item.component.html',
	styleUrls: ['./ui-snapshot-item.component.scss'],
})
export class UiSnapshotItemComponent implements OnInit, OnDestroy {
	@Input() name: string;
	@Input() component: any;
	@Input() i: number;
	@Input() last: number;

	public detailsExpanded: boolean;

	public itemsAttributes = new Array();
	public snapshotStatus: any;

	constructor(private snapshotService: SnapshotService) {}

	ngOnInit(): void {
		this.itemsAttributes = new Array();
		this.snapshotStatus = SnapshotComponentStatus;
		this.detailsExpanded = false;
	}

	ngOnDestroy() {}

	public getModuleIcon(module: string): string {
		if (
			SnapshotHardwareComponents[SnapshotHardwareComponents[module]] === '' &&
			SnapshotSoftwareComponents[SnapshotSoftwareComponents[module]] === ''
		) {
			return '';
		}
		return 'assets/icons/snapshot/icon_' + module.toLowerCase() + '.svg';
	}

	public async updateSnapshot() {
		this.snapshotService.snapshotStatus = SnapshotStatus.individualSnapshotInProgress;
		await this.snapshotService.updateSnapshotInfo(this.name);
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
