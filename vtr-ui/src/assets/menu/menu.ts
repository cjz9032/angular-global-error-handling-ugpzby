import { Router } from '@angular/router';

export enum MenuID {
	smartPerformance = 'smart-performance',
	facebook = 'facebook',
	instagram = 'instagram',
	appSearch = 'app-search',
	user = 'user',
	dashboard = 'dashboard',
	device = 'device',
	systemUpdates = 'system-updates',
	deviceSettings = 'device-settings',
	power = 'power',
	audio = 'audio',
	displayCamera = 'display-camera',
	inputAccessories = 'input-accessories',
	smartAssist = 'smart-assist',
	security = 'security',
	homeSecurity = 'home-security',
	wifiSecurity = 'wifi-security',
	connectedHomeSecurity = 'connected-home-security',
	deviceSecurity = 'device-security',
	antiVirus = 'anti-virus',
	passwordProtection = 'password-protection',
	internetProtection = 'internet-protection',
	support = 'support',
	hardwareScan = 'hardware-scan',
	smb = 'smb',
	meetingExperience = 'meeting-experience',
	meetingManager = 'meeting-manager',
	creatorCentre = 'creator-centre',
	creatorSettings = 'creator-settings',
	easyRendering = 'easy-rendering',
	colorCalibration = 'color-calibration',
}

export class RoutePath {
	static readonly deviceGaming = 'device-gaming';
	static readonly smartPerfomance = 'smart-performance';
	static readonly smartPerformanceBaseArm = 'support/smart-performance';
	static readonly facebook = 'https://www.facebook.com/LenovoLegion/';
	static readonly instagram = 'https://www.instagram.com/lenovolegion/';
	static readonly search = 'search';
	static readonly user = 'user';
	static readonly dashboard = 'dashboard';
	static readonly systemUpdates = 'system-updates';
	static readonly device = 'device';
	static readonly deviceSettings = 'device-settings';
	static readonly power = 'power';
	static readonly powerFullPath = `${RoutePath.device}/${RoutePath.deviceSettings}/${RoutePath.power}`;
	static readonly audio = 'audio';
	static readonly audioFullPath = `${RoutePath.device}/${RoutePath.deviceSettings}/${RoutePath.audio}`;
	static readonly displayCamera = 'display-camera';
	static readonly displayCameraFullPath = `${RoutePath.device}/${RoutePath.deviceSettings}/${RoutePath.displayCamera}`;
	static readonly inputAccessories = 'input-accessories';
	static readonly inputAccessoriesFullPath = `${RoutePath.device}/${RoutePath.deviceSettings}/${RoutePath.inputAccessories}`;
	static readonly smartAssist = 'smart-assist';
	static readonly smartAssistFullPath = `${RoutePath.device}/${RoutePath.deviceSettings}/${RoutePath.smartAssist}`;
	static readonly security = 'security';
	static readonly mySecurity = 'mysecurity';
	static readonly homeSecurity = 'home-security';
	static readonly wifiSecurity = 'wifi-security';
	static readonly wifiSecurityFullPath = 'security/wifi-security';
	static readonly antiVirus = 'anti-virus';
	static readonly passwordProtection = 'password-protection';
	static readonly internetProtection = 'internet-protection';
	static readonly hardwareScan = 'hardware-scan';
	static readonly support = 'support';
	static readonly smb = 'smb';
	static readonly meetingExperience = 'meeting-experience';
	static readonly meetingManager = 'meeting-manager';
	static readonly creatorCentre = 'creator-centre';
	static readonly creatorSettings = 'creator-settings';
	static readonly easyRendering = 'easy-rendering';
	static readonly colorCalibration = 'color-calibration';
}

export const menuConfig = {
	menuItemsGaming: [
		{
			id: MenuID.device,
			label: 'common.menu.device.title',
			path: RoutePath.deviceGaming,
			icon: ['fas', 'desktop'],
			metricsEvent: 'itemClick',
			metricsParent: 'device.navbar',
			metricsItem: 'link.device',
			routerLinkActiveOptions: {
				exact: true,
			},
			sMode: true,
			subitems: [],
		},
		{
			id: MenuID.security,
			label: 'common.menu.security.title',
			path: RoutePath.wifiSecurityFullPath,
			icon: ['fal', 'lock'],
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.security',
			subitems: [
				{
					id: MenuID.wifiSecurity,
					label: 'common.menu.security.sub3',
					path: null,
					icon: null,
					metricsEvent: 'itemClick',
					metricsParent: 'navbar',
					metricsItem: 'link.wifisecurity',
					routerLinkActiveOptions: {
						exact: true,
					},
					subitems: [],
					pre: ['assets/images/coronet-logo-gaming.svg'],
				},
			],
		},
		{
			id: MenuID.support,
			label: 'gaming.common.menu.support.title',
			path: RoutePath.support,
			icon: ['fal', 'wrench'],
			metricsEvent: 'featureClick',
			metricsParent: 'navbar',
			metricsItem: 'link.support',
			routerLinkActiveOptions: {
				exact: true,
			},
			sMode: true,
			pre: ['assets/images/support/svg_icon_about_us.svg'],
			subitems: [
				{
					id: MenuID.support,
					label: 'gaming.common.menu.support.sub1',
					path: null,
					icon: null,
					externallink: false,
					metricsEvent: 'featureClick',
					metricsParent: 'navbar',
					metricsItem: 'support',
					sMode: true,
					routerLinkActiveOptions: {
						exact: true,
					},
					subitems: [],
				},
				{
					id: MenuID.smartPerformance,
					label: 'gaming.common.menu.smartPerformance',
					beta: false,
					path: RoutePath.smartPerfomance,
					icon: '',
					metricsEvent: 'itemClick',
					externallink: false,
					metricsParent: 'navbar',
					metricsItem: 'link.smartPerfomance',
					sMode: false,
					routerLinkActiveOptions: {
						exact: true,
					},
					subitems: [],
				},
				{
					id: MenuID.facebook,
					label: 'gaming.common.menu.support.sub2',
					path: RoutePath.facebook,
					icon: null,
					externallink: true,
					metricsEvent: 'featureClick',
					metricsParent: 'navbar',
					metricsItem: 'facebook',
					routerLinkActiveOptions: {
						exact: false,
					},
					subitems: [],
				},
				{
					id: MenuID.instagram,
					label: 'gaming.common.menu.support.sub3',
					path: RoutePath.instagram,
					icon: null,
					externallink: true,
					metricsEvent: 'featureClick',
					metricsParent: 'navbar',
					metricsItem: 'instagaram',
					routerLinkActiveOptions: {
						exact: true,
					},
					subitems: [],
				},
			],
		},
		{
			id: MenuID.appSearch,
			label: 'appSearch.menuName',
			beta: false,
			path: RoutePath.search,
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.app-search',
			routerLinkActiveOptions: {
				exact: true,
			},
			icon: ['fal', 'search'],
			subitems: [],
		},
		{
			id: MenuID.user,
			label: 'User',
			path: RoutePath.user,
			icon: 'user',
			metricsEvent: 'ItemClick',
			metricsParent: 'NavigationLenovoAccount.Submenu',
			metricsItem: 'link.user',
			routerLinkActiveOptions: {
				exact: true,
			},
			subitems: [],
		},
	],
	menuItems: [
		{
			id: MenuID.dashboard,
			label: 'common.menu.dashboard',
			path: RoutePath.dashboard,
			icon: ['fal', 'columns'],
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.dashboard',
			routerLinkActiveOptions: {
				exact: true,
			},
			sMode: true,
			subitems: [],
		},
		{
			id: MenuID.device,
			label: 'common.menu.device.title',
			path: RoutePath.device,
			icon: ['fal', 'laptop'],
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.device',
			sMode: true,
			subitems: [
				{
					id: MenuID.device,
					label: 'common.menu.device.sub1',
					path: null,
					icon: null,
					metricsEvent: 'itemClick',
					metricsParent: 'device.navbar',
					metricsItem: 'link.mydevice',
					routerLinkActiveOptions: {
						exact: true,
					},
					sMode: true,
					subitems: [
						{
							id: MenuID.device,
							label: 'common.menu.device.sub5',
							path: null,
							icon: null,
							metricsEvent: 'itemClick',
							metricsParent: 'device.device.navbar',
							metricsItem: 'link.mydevice',
							routerLinkActiveOptions: {
								exact: true,
							},
							sMode: true,
							subitems: [],
						},
						{
							id: MenuID.systemUpdates,
							label: 'common.menu.device.sub3',
							path: RoutePath.systemUpdates,
							icon: null,
							metricsEvent: 'itemClick',
							metricsParent: 'device.device.navbar',
							metricsItem: 'link.systemupdates',
							routerLinkActiveOptions: {
								exact: false,
							},
							adPolicyId: 'E40B12CE-C5DD-4571-BBC6-7EA5879A8472',
							subitems: [],
						},
					],
				},
				{
					id: MenuID.deviceSettings,
					label: 'common.menu.device.sub7',
					path: RoutePath.deviceSettings,
					icon: null,
					metricsEvent: 'itemClick',
					metricsParent: 'device.navbar',
					metricsItem: 'link.mydevicesettings',
					routerLinkActiveOptions: {
						exact: true,
					},
					sMode: true,
					subitems: [
						{
							id: MenuID.deviceSettings,
							label: 'common.menu.device.sub7',
							path: null,
							icon: null,
							hide: true,
							metricsEvent: 'itemClick',
							metricsParent: 'device-settings.device.navbar',
							metricsItem: 'link.mydevicesettings',
							routerLinkActiveOptions: {
								exact: false,
							},
							sMode: true,
							subitems: [],
						},
						{
							id: MenuID.power,
							label: 'device.deviceSettings.power.title',
							path: RoutePath.power,
							icon: null,
							metricsEvent: 'itemClick',
							metricsParent: 'device-settings.device.navbar',
							metricsItem: 'link.power',
							routerLinkActiveOptions: {
								exact: true,
							},
							sMode: true,
							subitems: [],
						},
						{
							id: MenuID.audio,
							label: 'device.deviceSettings.audio.title',
							path: RoutePath.audio,
							icon: null,
							metricsEvent: 'itemClick',
							metricsParent: 'device-settings.device.navbar',
							metricsItem: 'link.audio',
							routerLinkActiveOptions: {
								exact: true,
							},
							sMode: true,
							subitems: [],
						},
						{
							id: MenuID.displayCamera,
							label: 'device.deviceSettings.displayCamera.title',
							path: RoutePath.displayCamera,
							icon: null,
							metricsEvent: 'itemClick',
							metricsParent: 'device-settings.device.navbar',
							metricsItem: 'link.displaycamera',
							routerLinkActiveOptions: {
								exact: true,
							},
							sMode: true,
							subitems: [],
						},
						{
							id: MenuID.inputAccessories,
							label: 'device.deviceSettings.inputAccessories.title',
							path: RoutePath.inputAccessories,
							icon: null,
							metricsEvent: 'itemClick',
							metricsParent: 'device-settings.device.navbar',
							metricsItem: 'link.inputaccessories',
							routerLinkActiveOptions: {
								exact: true,
							},
							sMode: true,
							subitems: [],
						},
						{
							id: MenuID.smartAssist,
							label: 'common.menu.device.sub4',
							path: RoutePath.smartAssist,
							metricsEvent: 'itemClick',
							metricsParent: 'device.device.navbar',
							metricsItem: 'link.smartassist',
							externallink: false,
							routerLinkActiveOptions: {
								exact: true,
							},
							icon: null,
							sMode: true,
							subitems: [],
						},
					],
				},
			],
		},
		{
			id: MenuID.smb,
			label: 'common.menu.smb.title',
			path: RoutePath.smb,
			icon: ['fal', 'laptop'],
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.smb',
			hide: true,
			sMode: false,
			subitems: [
				{
					id: MenuID.meetingExperience,
					label: 'common.menu.smb.sub1',
					path: RoutePath.meetingExperience,
					icon: null,
					metricsEvent: 'itemClick',
					metricsParent: 'smb.navbar',
					metricsItem: 'link.meeting-experience',
					routerLinkActiveOptions: {
						exact: true,
					},
					sMode: true,
					subitems: [
						{
							id: MenuID.meetingManager,
							label: 'common.menu.smb.sub3',
							path: RoutePath.meetingManager,
							icon: null,
							metricsEvent: 'itemClick',
							metricsParent: 'smb.smb.navbar',
							metricsItem: 'link.meeting-manager',
							routerLinkActiveOptions: {
								exact: true,
							},
							sMode: false,
							subitems: [],
						},
					],
				},
				{
					id: MenuID.creatorCentre,
					label: 'common.menu.smb.sub2',
					path: RoutePath.creatorCentre,
					icon: null,
					metricsEvent: 'itemClick',
					metricsParent: 'smb.navbar',
					metricsItem: 'link.creator-centre',
					routerLinkActiveOptions: {
						exact: true,
					},
					sMode: false,
					subitems: [
						{
							id: MenuID.creatorSettings,
							label: 'common.menu.smb.sub4',
							path: RoutePath.creatorSettings,
							icon: null,
							metricsEvent: 'itemClick',
							metricsParent: 'smb.creator-centre.navbar',
							metricsItem: 'link.creator-settings',
							hide: false,
							routerLinkActiveOptions: {
								exact: true,
							},
							sMode: false,
							subitems: [],
						},
						{
							id: MenuID.easyRendering,
							label: 'common.menu.smb.sub5',
							path: RoutePath.easyRendering,
							icon: null,
							metricsEvent: 'itemClick',
							metricsParent: 'smb.creator-centre.navbar',
							metricsItem: 'link.easy-rendering',
							routerLinkActiveOptions: {
								exact: true,
							},
							sMode: false,
							subitems: [],
						},
						{
							id: 'color-calibration',
							label: 'common.menu.smb.sub6',
							path: 'color-calibration',
							icon: null,
							metricsEvent: 'itemClick',
							metricsParent: 'smb.creator-centre.navbar',
							metricsItem: 'link.color-calibration',
							routerLinkActiveOptions: {
								exact: true,
							},
							sMode: false,
							subitems: [],
						},
					],
				},
			],
		},
		{
			id: MenuID.security,
			label: 'common.menu.security.title',
			path: RoutePath.security,
			icon: ['fal', 'lock'],
			segment: '-[Commercial]',
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.security',
			subitems: [
				{
					id: MenuID.homeSecurity,
					label: 'common.menu.security.sub8',
					path: null,
					icon: null,
					metricsEvent: 'itemClick',
					metricsParent: 'navbar',
					metricsItem: 'link.mysecurity',
					routerLinkActiveOptions: {
						exact: true,
					},
					subitems: [
						{
							id: MenuID.security,
							label: 'common.menu.security.title',
							path: RoutePath.mySecurity,
							icon: null,
							metricsEvent: 'itemClick',
							metricsParent: 'navbar',
							metricsItem: 'link.mysecurity',
							routerLinkActiveOptions: {
								exact: false,
							},
							subitems: [],
						},
						{
							id: MenuID.connectedHomeSecurity,
							label: 'homeSecurity.title',
							path: RoutePath.homeSecurity,
							singleLayerRouting: true,
							metricsEvent: 'itemClick',
							metricsParent: 'navbar',
							metricsItem: 'link.homesecurity',
							routerLinkActiveOptions: {
								exact: true,
							},
							icon: ['fal', 'house-signal'],
							subitems: [],
							pre: ['assets/images/connected-home-security/welcome-slide1@2x.png'],
						},
					],
				},
				{
					id: MenuID.deviceSecurity,
					label: 'common.menu.security.sub9',
					path: null,
					icon: null,
					metricsEvent: 'itemClick',
					metricsParent: 'navbar',
					metricsItem: 'link.mysecurity',
					routerLinkActiveOptions: {
						exact: true,
					},
					subitems: [
						{
							id: MenuID.antiVirus,
							label: 'common.menu.security.sub2',
							path: RoutePath.antiVirus,
							icon: null,
							metricsEvent: 'itemClick',
							metricsParent: 'navbar',
							metricsItem: 'link.antivirus',
							routerLinkActiveOptions: {
								exact: true,
							},
							subitems: [],
							pre: [
								'assets/images/antivirus/side_bar_bottom.svg',
								'assets/images/antivirus/hero_side.png',
								'assets/images/antivirus/hero_blob.png',
								'assets/images/antivirus/hero_side_blob_white.svg',
								'assets/images/antivirus/hero_bottom_blob.svg',
							],
						},
						{
							id: MenuID.passwordProtection,
							label: 'common.menu.security.sub4',
							path: RoutePath.passwordProtection,
							metricsEvent: 'itemClick',
							metricsParent: 'navbar',
							metricsItem: 'link.passwordprotection',
							routerLinkActiveOptions: {
								exact: true,
							},
							icon: null,
							subitems: [],
						},
						{
							id: MenuID.wifiSecurity,
							label: 'common.menu.security.sub3',
							path: RoutePath.wifiSecurity,
							icon: null,
							metricsEvent: 'itemClick',
							metricsParent: 'navbar',
							metricsItem: 'link.wifisecurity',
							routerLinkActiveOptions: {
								exact: true,
							},
							subitems: [],
							pre: ['assets/images/coronet-logo.svg'],
						},
						{
							id: MenuID.internetProtection,
							label: 'common.menu.security.sub5',
							path: RoutePath.internetProtection,
							metricsEvent: 'itemClick',
							metricsParent: 'navbar',
							metricsItem: 'link.internetprotection',
							routerLinkActiveOptions: {
								exact: true,
							},
							icon: null,
							subitems: [],
						},
					],
				},
			],
		},
		{
			id: MenuID.wifiSecurity,
			label: 'common.menu.security.sub3',
			path: RoutePath.wifiSecurityFullPath,
			icon: null,
			segment: '+[Commercial]',
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.wifisecurity',
			routerLinkActiveOptions: {
				exact: true,
			},
			subitems: [],
			pre: ['assets/images/coronet-logo.svg'],
		},
		{
			id: MenuID.support,
			label: 'common.menu.support',
			path: RoutePath.support,
			icon: ['fal', 'wrench'],
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.support',
			routerLinkActiveOptions: {
				exact: true,
			},
			sMode: true,
			pre: ['assets/images/support/svg_icon_about_us.svg'],
			subitems: [
				{
					id: MenuID.support,
					label: 'support.common.getSupport',
					path: null,
					icon: null,
					metricsEvent: 'itemClick',
					metricsParent: 'navbar',
					metricsItem: 'link.support',
					routerLinkActiveOptions: {
						exact: true,
					},
					sMode: true,
					subitems: [],
				},
				{
					id: MenuID.smartPerformance,
					label: 'gaming.common.menu.smartPerformance',
					beta: false,
					path: RoutePath.smartPerfomance,
					icon: '',
					metricsEvent: 'itemClick',
					externallink: false,
					metricsParent: 'navbar',
					metricsItem: 'link.smartPerfomance',
					sMode: false,
					routerLinkActiveOptions: {
						exact: true,
					},
					subitems: [],
				},
				{
					id: MenuID.hardwareScan,
					label: 'hardwareScan.name',
					path: RoutePath.hardwareScan,
					singleLayerRouting: true,
					metricsEvent: 'itemClick',
					metricsParent: 'navbar',
					metricsItem: 'link.hardwarescan',
					segment: '-[Gaming]',
					routerLinkActiveOptions: {
						exact: true,
					},
					icon: ['fal', 'flask'],
					subitems: [],
				},
			],
		},
		{
			id: MenuID.appSearch,
			label: 'appSearch.menuName',
			beta: false,
			path: RoutePath.search,
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.app-search',
			routerLinkActiveOptions: {
				exact: true,
			},
			icon: ['fal', 'search'],
			subitems: [],
		},
		{
			id: MenuID.user,
			label: 'User',
			path: RoutePath.user,
			icon: 'user',
			metricsEvent: 'ItemClick',
			metricsParent: 'NavigationLenovoAccount.Submenu',
			metricsItem: 'link.user',
			routerLinkActiveOptions: {
				exact: true,
			},
			sMode: true,
			subitems: [],
		},
	],
	menuItemsArm: [
		{
			id: MenuID.dashboard,
			label: 'common.menu.dashboard',
			path: RoutePath.dashboard,
			icon: ['fal', 'columns'],
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.dashboard',
			routerLinkActiveOptions: {
				exact: true,
			},
			subitems: [],
		},
		{
			id: MenuID.smartPerformance,
			label: 'gaming.common.menu.smartPerformance',
			path: RoutePath.smartPerformanceBaseArm,
			icon: ['fal', 'wrench'],
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.smartPerfomance',
			routerLinkActiveOptions: {
				exact: false,
			},
			subitems: [],
		},
		{
			id: MenuID.user,
			label: 'User',
			path: RoutePath.user,
			icon: 'user',
			metricsEvent: 'ItemClick',
			metricsParent: 'NavigationLenovoAccount.Submenu',
			metricsItem: 'link.user',
			routerLinkActiveOptions: {
				exact: true,
			},
			subitems: [],
		},
	],
	betaItem: [],
};
