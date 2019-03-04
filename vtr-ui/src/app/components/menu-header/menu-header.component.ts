import { Component, OnInit, Input } from '@angular/core';
import { DevService } from 'src/app/services/dev/dev.service';
import { R3TargetBinder } from '@angular/compiler';

@Component({
	selector: 'vtr-menu-header',
	templateUrl: './menu-header.component.html',
	styleUrls: ['./menu-header.component.scss']
})
export class MenuHeaderComponent implements OnInit {

	@Input() menuItems = [];

	constructor(
		private devService: DevService
	) { }

	ngOnInit() {
		this.devService.writeLog('HEADER MENU INIT', this.menuItems);
	}

	getActiveTab() {
		let activeTab = {};
		this.menuItems.forEach(function (d, i) {
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
