import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TileItem } from 'src/app/feature/auto-close/types/auto-close';

@Component({
	selector: 'vtr-material-tile',
	templateUrl: './material-tile.component.html',
	styleUrls: ['./material-tile.component.scss'],
})
export class MaterialTileComponent implements OnInit {
	@Input() tileItem: TileItem;
	@Input() isHorizontal: boolean;
	@Input() removable: boolean;
	@Input() addable: boolean;
	@Input() metricsParent: string;

	@Output() removed = new EventEmitter();
	@Output() selected = new EventEmitter();

	public metricsItem = 'selected app';

	ngOnInit(): void {
		if (this.addable) {
			if (!this.tileItem.buttonType) {
				this.tileItem.buttonType = 'clickable';
			}
		}
	}

	remove(item: TileItem): void {
		this.removed.emit(item);
	}

	select(item: TileItem): void {
		const itemButtonType = item.buttonType;
		this.tileItem.buttonType = itemButtonType === 'selected' ? 'clickable' : 'selected';
		this.metricsItem =
			itemButtonType === 'selected' ? `${item.name} unselected` : `${item.name} selected`;
		this.selected.emit();
	}
}
