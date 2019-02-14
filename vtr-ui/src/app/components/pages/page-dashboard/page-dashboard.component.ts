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








	data: any = [{
		'albumId': 1,
		'id': 1,
		'source': 'Vantage Exclusive',
		'title': 'Accusamus Beatae ad Facilis ci Similique Qui Sunt',
		'url': 'assets/images/banner1.jpeg',
		'thumbnailUrl': 'https://via.placeholder.com/150/92c952'
	},
	{
		'albumId': 1,
		'id': 2,
		'source': 'Vantage Exclusive',
		'title': 'Reprehenderit est Deserunt Velit Ipsam',
		'url': 'assets/images/banner2.jpeg',
		'thumbnailUrl': 'https://via.placeholder.com/150/771796'
	},
	{
		'albumId': 1,
		'id': 3,
		'source': 'Vantage Exclusive',
		'title': 'Officia Porro Iure quia Iusto qui Ipsa ut Modi',
		'url': 'assets/images/banner1.jpeg',
		'thumbnailUrl': 'https://via.placeholder.com/150/24f355'
	},
	{
		'albumId': 1,
		'id': 4,
		'source': 'Vantage Exclusive',
		'title': 'Culpa Odio esse Rerum Omnis Laboriosam Voluptate Repudiandae',
		'url': 'assets/images/banner2.jpeg',
		'thumbnailUrl': 'https://via.placeholder.com/150/d32776'
	}];

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
		public dashboardService: DashboardService
	) {
	}

	ngOnInit() {
	}

}
