import {
	Injectable
} from '@angular/core';
import {
	DeviceService
} from 'src/app/services/device/device.service';
import { menuItemsGaming, menuItems, appSearch, betaItem } from 'src/assets/menu/menu.json';
import { HypothesisService } from '../hypothesis/hypothesis.service';
import { BetaService } from '../beta/beta.service';
import { LoggerService } from '../logger/logger.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { MenuItem } from 'src/app/enums/menuItem.enum';
import { LocalInfoService } from '../local-info/local-info.service';
import { SegmentConst } from '../self-select/self-select.service';
import { SecurityAdvisor, EventTypes, WindowsHello } from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { SecurityAdvisorMockService } from '../security/securityMock.service';
import { WindowsHelloService } from '../security/windowsHello.service';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

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
	appSearch = appSearch;
	betaItem = betaItem;
	showCHSMenu = false;
	securityAdvisor: SecurityAdvisor;
	windowsHello: WindowsHello;
	public countryCodes = ['us', 'ca', 'gb', 'ie', 'de', 'fr', 'es', 'it', 'au'];
	public readonly menuItemNotification: Observable<AppNotification>;
	private menuItemSubject: BehaviorSubject<AppNotification>;
	constructor(
		private betaService: BetaService,
		private deviceService: DeviceService,
		private hypSettings: HypothesisService,
		private logger: LoggerService,
		private localInfoService: LocalInfoService,
		private vantageShellService: VantageShellService,
		private securityAdvisorMockService: SecurityAdvisorMockService,
		private windowsHelloService: WindowsHelloService,
		private commonService: CommonService) {
		this.menuItemSubject = new BehaviorSubject<AppNotification>(
			new AppNotification(MenuItem.MenuItemChange, 'init')
		);
		this.menuItemNotification = this.menuItemSubject;
		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
		if (!this.securityAdvisor) {
			this.securityAdvisor = this.securityAdvisorMockService.getSecurityAdvisor();
		}
		this.windowsHello = this.securityAdvisor.windowsHello;
		if (!this.windowsHello.fingerPrintStatus) {
			this.windowsHello.refresh();
		}
		this.windowsHello.on(EventTypes.helloFingerPrintStatusEvent, (result) => {
			this.notifyMenuChange(result);
		});

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
			const isBetaUser = await this.betaService.getBetaStatus();
			const machineInfo = await this.deviceService.getMachineInfo();
			const localInfo = await this.localInfoService.getLocalInfo();
			const segment: string = localInfo.Segment ? localInfo.Segment : SegmentConst.Commercial;
			let resultMenu = Object.assign([], this.menuItemsGaming);
			if (isGaming) {
				if (isBetaUser && this.deviceService.showSearch) {
					resultMenu.splice(resultMenu.length - 1, 0, this.appSearch);
				}
				resolve(resultMenu);
			}
			const country = machineInfo && machineInfo.country ? machineInfo.country : 'US';
			const locale: string = machineInfo && machineInfo.locale ? machineInfo.locale : 'en';
			resultMenu = Object.assign([], this.menuItems);
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
					this.showCHSMenu = country.toLowerCase() === 'us' && locale.startsWith('en') && result && this.isShowCHSByShellVersion(shellVersion);
					if (!this.showCHSMenu) {
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
			this.logger.error('DeviceService.initShowCHSMenu: promise rejected ', error);
		});
	}

	isShowCHSByShellVersion(shellVersion: ShellVersion) {
		const packageVersion = Windows.ApplicationModel.Package.current.id.version;
		return packageVersion.major !== shellVersion.major ? packageVersion.major > shellVersion.major :
			packageVersion.minor !== shellVersion.minor ? packageVersion.minor > shellVersion.minor :
				packageVersion.build >= shellVersion.build;
	}

	showSecurityItem(region, items) {
		const securityItem = items.find((item) => item.id === 'security');
		if (securityItem) {
			if (region === 'cn') {
				items = this.supportFilter(items, 'internet-protection', false);
			} else {
				items = this.supportFilter(items, 'internet-protection', true);
			}
			const cacheShowWindowsHello = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowWindowsHello, false);
			items = this.supportFilter(items, 'windows-hello', cacheShowWindowsHello);
			if (this.windowsHello.fingerPrintStatus) {
				items = this.supportFilter(items, 'windows-hello', this.windowsHelloService.showWindowsHello());
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWindowsHello, this.windowsHelloService.showWindowsHello());
			}
		}
	}

	supportFilter(menu: Array<any>,  id: string, isSupported: boolean) {
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

	notifyMenuChange(payload?) {
		const appNotification = new AppNotification(MenuItem.MenuItemChange, payload);
		this.menuItemSubject.next(appNotification);
	}
}
