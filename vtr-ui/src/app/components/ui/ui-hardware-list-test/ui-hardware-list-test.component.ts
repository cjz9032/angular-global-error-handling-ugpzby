import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vtr-ui-hardware-list-test',
	templateUrl: './ui-hardware-list-test.component.html',
	styleUrls: ['./ui-hardware-list-test.component.scss']
})
export class UiHardwareListTestComponent implements OnInit {
	@Input() items: any[];
	@Output() selectAny: EventEmitter<any> = new EventEmitter();

	constructor(private translate: TranslateService) { }

	select = this.translate.instant('hardwareScan.select');
	deselect = this.translate.instant('hardwareScan.deselect');
	allOptions = this.translate.instant('hardwareScan.allOptions');

	ngOnInit() {
	}

	public onSelectAll() {
		this.items.forEach(item => {
			item.selected = true;
			item.indeterminate = false;
			item.tests.forEach(test => test.selected = true);
		});
		this.selectAny.emit();
	}

	public onDeselectAll() {
		this.items.forEach(item => {
			item.selected = false;
			item.indeterminate = false;
			item.tests.forEach(test => test.selected = false);
		});
	}

	public onClick(itemId, event) {
		const clickedItem = this.items.find(item => item.id === itemId)

		// Toggle the clickedItem state base on the user click event
		clickedItem.tests.forEach(test => test.selected = event);
		clickedItem.indeterminate = false;
		clickedItem.selected = event;

		this.selectAny.emit();
	}

	public onCheckChildren(itemId: any) {
		const parentItem = this.items.find(item => item.id === itemId)

		// Change the parentItem state based on the quantity of selected tests
		const numberOfTests = parentItem.tests.length;
		const numberOfSelectedTests = parentItem.tests.filter(test => test.selected).length;

		if (numberOfSelectedTests === 0) {
			parentItem.selected = false;
			parentItem.indeterminate = false;
		} else if (numberOfTests > numberOfSelectedTests) {
			parentItem.selected = false;
			parentItem.indeterminate = true;
		} else {
			parentItem.selected = true;
			parentItem.indeterminate = false;
		}

		this.selectAny.emit();
	}
}
