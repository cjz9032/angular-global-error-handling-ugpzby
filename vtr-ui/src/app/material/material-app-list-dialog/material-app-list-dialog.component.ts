import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@lenovo/material/dialog';
import { MaxSelected } from '../material-app-tile-list/material-app-tile-list.component';
import { TileItem } from '../material-tile/material-tile.component';

@Component({
	selector: 'vtr-material-app-list-dialog',
	templateUrl: './material-app-list-dialog.component.html',
	styleUrls: ['./material-app-list-dialog.component.scss']
})
export class MaterialAppListDialogComponent implements OnInit {

	@Output() selectEmit = new EventEmitter();

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: TileItem[],
		@Inject(MAT_DIALOG_DATA) public maxSelected: MaxSelected,
	) { }

	ngOnInit(): void {
	}

	select(item: TileItem) {
		this.selectEmit.emit(item);
	}

}
