import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'vtr-material-picker',
	templateUrl: './material-picker.component.html',
	styleUrls: ['./material-picker.component.scss'],
})
export class MaterialPickerComponent implements OnInit {
	@Input() id: string;
	@Input() disabled = false;
	@Input() panelOpen = false;
	@Input() title: string;
	@Input() selectedValue: any;
	@Input() optionValue: any[];
	@Input() maxItemShow = 10;
	@Input() metricsItemName: string;
	@Input() metricsEvent = 'FeatureClick';

	@Output() selectionChange = new EventEmitter();
	@Output() isOpened = new EventEmitter<boolean>();

	maxHeight: number;
	private fontSize = 12;
	private lineHeight = 1.5;
	private margin = 10;
	private allItemsHeight: number;

	ngOnInit(): void {
		this.allItemsHeight =
			(this.fontSize * this.lineHeight + this.margin) * this.optionValue.length;
	}

	toggle() {
		if (this.canToggle()) {
			this.panelOpen = !this.panelOpen;
			this.isOpened.emit(this.panelOpen);
		}
	}

	close(id: string) {
		if (this.panelOpen) {
			this.panelOpen = false;
			if (!this.panelOpen) {
				const select = document.querySelector(`#select-${id}`) as HTMLElement;
				select.focus();
			}
		}
	}

	canToggle() {
		return !this.disabled && this.optionValue?.length > 0;
	}

	selected(value: any, id: string) {
		this.close(id);
		this.selectionChange.emit({
			value,
		});
	}

	scrollPosition() {
		const itemHeight = this.fontSize * this.lineHeight + this.margin;
		if (!this.maxHeight) {
			this.maxHeight = Number(itemHeight) * this.maxItemShow;
		}
		if (this.allItemsHeight > this.maxHeight) {
			const activeOffsetHeight =
				(this.getActiveItemIndex() - this.maxItemShow / 2) * itemHeight;
			document.getElementById('panel').scrollTop = activeOffsetHeight;
		}
	}

	getActiveItemIndex(): number {
		let index = 0;
		this.optionValue.map((option, i) => {
			if (this.selectedValue === option) {
				index = i;
			}
		});
		return index;
	}
}
