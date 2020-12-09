import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'vtr-ui-snapshot-list-info',
	templateUrl: './ui-snapshot-list-info.component.html',
	styleUrls: ['./ui-snapshot-list-info.component.scss']
})
export class UiSnapshotListInfoComponent {
	@Input() componentId: string;
	@Input() snapshotInfo: any;

	@Output() selectAny: EventEmitter<any> = new EventEmitter();

	constructor() { }

	public onSelectAll() {
		this.snapshotInfo.forEach((item) => {
			item.selected = true;
			item.indeterminate = false;
			item.components.forEach((component) => (component.selected = true));
		});
		this.selectAny.emit();
	}

	public onDeselectAll() {
		this.snapshotInfo.forEach((item) => {
			item.selected = false;
			item.indeterminate = false;
			item.components.forEach((component) => (component.selected = false));
		});
	}

	public onDeviceSelectionClicked(item, isChecked) {
		// Toggle the item state base on the user click event
		item.components.forEach((component) => (component.selected = isChecked));
		item.indeterminate = false;
		item.selected = isChecked;

		this.selectAny.emit();
	}

	public onCheckChildren(item) {
		// Change the item state based on the quantity of selected tests
		const numberOfTests = item.components.length;
		const numberOfSelectedTests = item.components.filter(x => x.selected).length;

		if (numberOfSelectedTests === 0) {
			item.selected = false;
			item.indeterminate = false;
		} else if (numberOfTests > numberOfSelectedTests) {
			item.selected = false;
			item.indeterminate = true;
		} else {
			item.selected = true;
			item.indeterminate = false;
		}

		this.selectAny.emit();
	}
}
