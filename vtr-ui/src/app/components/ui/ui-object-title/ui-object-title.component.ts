import {	Component,	OnInit,	Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-object-title',
	templateUrl: './ui-object-title.component.html',
	styleUrls: ['./ui-object-title.component.scss']
})
export class UiObjectTitleComponent implements OnInit {
	@Input() objects: any;

	itemStatusClass = {
		0: 'good',
		1: 'bad',
		2: 'blue',
		3: 'orange',
	};

	itemStatusIconClass = {
		0: 'check-circle', // green
		1: 'minus-circle', // red
		2: 'dot-circle', // blue
		3: 'minus-circle' // orange
	};
	constructor() {}

	getItemStatusClass(item) {
		let itemStatClass = 'good';
		if (item.status !== undefined && item.status !== '') {
			if (this.itemStatusClass.hasOwnProperty(item.status)) {
				itemStatClass = this.itemStatusClass[item.status];
			}
		}
		return itemStatClass;
	}

	getItemStatusIconClass(item) {
		let itemStatIconClass = 'good';
		if (item.status !== undefined && item.status !== '') {
			if (this.itemStatusIconClass.hasOwnProperty(item.status)) {
				itemStatIconClass = this.itemStatusIconClass[item.status];
				// console.log('itemStatusIconClass ' + itemStatIconClass);
			}
		}
		return itemStatIconClass;
	}

	getItemDetailClasses(item) {
		const itemDetailClass = {};
		// console.log(item);
		if (item.type === undefined) {
			itemDetailClass['text - uppercase'] = true;
		} else if (item.type !== undefined) {
			if (item.type === 'system') {
				itemDetailClass['text - lowercase'] = true;
			} else if (item.type === 'security') {
				itemDetailClass['security text - uppercase ' + this.getItemStatusClass(item)] = true;
			}

		}
		return itemDetailClass;
	}
	ngOnInit() {}

}
