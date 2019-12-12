import {
	Injectable, EventEmitter
} from '@angular/core';
import {
	DeviceService
} from 'src/app/services/device/device.service';
import cloneDeep from 'lodash/cloneDeep';
import { menuItemsGaming, menuItems, appSearch, betaItem } from 'src/assets/menu/menu.json';
import { privacyPolicyLinks } from 'src/assets/privacy-policy-links/policylinks.json';
import { HypothesisService } from '../hypothesis/hypothesis.service';
import { BetaService } from '../beta/beta.service';
import { LoggerService } from '../logger/logger.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { MenuItem } from 'src/app/enums/menuItem.enum';
import { LocalInfoService } from '../local-info/local-info.service';
import { SegmentConst } from '../self-select/self-select.service';
import { SecurityAdvisor, EventTypes, WindowsHello, WifiSecurity } from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';


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
	appSearch = appSearch;
	betaItem = betaItem;
	privacyPolicyLinks = privacyPolicyLinks;
	showCHS = false;
	wifiSecurity: WifiSecurity;
	securityAdvisor: SecurityAdvisor;
	public readonly menuItemNotification: Observable<AppNotification>;
	private menuItemSubject: BehaviorSubject<AppNotification>;
	windowsHello: WindowsHello;
	public countryCodes = ['us', 'ca', 'gb', 'ie', 'de', 'fr', 'es', 'it', 'au'];

	constructor(
		private betaService: BetaService,
		private deviceService: DeviceService,
		private hypSettings: HypothesisService,
		private logger: LoggerService,
		private localInfoService: LocalInfoService,
		private vantageShellService: VantageShellService,
		private commonService: CommonService) {
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
			const isBetaUser = this.betaService.getBetaStatus();
			const machineInfo = await this.deviceService.getMachineInfo();
			const localInfo = await this.localInfoService.getLocalInfo();
			const segment: string = localInfo.Segment ? localInfo.Segment : SegmentConst.Commercial;
			let resultMenu = cloneDeep(this.menuItemsGaming);
			if (isGaming) {
				if (isBetaUser && this.deviceService.showSearch) {
					resultMenu.splice(resultMenu.length - 1, 0, this.appSearch);
				}
				resolve(resultMenu);
			}
			const country = machineInfo && machineInfo.country ? machineInfo.country : 'US';
			const locale: string = machineInfo && machineInfo.locale ? machineInfo.locale : 'en';
			resultMenu = cloneDeep(this.menuItems);
			if (!this.deviceService.showPrivacy) {
				resultMenu = resultMenu.filter(item => item.id !== 'privacy');
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
						&& segment !== SegmentConst.Commercial;
					if (!this.showCHS) {
						resultMenu = resultMenu.filter(item => item.id !== 'home-security');
					}
				});
			}
			this.showSecurityItem(country.toLowerCase(), resultMenu);
			if (isBetaUser) {
				resultMenu.splice(resultMenu.length - 1, 0, ...this.betaItem);
				if (this.deviceService.showSearch) {
					resultMenu.splice(resultMenu.length - 1, 0, this.appSearch);
				}
			}
			resultMenu = this.segmentFilter(resultMenu, segment);
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

	showSecurityItem(region, items) {
		const securityItem = items.find((item) => item.id === 'security');
		const cacheWifi = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity, false);
		if (securityItem) {
			items = this.supportFilter(items, 'wifi-security', cacheWifi);
			if (region === 'cn') {
				items = this.supportFilter(items, 'internet-protection', false);
			} else {
				items = this.supportFilter(items, 'internet-protection', true);
			}
			if (typeof this.wifiSecurity.isSupported === 'boolean') {
				items = this.supportFilter(items, 'wifi-security', this.wifiSecurity.isSupported);
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity, this.wifiSecurity.isSupported);
			}
		}
	}

	segmentFilter(menu: Array<any>, segment: string) {
		if (!segment) { return menu; }
		menu.forEach(element => {
			if (element.segment) {
				if (element.hide) { return; }
				const mode = element.segment.charAt(0);
				const segments = element.segment.substring(2, element.segment.length - 1).split(',');
				if (mode === '+') {
					element.hide = !segments.includes(segment);
				} else if (mode === '-') {
					element.hide = segments.includes(segment);
				}
			}
			if (element.subitems.length > 0) {
				element.subitems = this.segmentFilter(element.subitems, segment);
			}
		});
		return menu;
	}

	supportFilter(menu: Array<any>, id: string, isSupported: boolean) {
		menu.forEach(item => {
			if (item.id === id) {
				item.isSupported = isSupported;
				item.hide = !isSupported;
			}
			if (item.subitems.length > 0) {
				item.subitems = this.supportFilter(item.subitems, id, isSupported);
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

	notifyMenuChange(payload?) {
		const appNotification = new AppNotification(MenuItem.MenuItemChange, payload);
		this.menuItemSubject.next(appNotification);
	}
}
