import { Component, OnInit, Input } from '@angular/core';
import { DeviceService } from 'src/app/services/device/device.service';
import { BaseComponent } from '../../base/base.component';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'vtr-ui-list-chevron',
	templateUrl: './ui-list-chevron.component.html',
	styleUrls: ['./ui-list-chevron.component.scss']
})

export class UiListChevronComponent extends BaseComponent implements OnInit {

	@Input() items: any;
	@Input() iconPlacement = 'right';
	@Input() chevronVisibility = true;
	@Input() arrowColor: string;
	/**** passing to ItemParent from metrics ****/
	@Input() metricsParent: string;
	@Input() clickable = true;
	@Input() metricsEvent: string;
	@Input() blockPosition: string;
	@Input() linkId: string;
	/** object having item class list*/
	itemStatusClass = {
		0: 'good',
		1: 'bad',
		2: 'blue',
		3: 'orange',
		4: 'text-dark',
		5: 'black',
		6: 'text-blue',
		7: 'text-gray'
	};

	/**
	 * object having item status icon list
	 */
	itemStatusIconClass = {
		0: 'check',
		1: 'times',
		2: 'circle',
		3: 'minus',
		5: 'circle',
		6: 'circle'
	};

	constructor(private deviceService: DeviceService, public router: Router) { super(); }


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
		return itemDetailClass;
	}

	ngOnInit() {
	}

	/**
	 * launchSystemUri
	 * path: string
	 */
	public launchSystemUri(path: string) {
		if (path) {
			this.deviceService.launchUri(path);
		}
	}

	retry(item, e) {
		item.retryText = undefined;
		item.retry();
		e.stopPropagation();
		e.preventDefault();
		return false;
	}
}
