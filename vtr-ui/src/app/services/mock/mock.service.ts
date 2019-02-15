import { Injectable } from '@angular/core';

@Injectable()

export class MockService {

	carousel: any = [{
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

	systemStatus = [
		{
			'status': 0,
			'id': 'memory',
			'title': 'Memory',
			'detail': '4.00 GB of 6 GB',
			'path': '/support',
			'asLink': false
		},
		{
			'status': 0,
			'id': 'disk',
			'title': 'Disk Space',
			'detail': '12.7 GB of 256 GB',
			'path': '/support',
			'asLink': false
		},
		{
			'status': 0,
			'id': 'warranty',
			'title': 'Warranty',
			'detail': 'Unitil 01/01/2020',
			'path': '/support',
			'asLink': false
		},
		{
			'status': 1,
			'id': 'systemupdate',
			'title': 'System Update',
			'detail': 'Update',
			'path': '/support',
			'asLink': true
		}
	];

	securityStatus = [
		{
			'status': 0,
			'id': 'anti-virus',
			'title': 'Anti-Virus',
			'detail': 'Enabled',
			'path': 'anti-virus'
		},
		{
			'status': 0,
			'id': 'wifi-security',
			'title': 'Wifi Security',
			'detail': 'Enabled',
			'path': 'wifi-security'

		},
		{
			'status': 1,
			'id': 'pwdmgr',
			'title': 'Password Manager',
			'detail': 'Installed',
			'path': 'password-protection'
		},
		{
			'status': 1,
			'id': 'vpn',
			'title': 'VPN',
			'detail': 'Installed',
			'path': 'internet-protection'
		},
		{
			'status': 2,
			'id': 'windows-hello',
			'title': 'Windows Hello',
			'detail': 'disabled',
			'path': 'security'

		}
	];

	qA = [
		{
			'icon': ['fas', 'plane'],
			'title': ' Reduced batterylife working outside.',
			'path': '/support',
			'lightTitle': true
		},
		{
			'icon': ['fas', 'plane'],
			'title': 'Can I use my Ideapad while in an airplane?',
			'path': '/support',
			'lightTitle': true
		},
		{
			'icon': ['fas', 'plane'],
			'title': 'Will the security control scanner damage',
			'path': '/support',
			'lightTitle': true
		},
		{
			'icon': ['fas', 'plane'],
			'title': 'Will the security control scanner damage',
			'path': '/support',
			'lightTitle': true
		}
	];

	constructor() { }
}
