import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type AddableType = 'clickable' | 'selected' | 'disabled';

export interface TileItem {
	path: string;
	name: string;
	iconSrc?: string;
	matIcon?: string;
	buttonType?: AddableType;
	tooltip?: string;
}

@Component({
	selector: 'vtr-material-tile',
	templateUrl: './material-tile.component.html',
	styleUrls: ['./material-tile.component.scss']
})
export class MaterialTileComponent implements OnInit {
	@Input() tileItem: TileItem;
	@Input() isHorizontal: boolean;
	@Input() removable: boolean;
	@Input() addable: boolean;

	@Output() tileRemove = new EventEmitter();
	@Output() tileSelect = new EventEmitter();

	ngOnInit(): void {
		if (this.addable) {
			if (!this.tileItem.buttonType) {
				this.tileItem.buttonType = 'clickable';
			}
		}
	}

	remove(item: TileItem): void {
		this.tileRemove.emit(item);
	}

	select(item: TileItem): void {
		const itemButtonType = item.buttonType;
		this.tileItem.buttonType = itemButtonType === 'selected' ? 'clickable' : 'selected';
		this.tileSelect.emit();
	}

}
