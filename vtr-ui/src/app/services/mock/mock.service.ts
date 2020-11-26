import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class MockService {
	// carousel: any = [{
	// 	'albumId': 1,
	// 	'id': 1,
	// 	'source': 'Vantage Exclusive',
	// 	'title': 'Accusamus Beatae ad Facilis ci Similique Qui Sunt',
	// 	'url': 'assets/images/banner1.jpeg',
	// 	'thumbnailUrl': 'https://via.placeholder.com/150/92c952'
	// },
	// {
	// 	'albumId': 1,
	// 	'id': 2,
	// 	'source': 'Vantage Exclusive',
	// 	'title': 'Reprehenderit est Deserunt Velit Ipsam',
	// 	'url': 'assets/images/banner2.jpeg',
	// 	'thumbnailUrl': 'https://via.placeholder.com/150/771796'
	// },
	// {
	// 	'albumId': 1,
	// 	'id': 3,
	// 	'source': 'Vantage Exclusive',
	// 	'title': 'Officia Porro Iure quia Iusto qui Ipsa ut Modi',
	// 	'url': 'assets/images/banner1.jpeg',
	// 	'thumbnailUrl': 'https://via.placeholder.com/150/24f355'
	// },
	// {
	// 	'albumId': 1,
	// 	'id': 4,
	// 	'source': 'Vantage Exclusive',
	// 	'title': 'Culpa Odio esse Rerum Omnis Laboriosam Voluptate Repudiandae',
	// 	'url': 'assets/images/banner2.jpeg',
	// 	'thumbnailUrl': 'https://via.placeholder.com/150/d32776'
	// }];

	systemStatus = [
		{
			status: 0,
			id: 'memory',
			title: 'Memory',
			detail: '4.00 GB of 6 GB',
			path: 'ms-settings:about',
			asLink: false,
			isSystemLink: true,
			type: 'system',
		},
		{
			status: 0,
			id: 'disk',
			title: 'Disk Space',
			detail: '12.7 GB of 256 GB',
			path: 'ms-settings:storagesense',
			asLink: false,
			isSystemLink: true,
			type: 'system',
		},
		{
			status: 0,
			id: 'warranty',
			title: 'Warranty',
			detail: 'Unitil 01/01/2020',
			path: '/support',
			asLink: false,
			type: 'system',
		},
		{
			status: 1,
			id: 'systemupdate',
			title: 'System Update',
			detail: 'Update',
			path: 'device/system-updates',
			asLink: false,
			type: 'system',
		},
	];

	securityHealth = [
		{
			status: 1,
			id: 'apps-src-unknown',
			title: 'Apps from unknown sources',
			detail: 'FAILED',
			path: '',
			hideChevron: true,
		},
		{
			status: 1,
			id: 'dev-mode',
			title: 'Developer mode',
			detail: 'FAILED',
			path: '',
			hideChevron: true,
		},
		{
			status: 1,
			id: 'uac-notification',
			title: 'UAC Notification',
			detail: 'FAILED',
			path: '',
			hideChevron: true,
		},
		{
			status: 2,
			id: 'anti-virus-availability',
			title: 'Anti-Virus availability',
			detail: 'PASSED',
			path: '',
			hideChevron: true,
		},
		{
			status: 2,
			id: 'drive-encryption',
			title: 'Drive encryption',
			detail: 'PASSED',
			path: '',
			hideChevron: true,
		},
		{
			status: 2,
			id: 'firewall-availability',
			title: 'Firewall availability',
			detail: 'PASSED',
			path: '',
			hideChevron: true,
		},
		{
			status: 2,
			id: 'os-integrity',
			title: 'OS integrity',
			detail: 'PASSED',
			path: '',
			hideChevron: true,
		},
		// {
		// 	'status': 2,
		// 	'id': 'os-version',
		// 	'title': 'OS version',
		// 	'detail': 'PASSED',
		// 	'path': '',
		// 	'hideChevron': true
		// },
		{
			status: 2,
			id: 'pin-pwd',
			title: 'Pin or Password',
			detail: 'PASSED',
			path: '',
			hideChevron: true,
		},
	];

	securityStatus = [
		{
			status: 0,
			id: 'anti-virus',
			title: 'Anti-Virus',
			detail: 'Enabled',
			path: 'security/anti-virus',
			type: 'security',
		},
		{
			status: 0,
			id: 'wifi-security',
			title: 'WiFi Security',
			detail: 'Enabled',
			path: 'security/wifi-security',
			type: 'security',
		},
		{
			status: 2,
			id: 'pwdmgr',
			title: 'Password Manager',
			detail: 'Installed',
			path: 'security/password-protection',
			type: 'security',
		},
		{
			status: 2,
			id: 'vpn',
			title: 'VPN',
			detail: 'Installed',
			path: 'security/internet-protection',
			type: 'security',
		},
		{
			status: 1,
			id: 'windows-hello',
			title: 'Windows Hello',
			detail: 'disabled',
			path: 'security/windows-hello',
			type: 'security',
		},
	];

	securityAntivirus = [
		{
			status: 0,
			id: 'anti-virus',
			title: 'Anti-Virus',
			detail: 'Enabled',
			path: 'security/anti-virus',
			type: 'security',
		},
		{
			status: 1,
			id: 'firewall',
			title: 'Firewall',
			detail: 'Disabled',
			path: 'security/anti-virus',
			type: 'security',
		},
	];

	securityPasswordHealth = [
		{
			status: 2,
			id: 'password-manager',
			title: 'Password Manager',
			detail: 'Installed',
			path: 'security/password-protection',
			type: 'security',
		},
	];

	securityVPN = [
		{
			status: 2,
			id: 'virtual-private-network',
			title: 'Virtual Private Network',
			detail: 'Installed',
			path: 'security/internet-protection',
			type: 'security',
		},
	];

	securityWifi = [
		{
			status: 0,
			id: 'wifi-security',
			title: 'WiFi Security',
			detail: 'Enabled',
			path: 'wifi-security',
			type: 'security',
		},
	];

	wifiHistoryList = [
		{
			ssid: 'Lenovo',
			info: '2019-01-25',
			good: 0,
		},
		{
			ssid: 'CDL',
			info: '2019-01-25',
			good: 1,
		},
	];

	securityConnectedHome = [
		{
			status: '',
			id: 'connected-home-security',
			title: 'Connected Home Security',
			detail: 'Learn more',
			path: 'security/wifi-security',
			type: 'security',
		},
	];

	securityWindowsHello = [
		{
			status: 0,
			id: 'fingerprint-reader',
			title: 'Fingerprint Reader',
			detail: 'Enabled',
			path: 'security/windows-hello',
			type: 'security',
		},
	];

	qA = [
		{
			icon: ['fas', 'plane'],
			title: ' Reduced batterylife working outside.',
			path: '/support-detail',
			lightTitle: true,
		},
		{
			icon: ['fas', 'plane'],
			title: 'Can I use my Ideapad while in an airplane?',
			path: '/support-detail',
			lightTitle: true,
		},
		{
			icon: ['fas', 'plane'],
			title: 'Will the security control scanner damage',
			path: '/support-detail',
			lightTitle: true,
		},
		{
			icon: ['fas', 'plane'],
			title: 'Will the security control scanner damage',
			path: '/support-detail',
			lightTitle: true,
		},
	];

	articles = [
		{
			Title: 'Lenovo Reprehenderit Officia Porro Iure est Deserunt Velit',
			Thumbnail: '',
			Logo: 'assets/images/test-logo.svg',
			LogoText: 'LENOVO SPECIAL',
			ReadMore: '/#/support-detail/1',
		},
		{
			Title: '',
			Thumbnail:
				'https://www.channelweb.co.uk/w-images/7703f0aa-a9d4-48ec-a719-c993f0388479/3/Datacentre-580x358.jpg',
			Logo: 'assets/images/test-logo.svg',
			LogoText: 'LENOVO SPECIAL',
			ReadMore: '/#/support-detail/1',
		},
		{
			Title: 'Lenovo Reprehenderit Officia Porro Iure est Deserunt Velit',
			Thumbnail:
				'https://d3w2mpp70f6o8z.cloudfront.net/media/images/MareNostrum.original.jpg',
			Logo: '',
			LogoText: 'LENOVO SPECIAL',
			ReadMore: '/#/support-detail/1',
		},
		{
			Title: 'Lenovo Reprehenderit Officia Porro Iure est Deserunt Velit',
			Thumbnail:
				'https://www.channelweb.co.uk/w-images/7703f0aa-a9d4-48ec-a719-c993f0388479/3/Datacentre-580x358.jpg',
			Logo: 'assets/images/test-logo.svg',
			LogoText: 'LENOVO SPECIAL',
			ReadMore: '/#/support-detail/1',
		},
		{
			Title: 'Lenovo Reprehenderit Officia Porro Iure est Deserunt Velit',
			Thumbnail:
				'https://d3w2mpp70f6o8z.cloudfront.net/media/images/MareNostrum.original.jpg',
			Logo: 'assets/images/test-logo.svg',
			LogoText: 'LENOVO SPECIAL',
			ReadMore: '/#/support-detail/1',
		},
		{
			Title: 'Lenovo Reprehenderit Officia Porro Iure est Deserunt Velit',
			Thumbnail: '',
			Logo: '',
			LogoText: 'LENOVO SPECIAL',
			ReadMore: '/#/support-detail/1',
		},
		{
			Title: 'Lenovo Reprehenderit Officia Porro Iure est Deserunt Velit',
			Thumbnail:
				'https://d3w2mpp70f6o8z.cloudfront.net/media/images/MareNostrum.original.jpg',
			Logo: 'assets/images/test-logo.svg',
			LogoText: 'LENOVO SPECIAL',
			ReadMore: '/#/support-detail/1',
		},
		{
			Title: 'Lenovo Reprehenderit Officia Porro Iure est Deserunt Velit',
			Thumbnail:
				'https://www.channelweb.co.uk/w-images/7703f0aa-a9d4-48ec-a719-c993f0388479/3/Datacentre-580x358.jpg',
			Logo: '',
			LogoText: 'LENOVO SPECIAL',
			ReadMore: '/#/support-detail/1',
		},
	];

	criticalUpdates = [
		{
			id: '1',
			icon: ['fas', 'plane'],
			title: 'Lenovo intelligent Thermal Solutions Driver',
			detail: ' - 10[64]',
			path: '',
			lightTitle: false,
			rebootRequired: true,
		},
		{
			id: '2',
			icon: ['fas', 'plane'],
			title: 'Intel Wireless LAN driver',
			detail: ' - (Windows 10 Build 1709 And Later) - 10[64]',
			path: '',
			lightTitle: false,
			rebootRequired: false,
		},
		{
			id: '3',
			icon: ['fas', 'plane'],
			title: 'Lenovo Intelligent Thermal Solution Driver',
			detail: ' - 10[64]',
			path: '',
			lightTitle: false,
			rebootRequired: false,
		},
	];

	recommendedUpdates = [
		{
			id: '1',
			icon: ['fas', 'plane'],
			title: 'Lenovo intelligent Thermal Solutions Driver',
			detail: ' - 10[64]',
			path: '',
			lightTitle: false,
			rebootRequired: false,
		},
		{
			id: '2',
			icon: ['fas', 'plane'],
			title: 'Intel Wireless LAN driver',
			detail: ' - (Windows 10 Build 1709 And Later) - 10[64]',
			path: '',
			lightTitle: false,
			rebootRequired: false,
		},
		{
			id: '3',
			icon: ['fas', 'plane'],
			title: 'Lenovo Intelligent Thermal Solution Driver',
			detail: ' - 10[64]',
			path: '',
			lightTitle: false,
			rebootRequired: true,
		},
	];

	optionalUpdates = [
		{
			id: '1',
			icon: ['fas', 'plane'],
			title: 'Lenovo intelligent Thermal Solutions Driver',
			detail: ' - 10[64]',
			path: '',
			lightTitle: false,
			rebootRequired: true,
		},
		{
			id: '2',
			icon: ['fas', 'plane'],
			title: 'Intel Wireless LAN driver',
			detail: ' - (Windows 10 Build 1709 And Later) - 10[64]',
			path: '',
			lightTitle: false,
			rebootRequired: false,
		},
		{
			id: '3',
			icon: ['fas', 'plane'],
			title: 'Lenovo Intelligent Thermal Solution Driver',
			detail: ' - 10[64]',
			path: '',
			lightTitle: false,
			rebootRequired: false,
		},
	];

	fullInstallationHistory = [
		{
			id: '1',
			icon: 'times',
			title: 'Lenovo intelligent Thermal Solutions Driver',
			detail: ' - 10[64]',
			path: '',
			lightTitle: false,
			success: true,
			installationDetails: ['Instllation text 1', 'Instllation text 2', 'Instllation text 3'],
		},
		{
			id: '2',
			icon: 'times',
			title: 'Intel Wireless LAN driver',
			detail: ' - (Windows 10 Build 1709 And Later) - 10[64]',
			path: '',
			lightTitle: false,
			success: false,
			installationDetails: ['Instllation text 1', 'Instllation text 2'],
		},
		{
			id: '3',
			icon: 'check',
			title: 'Lenovo Intelligent Thermal Solution Driver',
			detail: ' - 10[64]',
			path: '',
			lightTitle: false,
			success: false,
			installationDetails: [
				'Instllation text 11',
				'Instllation text 22',
				'Instllation text 33',
			],
		},
	];

	// antiVirus: Antivirus = {
	// 	on() {},
	// 	off() {},
	// 	mitt: null,
	// 	mcafeeDownloadUrl: 'ss',
	// 	refresh(): Promise<object> {
	// 		return  Promise.resolve(Object);
	// 	},
	// 	mcafee: {
	// 		localName: 'local',
	// 		trailUrl: 'url',
	// 		subscription: 'licenseActive',
	// 		// McAfee expire date
	// 		expireAt: '1/21/2020',
	// 		// McAfee register status
	// 		registered: true,
	// 		// McAfee sub-feature information
	// 		features: [{
	// 			key: 'Virus Scan',
	// 			value: true,
	// 			id: 'Virus Scan'
	// 		},
	// 		{
	// 			key: 'FireWall',
	// 			value: false,
	// 			id: 'FireWall',
	// 		}],
	// 		// launch McAfee application
	// 		launch() {
	// 		}
	// 	},
	// 	windowsDefender: {
	// 		status: false,
	// 		firewallStatus: false,
	// 	},
	// 	others: {
	// 		antiVirus: [{
	// 			status: true,
	// 			name: '360',
	// 		}],
	// 		firewall: [{
	// 			status: true,
	// 			name: '360',
	// 		}]
	// 	}
	// };

	constructor() {}
}
