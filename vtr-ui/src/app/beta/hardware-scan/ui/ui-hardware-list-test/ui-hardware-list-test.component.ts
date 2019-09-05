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
		this.items.map(item => {
			item.selected = true;
			item.indeterminate = false;
			item.tests.map(test => test.selected = true);
		});
		this.selectAny.emit();
	}

	public onDeselectAll() {
		this.items.map(item => {
			item.selected = false;
			item.indeterminate = false;
			item.tests.map(test => test.selected = false);
		});
	}

	public onSelectAllChildren(itemId: any) {
		const isSelected = this.items.find(item => item.id === itemId).selected;
		this.items.find(item => item.id === itemId).tests.map(test => test.selected = isSelected);
		this.items.find(item => item.id === itemId).indeterminate = false;
		this.selectAny.emit();
	}

	public onCheckChildren(itemId: any) {
		const children = this.items.find(item => item.id === itemId).tests.length;
		const childrenSelected = this.items.find(item => item.id === itemId).tests.filter(test => test.selected).length;

		if (childrenSelected === 0) {
			this.items.find(item => item.id === itemId).selected = false;
			this.items.find(item => item.id === itemId).indeterminate = false;
		} else if (children > childrenSelected) {
			this.items.find(item => item.id === itemId).selected = false;
			this.items.find(item => item.id === itemId).indeterminate = true;
		} else {
			this.items.find(item => item.id === itemId).selected = true;
			this.items.find(item => item.id === itemId).indeterminate = false;
		}

		this.selectAny.emit();
	}
}
