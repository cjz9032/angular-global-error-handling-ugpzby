import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'vtr-menu-main',
	templateUrl: './menu-main.component.html',
	styleUrls: ['./menu-main.component.scss']
})
export class MenuMainComponent implements OnInit {

	items = [
		{
			id: 'dashboard',
			label: 'Dashboard',
			path: 'dashboard',
			icon: 'dashboard'
		}, {
			id: 'device',
			label: 'Device',
			path: 'device',
			icon: 'device'
		}, {
			id: 'security',
			label: 'Security',
			path: 'security',
			icon: 'security'
		}, {
			id: 'support',
			label: 'Support',
			path: 'support',
			icon: 'support'
		}, {
			id: 'user',
			label: 'User',
			path: 'user',
			icon: 'user'
		}
	];

	constructor(
		private router: Router
	) { }

	ngOnInit() {
	}

	menuItemClick(event, path) {
		this.router.navigateByUrl(path);
	}

}
