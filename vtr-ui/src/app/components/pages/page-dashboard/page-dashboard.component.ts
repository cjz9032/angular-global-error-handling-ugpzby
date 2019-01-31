import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard/dashboard.service';

@Component({
	selector: 'vtr-page-dashboard',
	templateUrl: './page-dashboard.component.html',
	styleUrls: ['./page-dashboard.component.scss']
})
export class PageDashboardComponent implements OnInit {

	title = 'Dashboard';
	forwardLink = {
		path: 'dashboard-customize',
		label: 'Customize Dashboard'
	};

	constructor(
		public dashboardService: DashboardService
	) { }

	ngOnInit() {
	}

}
