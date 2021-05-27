import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'vtr-menu-header',
	templateUrl: './menu-header.component.html',
	styleUrls: ['./menu-header.component.scss'],
})
export class MenuHeaderComponent implements OnInit {
	@Input() menuItems = [];
	params = { fromTab: true };

	constructor(public router: Router) {}

	ngOnInit() {}

	changeRoute(routeValue, params?: any) {
		if (params) {
			this.router.navigate(['/' + routeValue], { queryParams: params });
		} else {
			this.router.navigate(['/' + routeValue]);
		}
	}
}
