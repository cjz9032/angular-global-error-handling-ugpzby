import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@lenovo/material/dialog';
import { TileItem, MaxSelected } from 'src/app/feature/auto-close/types/auto-close';

@Component({
	selector: 'vtr-material-app-list-dialog',
	templateUrl: './material-app-list-dialog.component.html',
	styleUrls: ['./material-app-list-dialog.component.scss'],
})
export class MaterialAppListDialogComponent {
	@Output() selectedEmit = new EventEmitter();

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: TileItem[],
		@Inject(MAT_DIALOG_DATA) public maxSelected: MaxSelected,
		@Inject(MAT_DIALOG_DATA) public metricsParent: string = 'Device'
	) {}

	select(item: TileItem) {
		this.selectedEmit.emit(item);
	}
}
