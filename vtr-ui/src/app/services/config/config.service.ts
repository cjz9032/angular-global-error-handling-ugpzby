import {
	Injectable, EventEmitter
} from '@angular/core';
import {
	DeviceService
} from 'src/app/services/device/device.service';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { menuItemsGaming, menuItems, menuItemsPrivacy, appSearch, betaItem } from 'src/assets/menu/menu.json';
import { privacyPolicyLinks } from 'src/assets/privacy-policy-links/policylinks.json';
import { HypothesisService } from '../hypothesis/hypothesis.service';
import { LoggerService } from '../logger/logger.service';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { SecurityAdvisor, WifiSecurity, EventTypes } from '@lenovo/tan-client-bridge';
import { MenuItem } from 'src/app/enums/menuItem.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
// declare var Windows;


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
	privacyPolicyLinks = privacyPolicyLinks;
	showCHS = false;
	wifiSecurity: WifiSecurity;
	securityAdvisor: SecurityAdvisor;
	public readonly menuItemNotification: Observable<AppNotification>;
	private menuItemSubject: BehaviorSubject<AppNotification>;
	public countryCodes = ['us', 'ca', 'gb', 'ie', 'de', 'fr', 'es', 'it', 'au'];
	constructor(
		private deviceService: DeviceService,
		private commonService: CommonService,
		private hypSettings: HypothesisService,
		private logger: LoggerService,
		private vantageShellService: VantageShellService) {
		this.menuItemSubject = new BehaviorSubject<AppNotification>(
			new AppNotification(MenuItem.MenuItemChange, 'init')
		);
		this.menuItemNotification = this.menuItemSubject;
		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
		if (this.securityAdvisor) {
			this.wifiSecurity = this.securityAdvisor.wifiSecurity;
			this.wifiSecurity.getWifiSecurityState();
			this.wifiSecurity.on(EventTypes.wsIsSupportWifiEvent, () => {
				this.notifyMenuChange(this.wifiSecurity.isSupported);
			});
		}
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
			const country = machineInfo && machineInfo.country ? machineInfo.country : 'US';
			const locale: string = machineInfo && machineInfo.locale ? machineInfo.locale : 'en';
			const brand: string = machineInfo.brand;
			let resultMenu = Object.assign([], this.menuItemsGaming);

			if (isGaming) {
				if (isBetaUser && this.deviceService.showSearch) {
					resultMenu.splice(resultMenu.length - 1, 0, this.appSearch);
				}
				resolve(resultMenu);
			}
			if (this.deviceService.showPrivacy) {
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
					this.showCHS = country.toLowerCase() === 'us'
						&& locale.startsWith('en')
						&& result
						&& this.isShowCHSByShellVersion(shellVersion)
						&& !isGaming
						&& brand !== 'think';
					if (!this.showCHS) {
						resultMenu = resultMenu.filter(item => item.id !== 'home-security');
					}
				});
			}
			resultMenu = this.getWifiItem(resultMenu);
			if (isBetaUser) {
				resultMenu.splice(resultMenu.length - 1, 0, ...this.betaItem);
				if (this.deviceService.showSearch) {
					resultMenu.splice(resultMenu.length - 1, 0, this.appSearch);
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
			this.logger.error('ConfigService.initShowCHSMenu: promise rejected ', error);
		});
	}

	isShowCHSByShellVersion(shellVersion: ShellVersion) {
		const Windows = this.getWindows();
		if (Windows) {
			const packageVersion = Windows.ApplicationModel.Package.current.id.version;
			return packageVersion.major !== shellVersion.major ? packageVersion.major > shellVersion.major :
				packageVersion.minor !== shellVersion.minor ? packageVersion.minor > shellVersion.minor :
					packageVersion.build >= shellVersion.build;
		} else {
			return true;
		}
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
				if (mode === '+' && element.isSupported !== false) {
					element.hide = !brands.includes(brand);
				} else if (mode === '-') {
					element.hide = brands.includes(brand);
				}
			}
		});
		return menu;
	}

	supportFilter(menu: Array<any>,  id: string, isSupported: boolean) {
		menu.forEach(item => {
			if (item.id === id) {
				item.isSupported = isSupported;
				item.hide = !isSupported;
			}
			if (item.subitems.length > 0) {
				item.subitems.forEach(subitem => {
					if (subitem.id === id) {
						subitem.isSupported = isSupported;
						subitem.hide = !isSupported;
					}
				});
			}
		});
		return menu;
	}

	getPrivacyPolicyLink(): Promise<any> {
		return new Promise((resolve) => {
			this.deviceService.getMachineInfo().then(val => {
				resolve(privacyPolicyLinks[val.locale] || privacyPolicyLinks.default);
			});
		});
	}

	private getWindows(): any {
		const win: any = window;
		if (win.Windows) {
			return win.Windows;
		}
		return undefined;
	}

	getWifiItem(resultMenu) {
		const cacheShowWifiSecurity = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity, false);
		resultMenu = this.supportFilter(resultMenu, 'wifi-security', cacheShowWifiSecurity);
		if (typeof this.wifiSecurity.isSupported === 'boolean') {
			resultMenu = this.supportFilter(resultMenu, 'wifi-security', this.wifiSecurity.isSupported);
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity, this.wifiSecurity.isSupported);
		}
		return resultMenu;
	}

	notifyMenuChange(payload?) {
		const appNotification = new AppNotification(MenuItem.MenuItemChange, payload);
		this.menuItemSubject.next(appNotification);
	}
}
