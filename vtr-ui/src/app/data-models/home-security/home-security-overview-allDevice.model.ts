import { TranslateService } from '@ngx-translate/core';
import { HomeSecurityAllDevicesItem } from './home-security-overview-allDevices-item.model';
import { CHSDeviceOverview } from '@lenovo/tan-client-bridge';

export class HomeSecurityAllDevice {
	allDevicesItem: HomeSecurityAllDevicesItem[];

	constructor(translateService: TranslateService, allDevices?: CHSDeviceOverview) {
		if (!allDevices) {
			return;
		}
		this.allDevicesItem = [];
		delete allDevices.allDevicesCount;
		delete allDevices.allDevicesProtected;
		for (const key in allDevices) {
			if (allDevices.hasOwnProperty(key)) {
				let count: number;
				let type: string;
				let icon: number;
				switch (key) {
					case 'familyMembersCount':
						count = allDevices.familyMembersCount;
						type = 'homeSecurity.overview.familyMembers';
						icon = 1;
						break;
					case 'placesCount':
						count = allDevices.placesCount;
						type = 'homeSecurity.overview.places';
						icon = 2;
						break;
					case 'personalDevicesCount':
						count = allDevices.personalDevicesCount;
						type = 'homeSecurity.overview.personalDevices';
						icon = 3;
						break;
					case 'wifiNetworkCount':
						count = allDevices.wifiNetworkCount;
						type = 'homeSecurity.overview.wifiNetworks';
						icon = 4;
						break;
					case 'homeDevicesCount':
						count = allDevices.homeDevicesCount;
						type = 'homeSecurity.overview.homeDevices';
						icon = 5;
						break;
					default:
						break;
				}

				if (icon && type && count) {
					this.allDevicesItem.push(
						new HomeSecurityAllDevicesItem({ icon, type, count }, translateService)
					);
				}
			}
		}
	}
}
