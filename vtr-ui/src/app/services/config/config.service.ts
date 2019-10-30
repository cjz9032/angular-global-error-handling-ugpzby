import {
	Injectable
} from '@angular/core';
import {
	DeviceService
} from 'src/app/services/device/device.service';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { menuItemsGaming, menuItems, menuItemsPrivacy, appSearch, betaItem } from 'src/assets/menu/menu.json';
import { HypothesisService } from '../hypothesis/hypothesis.service';
import { LoggerService } from '../logger/logger.service';

declare var Windows;

interface ShellVersion {
	major: number;
	minor: number;
	build: number;
}

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
	showCHSMenu = false;
	public countryCodes = ['us', 'ca', 'gb', 'ie', 'de', 'fr', 'es', 'it', 'au'];
	constructor(
		private deviceService: DeviceService,
		private hypSettings: HypothesisService,
		private logger: LoggerService,
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
		return new Promise(async (resolve, reject) => {
			const isBetaUser = this.commonService.getLocalStorageValue(LocalStorageKey.BetaUser, false);
			const machineInfo = this.deviceService.getMachineInfoSync();
			const brand: string = machineInfo.brand;
			let resultMenu = Object.assign([], this.menuItemsGaming);
			if (isGaming) {
				if (isBetaUser && this.deviceService.showSearch) {
					resultMenu.splice(resultMenu.length - 1, 0 , this.appSearch);
				}
				resolve(resultMenu);
			}
			const country = machineInfo && machineInfo.country ? machineInfo.country : 'US';
			const locale: string = machineInfo && machineInfo.locale ? machineInfo.locale : 'en';
			if (this.deviceService.showPrivacy && brand.toLowerCase() !== 'think') {
				resultMenu = Object.assign([], this.menuItemsPrivacy);
			} else {
				resultMenu = Object.assign([], this.menuItems);
			}
			if (this.hypSettings) {
				await this.initShowCHSMenu().then((result) => {
					const shellVersion = {
						major: 10,
						minor: 1910,
						build: 12
					};
					this.showCHSMenu = country.toLowerCase() === 'us' && locale.startsWith('en') && result && this.isShowCHSByShellVersion(shellVersion);
					if (!this.showCHSMenu) {
						resultMenu = resultMenu.filter(item => item.id !== 'home-security');
					}
				});
			}
			if (isBetaUser) {
				resultMenu.splice(resultMenu.length - 1, 0, ...this.betaItem);
				if (this.deviceService.showSearch) {
					resultMenu.splice(resultMenu.length - 1, 0 , this.appSearch);
				}
			}
			resultMenu = this.brandFilter(resultMenu);
			resolve(resultMenu.filter(item => !item.hide));
		});
	}

	initShowCHSMenu() {
		return this.hypSettings.getFeatureSetting('ConnectedHomeSecurity').then((result) => {
			return ((result || '').toString() === 'true');
		}, (error) => {
			this.logger.error('DeviceService.initShowCHSMenu: promise rejected ', error);
		});
	}

	isShowCHSByShellVersion(shellVersion: ShellVersion) {
		const packageVersion = Windows.ApplicationModel.Package.current.id.version;
		return packageVersion.major !== shellVersion.major ? packageVersion.major > shellVersion.major :
		packageVersion.minor !== shellVersion.minor ? packageVersion.minor > shellVersion.minor :
		packageVersion.build >= shellVersion.build;
	}

	brandFilter(menu: Array<any>) {
		const machineInfo = this.deviceService.getMachineInfoSync();
		if (!machineInfo) { return menu; }
		const brand: string = machineInfo.brand;
		if (!brand) { return menu; }
		menu.forEach(element => {
			if (element.hide) { return; }
			if (element.brand) {
				const mode = element.brand.charAt(0);
				const brands = element.brand.substring(2, element.brand.length - 1).split(',');
				if (mode === '+') {
					element.hide = !brands.includes(brand);
				} else if (mode === '-') {
					element.hide = brands.includes(brand);
				}
			}
		});
		return menu;
	}
}
