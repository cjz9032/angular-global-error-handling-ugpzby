import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'vtr-header-main',
	templateUrl: './header-main.component.html',
	styleUrls: [
		'./header-main.component.scss',
		'./header-main.component.gaming.scss'
	]
})
export class HeaderMainComponent implements OnInit {

	@Input() title: string;
	@Input() back: string;
	@Input() backarrow: string;
	@Input() forwardLink: { path: string, label: string };
	@Input() menuItems: any[];
	@Input() parentPath: string;
	@Input() backId: string;
	constructor() { }

	ngOnInit() {
		const self = this;
		if (this.parentPath !== '' && this.parentPath !== undefined) {
			this.menuItems.forEach(function (d, i) {
				d.path = self.parentPath + '/' + d.path;
				console.log('UPDATED PATH', d.path);
			});
		}
		console.log('MENU ITEMS UPDATED', this.menuItems);
	}

	goBack() {
		window.history.back();
	}
}
