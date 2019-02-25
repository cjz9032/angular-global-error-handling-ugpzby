import { Component, OnInit } from '@angular/core';
import { MockService } from '../../../services/mock/mock.service';

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

	constructor(public mockService: MockService) {}

	ngOnInit() {}

	public onFeedBackClick(content: any): void {}
}
