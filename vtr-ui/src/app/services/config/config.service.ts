import {
	Injectable
} from '@angular/core';
import {
	DeviceService
} from 'src/app/services/device/device.service';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { menuItemsGaming, menuItems, menuItemsPrivacy, appSearch, betaItem} from 'src/assets/menu/menu.json';

@Injectable({
	providedIn: 'root'
})
export class ConfigService {

	appBrand = 'Lenovo';
	appName = 'Vantage';
	menuItemsGaming = menuItemsGaming;
	menuItems = menuItems;
	menuItemsPrivacy = menuItemsPrivacy;
	appSearch = appSearch;
	betaItem = betaItem;
	public countryCodes = ['us', 'ca', 'gb', 'ie', 'de', 'fr', 'es', 'it', 'au'];
	constructor(
		private deviceService: DeviceService,
		private commonService: CommonService) {
	}


	getMenuItems(isGaming) {
		if (isGaming) {
			return this.menuItemsGaming;
		} else {
			return this.menuItems;
		}
	}

	getMenuItemsAsync(isGaming): Promise<any> {
		return new Promise((resolve, reject) => {
			const isBetaUser = this.commonService.getLocalStorageValue(LocalStorageKey.BetaUser, false);
			const machineInfo = this.deviceService.getMachineInfoSync();
			let resultMenu = Object.assign([], this.menuItemsGaming);
			if (isGaming) {
				if (isBetaUser) {
					resultMenu.splice(resultMenu.length - 1, 0, this.appSearch);
				}
				resolve(resultMenu);
			}
			const country = machineInfo && machineInfo.country ? machineInfo.country : 'US';
			const locale: string = machineInfo && machineInfo.locale ? machineInfo.locale : 'en';
			if (this.deviceService.showPrivacy) {
				resultMenu = Object.assign([], this.menuItemsPrivacy);
			} else {
				resultMenu = Object.assign([], this.menuItems);
			}
			const showCHSMenu = country.toLowerCase() === 'us' && locale.startsWith('en');
			if (!showCHSMenu) {
				resultMenu = resultMenu.filter(item => item.id !== 'home-security');
			}
			if (isBetaUser) {
				resultMenu.splice(resultMenu.length - 1, 0, ...this.betaItem);
			}
			resultMenu = this.brandFilter(resultMenu);
			resolve(resultMenu.filter(item => !item.hide));
		});
	}

	brandFilter(menu: Array<any>) {
		let brandMenu = [];
		let includeMenu = [];
		let excludeMenu = [];
		const brand: string = this.deviceService.getMachineInfoSync().brand;
		if (brand) {
			menu.forEach(element => {
				if (element.brand) {
					brandMenu = element.brand.split(',');
					includeMenu = brandMenu.filter((e: string) => e.includes('+'));
					excludeMenu = brandMenu.filter((e: string) => e.includes('-'));
					if (!(includeMenu.includes(`+${brand}`) && excludeMenu.includes(`-${brand}`))) {
						if (includeMenu.includes(`+${brand}`)) {
							element.hide = false;
						}
						if (excludeMenu.includes(`-${brand}`)) {
							element.hide = true;
						}
					}
				 }
			});
		}
		return menu;
	}
}
