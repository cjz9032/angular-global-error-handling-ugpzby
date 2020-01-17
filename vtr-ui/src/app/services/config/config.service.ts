import {
	Injectable
} from '@angular/core';
import {
	DeviceService
} from 'src/app/services/device/device.service';
import cloneDeep from 'lodash/cloneDeep';
import { menuItemsGaming, menuItems, appSearch, betaItem } from 'src/assets/menu/menu.json';
import { privacyPolicyLinks } from 'src/assets/privacy-policy-links/policylinks.json';
import { HypothesisService } from '../hypothesis/hypothesis.service';
import { BetaService, BetaStatus } from '../beta/beta.service';
import { LoggerService } from '../logger/logger.service';
import { MenuItem } from 'src/app/enums/menuItem.enum';
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
	menu = [];
	menuBySegment = {
		commercial: [],
		consumer: [],
		smb: []
	};
	activeSegment: string;
	appSearch = appSearch;
	betaItem = betaItem;
	privacyPolicyLinks = privacyPolicyLinks;
	showCHS = false;
	showCHSWithoutSegment = false;
	wifiSecurity: WifiSecurity;
	securityAdvisor: SecurityAdvisor;
	windowsHello: WindowsHello;
	public countryCodes = ['us', 'ca', 'gb', 'ie', 'de', 'fr', 'es', 'it', 'au'];
	subscription: Subscription;
	private isSmartAssistAvailable = false;

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
			this.wifiSecurity.getWifiSecurityState();
			this.wifiSecurity.on(EventTypes.wsIsSupportWifiEvent, (status) => {
				this.commonService.sendReplayNotification(MenuItem.MenuWifiItemChange, status);
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
					this.showSystemUpdates().then((menu) => {
						this.notifyMenuChange(menu);
					});
					break;
				case SelfSelectEvent.SegmentChange:
					this.updateSegmentMenu(notification.payload).then((menu) => {
						this.notifyMenuChange(menu);
					});
					break;
				case MenuItem.MenuWifiItemChange:
					this.showWifiMenu(notification.payload).then((menu) => {
						this.notifyMenuChange(menu);
					});
					break;
				case MenuItem.MenuBetaItemChange:
					this.showBetaMenu(notification.payload).then((menu) => {
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
			const isBetaUser = this.betaService.getBetaStatus() === BetaStatus.On;
			const machineInfo = await this.deviceService.getMachineInfo();
			const localInfo = await this.localInfoService.getLocalInfo();
			this.activeSegment = localInfo.Segment ? localInfo.Segment : SegmentConst.Commercial;
			const machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType, undefined);
			let resultMenu = cloneDeep(this.menuItemsGaming);
			if (machineInfo.isGaming) {
				if (isBetaUser && await this.canShowSearch()) {
					resultMenu.splice(resultMenu.length - 1, 0, this.appSearch);
				}
				this.smodeFilter(resultMenu, this.deviceService.isSMode);
				this.armFilter(resultMenu, this.deviceService.isArm);
				this.menu = resultMenu.filter(item => !item.hide);
				this.notifyMenuChange(this.menu);
				return resolve(this.menu);
			}
			const country = machineInfo && machineInfo.country ? machineInfo.country : 'US';
			const locale: string = machineInfo && machineInfo.locale ? machineInfo.locale : 'en';
			resultMenu = cloneDeep(this.menuItems);
			if (machineType) {
				this.smartAssistFilter(machineType, resultMenu);
			} else if (this.deviceService.isShellAvailable) {
				await this.deviceService.getMachineType().then(async (value: number) => {
					await this.smartAssistFilter(value, resultMenu);
				});
			}
			const canShowPrivacy = await this.canShowPrivacy();
			if (!canShowPrivacy) {
				resultMenu = resultMenu.filter(item => item.id !== 'privacy');
			}
			this.showSecurityItem(country.toLowerCase(), resultMenu);
			this.smodeFilter(resultMenu, this.deviceService.isSMode);
			this.armFilter(resultMenu, this.deviceService.isArm);
			this.menuBySegment.commercial = cloneDeep(resultMenu);
			if (isBetaUser) {
				resultMenu.splice(resultMenu.length - 1, 0, ...this.betaItem);
				if (await this.canShowSearch()) {
					resultMenu.splice(resultMenu.length - 1, 0, this.appSearch);
				}
			}
			this.menuBySegment.consumer = cloneDeep(resultMenu);
			this.menuBySegment.smb = cloneDeep(resultMenu);
			resultMenu = this.menuBySegment[this.activeSegment.toLowerCase()];
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
						&& !machineInfo.isGaming
						&& this.activeSegment !== SegmentConst.Commercial;
					this.showCHSWithoutSegment = country.toLowerCase() === 'us'
						&& locale.startsWith('en')
						&& result
						&& this.isShowCHSByShellVersion(shellVersion)
						&& !machineInfo.isGaming;
					if (!this.showCHS) {
						resultMenu = resultMenu.filter(item => item.id !== 'home-security');
					}
					this.menuBySegment.commercial = this.menuBySegment.commercial.filter(item => item.id !== 'home-security');
					if (!this.showCHSWithoutSegment) {
						this.menuBySegment.consumer = this.menuBySegment.consumer.filter(item => item.id !== 'home-security');
						this.menuBySegment.smb = this.menuBySegment.smb.filter(item => item.id !== 'home-security');
					}
				});
			}
			resultMenu = this.segmentFilter(resultMenu, this.activeSegment);
			this.menuBySegment.commercial = this.segmentFilter(this.menuBySegment.commercial, SegmentConst.Commercial);
			this.menuBySegment.consumer = this.segmentFilter(this.menuBySegment.consumer, SegmentConst.Consumer);
			this.menuBySegment.smb = this.segmentFilter(this.menuBySegment.smb, SegmentConst.SMB);

			this.menu = resultMenu.filter(item => !item.hide);
			this.menuBySegment.commercial = this.menuBySegment.commercial.filter(item => !item.hide);
			this.menuBySegment.consumer = this.menuBySegment.consumer.filter(item => !item.hide);
			this.menuBySegment.smb = this.menuBySegment.smb.filter(item => !item.hide);
			this.notifyMenuChange(this.menu);
			return resolve(this.menu);
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
		const Windows = this.vantageShellService.getWindows();
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
		items = this.supportFilter(items, 'wifi-security', cacheWifi);
		if (typeof this.wifiSecurity.isSupported === 'boolean') {
			items = this.supportFilter(items, 'wifi-security', this.wifiSecurity.isSupported);
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity, this.wifiSecurity.isSupported);
		}
		if (securityItem) {
			if (region === 'cn') {
				items = this.supportFilter(items, 'internet-protection', false);
			} else {
				items = this.supportFilter(items, 'internet-protection', true);
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
					element.subitems = this.smodeFilter(element.subitems, isArm);
				}
			});
		}
	}

	async smartAssistFilter(machineType: number, items) {
		if (machineType === 0 || machineType === 1) {
			await this.showSmartAssist(items);
		}
	}

	private async showSmartAssist(items) {
		this.logger.info('MenuMainComponent.showSmartAssist: inside');
		const myDeviceItem = items.find((item) => item.id === 'device');
		if (myDeviceItem !== undefined) {
			// if cache has value true for IsSmartAssistSupported, add menu item
			const smartAssistCacheValue = this.commonService.getLocalStorageValue(
				LocalStorageKey.IsSmartAssistSupported,
				false
			);
			this.logger.info('MenuMainComponent.showSmartAssist smartAssistCacheValue', smartAssistCacheValue);

			if (!smartAssistCacheValue || !this.isSmartAssistAvailable) {
				this.removeSmartAssistMenu(items);
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
				assistCapability.isAPSSupported;

			if (this.isSmartAssistAvailable) {
				this.addSmartAssistMenu(items);
			} else {
				this.removeSmartAssistMenu(items);
			}

			this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartAssistSupported, this.isSmartAssistAvailable);
			this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCapability, assistCapability);

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
			if (!smartAssistItem) {
				myDeviceItem.subitems.splice(3, 0, this.menuItems.find((item) => item.id === 'device').subitems.find((item) => item.id === 'smart-assist'));
			}
		}
	}

	private removeSmartAssistMenu(items) {
		const myDeviceItem = items.find((item) => item.id === 'device');
		if (myDeviceItem) {
			const smartAssistItem = myDeviceItem.subitems.find(item => item.id === 'smart-assist');
			if (smartAssistItem) {
				this.logger.info('ConfigService.removeSmartAssistMenu: removing smart-assist menu');
				myDeviceItem.subitems = myDeviceItem.subitems.filter(
					(item) => item.id !== 'smart-assist'
				);
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
		this.commonService.sendNotification(MenuItem.MenuItemChange, payload);
	}

	public canShowPrivacy(): Promise<boolean> {
		return new Promise(resolve => {
			if (this.hypSettings) {
				this.hypSettings.getFeatureSetting('PrivacyTab').then((privacy) => {
					resolve(privacy === 'enabled');
				}, (error) => {
					this.logger.error('DeviceService.initshowPrivacy: promise rejected ', error);
					resolve(false);
				});
			}
		});
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

	updateSegmentMenu(segment): Promise<any> {
		return new Promise((resolve) => {
			if (segment === this.activeSegment || segment === SegmentConst.Gaming) {
				return resolve(this.menu);
			} else {
				this.activeSegment = segment;
				this.showCHS = this.showCHSWithoutSegment && this.activeSegment !== SegmentConst.Commercial;
				const seg = segment.toLowerCase();
				this.menu = cloneDeep(this.menuBySegment[seg]);
				return resolve(this.menu);
			}
		});
	}

	showWifiMenu(wifiIsSupport: boolean): Promise<any> {
		return new Promise((resolve) => {
			this.updateWifiMenu(this.menu, wifiIsSupport, this.activeSegment);
			this.updateWifiMenu(this.menuBySegment.commercial, wifiIsSupport, this.activeSegment);
			this.updateWifiMenu(this.menuBySegment.consumer, wifiIsSupport, this.activeSegment);
			this.updateWifiMenu(this.menuBySegment.smb, wifiIsSupport, this.activeSegment);
			return resolve(this.menu);
		});
	}

	updateWifiMenu(menu, wifiIsSupport, segment) {
		const securityItem = menu.find((item) => item.id === 'security');
		if (menu.find((item) => item.id === 'wifi-security')
			|| (securityItem && securityItem.subitems.find((item) => item.id === 'wifi-security'))) {
			this.supportFilter(menu, 'wifi-security', wifiIsSupport);
		} else if (wifiIsSupport && !this.deviceService.isSMode && !this.deviceService.isArm && segment !== SegmentConst.Gaming) {
			if (securityItem && securityItem.subitems) {
				const wifiItem = this.menuItems.find((item) => item.id === 'security').subitems.find((item) => item.id === 'wifi-security');
				securityItem.subitems.splice(3, 0, wifiItem);
			} else {
				const supportIndex = menu.findIndex((item) => item.id === 'support');
				const wifiItems = this.menuItems.find((item) => item.id === 'wifi-security');
				menu.splice(supportIndex, 0, wifiItems);
			}
		}
	}

	showBetaMenu(isBeta: boolean): Promise<any> {
		return new Promise((resolve) => {
			this.updateBetaMenu(this.menu, isBeta).then((menu) => {
				this.menu = menu;
				this.menu = this.segmentFilter(this.menu, this.activeSegment);
				return resolve(this.menu);
			});
			this.updateBetaMenu(this.menuBySegment.consumer, isBeta).then((menu) => {
				this.menuBySegment.consumer = menu;
			});
			this.updateBetaMenu(this.menuBySegment.smb, isBeta).then((menu) => {
				this.menuBySegment.smb = menu;
			});
		});
	}

	updateBetaMenu(menu, isBeta: boolean): Promise<any> {
		return new Promise((resolve) => {
			if (isBeta) {
				if (!menu.find((item) => item.id === 'hardware-scan') && !menu.find((item) => item.id === 'app-search')) {
					menu.splice(menu.length - 1, 0, ...this.betaItem);
					this.canShowSearch().then((result) => {
						if (result) {
							menu.splice(menu.length - 1, 0, this.appSearch);
						}
						return resolve(menu);
					});
				} else {
					return resolve(menu);
				}
			} else {
				menu = menu.filter(item => item.id !== 'hardware-scan');
				menu = menu.filter(item => item.id !== 'app-search');
				return resolve(menu);
			}
		});
	}

	showSystemUpdates(): Promise<any> {
		return new Promise((resolve) => {
			if (!Array.isArray(this.menu)) { return; }

			const device = this.menu.find((item) => item.id === 'device');
			const deviceCommercial = this.menuBySegment.commercial.find((item) => item.id === 'device');
			const deviceConsumer = this.menuBySegment.consumer.find((item) => item.id === 'device');
			const deviceSMB = this.menuBySegment.smb.find((item) => item.id === 'device');
			this.updateSystemUpdatesMenu(device);
			this.updateSystemUpdatesMenu(deviceCommercial);
			this.updateSystemUpdatesMenu(deviceConsumer);
			this.updateSystemUpdatesMenu(deviceSMB);
			return resolve(this.menu);
		});
	}

	updateSystemUpdatesMenu(device) {
		if (device !== undefined) {
			const su = device.subitems.find((item) => item.id === 'system-updates');
			if (this.adPolicyService.IsSystemUpdateEnabled && !this.deviceService.isSMode && !this.deviceService.isGaming) {
				if (!su) {
					device.subitems.splice(2, 0, {
						id: 'system-updates',
						label: 'common.menu.device.sub3',
						path: 'system-updates',
						icon: '',
						metricsEvent: 'itemClick',
						metricsParent: 'navbar',
						metricsItem: 'link.systemupdates',
						routerLinkActiveOptions: {
							exact: true
						},
						adPolicyId: AdPolicyId.SystemUpdate,
						subitems: []
					});
				}
			} else {
				if (su) {
					device.subitems = device.subitems.filter(
						(item) => item.id !== 'system-updates'
					);
				}
			}
		}
	}

	showNewFeatureTipsWithMenuItems() {
		const newFeatureVersion = 3.002000;
		const welcomeTutorial = this.commonService.getLocalStorageValue(LocalStorageKey.WelcomeTutorial);
		if (!welcomeTutorial || !welcomeTutorial.isDone) {
			this.commonService.setLocalStorageValue(LocalStorageKey.NewFeatureTipsVersion, newFeatureVersion);
			return;
		}
		const newFeatureTipsShowComplete = this.commonService.getLocalStorageValue(LocalStorageKey.NewFeatureTipsVersion);
		if ((!newFeatureTipsShowComplete || newFeatureTipsShowComplete < newFeatureVersion)
			&& Array.isArray(this.menu)) {
			const privacyItem = this.menu.find((item: any) => item.id === 'privacy');
			const securityItem = this.menu.find((item: any) => item.id === 'security');
			const chsItem = this.menu.find((item: any) => item.id === 'home-security');
			let isHideMenuToggle = true;
			if (window.innerWidth < 1200) { isHideMenuToggle = false; }
			if ((privacyItem || securityItem || chsItem) && isHideMenuToggle) {
				this.newFeatureTipService.create();
			}
			this.commonService.setLocalStorageValue(LocalStorageKey.NewFeatureTipsVersion, newFeatureVersion);
		}
	}
}
