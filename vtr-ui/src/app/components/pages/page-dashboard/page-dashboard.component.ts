import { Component, OnInit } from '@angular/core';
import { MockService } from '../../../services/mock/mock.service';
import { QaService } from '../../../services/qa/qa.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

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
		public dashboardService: DashboardService,
		public mockService: MockService,
		public qaService: QaService
	) {}

	ngOnInit() {}

	public onFeedBackClick(content: any): void {}
}
