import {
	Injectable
} from '@angular/core';
import {
	DeviceService
} from 'src/app/services/device/device.service';
import { CommonService } from '../common/common.service';
import { menuItemsGaming, menuItems, appSearch, betaItem } from 'src/assets/menu/menu.json';
import { HypothesisService } from '../hypothesis/hypothesis.service';
import { LoggerService } from '../logger/logger.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { MenuItem } from 'src/app/enums/menuItem.enum';
import { LocalInfoService } from '../local-info/local-info.service';
import { SegmentConst } from '../self-select/self-select.service';

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
	public countryCodes = ['us', 'ca', 'gb', 'ie', 'de', 'fr', 'es', 'it', 'au'];
	public readonly menuItemNotification: Observable<AppNotification>;
	private menuItemSubject: BehaviorSubject<AppNotification>;
	constructor(
		private deviceService: DeviceService,
		private hypSettings: HypothesisService,
		private logger: LoggerService,
		private commonService: CommonService,
		private localInfoService: LocalInfoService) {
			this.menuItemSubject = new BehaviorSubject<AppNotification>(
				new AppNotification(MenuItem.MenuItemChange, 'init')
			);
			this.menuItemNotification = this.menuItemSubject;
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
			const isBetaUser = this.commonService.getBetaUser();
			const machineInfo = await this.deviceService.getMachineInfo();
			const localInfo = await this.localInfoService.getLocalInfo();
			const segment: string = localInfo.Segment ? localInfo.Segment : SegmentConst.Commercial;
			let resultMenu = Object.assign([], this.menuItemsGaming);
			if (isGaming) {
				if (isBetaUser && this.deviceService.showSearch) {
					resultMenu.splice(resultMenu.length - 1, 0 , this.appSearch);
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
			this.showVpn(country.toLowerCase(), resultMenu);
			if (isBetaUser) {
				resultMenu.splice(resultMenu.length - 1, 0, ...this.betaItem);
				if (this.deviceService.showSearch) {
					resultMenu.splice(resultMenu.length - 1, 0 , this.appSearch);
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

	showVpn(region, items) {
		const securityItemForVpn = items.find((item) => item.id === 'security');
		if (securityItemForVpn !== undefined) {
			const vpnItem = securityItemForVpn.subitems.find((item) => item.id === 'internet-protection');
			if (region !== 'cn') {
				if (!vpnItem) {
					securityItemForVpn.subitems.splice(4, 0, {
						id: 'internet-protection',
						label: 'common.menu.security.sub5',
						path: 'internet-protection',
						metricsEvent: 'itemClick',
						metricsParent: 'navbar',
						metricsItem: 'link.internetprotection',
						routerLinkActiveOptions: { exact: true },
						icon: '',
						segment: `-[${SegmentConst.Commercial}]`,
						subitems: []
					});
				}
			} else {
				if (vpnItem) {
					securityItemForVpn.subitems = securityItemForVpn.subitems.filter(
						(item) => item.id !== 'internet-protection'
					);
				}
			}
		}
	}

	segmentFilter(menu: Array<any>, segment: string) {
		if (!segment) { return menu; }
		menu.forEach(element => {
			if (element.segment) {
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
