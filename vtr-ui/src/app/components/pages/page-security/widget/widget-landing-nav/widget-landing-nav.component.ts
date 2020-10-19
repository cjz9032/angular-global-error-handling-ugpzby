import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'vtr-widget-landing-nav',
	templateUrl: './widget-landing-nav.component.html',
	styleUrls: ['./widget-landing-nav.component.scss']
})
export class WidgetLandingNavComponent implements OnInit {
	@Output() haveOwnChecked = new EventEmitter<any>();
	@Output() retryClick = new EventEmitter<any>();
	@Input() currentPage = 'basic';
	featurePagesConfig = [
		{
			title: 'security.landing.basicSecurity',
			page: 'basic',
			item: this.baseItems
		},
		{
			title: 'security.landing.intermediateSecurity',
			page: 'intermediate',
			item: this.intermediateItems
		},
		{
			title: 'security.landing.advancedSecurity',
			page: 'advanced',
			item: this.advancedItems
		},
	];
	private _baseItems;
	private _intermediateItems;
	private _advancedItems;

	constructor() { }

	ngOnInit() {
	}

	@Input() set baseItems(itemValue: any) {
		if (itemValue) {
			this.featurePagesConfig[0].item = itemValue;
			this._baseItems = itemValue;
		}
	}

	get baseItems() {
		return this._baseItems;
	}

	@Input() set intermediateItems(itemValue: any) {
		if (itemValue) {
			this.featurePagesConfig[1].item = itemValue;
			this._intermediateItems = itemValue;
		}
	}

	get intermediateItems() {
		return this._intermediateItems;
	}

	@Input() set advancedItems(itemValue: any) {
		if (itemValue) {
			this.featurePagesConfig[2].item = itemValue;
			this._advancedItems = itemValue;
		}
	}

	get advancedItems() {
		return this._advancedItems;
	}

	changePage(page) {
		this.currentPage = page;
	}

	haveOwn(checkedList) {
		this.haveOwnChecked.emit(checkedList);
	}

	retry(id) {
		this.retryClick.emit(id);
	}

}
