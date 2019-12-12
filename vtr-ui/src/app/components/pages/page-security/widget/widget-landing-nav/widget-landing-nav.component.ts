import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-widget-landing-nav',
	templateUrl: './widget-landing-nav.component.html',
	styleUrls: ['./widget-landing-nav.component.scss']
})
export class WidgetLandingNavComponent implements OnInit {
	@Input() baseItems;
	@Input() intermediateItems;
	@Input() advancedItems;
	currentPage = 'base-security';
	featurePagesConfig = [
		{
			title: 'BASIC SECURITY',
			page: 'base-security',
			display: true
		},
		{
			title: 'INTERMEDIATE SECURITY',
			page: 'intermediate-security',
			display: true
		},
		{
			title: 'ADVANCED SECURITY',
			page: 'advanced-security',
			display: true
		},
	];
	constructor() { }

	ngOnInit() {
	}

	changePage(page) {
		this.currentPage = page;
	}

}
