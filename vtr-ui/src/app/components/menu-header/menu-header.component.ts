import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-menu-header',
	templateUrl: './menu-header.component.html',
	styleUrls: ['./menu-header.component.scss']
})
export class MenuHeaderComponent implements OnInit {

	@Input() menuItems = [];

	constructor() { }

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

}
