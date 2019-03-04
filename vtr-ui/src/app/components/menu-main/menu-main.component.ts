import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../../services/config/config.service';
import { DeviceService } from '../../services/device/device.service';
import { UserService } from '../../services/user/user.service';

@Component({
	selector: 'vtr-menu-main',
	templateUrl: './menu-main.component.html',
	styleUrls: ['./menu-main.component.scss']
})
export class MenuMainComponent implements OnInit {

	items = [
		{
			id: 'dashboard',
			label: 'Dashboard',
			path: 'dashboard',
			icon: 'columns',
			subitems: []
		}, {
			id: 'device',
			label: 'Device',
			path: 'device',
			icon: 'laptop',
			subitems: [{
				id: 'device',
				label: 'My Device',
				path: 'device',
				icon: '',
				subitems: []
			}, {
				id: 'device-settings',
				label: 'My Device Settings',
				path: 'device-settings',
				icon: '',
				subitems: []
			}, {
				id: 'system-updates',
				label: 'System Updates',
				path: 'system-updates',
				icon: '',
				subitems: []
			}]
		}, {
			id: 'security',
			label: 'Security',
			path: 'security',
			icon: 'lock',
			subitems: [{
				id: 'security',
				label: 'My Security',
				path: 'security',
				icon: '',
				subitems: []
			}, {
				id: 'anti-virus',
				label: 'Anti-Virus',
				path: 'anti-virus',
				icon: '',
				subitems: []
			}, {
				id: 'wifi-security',
				label: 'Wifi Security',
				path: 'wifi-security',
				icon: '',
				subitems: []
			}, {
				id: 'password-protection',
				label: 'Password Protection',
				path: 'password-protection',
				icon: '',
				subitems: []
			}, {
				id: 'internet-protection',
				label: 'Internet Protection',
				path: 'internet-protection',
				icon: '',
				subitems: []
			}, {
				id: 'windows-hello',
				label: 'Windows Hello',
				path: 'windows-hello',
				icon: '',
				subitems: []
			}]
		}, {
			id: 'support',
			label: 'Support',
			path: 'support',
			icon: 'wrench',
			subitems: []
		}, {
			id: 'user',
			label: 'User',
			path: 'user',
			icon: 'user',
			subitems: []
		}
	];

	constructor(
		private router: Router,
		public configService: ConfigService,
		public deviceService: DeviceService,
		public userService: UserService
	) { }

	ngOnInit() {
	}

	menuItemClick(event, path) {
		this.router.navigateByUrl(path);
	}

}
