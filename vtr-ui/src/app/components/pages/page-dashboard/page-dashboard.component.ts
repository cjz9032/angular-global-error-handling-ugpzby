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

	dummySystem = [
		{
			'status': 0,
			'id': 'memory',
			'title': 'Memory',
			'detail': '4.00 GB of 6 GB',
			'path': 'support',
			'asLink': false
		},
		{
			'status': 0,
			'id': 'disk',
			'title': 'Disk Space',
			'detail': '12.7 GB of 256 GB',
			'path': 'support',
			'asLink': false
		},
		{
			'status': 0,
			'id': 'warranty',
			'title': 'Warranty',
			'detail': 'Unitil 01/01/2020',
			'path': 'support',
			'asLink': false
		},
		{
			'status': 1,
			'id': 'systemupdate',
			'title': 'System Update',
			'detail': 'Update',
			'path': 'support',
			'asLink': true
		}
	];


	dummySecurity = [
		{
			'status': 0,
			'id': 'anti-virus',
			'title': 'Anti-Virus',
			'path': 'security'
		},
		{
			'status': 0,
			'id': 'wifi-security',
			'title': 'Wifi Security',
			'path': 'security'
		},
		{
			'status': 0,
			'id': 'pwdmgr',
			'title': 'Password Manager',
			'path': 'security'
		},
		{
			'status': 1,
			'id': 'vpn',
			'title': 'VPN',
			'path': 'security'
		}
	];

	constructor(
		public dashboardService: DashboardService
	) { }

	ngOnInit() {
	}

}
