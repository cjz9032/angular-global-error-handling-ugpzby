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

  data = [
		{
			'status': 0,
			'id': 'memory',
			'title': 'Memory',
			'description': '4,00 GB of 6,00 GB',
			'isDescClickable': false,
			'route': {
				'description': 'memory',
				'path': 'support'
			}
		},
		{
			'status': 0,
			'id': 'disk',
			'title': 'diskspace',
			'description': '12,7GB of 256 GB',
			'isDescClickable': false,
			'route': {
				'description': 'diskspace',
				'path': 'support'
			}
		},
		{
			'status': 0,
			'id': 'warranty',
			'title': 'warranty',
			'description': 'Unitil 01/01/2020',
			'isDescClickable': false,
			'route': {
				'description': 'warranty',
				'path': 'support'
			}
		},
		{
			'status': 2,
			'id': 'systemupdate',
			'title': 'system update',
			'description': 'update',
			'isDescClickable': true,
			'route': {
				'description': 'systemupdate',
				'path': 'support'
			}
		}
	];


	data2 = [
		{
			'status': '0',
			'id': 'anti-virus',
			'title': 'Anti-Virus',
			'route': {
				'description': 'memory',
				'path': 'security'
			}
		},
		{
			'status': '0',
			'id': 'wifi-security',
			'title': 'Wifi Security',
			'route': {
				'description': 'warranty',
				'path': 'security'
			}
		},
		{
			'status': '0',
			'id': 'pwdmgr',
			'title': 'Password Manager',
			'route': {
				'description': 'systemupdate',
				'path': 'security'
			}
		},
		{
			'status': '1',
			'id': 'vpn',
			'title': 'VPN',
			'route': {
				'description': 'VPN',
				'path': 'security'
			}
		}
	];
	constructor(
		public dashboardService: DashboardService
	) { }

	ngOnInit() {
	}

}
