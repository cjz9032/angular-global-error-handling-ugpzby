import {	Component,	OnInit,	Input } from '@angular/core';

@Component({
	selector: 'vtr-ui-object-title',
	templateUrl: './ui-object-title.component.html',
	styleUrls: ['./ui-object-title.component.scss']
})
export class UiObjectTitleComponent implements OnInit {
	@Input() objects: any[];

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
		if (item.subjectStatus !== undefined && item.subjectStatus !== '') {
			if (this.itemStatusClass.hasOwnProperty(item.subjectStatus)) {
				itemStatClass = this.itemStatusClass[item.subjectStatus];
			}
		}
		return itemStatClass;
	}

	getItemStatusIconClass(item) {
		let itemStatIconClass = 'good';
		if (item.subjectStatus !== undefined && item.subjectStatus !== '') {
			if (this.itemStatusIconClass.hasOwnProperty(item.subjectStatus)) {
				itemStatIconClass = this.itemStatusIconClass[item.subjectStatus];
				// console.log('itemStatusIconClass ' + itemStatIconClass);
			}
		}
		return itemStatIconClass;
	}

	getItemDetailClasses(item) {
		const itemDetailClass = {};
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
