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
			'path': 'ms-settings:about',
			'asLink': false,
			'isSystemLink': true
		},
		{
			'status': 0,
			'id': 'disk',
			'title': 'Disk Space',
			'detail': '12.7 GB of 256 GB',
			'path': 'ms-settings:storagesense',
			'asLink': false,
			'isSystemLink': true
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
			'path': '/system-updates',
			'asLink': true
		}
	];


	securityHealth = [
		{
			'status': 1,
			'id': 'apps-src-unknown',
			'title': 'Apps from unknown sources',
			'detail': 'Failed',
			'path': 'apps-src-unknown'
		},
		{
			'status': 1,
			'id': 'dev-mode',
			'title': 'Developer mode',
			'detail': 'FAILED',
			'path': 'dev-mode'

		},
		{
			'status': 1,
			'id': 'uac-notification',
			'title': 'UAC Notification',
			'detail': 'FAILED',
			'path': 'uac-notification'
		},
		{
			'status': 0,
			'id': 'anti-virus-availability',
			'title': 'Anti-Virus availability',
			'detail': 'PASSED',
			'path': 'anti-virus-availability'
		},
		{
			'status': 0,
			'id': 'drive-encryption',
			'title': 'Drive encryption',
			'detail': 'PASSED',
			'path': 'drive-encryption'

		},
		{
			'status': 0,
			'id': 'firewall-availability',
			'title': 'Firewall availability',
			'detail': 'PASSED',
			'path': 'firewall-availability'

		},
		{
			'status': 0,
			'id': 'os-integrity',
			'title': 'OS integrity',
			'detail': 'PASSED',
			'path': 'OS integrity'
		},
		{
			'status': 0,
			'id': 'os-version',
			'title': 'OS version',
			'detail': 'PASSED',
			'path': 'os-version'
		},
		{
			'status': 0,
			'id': 'pin-pwd',
			'title': 'Pin or Password',
			'detail': 'PASSED',
			'path': 'pin-pwd'
		}
	];

	securityStatus = [
		{
			'status': 0,
			'id': 'anti-virus',
			'title': 'Anti-Virus',
			'detail': 'Enabled',
			'path': 'anti-virus',
			'type': 'security'

		},
		{
			'status': 0,
			'id': 'wifi-security',
			'title': 'WiFi Security',
			'detail': 'Enabled',
			'path': 'wifi-security',
			'type': 'security'

		},
		{
			'status': 2,
			'id': 'pwdmgr',
			'title': 'Password Manager',
			'detail': 'Installed',
			'path': 'password-protection',
			'type': 'security'
		},
		{
			'status': 2,
			'id': 'vpn',
			'title': 'VPN',
			'detail': 'Installed',
			'path': 'internet-protection',
			'type': 'security'
		},
		{
			'status': 1,
			'id': 'windows-hello',
			'title': 'Windows Hello',
			'detail': 'disabled',
			'path': 'windows-hello',
			'type': 'security'

		}
	];

	securityAntivirus = [
		{
			'status': 0,
			'id': 'anti-virus',
			'title': 'Anti-Virus',
			'detail': 'Enabled',
			'path': ''
		},
		{
			'status': 1,
			'id': 'firewall',
			'title': 'Firewall',
			'detail': 'Disabled',
			'path': ''

		}
	];

	securityPasswordHealth = [
		{
			'status': 0,
			'id': 'password-manager',
			'title': 'Password Manager',
			'detail': 'Installed',
			'path': ''
		}
	];

	securityVPN = [
		{
			'status': 0,
			'id': 'virtual-private-network',
			'title': 'Virtual Private Network',
			'detail': 'Installed',
			'path': ''
		}
	];

	securityWifi = [
		{
			'status': 0,
			'id': 'wifi-security',
			'title': 'WiFi Security',
			'detail': 'Enabled',
			'path': ''
		}
	];

	securityConnectedHome = [
		{
			'status': 0,
			'id': 'connected-home-security',
			'title': 'Connected Home Security',
			'detail': 'Enabled',
			'path': ''
		}
	];

	securityWindowsHello = [
		{
			'status': 0,
			'id': 'fingerprint-reader',
			'title': 'Fingerprint reader',
			'detail': 'Enabled',
			'path': ''
		}
	];

	qA = [
		{
			'icon': ['fas', 'plane'],
			'title': ' Reduced batterylife working outside.',
			'path': '/support-detail',
			'lightTitle': true
		},
		{
			'icon': ['fas', 'plane'],
			'title': 'Can I use my Ideapad while in an airplane?',
			'path': '/support-detail',
			'lightTitle': true
		},
		{
			'icon': ['fas', 'plane'],
			'title': 'Will the security control scanner damage',
			'path': '/support-detail',
			'lightTitle': true
		},
		{
			'icon': ['fas', 'plane'],
			'title': 'Will the security control scanner damage',
			'path': '/support-detail',
			'lightTitle': true
		}
	];

	warranty = {
		'status': 1, // 0 IN WARRANTY | 1 WARRANTY EXPIRED | 2 Not Found Warranty
		'dayDiff': 1,
		'startDate': '2017-12-13T09:12:43.083Z',
		'endDate': '2018-12-12T09:12:43.083Z',
		'url': 'https://pcsupport.lenovo.com/us/en/warrantylookup',
	};

	documentation = [
		{
			'icon': ['fas', 'book'],
			'title': 'User Guide',
			'path': '',
			'url': 'https://support.lenovo.com',
			'target': '_blank',
		}
	];

	needHelp = [
		{
			'icon': ['fas', 'comment-alt'],
			'title': 'Lenovo Community',
			'path': '',
			'url': 'https://community.lenovo.com',
			'target': '_blank',
		},
		{
			'icon': ['fas', 'share-alt'],
			'title': 'Contact Customer service',
			'path': '',
			'url': 'https://support.lenovo.com/',
			'target': '_blank',
		},
		{
			'icon': ['fab', 'weixin'],
			'title': 'Contact us on WeChat',
			'path': '',
			'url': '',
			'hideArrow': true,
			'image': 'assets/images/wechat-qrcode.png'
		}
	];
	quicklink = [
		{
			'icon': ['fas', 'ticket-alt'],
			'title': 'Get support with E-ticket',
			'path': '',
			'url': 'https://pcsupport.lenovo.com/us/en/eticketwithservice',
			'target': '_blank',
		},
		{
			'icon': ['fas', 'briefcase'],
			'title': 'Find a service provider',
			'path': '',
			'url': 'https://www.lenovo.com/us/en/ordersupport/',
			'target': '_blank',
		}
	];
	articles = [
		{
			'title': 'Lenovo Reprehenderit Officia Porro Iure est Deserunt Velit',
			'thumbnailUrl': '',
			'logo': 'assets/images/test-logo.svg',
			'logoText': 'LENEVO SPECIAL',
			'readMore': '/#/support-detail',
		},
		{
			'title': '',
			'thumbnailUrl': 'https://www.channelweb.co.uk/w-images/7703f0aa-a9d4-48ec-a719-c993f0388479/3/Datacentre-580x358.jpg',
			'logo': 'assets/images/test-logo.svg',
			'logoText': 'LENEVO SPECIAL',
			'readMore': '/#/support-detail',
		},
		{
			'title': 'Lenovo Reprehenderit Officia Porro Iure est Deserunt Velit',
			'thumbnailUrl': 'https://d3w2mpp70f6o8z.cloudfront.net/media/images/MareNostrum.original.jpg',
			'logo': '',
			'logoText': 'LENEVO SPECIAL',
			'readMore': '/#/support-detail',
		},
		{
			'title': 'Lenovo Reprehenderit Officia Porro Iure est Deserunt Velit',
			'thumbnailUrl': 'https://www.channelweb.co.uk/w-images/7703f0aa-a9d4-48ec-a719-c993f0388479/3/Datacentre-580x358.jpg',
			'logo': 'assets/images/test-logo.svg',
			'logoText': 'LENEVO SPECIAL',
			'readMore': '/#/support-detail',
		},
		{
			'title': 'Lenovo Reprehenderit Officia Porro Iure est Deserunt Velit',
			'thumbnailUrl': 'https://d3w2mpp70f6o8z.cloudfront.net/media/images/MareNostrum.original.jpg',
			'logo': 'assets/images/test-logo.svg',
			'logoText': 'LENEVO SPECIAL',
			'readMore': '/#/support-detail',
		},
		{
			'title': 'Lenovo Reprehenderit Officia Porro Iure est Deserunt Velit',
			'thumbnailUrl': '',
			'logo': '',
			'logoText': 'LENEVO SPECIAL',
			'readMore': '/#/support-detail',
		},
		{
			'title': 'Lenovo Reprehenderit Officia Porro Iure est Deserunt Velit',
			'thumbnailUrl': 'https://d3w2mpp70f6o8z.cloudfront.net/media/images/MareNostrum.original.jpg',
			'logo': 'assets/images/test-logo.svg',
			'logoText': 'LENEVO SPECIAL',
			'readMore': '/#/support-detail',
		},
		{
			'title': 'Lenovo Reprehenderit Officia Porro Iure est Deserunt Velit',
			'thumbnailUrl': 'https://www.channelweb.co.uk/w-images/7703f0aa-a9d4-48ec-a719-c993f0388479/3/Datacentre-580x358.jpg',
			'logo': '',
			'logoText': 'LENEVO SPECIAL',
			'readMore': '/#/support-detail',
		},
	];

	criticalUpdates = [
		{
			'id': '1',
			'icon': ['fas', 'plane'],
			'title': 'Lenovo intelligent Thermal Solutions Driver',
			'detail': ' - 10[64]',
			'path': '',
			'lightTitle': false,
			'rebootRequired': true
		},
		{
			'id': '2',
			'icon': ['fas', 'plane'],
			'title': 'Intel Wireless LAN driver',
			'detail': ' - (Windows 10 Build 1709 And Later) - 10[64]',
			'path': '',
			'lightTitle': false,
			'rebootRequired': false
		},
		{
			'id': '3',
			'icon': ['fas', 'plane'],
			'title': 'Lenovo Intelligent Thermal Solution Driver',
			'detail': ' - 10[64]',
			'path': '',
			'lightTitle': false,
			'rebootRequired': false
		}
	];

	recommendedUpdates = [
		{
			'id': '1',
			'icon': ['fas', 'plane'],
			'title': 'Lenovo intelligent Thermal Solutions Driver',
			'detail': ' - 10[64]',
			'path': '',
			'lightTitle': false,
			'rebootRequired': false
		},
		{
			'id': '2',
			'icon': ['fas', 'plane'],
			'title': 'Intel Wireless LAN driver',
			'detail': ' - (Windows 10 Build 1709 And Later) - 10[64]',
			'path': '',
			'lightTitle': false,
			'rebootRequired': false
		},
		{
			'id': '3',
			'icon': ['fas', 'plane'],
			'title': 'Lenovo Intelligent Thermal Solution Driver',
			'detail': ' - 10[64]',
			'path': '',
			'lightTitle': false,
			'rebootRequired': true
		}
	];

	optionalUpdates = [
		{
			'id': '1',
			'icon': ['fas', 'plane'],
			'title': 'Lenovo intelligent Thermal Solutions Driver',
			'detail': ' - 10[64]',
			'path': '',
			'lightTitle': false,
			'rebootRequired': true
		},
		{
			'id': '2',
			'icon': ['fas', 'plane'],
			'title': 'Intel Wireless LAN driver',
			'detail': ' - (Windows 10 Build 1709 And Later) - 10[64]',
			'path': '',
			'lightTitle': false,
			'rebootRequired': false
		},
		{
			'id': '3',
			'icon': ['fas', 'plane'],
			'title': 'Lenovo Intelligent Thermal Solution Driver',
			'detail': ' - 10[64]',
			'path': '',
			'lightTitle': false,
			'rebootRequired': false
		}
	];

	constructor() { }
}
