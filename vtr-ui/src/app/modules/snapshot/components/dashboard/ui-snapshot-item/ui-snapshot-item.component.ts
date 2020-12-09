import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
	SnapshotHardwareComponents,
	SnapshotSoftwareComponents,
	SnapshotComponentStatus,
} from 'src/app/modules/snapshot/enums/snapshot.enum';
import { Subscription } from 'rxjs';

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

	private notificationSubscription: Subscription;

	constructor() {}

	ngOnInit(): void {
		this.itemsAttributes = new Array();
		this.snapshotStatus = SnapshotComponentStatus;
		this.detailsExpanded = false;
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	public getModuleIcon(module: string): string {
		if (
			SnapshotHardwareComponents[SnapshotHardwareComponents[module]] === '' &&
			SnapshotSoftwareComponents[SnapshotSoftwareComponents[module]] === ''
		) {
			return '';
		}
		return 'assets/icons/snapshot/icon_' + module.toLowerCase() + '.svg';
	}
}
