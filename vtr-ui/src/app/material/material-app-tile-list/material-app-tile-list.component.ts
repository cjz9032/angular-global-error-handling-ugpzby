import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { TileItem } from '../material-tile/material-tile.component';

export interface MaxSelected {
	maxLength: number;
	tooltips?: string;
}

@Component({
	selector: 'vtr-material-app-tile-list',
	templateUrl: './material-app-tile-list.component.html',
	styleUrls: ['./material-app-tile-list.component.scss']
})
export class MaterialAppTileListComponent implements OnInit, AfterViewInit {

	@Input() tileItems: TileItem[];
	@Input() isHorizontal: boolean;
	@Input() removable: boolean;
	@Input() addable: boolean;
	@Input() maxSelected: MaxSelected;
	@Input() isShowAddBtn = true;

	@ViewChild('appTileContainer') appTileContainer: ElementRef;

	@Output() addButtonClick = new EventEmitter();
	@Output() removeTile = new EventEmitter();
	@Output() selectTile = new EventEmitter();

	constructor(
		public elementRef: ElementRef,
		public renderer2: Renderer2
	) { }

	ngOnInit(): void {
		if (this.addable) {
			this.tileItems.forEach(item => {
				if (!item.buttonType) {
					item.buttonType = 'clickable';
				}
			});
		}
	}

	ngAfterViewInit(): void {
		const hasClass = this.elementRef.nativeElement.hasAttribute('class');
		this.renderer2.addClass( // ng class
			this.appTileContainer.nativeElement,
			hasClass ? this.elementRef.nativeElement.getAttribute('class') : ''
		);
	}

	remove(item: TileItem): void {
		const index = this.tileItems.indexOf(item);

		if (index >= 0) {
			this.tileItems.splice(index, 1);
		}
		this.removeTile.emit(item);
	}

	select(item: TileItem): void {
		const index = this.tileItems.indexOf(item);
		if (index >= 0) {
			this.tileItems[index].buttonType = item.buttonType;
			this.selectTile.emit(item);
		}
		if (this.maxSelected?.maxLength >= 0) {
			this.tileItems.forEach(tile => {
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
		tiles.forEach(tile => {
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
