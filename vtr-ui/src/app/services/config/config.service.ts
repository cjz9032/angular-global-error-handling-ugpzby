import {
	Injectable
} from '@angular/core';
import {
	DeviceService
} from 'src/app/services/device/device.service';
import cloneDeep from 'lodash/cloneDeep';
import { menuItemsGaming, menuItems, betaItem } from 'src/assets/menu/menu.json';
import { privacyPolicyLinks } from 'src/assets/privacy-policy-links/policylinks.json';
import { HypothesisService } from '../hypothesis/hypothesis.service';
import { BetaService, BetaStatus } from '../beta/beta.service';
import { LoggerService } from '../logger/logger.service';
import { MenuItemEvent } from 'src/app/enums/menuItemEvent.enum';
import { LocalInfoService } from '../local-info/local-info.service';
import { SegmentConst } from '../self-select/self-select.service';
import { SecurityAdvisor, EventTypes, WindowsHello, WifiSecurity } from '@lenovo/tan-client-bridge';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { CommonService } from '../common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { Subscription } from 'rxjs';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { AdPolicyEvent, AdPolicyId } from 'src/app/enums/ad-policy-id.enum';
import { AdPolicyService } from '../ad-policy/ad-policy.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { SmartAssistCapability } from 'src/app/data-models/smart-assist/smart-assist-capability.model';
import { SmartAssistService } from '../smart-assist/smart-assist.service';
import { SelfSelectEvent } from 'src/app/enums/self-select.enum';
import { NewFeatureTipService } from '../new-feature-tip/new-feature-tip.service';

interface MenuItem {
	id: string,
	label: string,
	path: string,
	icon: string | string[],
	beta?: boolean,
	segment?: string,
	metricsEvent: string,
	metricsParent: string,
	metricsItem: string,
	forArm: boolean,
	subitems?: any[],
	hide?: boolean,
	availability?: boolean
}

@Injectable({
	providedIn: 'root'
})

export class ConfigService {

	appBrand = 'Lenovo';
	appName = 'Vantage';
	menuItemsGaming: MenuItem[] = menuItemsGaming;
	menuItems: MenuItem[] = menuItems;
	menu: MenuItem[] = [];
	activeSegment: string;
	betaItem = betaItem;
	privacyPolicyLinks = privacyPolicyLinks;
	showCHS = false;
	wifiSecurity: WifiSecurity;
	securityAdvisor: SecurityAdvisor;
	windowsHello: WindowsHello;
	public countryCodes = ['us', 'ca', 'gb', 'ie', 'de', 'fr', 'es', 'it', 'au'];
	subscription: Subscription;
	private isSmartAssistAvailable = false;
	private isBetaUser: boolean;
	private country: string;

	constructor(
		private betaService: BetaService,
		private deviceService: DeviceService,
		private hypSettings: HypothesisService,
		private logger: LoggerService,
		private localInfoService: LocalInfoService,
		private vantageShellService: VantageShellService,
		private adPolicyService: AdPolicyService,
		public dashboardService: DashboardService,
		private smartAssist: SmartAssistService,
		private newFeatureTipService: NewFeatureTipService,
		private commonService: CommonService) {
		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
		if (this.securityAdvisor) {
			this.wifiSecurity = this.securityAdvisor.wifiSecurity;
			this.wifiSecurity.getWifiSecurityStateOnce();
			this.wifiSecurity.on(EventTypes.wsIsSupportWifiEvent, (status) => {
				this.commonService.sendReplayNotification(MenuItemEvent.MenuWifiItemChange, status);
			});
		}
		this.initGetMenuItemsAsync().then(() => {
			this.subscription = this.commonService.replayNotification.subscribe((notification: AppNotification) => {
				this.onNotification(notification);
			});
			this.showNewFeatureTipsWithMenuItems();
		});
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case AdPolicyEvent.AdPolicyUpdatedEvent:
					this.showSystemUpdates();
					this.notifyMenuChange(this.menu);
					break;
				case SelfSelectEvent.SegmentChange:
					this.updateSegmentMenu(notification.payload);
					this.notifyMenuChange(this.menu);
					break;
				case MenuItemEvent.MenuWifiItemChange:
					this.updateWifiMenu(this.menu,notification.payload)
					this.notifyMenuChange(this.menu);
					break;
				case MenuItemEvent.MenuBetaItemChange:
					this.filterByBeta(this.menu, notification.payload).then((menu) => {
						this.notifyMenuChange(menu);
					});
					break;
				default:
					break;
			}
		}
	}

	getMenuItems(isGaming) {
		if (isGaming) {
			return this.menuItemsGaming;
		} else {
			return this.menuItems;
		}
	}

	initGetMenuItemsAsync(): Promise<any> {
		return new Promise(async (resolve) => {
			this.isBetaUser = this.betaService.getBetaStatus() === BetaStatus.On;
			const machineInfo = this.deviceService.machineInfo;
			const localInfo = await this.localInfoService.getLocalInfo();
			this.activeSegment = localInfo.Segment ? localInfo.Segment : SegmentConst.Commercial;
			this.country = machineInfo && machineInfo.country ? machineInfo.country : 'US';
			let resultMenu;

			if (machineInfo.isGaming) {
				resultMenu = cloneDeep(this.menuItemsGaming);
				this.initializeWiFiItem(resultMenu);
				this.menu = await this.updateHide(resultMenu, SegmentConst.Gaming, this.isBetaUser);

				this.notifyMenuChange(this.menu);
				return resolve(this.menu);
			}

			resultMenu = cloneDeep(this.menuItems);
			this.initializeSecurityItem(this.country, resultMenu);
			if (this.hypSettings) {
				resultMenu = await this.initShowCHSMenu(this.country, resultMenu, machineInfo);
			}

			this.menu = await this.updateHide(resultMenu, this.activeSegment, this.isBetaUser);

			this.betaService.betaFeatureAvailable = (function findBetaAvailability(menus: any[], result: boolean) {
				menus.forEach(m => {
					if (m.beta) {
						if (!('availability' in m) || m.availability === true) {
							result = true;
						}
					}
					if (m.subitems) {
						result = findBetaAvailability(m.subitems, result);
					}
				});
				return result;
			})(this.menu, false);

			this.initializeSmartAssist();
			this.notifyMenuChange(this.menu);
			return resolve(this.menu);
		});
	}

	private initializeAppSearchItem(menu: any, supportSearch: boolean) {
		const appSearchItem = menu.find((item) => item.id === 'app-search');
		if (appSearchItem) {
			appSearchItem.availability = supportSearch;
			appSearchItem.hide = !supportSearch;
		}
	}

	private async initShowCHSMenu(country: string, menu: MenuItem[], machineInfo: any): Promise<MenuItem[]> {
		const locale: string = machineInfo && machineInfo.locale ? machineInfo.locale : 'en';
		const chsHypsis = await this.hypSettings.getFeatureSetting('ConnectedHomeSecurity').then((result) => {
			return ((result || '').toString() === 'true');
		}, (error) => {
			this.logger.error('ConfigService.initShowCHSMenu: promise rejected ', error);
		});

		const showCHSWithoutSegment = country.toLowerCase() === 'us'
										&& locale.startsWith('en')
										&& chsHypsis
										&& !machineInfo.isGaming;
		this.showCHS = showCHSWithoutSegment && (this.activeSegment !== SegmentConst.Commercial);

		const chsMenuItem = menu.find(item => item.id === 'home-security');
		if (chsMenuItem) {
			chsMenuItem.availability = showCHSWithoutSegment;
			chsMenuItem.hide = !this.showCHS;
		}

		return menu;
	}

	initializeSecurityItem(region, items) {
		this.initializeWiFiItem(items);
		this.supportFilter(items, 'security', true);
		this.supportFilter(items, 'anti-virus', true);
		if (region.toLowerCase() === 'cn') {
			this.supportFilter(items, 'password-protection', false);
			this.supportFilter(items, 'internet-protection', false);
		} else {
			this.supportFilter(items, 'internet-protection', true);
			this.supportFilter(items, 'password-protection', true);
		}
	}

	initializeWiFiItem(items) {
		const cacheWifi = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity, false);
		items = this.supportFilter(items, 'wifi-security', cacheWifi);
		if (typeof this.wifiSecurity.isSupported === 'boolean') {
			items = this.supportFilter(items, 'wifi-security', this.wifiSecurity.isSupported);
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity, this.wifiSecurity.isSupported);
		}
	}

	updateWifiMenu(menu: MenuItem[], wifiIsSupport) {
		this.supportFilter(menu, 'wifi-security', wifiIsSupport
		&& !this.deviceService.isSMode
		&& !this.deviceService.isArm);
		if (this.activeSegment !== SegmentConst.Gaming) this.segmentFilter(menu, this.activeSegment);
		this.updateWifiStateCache(wifiIsSupport);
	}

	updateWifiStateCache(wifiIsSupport: boolean) {
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity, wifiIsSupport);
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

	smodeFilter(menu: Array<any>, isSmode: boolean) {
		if (isSmode) {
			menu.forEach(element => {
				if (!element.sMode) {
					element.hide = true;
				}
				if (element.subitems.length > 0) {
					element.subitems = this.smodeFilter(element.subitems, isSmode);
				}
			});
		}
		return menu;
	}

	armFilter(menu: Array<any>, isArm: boolean) {
		if (isArm) {
			menu.forEach(element => {
				if (!element.forArm) {
					element.hide = true;
				}
				if (element.subitems.length > 0) {
					this.armFilter(element.subitems, isArm);
				}
			});
		}
	}

	private smartAssistFilter(machineType: number) {
		if (machineType === 0 || machineType === 1) {
			this.showSmartAssist();
		} else {
			this.removeSmartAssistMenu(this.menu);
		}
	}

	private async showSmartAssist(): Promise<any> {
		this.logger.info('MenuMainComponent.showSmartAssist: inside');
		const myDeviceItem = this.menu.find((item) => item.id === 'device');
		if (myDeviceItem !== undefined) {
			// if cache has value true for IsSmartAssistSupported, add menu item
			const smartAssistCacheValue = this.commonService.getLocalStorageValue(
				LocalStorageKey.IsSmartAssistSupported,
				false
			);
			this.logger.info('MenuMainComponent.showSmartAssist smartAssistCacheValue', smartAssistCacheValue);
			if (!smartAssistCacheValue) {
				this.removeSmartAssistMenu(this.menu);
			}

			// raj: promise.all breaks if any one function is breaks. adding feature wise capability check
			const assistCapability: SmartAssistCapability = new SmartAssistCapability();
			// HPD and Intelligent Screen capability check
			try {
				this.logger.info('configService.showSmartAssist: HPD and Intelligent Screen capability check');
				assistCapability.isIntelligentSecuritySupported = await this.smartAssist.getHPDVisibility();
				assistCapability.isIntelligentScreenSupported = await this.smartAssist.getIntelligentScreenVisibility();
				this.logger.info('configService.showSmartAssist: HPD and Intelligent Screen capability check completed');
			} catch (error) {
				this.logger.exception('configService.showSmartAssist smartAssist.getHPDVisibility check', error);
			}
			// lenovo voice capability check
			try {
				this.logger.info('configService.showSmartAssist: lenovo voice capability check');
				assistCapability.isLenovoVoiceSupported = await this.smartAssist.isLenovoVoiceAvailable();
				this.logger.info('configService.showSmartAssist: lenovo voice capability check completed');

			} catch (error) {
				this.logger.exception('configService.showSmartAssist smartAssist.isLenovoVoiceAvailable check', error);
			}
			// video pause capability check
			try {
				this.logger.info('configService.showSmartAssist: video pause capability check');
				assistCapability.isIntelligentMediaSupported = await this.smartAssist.getVideoPauseResumeStatus(); // returns object
				this.logger.info('configService.showSmartAssist: video pause capability check completed');

			} catch (error) {
				this.logger.exception('configService.showSmartAssist smartAssist.getVideoPauseResumeStatus check', error);
			}
			// super resolution capability check
			try {
				this.logger.info('configService.showSmartAssist: super resolution capability check');
				assistCapability.isSuperResolutionSupported = await this.smartAssist.getSuperResolutionStatus();
				this.logger.info('configService.showSmartAssist: super resolution capability check completed');
			} catch (error) {
				this.logger.exception('configService.showSmartAssist smartAssist.getSuperResolutionStatus check', error);
			}

			// Anti Theft check
			try {
				this.logger.info('configService.showSmartAssist: Anti Theft check');
				assistCapability.isAntiTheftSupported = await this.smartAssist.getAntiTheftStatus();
				this.logger.info('configService.showSmartAssist: Anti Theft check completed');
			} catch (error) {
				this.logger.exception('configService.showSmartAssist smartAssist.getAntiTheftStatus check', error);
			}

			// HSA intelligent security check
			try {
				this.logger.info('configService.showSmartAssist: HSA intelligent security check');
				assistCapability.isHsaIntelligentSecuritySupported = await this.smartAssist.getHsaIntelligentSecurityStatus();
				this.logger.info('configService.showSmartAssist: HSA intelligent security check completed');
			} catch (error) {
				this.logger.exception('configService.showSmartAssist smartAssist.getHsaIntelligentSecurityStatus check', error);
			}

			// APS capability check
			try {
				this.logger.info('configService.showSmartAssist: APS capability check');
				assistCapability.isAPSCapable = await this.smartAssist.getAPSCapability();
				assistCapability.isAPSSensorSupported = await this.smartAssist.getSensorStatus();
				assistCapability.isAPSHDDStatus = await this.smartAssist.getHDDStatus();
				assistCapability.isAPSSupported = assistCapability.isAPSCapable && assistCapability.isAPSSensorSupported && assistCapability.isAPSHDDStatus > 0; this.logger.info('MenuMainComponent.showSmartAssist: APS capability check completed');
			} catch (error) {
				this.logger.exception('configService.showSmartAssist APS capability check', error);
			}

			this.isSmartAssistAvailable =
				assistCapability.isIntelligentSecuritySupported ||
				assistCapability.isLenovoVoiceSupported ||
				assistCapability.isIntelligentMediaSupported.available ||
				assistCapability.isIntelligentScreenSupported ||
				assistCapability.isSuperResolutionSupported.available ||
				assistCapability.isAntiTheftSupported.available ||
				assistCapability.isAPSSupported ||
				((assistCapability.isHsaIntelligentSecuritySupported.capability && 0x100) != 0) ||
				((assistCapability.isHsaIntelligentSecuritySupported.capability && 0x80) != 0);

			if (this.isSmartAssistAvailable) {
				this.addSmartAssistMenu(this.menu);
			} else {
				this.removeSmartAssistMenu(this.menu);
			}

			this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartAssistSupported, this.isSmartAssistAvailable);
			this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCapability, assistCapability);
			this.notifyMenuChange(this.menu);
			this.logger.error('configService.showSmartAssist capability check',
				{
					smartAssistCacheValue,
					isSmartAssistAvailable: this.isSmartAssistAvailable,
					assistCapability
				});
		}
	}

	private addSmartAssistMenu(items) {
		const myDeviceItem = items.find((item) => item.id === 'device');
		if (myDeviceItem) {
			const smartAssistItem = myDeviceItem.subitems.find(item => item.id === 'smart-assist');
			if (smartAssistItem) {
				smartAssistItem.hide = false;
			}
		}
	}

	private removeSmartAssistMenu(items) {
		const myDeviceItem = items.find((item) => item.id === 'device');
		if (myDeviceItem) {
			const smartAssistItem = myDeviceItem.subitems.find(item => item.id === 'smart-assist');
			if (smartAssistItem) {
				smartAssistItem.hide = true;
			}
		}
	}

	getPrivacyPolicyLink(): Promise<any> {
		return new Promise((resolve) => {
			this.deviceService.getMachineInfo().then(val => {
				resolve(privacyPolicyLinks[val.locale] || privacyPolicyLinks.default);
			});
		});
	}

	notifyMenuChange(payload?) {
		this.commonService.sendNotification(MenuItemEvent.MenuItemChange, payload);
	}

	public canShowSearch(): Promise<boolean> {
		return new Promise(resolve => {
			if (this.hypSettings) {
				this.hypSettings.getFeatureSetting('FeatureSearch').then((searchFeature) => {
					resolve((searchFeature || '').toString().toLowerCase() === 'true');
				}, (error) => {
					this.logger.error('DeviceService.initShowSearch: promise rejected ', error);
					resolve(false);
				});
			}
		});
	}

	updateSegmentMenu(segment): MenuItem[] {
		if (segment === this.activeSegment || segment === SegmentConst.Gaming) {
			return this.menu;
		} else {
			this.activeSegment = segment;
			const chsMenuItem = this.menu.find(item => item.id === 'home-security');
			if (chsMenuItem) {
				this.showCHS = chsMenuItem.availability && this.activeSegment !== SegmentConst.Commercial;
				chsMenuItem.hide = !this.showCHS;
			}
			this.initializeSecurityItem(this.country,this.menu);
			this.updateHide(this.menu, segment, this.isBetaUser);
			return this.menu;
		}
	}

	filterByBeta(menu: Array<any>, isBeta: boolean): Promise<Array<any>> {
		this.showSmartPerformance(menu, isBeta);
		return this.canShowSearch().then((result) => {
			this.initializeAppSearchItem(menu, result);
			const item = menu.find(i => i.id === 'app-search');
			if (item) item.hide = !isBeta || !result;
			return menu;
		});
	}
	showSmartPerformance(menu, isBeta) {
		menu.forEach(i => {
			if (i.subitems) {
				if (i.subitems.length && i.subitems.length > 0) {
					i.subitems.forEach(el => {
						if (el.id === 'smart-performance') {
							el.hide = !isBeta;
						}
					})
				}
			}
		})
	}
	showSystemUpdates(): void {
		if (!Array.isArray(this.menu)) { return; }

		this.updateSystemUpdatesMenu();
	}

	updateSystemUpdatesMenu() {
		const device = this.menu.find((item) => item.id === 'device');
		if (device) {
			const su = device.subitems.find((item) => item.id === 'system-updates');
			if (su) {
				su.hide = !(
					this.adPolicyService.IsSystemUpdateEnabled
					&& !this.deviceService.isSMode
					&& !this.deviceService.isGaming
				);
			}
		}
	}

	showNewFeatureTipsWithMenuItems() {
		const welcomeTutorial = this.commonService.getLocalStorageValue(LocalStorageKey.WelcomeTutorial);
		if (!welcomeTutorial || !welcomeTutorial.isDone || window.innerWidth < 1200) {
			this.commonService.setLocalStorageValue(LocalStorageKey.NewFeatureTipsVersion, this.commonService.newFeatureVersion);
			return;
		}
		this.localInfoService.getLocalInfo().then(localInfo => {
			if (localInfo.Segment !== SegmentConst.Consumer) {
				this.commonService.setLocalStorageValue(LocalStorageKey.NewFeatureTipsVersion, this.commonService.newFeatureVersion);
				return;
			}
			const lastVersion = this.commonService.getLocalStorageValue(LocalStorageKey.NewFeatureTipsVersion);
			if ((!lastVersion || lastVersion < this.commonService.newFeatureVersion) && Array.isArray(this.menu)) {
				const idArr = ['security', 'home-security', 'hardware-scan']
				const isIncludesItem = this.menu.find(item => idArr.includes(item.id))
				if (isIncludesItem) {
					if (lastVersion > 0) { this.commonService.lastFeatureVersion = lastVersion; }
					this.newFeatureTipService.create();
				}
				this.commonService.setLocalStorageValue(LocalStorageKey.NewFeatureTipsVersion, this.commonService.newFeatureVersion);
			}
		});
	}

	private async updateHide(menu: Array<any>, segment: string, beta: boolean): Promise<MenuItem[]> {
		this.smodeFilter(menu, this.deviceService.isSMode);
		this.armFilter(menu, this.deviceService.isArm);
		if (segment !== SegmentConst.Gaming) this.segmentFilter(menu, segment);
		await this.filterByBeta(menu, beta);
		menu.forEach(item => {
			if (item.subitems.length > 0) {
				item.hide = item.subitems.length === item.subitems.filter(i => i.hide).length;
			}
		});
		return menu;
	}

	private initializeSmartAssist() {
		const machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType, undefined);
		if (machineType) {
			this.smartAssistFilter(machineType);
		} else if (this.deviceService.isShellAvailable) {
			this.deviceService.getMachineType().then((value: number) => {
				this.smartAssistFilter(value);
			});
		}
	}
}
