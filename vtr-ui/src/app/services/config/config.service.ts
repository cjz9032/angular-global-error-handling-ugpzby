import {
	Injectable
} from '@angular/core';
import {
	DeviceService
} from 'src/app/services/device/device.service';
import cloneDeep from 'lodash/cloneDeep';
import { menuItemsGaming, menuItemsArm, menuItems, betaItem } from 'src/assets/menu/menu.json';
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
import { LocalCacheService } from '../local-cache/local-cache.service';

interface MenuItem {
	id: string;
	label: string;
	path: string;
	icon: string | string[];
	beta?: boolean;
	segment?: string;
	metricsEvent: string;
	metricsParent: string;
	metricsItem: string;
	subitems?: any[];
	hide?: boolean;
	availability?: boolean;
}

interface SecurityMenuCondition {
	wifiIsSupport: boolean;
	currentSegment: string;
	isSmode?: boolean;
	isArm?: boolean;
}

@Injectable({
	providedIn: 'root'
})

export class ConfigService {

	appBrand = 'Lenovo';
	appName = 'Vantage';
	menuItemsGaming: MenuItem[] = menuItemsGaming;
	menuItemsArm: MenuItem[] = menuItemsArm;
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
	public isSmartPerformanceAvailable = false;
	private isBetaUser: boolean;
	private country: string;
	private betaFeature = ['smart-performance', 'app-search'];

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
		private localCacheService: LocalCacheService,
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
					this.updateWifiMenu(this.menu, notification.payload);
					this.notifyMenuChange(this.menu);
					break;
				case MenuItemEvent.MenuBetaItemChange:
					this.updateBetaMenu(this.menu, notification.payload, false);
					this.notifyMenuChange(this.menu);
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
			} else if (this.deviceService.isArm) {
				resultMenu = cloneDeep(this.menuItemsArm);
				this.menu = await this.updateHide(resultMenu, this.activeSegment, this.isBetaUser);
				this.notifyMenuChange(this.menu);
			} else {
				resultMenu = cloneDeep(this.menuItems);
				this.initializeSecurityItem(this.country, resultMenu);
				if (this.hypSettings) {
					resultMenu = await this.initShowCHSMenu(this.country, resultMenu, machineInfo);
				}

				this.menu = await this.updateHide(resultMenu, this.activeSegment, this.isBetaUser);

				await this.initializeSmartAssist();
				this.notifyMenuChange(this.menu);
			}
			return resolve(this.menu);
		});
	}

	private initializeAppSearchItem(menu: any, supportSearch: boolean, isBeta: boolean) {
		const appSearchItem = menu.find((item) => item.id === 'app-search');
		if (appSearchItem) {
			appSearchItem.availability = supportSearch && !appSearchItem.hide;
			appSearchItem.hide = !appSearchItem.availability || !isBeta;
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
		this.supportFilter(items, 'security', true);
		this.supportFilter(items, 'anti-virus', true);
		this.supportFilter(items, 'password-protection', region.toLowerCase() !== 'cn');
		this.supportFilter(items, 'internet-protection', region.toLowerCase() !== 'cn');
		this.initializeWiFiItem(items);
	}

	initializeWiFiItem(items) {
		if (typeof this.wifiSecurity.isSupported === 'boolean') {
			items = this.supportFilter(items, 'wifi-security', this.wifiSecurity.isSupported);
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity, this.wifiSecurity.isSupported);
			this.updateSecurityMenuHide(items, {
				wifiIsSupport: this.wifiSecurity.isSupported,
				currentSegment: this.activeSegment
			});
		} else {
			const cacheWifi = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity, false);
			items = this.supportFilter(items, 'wifi-security', cacheWifi);
			this.updateSecurityMenuHide(items, {
				wifiIsSupport: cacheWifi,
				currentSegment: this.activeSegment
			});
		}
	}

	updateWifiMenu(menu: MenuItem[], wifiIsSupport) {
		this.supportFilter(menu, 'wifi-security', wifiIsSupport
			&& !this.deviceService.isSMode
			&& !this.deviceService.isArm);
		this.updateWifiStateCache(wifiIsSupport);
		this.updateSecurityMenuHide(menu, {
			wifiIsSupport,
			currentSegment: this.activeSegment,
			isSmode: this.deviceService.isSMode,
			isArm: this.deviceService.isArm
		});
	}

	private updateSecurityMenuHide(menu: MenuItem[], securityMenuCondition: SecurityMenuCondition) {
		const securityMenu = menu.find((item) => item.id === 'security');
		if (!securityMenu) { return; }
		if (!securityMenuCondition) { return; }
		securityMenu.hide = securityMenuCondition.isSmode
			|| securityMenuCondition.isArm
			|| (!securityMenuCondition.wifiIsSupport
			&& (securityMenuCondition.currentSegment === SegmentConst.Commercial
			|| securityMenuCondition.currentSegment === SegmentConst.Gaming));
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
			this.initializeSecurityItem(this.country, this.menu);
			this.betaFeature.forEach(featureId => {
				this.supportFilter(this.menu, featureId, true);
			});
			this.updateHide(this.menu, segment, this.isBetaUser);
			return this.menu;
		}
	}

	async initializeByBeta(menu: MenuItem[], isBeta: boolean) {
		this.updateBetaMenu(menu, isBeta, true);

		const result = await this.canShowSearch();
		this.updateAvailability(menu, 'app-search', result);

		this.isSmartPerformanceAvailable = await this.showSmartPerformance();
		this.updateAvailability(menu, 'smart-performance', this.isSmartPerformanceAvailable);

		this.updateBetaService(menu);
	}

	updateAvailability(menu: MenuItem[], id: string, featureAvailability: boolean) {
		menu.forEach(item => {
			if (item.id === id) {
				item.availability = item.availability && featureAvailability;
				item.hide = item.hide || !featureAvailability;
			}
			if (Array.isArray(item.subitems) && item.subitems.length > 0) {
				item.subitems = this.updateAvailability(item.subitems, id, featureAvailability);
			}
		});
		return menu;
	}
	public showSmartPerformance(): Promise<boolean> {

		return new Promise(resolve => {
			if (this.hypSettings) {
				this.hypSettings.getFeatureSetting('SmartPerformance').then((result) => {
					resolve((result || '').toString().toLowerCase() === 'true');
				}, (error) => {
					this.logger.error('ConfigService.showSmartPerformance: promise rejected ', error);
					resolve(false);
				});
			}
		});
	}
	updateBetaMenu(menu: MenuItem[], isBeta: boolean, isUpdateAvailability: boolean) {
		this.isBetaUser = isBeta;
		(function findBetaMenu(menus: MenuItem[], betaState: boolean) {
			menus.forEach(m => {
				if (m.beta) {
					if (isUpdateAvailability) {
						m.availability = !m.hide;
					}
					m.hide = !m.availability || !betaState;
				}
				if (Array.isArray(m.subitems) && m.subitems.length > 0) {
					findBetaMenu(m.subitems, isBeta);
				}
			});
		})(menu, isBeta);
	}

	private updateBetaService(menu: MenuItem[]) {
		this.betaService.betaFeatureAvailable = (function isBetaAvail(menus: MenuItem[], result: boolean) {
			menus.forEach(m => {
				if (m.beta) {
					if (!('availability' in m) || m.availability === true) {
						result = true;
					}
				}
				if (Array.isArray(m.subitems) && m.subitems.length > 0) {
					result = isBetaAvail(m.subitems, result);
				}
			});
			return result;
		})(menu, false);
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

	public isSystemUpdateEnabled(): boolean{
		return this.adPolicyService.IsSystemUpdateEnabled
				&& !this.deviceService.isSMode
				&& !this.deviceService.isArm;
	}

	showNewFeatureTipsWithMenuItems() {
		const welcomeTutorial = this.commonService.getLocalStorageValue(LocalStorageKey.WelcomeTutorial);
		if (!welcomeTutorial || !welcomeTutorial.isDone || window.innerWidth < 1200) {
			this.localCacheService.setLocalCacheValue(LocalStorageKey.NewFeatureTipsVersion, this.commonService.newFeatureVersion);
			return;
		}
		this.localInfoService.getLocalInfo().then(async localInfo => {
			if (localInfo.Segment !== SegmentConst.Consumer) {
				this.localCacheService.setLocalCacheValue(LocalStorageKey.NewFeatureTipsVersion, this.commonService.newFeatureVersion);
				return;
			}
			const lastVersion = await this.localCacheService.getLocalCacheValue(LocalStorageKey.NewFeatureTipsVersion);
			if ((!lastVersion || lastVersion < this.commonService.newFeatureVersion) && Array.isArray(this.menu)) {
				const idArr = ['security', 'home-security', 'hardware-scan'];
				const isIncludesItem = this.menu.find(item => idArr.includes(item.id));
				if (isIncludesItem) {
					if (lastVersion > 0) { this.commonService.lastFeatureVersion = lastVersion; }
					this.newFeatureTipService.create();
				}
				this.localCacheService.setLocalCacheValue(LocalStorageKey.NewFeatureTipsVersion, this.commonService.newFeatureVersion);
			}
		});
	}

	private async updateHide(menu: Array<any>, segment: string, beta: boolean): Promise<MenuItem[]> {
		this.smodeFilter(menu, this.deviceService.isSMode);
		if (segment !== SegmentConst.Gaming) { this.segmentFilter(menu, segment); }
		await this.initializeByBeta(menu, beta);
		return menu;
	}

	private async initializeSmartAssist() {
		const machineType = await this.localCacheService.getLocalCacheValue(LocalStorageKey.MachineType, undefined);
		if (machineType) {
			this.smartAssistFilter(machineType);
		} else if (this.deviceService.isShellAvailable) {
			this.deviceService.getMachineType().then((value: number) => {
				this.smartAssistFilter(value);
			});
		}
	}
}
