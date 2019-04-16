import { Component, OnInit } from '@angular/core';
import { FigleafOverviewService } from '../../../common-services/figleaf-overview.service';

@Component({
	selector: 'vtr-privacy-dashboard-list',
	templateUrl: './privacy-dashboard-list.component.html',
	styleUrls: ['./privacy-dashboard-list.component.scss']
})
export class PrivacyDashboardListComponent implements OnInit {
	dashboardData$ = this.figleafOverviewService.figleafDashboard$;

	constructor(private figleafOverviewService: FigleafOverviewService) {
	}

	ngOnInit() {
	}

}
