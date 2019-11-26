import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ConfigService } from '../../services/config/config.service';
import { DeviceService } from '../../services/device/device.service';
import { UserService } from '../../services/user/user.service';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { VantageShellService } from '../../services/vantage-shell/vantage-shell.service';
import { EventTypes, SecurityAdvisor, WindowsHello, WifiSecurity } from '@lenovo/tan-client-bridge';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { SmartAssistCapability } from 'src/app/data-models/smart-assist/smart-assist-capability.model';
import { LenovoIdDialogService } from '../../services/dialog/lenovoIdDialog.service';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { InputAccessoriesCapability } from 'src/app/data-models/input-accessories/input-accessories-capability.model';
import { WindowsHelloService } from 'src/app/services/security/windowsHello.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalModernPreloadComponent } from '../modal/modal-modern-preload/modal-modern-preload.component';
import { ModernPreloadService } from 'src/app/services/modern-preload/modern-preload.service';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { AdPolicyService } from 'src/app/services/ad-policy/ad-policy.service';
import { AdPolicyEvent, AdPolicyId } from 'src/app/enums/ad-policy-id.enum';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { HardwareScanService } from 'src/app/beta/hardware-scan/services/hardware-scan/hardware-scan.service';
import { AppsForYouEnum } from 'src/app/enums/apps-for-you.enum';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AppsForYouService } from 'src/app/services/apps-for-you/apps-for-you.service';
import { AppSearchService } from 'src/app/beta/app-search/app-search.service';
import { TopRowFunctionsIdeapadService } from '../pages/page-device-settings/children/subpage-device-settings-input-accessory/top-row-functions-ideapad/top-row-functions-ideapad.service';
import { StringBooleanEnum } from '../pages/page-device-settings/children/subpage-device-settings-input-accessory/top-row-functions-ideapad/top-row-functions-ideapad.interface';
import { catchError } from 'rxjs/operators';
import { MenuItem } from 'src/app/enums/menuItem.enum';


@Component({
	selector: 'vtr-menu-main',
	templateUrl: './menu-main.component.html',
	styleUrls: ['./menu-main.component.scss']
})
export class MenuMainComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('menuTarget', { static: false })
	menuTarget: ElementRef;
	@Input() loadMenuItem: any = {};
	public machineFamilyName: string;
	public country: string;
	commonMenuSubscription: Subscription;
	constantDevice = 'device';
	constantDeviceSettings = 'device-settings';
	region: string;
	public isDashboard = false;
	public countryCode: string;
	public locale: string;
	public items: any = [];
	public showSearchBox = false;
	public showSearchMenu = false;
	public searchTips = '';
	private searchTipsTimeout: any;
	private unsupportFeatureEvt: Observable<string>;

	showMenu = false;
	showHWScanMenu = false;
	preloadImages: string[];
	securityAdvisor: SecurityAdvisor;
	isRS5OrLater: boolean;
	isGamingHome: boolean;
	currentUrl: string;
	isSMode: boolean;
	hideDropDown = false;

	UnreadMessageCount = {
		totalMessage: 0,
		lmaMenuClicked: false,
		adobeMenuClicked: false
	};

	get appsForYouEnum() { return AppsForYouEnum; }

	constructor(
		private router: Router,
		public configService: ConfigService,
		public commonService: CommonService,
		public userService: UserService,
		public languageService: LanguageService,
		public deviceService: DeviceService,
		public vantageShellService: VantageShellService,
		public localInfoService: LocalInfoService,
		private smartAssist: SmartAssistService,
		private logger: LoggerService,
		private dialogService: LenovoIdDialogService,
		private keyboardService: InputAccessoriesService,
		public modalService: NgbModal,
		private windowsHelloService: WindowsHelloService,
		public modernPreloadService: ModernPreloadService,
		private adPolicyService: AdPolicyService,
		private hardwareScanService: HardwareScanService,
		private translate: TranslateService,
		public appsForYouService: AppsForYouService,
		searchService: AppSearchService,
		private topRowFunctionsIdeapadService: TopRowFunctionsIdeapadService
	) {
		this.router.events.subscribe((ev) => {
			if (ev instanceof NavigationEnd) {
				this.currentUrl = ev.url;
				if (this.currentUrl === '/device-gaming' || this.currentUrl === '/gaming') {
					this.isGamingHome = true;
				} else {
					this.isGamingHome = false;
				}
			}
		});

		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			if (this.translate.currentLang === 'en') {
				this.showSearchMenu = true;
			}
		});

		this.unsupportFeatureEvt = searchService.getUnsupportFeatureEvt();
		this.unsupportFeatureEvt.subscribe(featureDesc => {
			if (this.searchTipsTimeout) {
				clearTimeout(this.searchTipsTimeout);
			}
			this.searchTips = featureDesc;
			this.searchTipsTimeout = setTimeout(() => {
				this.searchTips = '';
				this.searchTipsTimeout = null;
			}, 3000);
		});
	}

	@HostListener('window: focus')
	onFocus(): void {
		this.showVpn();
	}

	@HostListener('document:click', ['$event'])
	onClick(event) {
		const targetElement = event.target;
		if (this.menuTarget) {
			const clickedInside = this.menuTarget.nativeElement.contains(targetElement);
			const toggleMenuButton =
				targetElement.classList.contains('navbar-toggler-icon ') ||
				targetElement.classList.contains('fa-bars') ||
				targetElement.parentElement.classList.contains('fa-bars') ||
				targetElement.localName === 'path';
			if (!clickedInside && !toggleMenuButton) {
				this.showMenu = false;
			}
		}

		if (!event.fromSearchBox && !event.fromSearchMenu) {
			this.updateSearchBoxState(false);
		}
	}

	ngOnInit() {
		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});

		this.commonMenuSubscription = this.configService.menuItemNotification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});

		this.isDashboard = true;

		const cacheMachineFamilyName = this.commonService.getLocalStorageValue(
			LocalStorageKey.MachineFamilyName,
			undefined
		);
		if (cacheMachineFamilyName) {
			this.machineFamilyName = cacheMachineFamilyName;
		}

		if (this.hardwareScanService && this.hardwareScanService.isAvailable) {
			this.showHWScanMenu = this.hardwareScanService.isHardwareScanAvailable();
		}
	}

	private loadMenuOptions(machineType: number) {
		// if IdeaPad or ThinkPad then call below function
		if (machineType === 0 || machineType === 1) {
			this.showSmartAssist();
		}
		if (machineType === 1) {
			this.initInputAccessories();
		}
		if (machineType === 0) {
			// todo: in case unexpected showing up in edge case when u remove drivers. should be a safety way to check capability.
			this.commonService.setLocalStorageValue(LocalStorageKey.TopRowFunctionsCapability, false);
			this.topRowFunctionsIdeapadService.capability
				.pipe(
					catchError(() => {
						window.localStorage.removeItem(LocalStorageKey.TopRowFunctionsCapability);
						return undefined;
					})
				)
				.subscribe((capabilities: Array<any>) => {
					if (capabilities.length === 0) {
						this.commonService.setLocalStorageValue(LocalStorageKey.TopRowFunctionsCapability, false);
					}
					// todo: there should be a better way to operate this array
					capabilities.forEach(capability => {
						if (capability.key === 'FnLock') {
							this.commonService.setLocalStorageValue(LocalStorageKey.TopRowFunctionsCapability, capability.value === StringBooleanEnum.TRUTHY);
						}
					});
				});
		}
	}

	private initUnreadMessage() {
		const cacheUnreadMessageCount = this.commonService.getLocalStorageValue(
			LocalStorageKey.UnreadMessageCount,
			undefined
		);
		if (cacheUnreadMessageCount) {
			this.UnreadMessageCount.totalMessage = cacheUnreadMessageCount.totalMessage;
			this.UnreadMessageCount.lmaMenuClicked = cacheUnreadMessageCount.lmaMenuClicked;
			this.UnreadMessageCount.adobeMenuClicked = cacheUnreadMessageCount.adobeMenuClicked;
		} else {
			if (this.appsForYouService.showLmaMenu()) {
				this.UnreadMessageCount.totalMessage++;
			}
			if (this.appsForYouService.showAdobeMenu()) {
				this.UnreadMessageCount.totalMessage++;
			}
		}
	}

	updateUnreadMessageCount(item, event?) {
		this.showMenu = false;
		if (item.id === 'user') {
			const target = event.target || event.srcElement || event.currentTarget;
			const idAttr = target.attributes.id;
			const id = idAttr.nodeValue;
			let needUpdateLocalStorage = false;
			if (id === 'menu-main-lnk-open-lma') {
				if (!this.UnreadMessageCount.lmaMenuClicked) {
					if (this.UnreadMessageCount.totalMessage > 0) {
						this.UnreadMessageCount.totalMessage--;
					}
					this.UnreadMessageCount.lmaMenuClicked = true;
					needUpdateLocalStorage = true;
				}
			} else if (id === 'menu-main-lnk-open-adobe') {
				if (!this.UnreadMessageCount.adobeMenuClicked) {
					if (this.UnreadMessageCount.totalMessage > 0) {
						this.UnreadMessageCount.totalMessage--;
					}
					this.UnreadMessageCount.adobeMenuClicked = true;
					needUpdateLocalStorage = true;
				}
			}
			if (needUpdateLocalStorage) {
				this.commonService.setLocalStorageValue(LocalStorageKey.UnreadMessageCount, this.UnreadMessageCount);
			}
		}
	}

	ngAfterViewInit(): void {
		this.getMenuItems().then((items) => {
			const chsItem = items.find((item) => item.id === 'home-security');
			if (!chsItem) {
				return;
			}
			this.preloadImages = [].concat(chsItem.pre);
		});
	}

	ngOnDestroy() {
		if (this.commonMenuSubscription) {
			this.commonMenuSubscription.unsubscribe();
		}
	}

	toggleMenu(event) {
		this.updateSearchBoxState(false);
		this.showMenu = !this.showMenu;
		event.stopPropagation();
	}

	onKeyPress($event) {
		if ($event.keyCode === 13) {
			this.toggleMenu($event);
		}
	}

	isParentActive(item) {
		// console.log('IS PARENT ACTIVE', item.id, item.path);
	}

	showItem(item) {
		let showItem = true;
		if (this.deviceService.isSMode) {
			if (!item.sMode) {
				showItem = false;
			}
			if (item.id === 'device') {
				item.subitems.forEach((subitem, index, object) => {
					if (!subitem.sMode) {
						object.splice(index, 1);
					}
				});
			}
		}
		if (this.deviceService.isArm) {
			if (!item.forArm) {
				showItem = false;
			}
		}

		if (item.id === 'hardware-scan') {
			showItem = this.showHWScanMenu;
		}

		if (item.id === 'app-search') {
			showItem = this.showSearchMenu;
		}

		if (item.hasOwnProperty('hide') && item.hide) {
			showItem = false;
		}
		if (!this.adPolicyService.IsSystemUpdateEnabled && item.id === 'device') {
			item.subitems.forEach((subitem, index, object) => {
				if (subitem.adPolicyId && subitem.adPolicyId === AdPolicyId.SystemUpdate) {
					object.splice(index, 1);
				}
			});
		}

		return showItem;
	}

	isCommomItem(item) {
		return item.id !== 'user' && item.id !== 'app-search';
	}

	updateSearchBoxState(isActive) {
		this.searchTips = '';
		this.showSearchBox = isActive;
		if (isActive && this.searchTipsTimeout) {
			this.searchTipsTimeout = clearTimeout(this.searchTipsTimeout);
			this.searchTipsTimeout = null;
		}
	}

	onMenuItemClick(item, event?) {
		this.showMenu = false;
		if (item.id === 'app-search') {
			this.updateSearchBoxState(!this.showSearchBox);
			if (event) {
				event.fromSearchMenu = true;
			}
		}
	}

	onClickSearchMask() {
		this.showMenu = false;
		this.updateSearchBoxState(false);
	}

	menuItemClick(event, path) {
		if (path) {
			this.router.navigateByUrl(path);
		}
	}

	//  to popup Lenovo ID modal dialog
	OpenLenovoId(appFeature = null) {
		this.dialogService.openLenovoIdDialog(appFeature);
	}

	onLogout() {
		this.userService.removeAuth();
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case 'MachineInfo':
					this.machineFamilyName = notification.payload.family;
					this.commonService.setLocalStorageValue(
						LocalStorageKey.MachineFamilyName,
						notification.payload.family
					);
					this.country = notification.payload.country;
					break;
				case LocalStorageKey.MachineFamilyName:
					this.machineFamilyName = notification.payload;
					break;
				case NetworkStatus.Online:
					this.modernPreloadService.getIsEntitled();
					break;
				case AdPolicyEvent.AdPolicyUpdatedEvent:
					this.showSystemUpdates();
					break;
				case MenuItem.MenuItemChange:
					this.showMenuItems();
					break;
				default:
					break;
			}
		}
	}

	showSystemUpdates() {
		this.getMenuItems().then((items) => {
			const device = items.find((item) => item.id === 'device');
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
		});
	}

	showWindowsHelloItem() {
		this.getMenuItems().then((items) => {
			const securityItem = items.find((item) => item.id === 'security');

			if (!this.windowsHelloService.showWindowsHello()) {
				securityItem.subitems = securityItem.subitems.filter((subitem) => subitem.id !== 'windows-hello');
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWindowsHello, false);
			} else {
				const windowsHelloItem = securityItem.subitems.find((item) => item.id === 'windows-hello');
				if (!windowsHelloItem) {
					securityItem.subitems.push({
						id: 'windows-hello',
						label: 'common.menu.security.sub6',
						path: 'windows-hello',
						icon: '',
						metricsEvent: 'itemClick',
						metricsParent: 'navbar',
						metricsItem: 'link.windowshello',
						routerLinkActiveOptions: { exact: true },
						subitems: []
					});
				}
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWindowsHello, true);
			}
		});
	}

	showVpn() {
		this.getMenuItems().then((items) => {
			const securityItemForVpn = items.find((item) => item.id === 'security');
			if (securityItemForVpn !== undefined) {
				const vpnItem = securityItemForVpn.subitems.find((item) => item.id === 'internet-protection');
				if (this.region !== 'cn') {
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
		});
	}

	getMenuItems(): Promise<any> {
		return this.configService.getMenuItemsAsync(this.deviceService.isGaming).then((items) => {
			this.items = items;
			return this.items;
		});
	}

	private showSmartAssist() {
		this.logger.info('inside showSmartAssist');
		this.getMenuItems().then(async (items) => {
			const myDeviceItem = items.find((item) => item.id === this.constantDevice);
			if (myDeviceItem !== undefined) {
				const smartAssistItem = myDeviceItem.subitems.find((item) => item.id === 'smart-assist');
				if (!smartAssistItem) {
					// if cache has value true for IsSmartAssistSupported, add menu item
					const isSmartAssistSupported = this.commonService.getLocalStorageValue(
						LocalStorageKey.IsSmartAssistSupported,
						false
					);
					this.logger.info('showSmartAssist isSmartAssistSupported cache value', isSmartAssistSupported);

					if (isSmartAssistSupported) {
						this.addSmartAssistMenu(myDeviceItem);
					}

					// raj: promise.all breaks if any one function is breaks. adding feature wise capability check
					const assistCapability: SmartAssistCapability = new SmartAssistCapability();
					// HPD and Intelligent Screen capability check
					try {
						assistCapability.isIntelligentSecuritySupported = await this.smartAssist.getHPDVisibility();
						assistCapability.isIntelligentScreenSupported = await this.smartAssist.getIntelligentScreenVisibility();
					} catch (error) {
						this.logger.exception('showSmartAssist smartAssist.getHPDVisibility check', error);
					}
					// lenovo voice  capability check
					try {
						assistCapability.isLenovoVoiceSupported = await this.smartAssist.isLenovoVoiceAvailable();
					} catch (error) {
						this.logger.exception('showSmartAssist smartAssist.isLenovoVoiceAvailable check', error);
					}
					// lenovo voice  capability check
					try {
						assistCapability.isIntelligentMediaSupported = await this.smartAssist.getVideoPauseResumeStatus(); // returns object
					} catch (error) {
						this.logger.exception('showSmartAssist smartAssist.getVideoPauseResumeStatus check', error);
					}
					// lenovo voice  capability check
					try {
						assistCapability.isSuperResolutionSupported = await this.smartAssist.getSuperResolutionStatus();
					} catch (error) {
						this.logger.exception('showSmartAssist smartAssist.getSuperResolutionStatus check', error);
					}
					try {
						assistCapability.isAPSCapable = await this.smartAssist.getAPSCapability();
						assistCapability.isAPSSensorSupported = await this.smartAssist.getSensorStatus();
						assistCapability.isAPSHDDStatus = await this.smartAssist.getHDDStatus();
						assistCapability.isAPSSupported = assistCapability.isAPSCapable && assistCapability.isAPSSensorSupported && assistCapability.isAPSHDDStatus > 0;
					} catch (error) {
						this.logger.exception('showSmartAssist APS capability check', error);
					}

					this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCapability, assistCapability);
					this.logger.info('showSmartAssist capability check', assistCapability);

					const isAvailable =
						assistCapability.isIntelligentSecuritySupported ||
						assistCapability.isLenovoVoiceSupported ||
						assistCapability.isIntelligentMediaSupported.available ||
						assistCapability.isIntelligentScreenSupported ||
						assistCapability.isSuperResolutionSupported.available ||
						assistCapability.isAPSSupported;
					// const isAvailable = true;
					this.commonService.setLocalStorageValue(
						LocalStorageKey.IsSmartAssistSupported,
						isAvailable
					);

					// avoid duplicate entry. if not added earlier then add menu
					if (isAvailable && !isSmartAssistSupported) {
						this.addSmartAssistMenu(myDeviceItem);
					}
				}
			}
		});
	}

	private addSmartAssistMenu(myDeviceItem: any) {
		myDeviceItem.subitems.splice(4, 0, {
			id: 'smart-assist',
			label: 'common.menu.device.sub4',
			path: 'smart-assist',
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.smartassist',
			routerLinkActiveOptions: { exact: true },
			icon: '',
			sMode: true,
			subitems: []
		});
	}

	public openExternalLink(link) {
		if (link) {
			window.open(link);
		}
	}

	initInputAccessories() {
		Promise.all([
			this.keyboardService.GetUDKCapability(),
			this.keyboardService.GetKeyboardMapCapability(),
			this.keyboardService.GetKeyboardVersion()
		])
			.then((responses) => {
				try {
					let inputAccessoriesCapability: InputAccessoriesCapability = this.commonService.getLocalStorageValue(LocalStorageKey.InputAccessoriesCapability, undefined);
					if (inputAccessoriesCapability === undefined) {
						inputAccessoriesCapability = new InputAccessoriesCapability();
					}
					inputAccessoriesCapability.isUdkAvailable = responses[0];
					inputAccessoriesCapability.isKeyboardMapAvailable = responses[1];
					inputAccessoriesCapability.keyboardVersion = responses[2];
					this.commonService.setLocalStorageValue(LocalStorageKey.InputAccessoriesCapability,
						inputAccessoriesCapability
					);
				} catch (error) {
					console.log('initInputAccessories', error);
				}
			})
			.catch((error) => { });
		this.keyboardService.getVoipHotkeysSettings()
			.then(response => {
				if (response.capability) {
					this.commonService.setLocalStorageValue(LocalStorageKey.VOIPCapability, response.capability);
				}
				return response;
			});
	}

	openModernPreloadModal() {
		this.showMenu = false;
		const modernPreloadModal: NgbModalRef = this.modalService.open(ModalModernPreloadComponent, {
			backdrop: 'static',
			size: 'lg',
			centered: true,
			windowClass: 'modern-preload-modal',
			keyboard: false,
			beforeDismiss: () => {
				if (modernPreloadModal.componentInstance.onBeforeDismiss) {
					modernPreloadModal.componentInstance.onBeforeDismiss();
				}
				return true;
			}
		});
	}

	showMenuItems() {
		this.localInfoService
			.getLocalInfo()
			.then((result) => {
				this.region = result.GEO;
				this.showVpn();
				this.initUnreadMessage();
			})
			.catch((e) => {
				this.region = 'us';
				this.showVpn();
			});

		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
		this.getMenuItems().then((items) => {
			const cacheShowWindowsHello = this.commonService.getLocalStorageValue(
				LocalStorageKey.SecurityShowWindowsHello
			);
			if (cacheShowWindowsHello) {
				const securityItem = items.find((item) => item.id === 'security');
				if (securityItem) {
					const windowsHelloItem = securityItem.subitems.find((item) => item.id === 'windows-hello');
					if (!windowsHelloItem) {
						securityItem.subitems.push({
							id: 'windows-hello',
							label: 'common.menu.security.sub6',
							path: 'windows-hello',
							icon: '',
							metricsEvent: 'itemClick',
							metricsParent: 'navbar',
							metricsItem: 'link.windowshello',
							routerLinkActiveOptions: { exact: true },
							subitems: []
						});
					}
				}
			}
			if (this.securityAdvisor) {
			const windowsHello: WindowsHello = this.securityAdvisor.windowsHello;
			if (windowsHello.fingerPrintStatus) {
				this.showWindowsHelloItem();
			}
			windowsHello.on(EventTypes.helloFingerPrintStatusEvent, () => {
				this.showWindowsHelloItem();
			});
			}
		});

		if (this.hardwareScanService && this.hardwareScanService.getPluginInfo()) {
			this.hardwareScanService.getPluginInfo()
				.then((hwscanPluginInfo: any) => {
					// Shows Hardware Scan menu icon only when the Hardware Scan plugin exists and it is not Legacy (version <= 1.0.38)
					this.showHWScanMenu = hwscanPluginInfo !== undefined &&
						hwscanPluginInfo.LegacyPlugin === false &&
						hwscanPluginInfo.PluginVersion !== '1.0.39'; // This version is not compatible with current version
				})
				.catch(() => {
					this.showHWScanMenu = false;
				});
		}

		const machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType, undefined);
		if (machineType) {
			this.loadMenuOptions(machineType);
		} else if (this.deviceService.isShellAvailable) {
			this.deviceService
				.getMachineType()
				.then((value: number) => {
					this.loadMenuOptions(value);
				})
				.catch((error) => { });
		}
	}

}
