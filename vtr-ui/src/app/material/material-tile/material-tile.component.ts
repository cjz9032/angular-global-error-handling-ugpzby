import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export type AddibleType = 'clickable' | 'selected' | 'disabled';

export interface TileItem {
	iconSrc?: string;
	matIcon?: string;
	name: string;
	buttonType?: AddibleType;
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
	@Input() addible: boolean;

	@Output() tileRemove = new EventEmitter();
	@Output() tileSelect = new EventEmitter();

	ngOnInit(): void {
		if (this.addible) {
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
