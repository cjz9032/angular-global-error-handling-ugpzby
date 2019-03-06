import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-list-chevron',
	templateUrl: './ui-list-chevron.component.html',
	styleUrls: ['./ui-list-chevron.component.scss']
})

export class UiListChevronComponent implements OnInit {

	@Input() items: any[];
	@Input() iconPlacement: string = 'right';

	/** object having item class list*/
	itemStatusClass = {
		0: 'good',
		1: 'bad',
		2: 'blue'
	};

	/** object having item status icon list*/
	itemStatusIconClass = {
		0: 'check',
		1: 'times',
		2: 'circle'
	};

	constructor() { }

	ngOnInit() {
	}

	getItemStatusClass(item) {
		// console.log('getItemStatusClass method invoked');
		let itemStatClass = 'good';
		if (item.status !== undefined && item.status !== '') {
			// console.log('status not undefined or empty');
			if (this.itemStatusClass.hasOwnProperty(item.status)) {
				itemStatClass = this.itemStatusClass[item.status];
				// console.log('itemStatClass ' + itemStatClass);
			}
		}
		return itemStatClass;
	}


	getItemStatusIconClass(item) {
		// console.log('getItemStatusIconClass method invoked');
		let itemStatIconClass = 'good';
		if (item.status !== undefined && item.status !== '') {
			// console.log('status not undefined or empty');
			if (this.itemStatusIconClass.hasOwnProperty(item.status)) {
				itemStatIconClass = this.itemStatusIconClass[item.status];
				// console.log('itemStatusIconClass ' + itemStatIconClass);
			}
		}
		return itemStatIconClass;
	}

	getItemDetailClasses(item) {
		const itemDetailClass = {};

		if (item.asLink !== undefined && item.asLink) {
			itemDetailClass['highlight'] = true;
		}
		if (item.type !== undefined) {
			itemDetailClass['security ' + this.getItemStatusClass(item)] = true;
		}

		return itemDetailClass;

	}

}
