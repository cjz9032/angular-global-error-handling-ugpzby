import { Component, OnInit, HostListener, ViewChild, AfterViewInit, Input, ElementRef, Optional } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ConfigService } from '../../services/config/config.service';
import { DeviceService } from '../../services/device/device.service';
import { UserService } from '../../services/user/user.service';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { VantageShellService } from '../../services/vantage-shell/vantage-shell.service';
import { WindowsHello, EventTypes, SecurityAdvisor } from '@lenovo/tan-client-bridge';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { SmartAssistCapability } from 'src/app/data-models/smart-assist/smart-assist-capability.model';
import { SecurityAdvisorMockService } from 'src/app/services/security/securityMock.service';
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
import { AdPolicyId, AdPolicyEvent } from 'src/app/enums/ad-policy-id.enum';
import { EMPTY } from 'rxjs';
import { HardwareScanService } from 'src/app/beta/hardware-scan/services/hardware-scan/hardware-scan.service';
import { AppsForYouEnum } from 'src/app/enums/apps-for-you.enum';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AppsForYouService } from 'src/app/services/apps-for-you/apps-for-you.service';
import { AppSearchService } from 'src/app/beta/app-search/app-search.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'vtr-menu-main',
	templateUrl: './menu-main.component.html',
	styleUrls: ['./menu-main.component.scss']
})
export class MenuMainComponent implements OnInit, AfterViewInit {
	@ViewChild('menuTarget', { static: false })
	menuTarget: ElementRef;
	@Input() loadMenuItem: any = {};
	public machineFamilyName: string;
	public country: string;
	// commonMenuSubscription: Subscription;
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
		vantageShellService: VantageShellService,
		localInfoService: LocalInfoService,
		private smartAssist: SmartAssistService,
		private logger: LoggerService,
		private securityAdvisorMockService: SecurityAdvisorMockService,
		private dialogService: LenovoIdDialogService,
		private keyboardService: InputAccessoriesService,
		public modalService: NgbModal,
		private windowsHelloService: WindowsHelloService,
		public modernPreloadService: ModernPreloadService,
		private adPolicyService: AdPolicyService,
		private hardwareScanService: HardwareScanService,
		private translate: TranslateService,
		public appsForYouService: AppsForYouService,
		searchService: AppSearchService
	) {
		localInfoService
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
		this.securityAdvisor = vantageShellService.getSecurityAdvisor();
		if (!this.securityAdvisor) {
			this.securityAdvisor = this.securityAdvisorMockService.getSecurityAdvisor();
		}
		this.getMenuItems().then((items) => {
			const cacheShowWindowsHello = this.commonService.getLocalStorageValue(
				LocalStorageKey.SecurityShowWindowsHello
			);
			if (cacheShowWindowsHello) {
				const securityItem = items.find((item) => item.id === 'security');
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
			if (this.securityAdvisor) {
				const windowsHello: WindowsHello = this.securityAdvisor.windowsHello;
				if (windowsHello.fingerPrintStatus) {
					this.showWindowsHelloItem(windowsHello);
				}
				windowsHello.on(EventTypes.helloFingerPrintStatusEvent, () => {
					this.showWindowsHelloItem(windowsHello);
				});
			}
		});

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

		this.isDashboard = true;

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

		const cacheMachineFamilyName = this.commonService.getLocalStorageValue(
			LocalStorageKey.MachineFamilyName,
			undefined
		);
		if (cacheMachineFamilyName) {
			this.machineFamilyName = cacheMachineFamilyName;
		}

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
	}

	private loadMenuOptions(machineType: number) {
		// if IdeaPad or ThinkPad then call below function
		if (machineType === 0 || machineType === 1) {
			this.showSmartAssist();
		}
		if (machineType === 1) {
			this.initInputAccessories();
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

	// ngOnDestroy() {
	// 	if (this.commonMenuSubscription) {
	// 		this.commonMenuSubscription.unsubscribe();
	// 	}
	// }

	toggleMenu(event) {
		this.updateSearchBoxState(false);
		this.showMenu = !this.showMenu;
		event.stopPropagation();
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

	showWindowsHelloItem(windowsHello: WindowsHello) {
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
		this.getMenuItems().then((items) => {
			const myDeviceItem = items.find((item) => item.id === this.constantDevice);
			if (myDeviceItem !== undefined) {
				const smartAssistItem = myDeviceItem.subitems.find((item) => item.id === 'smart-assist');
				if (!smartAssistItem) {
					this.logger.info('get IsSmartAssistSupported');

					// if cache has value true for IsSmartAssistSupported, add menu item
					const isSmartAssistSupported = this.commonService.getLocalStorageValue(
						LocalStorageKey.IsSmartAssistSupported,
						false
					);

					if (isSmartAssistSupported) {
						this.addSmartAssistMenu(myDeviceItem);
					}
					this.logger.info('before Promise.all JS Bridge call');

					// still check if any of the feature supported. if yes then add menu
					Promise.all([
						this.smartAssist.getHPDVisibilityInIdeaPad(),
						this.smartAssist.getHPDVisibilityInThinkPad(),
						this.smartAssist.isLenovoVoiceAvailable(),
						this.smartAssist.getVideoPauseResumeStatus(), // returns object
						this.smartAssist.getIntelligentScreenVisibility(),
						this.smartAssist.getAPSCapability(),
						this.smartAssist.getSensorStatus(),
						this.smartAssist.getHDDStatus()
					])
						.then((responses: any[]) => {
							this.logger.info('inside Promise.all THEN JS Bridge call', responses);
							// cache smart assist capability
							const smartAssistCapability: SmartAssistCapability = new SmartAssistCapability();
							smartAssistCapability.isIntelligentSecuritySupported = responses[0] || responses[1];
							smartAssistCapability.isLenovoVoiceSupported = responses[2];
							smartAssistCapability.isIntelligentMediaSupported = responses[3];
							smartAssistCapability.isIntelligentScreenSupported = responses[4];
							smartAssistCapability.isAPSSupported = responses[5] && responses[6] && responses[7] > 0;
							this.commonService.setLocalStorageValue(
								LocalStorageKey.SmartAssistCapability,
								smartAssistCapability
							);
							this.logger.info('inside Promise.all THEN JS Bridge call', smartAssistCapability);

							const isAvailable =
								responses[0] ||
								responses[1] ||
								responses[2] ||
								responses[3].available ||
								responses[4] ||
								(responses[5] && responses[6] && responses[7] > 0);
							// const isAvailable = true;
							this.commonService.setLocalStorageValue(
								LocalStorageKey.IsSmartAssistSupported,
								isAvailable
							);

							// avoid duplicate entry. if not added earlier then add menu
							if (isAvailable && !isSmartAssistSupported) {
								this.addSmartAssistMenu(myDeviceItem);
							}
						})
						.catch((error) => {
							this.logger.error('error in initSmartAssist.Promise.all()', error.message);
							return EMPTY;
						});
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
		Promise.all([this.keyboardService.GetUDKCapability(), this.keyboardService.GetKeyboardMapCapability()])
			.then((responses: any[]) => {
				try {
					let inputAccessoriesCapability: InputAccessoriesCapability = this.commonService.getLocalStorageValue(LocalStorageKey.InputAccessoriesCapability, undefined);
					if (inputAccessoriesCapability === undefined) {
						inputAccessoriesCapability = new InputAccessoriesCapability();
					}
					inputAccessoriesCapability.isUdkAvailable = responses[0];
					inputAccessoriesCapability.isKeyboardMapAvailable = responses[1];
					this.commonService.setLocalStorageValue(LocalStorageKey.InputAccessoriesCapability,
						inputAccessoriesCapability
					);
				} catch (error) {
					console.log('initInputAccessories', error);
				}
			})
			.catch((error) => { });
	}

	openModernPreloadModal() {
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
}
