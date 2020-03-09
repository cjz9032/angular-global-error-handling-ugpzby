import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
	selector: 'vtr-widget-landing-nav',
	templateUrl: './widget-landing-nav.component.html',
	styleUrls: ['./widget-landing-nav.component.scss']
})
export class WidgetLandingNavComponent implements OnInit, OnChanges {
	@Input() baseItems;
	@Input() intermediateItems;
	@Input() advancedItems;
	@Output() haveOwnChecked = new EventEmitter<any>();
	@Output() retryClick = new EventEmitter<any>();
	currentPage = 'base-security';
	featurePagesConfig = [
		{
			title: 'security.landing.basicSecurity',
			page: 'base-security',
			item: this.baseItems,
			display: true
		},
		{
			title: 'security.landing.intermediateSecurity',
			page: 'intermediate-security',
			item: this.intermediateItems,
			display: true
		},
		{
			title: 'security.landing.advancedSecurity',
			page: 'advanced-security',
			item: this.advancedItems,
			display: true
		},
	];
	constructor() { }

	ngOnInit() {
	}

	ngOnChanges(): void {
		this.featurePagesConfig[0].item = this.baseItems;
		this.featurePagesConfig[1].item = this.intermediateItems;
		this.featurePagesConfig[2].item = this.advancedItems;
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
