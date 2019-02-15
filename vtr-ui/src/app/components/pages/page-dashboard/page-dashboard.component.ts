import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
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


	qAndA = {
		title: 'Q&A\'s for your machine',
		description: 'Description of component',
		data: [
			{ icon: 'fa-plane', question: 'Reduced batterylife working outside.' },
			{ icon: 'fa-plane', question: 'Can I use my Ideapad while in an airplane?' },
			{ icon: 'fa-edge', question: 'Will the security control scanner damage' },
			{ icon: 'fa-amazon', question: 'Reduced batterylife working outside.' },
			{ icon: 'fa-envira', question: 'Can I use my Ideapad while in an airplane?' },
			{ icon: 'fa-chrome', question: 'Will the security control scanner damage' }
		]
	};

	constructor(
		public dashboardService: DashboardService,
		public mockService: MockService
	) {
	}

	ngOnInit() {
	}

}
