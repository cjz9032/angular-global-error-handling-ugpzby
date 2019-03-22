import { Component, OnInit, Input } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
	selector: 'vtr-ui-list-chevron',
	templateUrl: './ui-list-chevron.component.html',
	styleUrls: ['./ui-list-chevron.component.scss']
})

export class UiListChevronComponent implements OnInit {

	@Input() items: any[];
	@Input() iconPlacement = 'right';
	@Input() chevronVisibility = true;
	/**** passing to ItemParent from metrics ****/
	@Input() metricsParent: string;

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

	constructor(private deviceService: DeviceService) { }


	getItemStatusClass(item) {
		// console.log('getItemStatusClass method invoked');
		let itemStatClass = 'good';
		if (item.status !== undefined && item.status !== '') {
			// console.log('status not undefined or empty');
			if (this.itemStatusClass.hasOwnProperty(item.status)) {
				itemStatClass = this.itemStatusClass[item.status];
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
		// By Default Details are uppercase , lower case when it system status
		if (item.type === undefined) {
			itemDetailClass['text - uppercase'] = true;
		} else if (item.type !== undefined) {
			if (item.type === 'system') {
				itemDetailClass['text - lowercase'] = true;
			} else if (item.type === 'security') {
				itemDetailClass['security text - uppercase ' + this.getItemStatusClass(item)] = true;
			}

		}
		// console.log(" itemDetailClass " + JSON.stringify(itemDetailClass));
		return itemDetailClass;
	}

	ngOnInit() {
	}

	/**
	 * launchSystemUri
	path: string */
	public launchSystemUri(path: string) {
		if (path) {
			this.deviceService.launchUri(path);
		}
	}
}
