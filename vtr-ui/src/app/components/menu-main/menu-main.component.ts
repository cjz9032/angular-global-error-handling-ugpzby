import { Component, OnInit, HostListener, ViewChild, AfterViewInit, Input, ElementRef, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ConfigService } from '../../services/config/config.service';
import { DeviceService } from '../../services/device/device.service';
import { UserService } from '../../services/user/user.service';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { VantageShellService } from '../../services/vantage-shell/vantage-shell.service';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { SmartAssistCapability } from 'src/app/data-models/smart-assist/smart-assist-capability.model';
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
import { HardwareScanService } from 'src/app/beta/hardware-scan/services/hardware-scan/hardware-scan.service';
import { AppsForYouEnum } from 'src/app/enums/apps-for-you.enum';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AppsForYouService } from 'src/app/services/apps-for-you/apps-for-you.service';
import { AppSearchService } from 'src/app/beta/app-search/app-search.service';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { DashboardLocalStorageKey } from 'src/app/enums/dashboard-local-storage-key.enum';
import { MenuItem } from 'src/app/enums/menuItem.enum';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { SelfSelectEvent } from 'src/app/enums/self-select.enum';
import { DialogService } from 'src/app/services/dialog/dialog.service';

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
	public items: Array<any> = [];
	public showSearchBox = false;
	public showSearchMenu = false;
	public searchTips = '';
	private searchTipsTimeout: any;
	private unsupportFeatureEvt: Observable<string>;
	private subscription: Subscription;
	public selfSelectStatusVal: boolean;
	showMenu = false;
	showHWScanMenu = false;
	preloadImages: string[];
	isRS5OrLater: boolean;
	isGamingHome: boolean;
	currentUrl: string;
	isSMode: boolean;
	segment: string;
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
		private vantageShellService: VantageShellService,
		private localInfoService: LocalInfoService,
		private smartAssist: SmartAssistService,
		private logger: LoggerService,
		private dialogService: DialogService,
		private keyboardService: InputAccessoriesService,
		public modalService: NgbModal,
		private windowsHelloService: WindowsHelloService,
		public modernPreloadService: ModernPreloadService,
		private adPolicyService: AdPolicyService,
		// private hardwareScanService: HardwareScanService,
		private translate: TranslateService,
		public appsForYouService: AppsForYouService,
		private searchService: AppSearchService,
		public dashboardService: DashboardService,

	) {
	}

	ngOnInit() {
		this.subscription = this.commonService.notification.subscribe((notification: AppNotification) => {
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

		// VAN-10950 hide HW scan from Vantage UI in 3.1.1
		// if (this.hardwareScanService && this.hardwareScanService.isAvailable) {
		// 	this.hardwareScanService.isAvailable()
		// 		.then((isAvailable: any) => {
		// 			this.showHWScanMenu = isAvailable;
		// 		})
		// 		.catch(() => {
		// 			this.showHWScanMenu = false;
		// 		});
		// }
	}

	private initComponent() {
		this.localInfoService
			.getLocalInfo()
			.then((result) => {
				this.initUnreadMessage();
			});
		this.getMenuItems();
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
		this.unsupportFeatureEvt = this.searchService.getUnsupportFeatureEvt();
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

		const machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType, undefined);
		if (machineType) {
			this.loadMenuOptions(machineType);
		} else if (this.deviceService.isShellAvailable) {
			this.deviceService
				.getMachineType()
				.then((value: number) => {
					this.loadMenuOptions(value);
				});
		}
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



	private loadMenuOptions(machineType: number) {
		const machineFamily = this.commonService.getLocalStorageValue(LocalStorageKey.MachineFamilyName, undefined);
		const familyName = machineFamily.replace(/\s+/g, '');

		// if IdeaPad or ThinkPad then call below function
		if (machineType === 0 || machineType === 1) {
			// checking self select status for HW Settings
			this.dashboardService.getSelfSelectStatus().then(value => {
				this.selfSelectStatusVal = value;
				if (this.selfSelectStatusVal === true) {
					this.showSmartAssist();
				} else {
					this.removeDeviceSettings();
				}
			});
		}
		if (machineType === 1 && familyName !== 'LenovoTablet10') {
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
		} else if (this.UnreadMessageCount.totalMessage === 0) {
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
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
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
					// this.initComponent();
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
					this.initComponent();
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

	getMenuItems(): Promise<any> {
		// remove onfocus showVpn()
		// need refresh menuItem from config service, don't need localStorage
		return this.configService.getMenuItemsAsync(this.deviceService.isGaming).then((items) => {
				this.items = items;
				return this.items;
		});
	}
	public removeDeviceSettings() {
		this.getMenuItems().then((items: any) => {
			const deviceSettingsItem = items.find((item) => item.id === this.constantDevice);
			const id = 'device-settings';
			if (deviceSettingsItem) {
				deviceSettingsItem.subitems =  deviceSettingsItem.subitems.filter(item => item.id !== id);
			}
		});
	}
	private showSmartAssist() {
		this.logger.info('MenuMainComponent.showSmartAssist : inside showSmartAssist');
		this.getMenuItems().then((items) => {
			const myDeviceItem = items.find((item) => item.id === this.constantDevice);
			if (myDeviceItem !== undefined) {
				const smartAssistItem = myDeviceItem.subitems.find((item) => item.id === 'smart-assist');
				if (!smartAssistItem) {
					this.logger.info('MenuMainComponent.showSmartAssist : get IsSmartAssistSupported value');

					// if cache has value true for IsSmartAssistSupported, add menu item
					const isSmartAssistSupported = this.commonService.getLocalStorageValue(
						LocalStorageKey.IsSmartAssistSupported,
						false
					);

					if (isSmartAssistSupported) {
						this.addSmartAssistMenu(myDeviceItem);
					}
					this.logger.info('MenuMainComponent.showSmartAssist : before Promise.all JS Bridge call. Cache value', isSmartAssistSupported);

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
							this.logger.info('MenuMainComponent.showSmartAssist : promise then', responses);
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
							this.logger.info('MenuMainComponent.showSmartAssist : smartAssistCapability', smartAssistCapability);

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
							this.logger.error('MenuMainComponent.showSmartAssist: error in promise', error.message);
						});
				}
			}
		});
	}

	private addSmartAssistMenu(myDeviceItem: any) {
		const smartAssistItem = myDeviceItem.subitems.find(item => item.id === 'smart-assist');
		if (!smartAssistItem) {
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
		this.showMenu = false;
		this.dialogService.openModernPreloadModal();
	}

}
