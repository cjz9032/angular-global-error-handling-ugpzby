import { Component, OnInit, Input } from '@angular/core';
import { HomeSecurityAccount } from 'src/app/data-models/home-security/home-security-account.model';
import { HomeSecurityCommon } from 'src/app/data-models/home-security/home-security-common.model';
import { HomeSecurityAllDevice } from 'src/app/data-models/home-security/home-security-overview-allDevice.model';

@Component({
	selector: 'vtr-home-security-all-devices',
	templateUrl: './home-security-all-devices.component.html',
	styleUrls: ['./home-security-all-devices.component.scss']
})
export class HomeSecurityAllDevicesComponent implements OnInit {
	@Input() common: HomeSecurityCommon;
	@Input() account: HomeSecurityAccount;
	@Input() allDevices: HomeSecurityAllDevice;

	pluginAvailable = true;
	itemStatusIconClass = {
		1: 'user-friends',
		2: 'home',
		3: 'tv',
		4: 'wifi',
		5: 'map-marker-alt',
	};

	constructor() {	}

	ngOnInit() {	}

	getItemStatusIconClass(item) {
		let itemStatIconClass = 'good';
		if (item.icon !== undefined && item.icon !== '') {
			if (this.itemStatusIconClass.hasOwnProperty(item.icon)) {
				itemStatIconClass = this.itemStatusIconClass[item.icon];
			}
		}
		return itemStatIconClass;
	}
}
