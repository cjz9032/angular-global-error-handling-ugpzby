import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'vtr-menu-header',
	templateUrl: './menu-header.component.html',
	styleUrls: ['./menu-header.component.scss']
})
export class MenuHeaderComponent implements OnInit {

	@Input() menuItems = [];
	params = { fromTab: true }

	constructor(public router: Router) { }

	ngOnInit() { }

	getActiveTab() {
		let activeTab = {};
		this.menuItems.forEach((d, i) => {
			if (d.active) {
				activeTab = d;
			}
		});
		return activeTab;
	}

	tabClick($event, tab) {
		this.setActiveTab(tab);
	}

	setActiveTab(tab) {
		for (const item of this.menuItems) {
			item.active = false;
			if (item.id === tab.id) {
				item.active = true;
			}
		}
	}
	changeRoute(routeValue, params?: any) {
		this.router.navigate(["/" + routeValue], { queryParams: params });
	}
}
