import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnInit,
	Output,
	Renderer2,
	ViewChild,
} from '@angular/core';
import { TileItem, MaxSelected } from 'src/app/feature/types/auto-close';

@Component({
	selector: 'vtr-material-app-tile-list',
	templateUrl: './material-app-tile-list.component.html',
	styleUrls: ['./material-app-tile-list.component.scss'],
})
export class MaterialAppTileListComponent implements OnInit {
	@Input() tileItems: TileItem[];
	@Input() isHorizontal: boolean;
	@Input() removable: boolean;
	@Input() addable: boolean;
	@Input() maxSelected: MaxSelected;
	@Input() isShowAddBtn = true;
	@Input() metricsParent: string;

	@ViewChild('appTileContainer') appTileContainer: ElementRef;

	@Output() addButtonClick = new EventEmitter();
	@Output() removed = new EventEmitter();
	@Output() selected = new EventEmitter();

	constructor(public elementRef: ElementRef, public renderer2: Renderer2) {}

	ngOnInit(): void {
		if (this.addable) {
			this.tileItems.forEach((item) => {
				if (!item.buttonType) {
					item.buttonType = 'clickable';
				}
			});
		}
	}

	remove(item: TileItem): void {
		this.removed.emit(item);
	}

	select(item: TileItem): void {
		const index = this.tileItems.indexOf(item);
		if (index >= 0) {
			this.tileItems[index].buttonType = item.buttonType;
			this.selected.emit(item);
		}
		if (this.maxSelected?.maxLength >= 0) {
			this.tileItems.forEach((tile) => {
				if (tile.buttonType !== 'selected') {
					if (this.isDisabledAddButton(this.tileItems)) {
						tile.buttonType = 'disabled';
						tile.tooltip = this.maxSelected.tooltips;
					} else {
						tile.buttonType = 'clickable';
					}
				}
			});
		}
	}

	isDisabledAddButton(tiles: TileItem[]): boolean {
		let disabled: boolean;
		let i = 0;
		tiles.forEach((tile) => {
			if (tile.buttonType === 'selected') {
				i++;
				if (i >= this.maxSelected.maxLength) {
					disabled = true;
					return disabled;
				}
			}
		});
		return disabled;
	}

	clickAdd(): void {
		this.addButtonClick.emit();
	}
}
