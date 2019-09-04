import { TranslateService } from '@ngx-translate/core';
import { HomeSecurityAllDevicesItem } from './home-security-overview-allDevices-item.model';

export class HomeSecurityAllDevice {
	allDevicesItem: HomeSecurityAllDevicesItem[];

	constructor(translateService: TranslateService, allDevices?: any) {
		if (!allDevices) { return; }
		this.allDevicesItem = [];
		allDevices.forEach((device: any) => {
			let count: number;
			let type: string;
			let icon: number;
			switch (device.type) {
				case 'familyMembers':
					count = device.count;
					type = 'homeSecurity.overview.familyMembers';
					icon = 1;
					break;
				case 'places':
					count = device.count;
					type = 'homeSecurity.overview.places';
					icon = 2;
					break;
				case 'personalDevices':
					count = device.count;
					type = 'homeSecurity.overview.personalDevices';
					icon = 3;
					break;
				case 'wifiNetworks':
					count = device.count;
					type = 'homeSecurity.overview.wifiNetworks';
					icon = 4;
					break;
				case 'homeDevices':
					count = device.count;
					type = 'homeSecurity.overview.homeDevices';
					icon = 5;
					break;
				default:
					break;
			}
			this.allDevicesItem.push(new HomeSecurityAllDevicesItem({icon, type, count}, translateService));
		});
	}
}
