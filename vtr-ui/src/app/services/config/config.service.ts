import { Injectable } from '@angular/core';
import {DeviceService} from "../device/device.service";

@Injectable({
	providedIn: 'root'
})
export class ConfigService {

	appBrand = 'Lenovo';
	appName = 'Vantage';
	public countryCodes=['us','ca','gb','ie','de','fr','es','it','au'];
	constructor(private deviceService:DeviceService) { }

	menuItemsGaming: Array<any> = [
		{
			id: 'device',
			label: 'common.menu.device.title',
			path: 'device-gaming',
			icon: ['fas', 'desktop'],
			metricsEvent: 'featureClick',
			metricsParent: 'navbar',
			metricsItem: 'link.device',
			routerLinkActiveOptions: { exact: true },
			forArm: true,
			subitems: []
		}, {
			id: 'support',
			label: 'common.menu.support',
			path: 'support',
			icon: ['fal', 'wrench'],
			metricsEvent: 'featureClick',
			metricsParent: 'navbar',
			metricsItem: 'link.support',
			routerLinkActiveOptions: { exact: true },
			forArm: false,
			subitems: []
		}, {
			id: 'user',
			label: 'User',
			path: 'user',
			icon: 'user',
			metricsEvent: 'featureClick',
			metricsParent: 'NavigationLenovoAccount.Submenu',
			metricsItem: 'link.user',
			routerLinkActiveOptions: { exact: true },
			forArm: true,
			subitems: []
		}
	];
	menuItems: Array<any> = [
		{
			id: 'dashboard',
			label: 'common.menu.dashboard',
			path: 'dashboard',
			icon: ['fal', 'columns'],
			metricsEvent: 'featureClick',
			metricsParent: 'navbar',
			metricsItem: 'link.dashboard',
			routerLinkActiveOptions: { exact: true },
			forArm: true,
			subitems: []
		}, {
			id: 'device',
			label: 'common.menu.device.title',
			path: 'device',
			icon: ['fal', 'laptop'],
			metricsEvent: 'featureClick',
			metricsParent: 'navbar',
			metricsItem: 'link.device',
			forArm: false,
			subitems: [{
				id: 'device',
				label: 'common.menu.device.sub1',
				path: '',
				icon: '',
				metricsEvent: 'featureClick',
				metricsParent: 'navbar',
				metricsItem: 'link.mydevice',
				routerLinkActiveOptions: { exact: true },
				subitems: []
			}, {
				id: 'device-settings',
				label: 'common.menu.device.sub2',
				path: 'device-settings',
				icon: '',
				metricsEvent: 'featureClick',
				metricsParent: 'navbar',
				metricsItem: 'link.mydevicesettings',
				routerLinkActiveOptions: { exact: false },
				subitems: []
			}, {
				id: 'system-updates',
				label: 'common.menu.device.sub3',
				path: 'system-updates',
				icon: '',
				metricsEvent: 'featureClick',
				metricsParent: 'navbar',
				metricsItem: 'link.systemupdates',
				routerLinkActiveOptions: { exact: true },
				subitems: []
			}]
		}, {
			id: 'security',
			label: 'common.menu.security.title',
			path: 'security',
			icon: ['fal', 'lock'],
			metricsEvent: 'featureClick',
			metricsParent: 'navbar',
			metricsItem: 'link.security',
			forArm: false,
			subitems: [{
				id: 'security',
				label: 'common.menu.security.sub1',
				path: '',
				icon: '',
				metricsEvent: 'featureClick',
				metricsParent: 'navbar',
				metricsItem: 'link.mysecurity',
				routerLinkActiveOptions: { exact: true },
				subitems: []
			}, {
				id: 'anti-virus',
				label: 'common.menu.security.sub2',
				path: 'anti-virus',
				icon: '',
				metricsEvent: 'featureClick',
				metricsParent: 'navbar',
				metricsItem: 'link.antivirus',
				routerLinkActiveOptions: { exact: true },
				subitems: []
			}, {
				id: 'wifi-security',
				label: 'common.menu.security.sub3',
				path: 'wifi-security',
				icon: '',
				metricsEvent: 'featureClick',
				metricsParent: 'navbar',
				metricsItem: 'link.wifisecurity',
				routerLinkActiveOptions: { exact: true },
				subitems: []
			}, {
				id: 'password-protection',
				label: 'common.menu.security.sub4',
				path: 'password-protection',
				metricsEvent: 'featureClick',
				metricsParent: 'navbar',
				metricsItem: 'link.passwordprotection',
				routerLinkActiveOptions: { exact: true },
				icon: '',
				subitems: []
			}]
		},{
			id: 'support',
			label: 'common.menu.support',
			path: 'support',
			icon: ['fal', 'wrench'],
			metricsEvent: 'featureClick',
			metricsParent: 'navbar',
			metricsItem: 'link.support',
			routerLinkActiveOptions: { exact: true },
			forArm: false,
			subitems: []
		}, {
			id: 'user',
			label: 'User',
			path: 'user',
			icon: 'user',
			metricsEvent: 'featureClick',
			metricsParent: 'NavigationLenovoAccount.Submenu',
			metricsItem: 'link.user',
			routerLinkActiveOptions: { exact: true },
			forArm: true,
			subitems: []
		}
	];
	menuItemsPrivacy: Array<any> = [
		{
			id: 'dashboard',
			label: 'common.menu.dashboard',
			path: 'dashboard',
			icon: ['fal', 'columns'],
			metricsEvent: 'featureClick',
			metricsParent: 'navbar',
			metricsItem: 'link.dashboard',
			routerLinkActiveOptions: { exact: true },
			forArm: true,
			subitems: []
		}, {
			id: 'device',
			label: 'common.menu.device.title',
			path: 'device',
			icon: ['fal', 'laptop'],
			metricsEvent: 'featureClick',
			metricsParent: 'navbar',
			metricsItem: 'link.device',
			forArm: false,
			subitems: [{
				id: 'device',
				label: 'common.menu.device.sub1',
				path: '',
				icon: '',
				metricsEvent: 'featureClick',
				metricsParent: 'navbar',
				metricsItem: 'link.mydevice',
				routerLinkActiveOptions: { exact: true },
				subitems: []
			}, {
				id: 'device-settings',
				label: 'common.menu.device.sub2',
				path: 'device-settings',
				icon: '',
				metricsEvent: 'featureClick',
				metricsParent: 'navbar',
				metricsItem: 'link.mydevicesettings',
				routerLinkActiveOptions: { exact: false },
				subitems: []
			}, {
				id: 'system-updates',
				label: 'common.menu.device.sub3',
				path: 'system-updates',
				icon: '',
				metricsEvent: 'featureClick',
				metricsParent: 'navbar',
				metricsItem: 'link.systemupdates',
				routerLinkActiveOptions: { exact: true },
				subitems: []
			}]
		}, {
			id: 'security',
			label: 'common.menu.security.title',
			path: 'security',
			icon: ['fal', 'lock'],
			metricsEvent: 'featureClick',
			metricsParent: 'navbar',
			metricsItem: 'link.security',
			forArm: false,
			subitems: [{
				id: 'security',
				label: 'common.menu.security.sub1',
				path: '',
				icon: '',
				metricsEvent: 'featureClick',
				metricsParent: 'navbar',
				metricsItem: 'link.mysecurity',
				routerLinkActiveOptions: { exact: true },
				subitems: []
			}, {
				id: 'anti-virus',
				label: 'common.menu.security.sub2',
				path: 'anti-virus',
				icon: '',
				metricsEvent: 'featureClick',
				metricsParent: 'navbar',
				metricsItem: 'link.antivirus',
				routerLinkActiveOptions: { exact: true },
				subitems: []
			}, {
				id: 'wifi-security',
				label: 'common.menu.security.sub3',
				path: 'wifi-security',
				icon: '',
				metricsEvent: 'featureClick',
				metricsParent: 'navbar',
				metricsItem: 'link.wifisecurity',
				routerLinkActiveOptions: { exact: true },
				subitems: []
			}, {
				id: 'password-protection',
				label: 'common.menu.security.sub4',
				path: 'password-protection',
				metricsEvent: 'featureClick',
				metricsParent: 'navbar',
				metricsItem: 'link.passwordprotection',
				routerLinkActiveOptions: { exact: true },
				icon: '',
				subitems: []
			}]
		},{
			id: 'support',
			label: 'common.menu.support',
			path: 'support',
			icon: ['fal', 'wrench'],
			metricsEvent: 'featureClick',
			metricsParent: 'navbar',
			metricsItem: 'link.support',
			routerLinkActiveOptions: { exact: true },
			forArm: false,
			subitems: []
		},{
			id: 'privacy',
			label: 'common.menu.privacy',
			path: 'privacy',
			icon: ['fal', 'eye'],
			metricsEvent: 'featureClick',
			metricsParent: 'navbar',
			metricsItem: 'link.privacy',
			routerLinkActiveOptions: { exact: true },
			forArm: false,
			subitems: []
		}, {
			id: 'user',
			label: 'User',
			path: 'user',
			icon: 'user',
			metricsEvent: 'featureClick',
			metricsParent: 'NavigationLenovoAccount.Submenu',
			metricsItem: 'link.user',
			routerLinkActiveOptions: { exact: true },
			forArm: true,
			subitems: []
		},
	];
	getMenuItems(isGaming){
		if(isGaming){
			return this.menuItemsGaming;
		} else {
			return this.menuItems;
		}
	}

	getMenuItemsAsync(isGaming){
		return this.deviceService.getMachineInfo().then((machineInfo)=>{
			console.log('*****************************************',machineInfo.country)
			if(isGaming){
				return this.menuItemsGaming;
			} else if(this.countryCodes.indexOf(machineInfo.country.toLowerCase())!==-1) {
				return this.menuItemsPrivacy;
			}else{
				return this.menuItems;
			}
		})
	}
}
