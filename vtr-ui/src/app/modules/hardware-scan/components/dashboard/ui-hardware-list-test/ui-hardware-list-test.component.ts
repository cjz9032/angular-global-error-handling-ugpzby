import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'vtr-ui-hardware-list-test',
	templateUrl: './ui-hardware-list-test.component.html',
	styleUrls: ['./ui-hardware-list-test.component.scss'],
})
export class UiHardwareListTestComponent {
	@Input() componentId: string;
	@Input() items: any[];
	@Output() selectAny: EventEmitter<any> = new EventEmitter();

	constructor() {}

	public onSelectAll() {
		this.items.forEach((item) => {
			item.selected = true;
			item.indeterminate = false;
			item.tests.forEach((test) => (test.selected = true));
		});
		this.selectAny.emit();
	}

	public onDeselectAll() {
		this.items.forEach((item) => {
			item.selected = false;
			item.indeterminate = false;
			item.tests.forEach((test) => (test.selected = false));
		});
	}

	public onDeviceSelectionClicked(item, isChecked) {
		// Toggle the item state base on the user click event
		item.tests.forEach((test) => (test.selected = isChecked));
		item.indeterminate = false;
		item.selected = isChecked;

		this.selectAny.emit();
	}

	public onCheckChildren(item) {
		// Change the item state based on the quantity of selected tests
		const numberOfTests = item.tests.length;
		const numberOfSelectedTests = item.tests.filter((test) => test.selected).length;

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
