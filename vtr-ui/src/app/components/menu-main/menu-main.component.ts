import { Component, OnInit, HostListener, ViewChild, AfterViewInit, Input, ElementRef, ViewContainerRef, OnDestroy } from '@angular/core';
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
import { LanguageService } from 'src/app/services/language/language.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModernPreloadService } from 'src/app/services/modern-preload/modern-preload.service';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { AdPolicyService } from 'src/app/services/ad-policy/ad-policy.service';
import { AdPolicyEvent, AdPolicyId } from 'src/app/enums/ad-policy-id.enum';
import { Observable, Subscription } from 'rxjs';
import { HardwareScanService } from 'src/app/beta/hardware-scan/services/hardware-scan/hardware-scan.service';
import { AppsForYouEnum } from 'src/app/enums/apps-for-you.enum';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AppsForYouService } from 'src/app/services/apps-for-you/apps-for-you.service';
import { AppSearchService } from 'src/app/beta/app-search/app-search.service';
import { TopRowFunctionsIdeapadService } from '../pages/page-device-settings/children/subpage-device-settings-input-accessory/top-row-functions-ideapad/top-row-functions-ideapad.service';
import { StringBooleanEnum } from '../pages/page-device-settings/children/subpage-device-settings-input-accessory/top-row-functions-ideapad/top-row-functions-ideapad.interface';
import { catchError } from 'rxjs/operators';
import { MenuItem } from 'src/app/enums/menuItem.enum';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { NewFeatureTipService } from 'src/app/services/new-feature-tip/new-feature-tip.service';
import { CardService } from 'src/app/services/card/card.service';

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
	hideDropDown = false;

	segment: string;

	headerLogo: string;

	VantageLogo = `
		data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c
		3RyYXRvciAyMy4wLjIsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4x
		IiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS9
		4bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAyNTYgMjU2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyNTYgMj
		U2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojMjdBREQ3O30NCgkuc3Qxe2ZpbGw6I
		zIxMzA2NDt9DQoJLnN0MntmaWxsOiNGRkZGRkY7fQ0KPC9zdHlsZT4NCjxnPg0KCTxyZWN0IHk9IjAiIGNsYXNzPSJzdDAiIHdpZHRoPSIyNTYiIGhl
		aWdodD0iMjU2Ii8+DQoJPGc+DQoJCTxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iNTguMiwyMTEuNiA4OC41LDE5Mi42IDE5NC44LDE5Mi42IDE
		5NC44LDE5NS41IAkJIi8+DQoJCTxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iNTguMiwyMTEuNiA4OC41LDE5Mi42IDg4LjUsMzkuNiA4Ni4zLD
		M5LjYgCQkiLz4NCgkJPHBvbHlnb24gY2xhc3M9InN0MiIgcG9pbnRzPSIxOTQuOCwxNjIuOSAxMjEuMywxNjIuOSAxMjEuMywzOS42IDg4LjUsMzkuN
		iA4OC41LDE5Mi42IDE5NC44LDE5Mi42IAkJIi8+DQoJPC9nPg0KPC9nPg0KPC9zdmc+DQo=
		`;
	gamingLogo = '../../../assets/images/gaming/gaming-logo-small.png';

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
		public modernPreloadService: ModernPreloadService,
		private adPolicyService: AdPolicyService,
		private hardwareScanService: HardwareScanService,
		private translate: TranslateService,
		public appsForYouService: AppsForYouService,
		private topRowFunctionsIdeapadService: TopRowFunctionsIdeapadService,
		private searchService: AppSearchService,
		public dashboardService: DashboardService,
		private newFeatureTipService: NewFeatureTipService,
		private viewContainerRef: ViewContainerRef,
		public cardService: CardService
	) {
			newFeatureTipService.viewContainer = this.viewContainerRef;
		}

	ngOnInit() {
		this.headerLogo = '';
		this.checkLiteGaming();

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

		if (this.hardwareScanService && this.hardwareScanService.isAvailable) {
			this.hardwareScanService.isAvailable().then((available) => {
				this.showHWScanMenu = available;
			});
		}
		this.showNewFeatureTipsWithMenuItems();
	}

	private initComponent() {
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
		// Added special case for KEI machine
		if (machineFamily) {
			const familyName = machineFamily.replace(/\s+/g, '');
			if (machineType === 1 && familyName !== 'LenovoTablet10') {
				this.initInputAccessories();
			}
		}
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

	private checkLiteGaming() {
		const filter: Promise<any> = this.vantageShellService.calcDeviceFilter({ var: 'DeviceTags.System.Profile.LiteGaming' });
		if (filter) {
			filter.then((hyp) => {
				if (hyp !== null) {
					this.deviceService.isLiteGaming = true;
					this.headerLogo = this.VantageLogo;
				} else {
					this.deviceService.isLiteGaming = false;
					this.headerLogo = this.gamingLogo;
				}
			});
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
		} else if (item.id === 'user') {
			const target = event.target || event.srcElement || event.currentTarget;
			const idAttr = target.attributes.id;
			const id = idAttr.nodeValue;
			if (id === 'menu-main-lnk-open-lma' ||
				id === 'menu-main-lnk-open-adobe' ||
				id === 'menu-main-lnk-open-dcc') {
				this.appsForYouService.updateUnreadMessageCount(id);
				if (id === 'menu-main-lnk-open-dcc') {
					this.cardService.openDccDetailModal();
				}
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
				deviceSettingsItem.subitems = deviceSettingsItem.subitems.filter(item => item.id !== id);
			}
		});
	}
	private showSmartAssist() {
		this.logger.info('MenuMainComponent.showSmartAssist: inside');
		this.getMenuItems().then(async (items) => {
			const myDeviceItem = items.find((item) => item.id === this.constantDevice);
			if (myDeviceItem !== undefined) {
				const smartAssistItem = myDeviceItem.subitems.find((item) => item.id === 'smart-assist');
				if (!smartAssistItem) {
					// if cache has value true for IsSmartAssistSupported, add menu item
					const smartAssistCacheValue = this.commonService.getLocalStorageValue(
						LocalStorageKey.IsSmartAssistSupported,
						false
					);
					this.logger.info('MenuMainComponent.showSmartAssist smartAssistCacheValue', smartAssistCacheValue);

					if (smartAssistCacheValue) {
						this.addSmartAssistMenu(myDeviceItem);
					}

					// raj: promise.all breaks if any one function is breaks. adding feature wise capability check
					const assistCapability: SmartAssistCapability = new SmartAssistCapability();
					// HPD and Intelligent Screen capability check
					try {
						assistCapability.isIntelligentSecuritySupported = await this.smartAssist.getHPDVisibility();
						assistCapability.isIntelligentScreenSupported = await this.smartAssist.getIntelligentScreenVisibility();
					} catch (error) {
						this.logger.exception('MenuMainComponent.showSmartAssist smartAssist.getHPDVisibility check', error);
					}
					// lenovo voice  capability check
					try {
						assistCapability.isLenovoVoiceSupported = await this.smartAssist.isLenovoVoiceAvailable();
					} catch (error) {
						this.logger.exception('MenuMainComponent.showSmartAssist smartAssist.isLenovoVoiceAvailable check', error);
					}
					// video pause capability check
					try {
						assistCapability.isIntelligentMediaSupported = await this.smartAssist.getVideoPauseResumeStatus(); // returns object
					} catch (error) {
						this.logger.exception('MenuMainComponent.showSmartAssist smartAssist.getVideoPauseResumeStatus check', error);
					}
					// super resolution  capability check
					try {
						assistCapability.isSuperResolutionSupported = await this.smartAssist.getSuperResolutionStatus();
					} catch (error) {
						this.logger.exception('MenuMainComponent.showSmartAssist smartAssist.getSuperResolutionStatus check', error);
					}

					// APS capability check
					try {
						assistCapability.isAPSCapable = await this.smartAssist.getAPSCapability();
						assistCapability.isAPSSensorSupported = await this.smartAssist.getSensorStatus();
						assistCapability.isAPSHDDStatus = await this.smartAssist.getHDDStatus();
						assistCapability.isAPSSupported = assistCapability.isAPSCapable && assistCapability.isAPSSensorSupported && assistCapability.isAPSHDDStatus > 0;
					} catch (error) {
						this.logger.exception('MenuMainComponent.showSmartAssist APS capability check', error);
					}

					this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCapability, assistCapability);

					const isSmartAssistAvailable =
						assistCapability.isIntelligentSecuritySupported ||
						assistCapability.isLenovoVoiceSupported ||
						assistCapability.isIntelligentMediaSupported.available ||
						assistCapability.isIntelligentScreenSupported ||
						assistCapability.isSuperResolutionSupported.available ||
						assistCapability.isAPSSupported;
					// const isAvailable = true;
					this.commonService.setLocalStorageValue(
						LocalStorageKey.IsSmartAssistSupported,
						isSmartAssistAvailable
					);

					this.logger.error('MenuMainComponent.showSmartAssist capability check',
						{
							smartAssistCacheValue,
							isSmartAssistAvailable,
							assistCapability
						});

					// avoid duplicate entry. if not added earlier then add menu
					if (isSmartAssistAvailable && !smartAssistCacheValue) {
						this.addSmartAssistMenu(myDeviceItem);
					}

					// if cache is old and new capability call is false then remove it
					if (!isSmartAssistAvailable) {
						this.removeSmartAssistMenu(myDeviceItem);
					}
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

	private removeSmartAssistMenu(myDeviceItem: any) {
		const smartAssistItem = myDeviceItem.subitems.find(item => item.id === 'smart-assist');
		if (smartAssistItem) {
			myDeviceItem.subitems = myDeviceItem.subitems.filter(
				(item) => item.id !== 'smart-assist'
			);
		}
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
		this.dialogService.openModernPreloadModal();
	}

	showNewFeatureTipsWithMenuItems() {
		const newFeatureVersion = 3.002000;
		const welcomeTutorial = this.commonService.getLocalStorageValue(LocalStorageKey.WelcomeTutorial);
		if (!welcomeTutorial || !welcomeTutorial.isDone) {
			this.commonService.setLocalStorageValue(LocalStorageKey.NewFeatureTipsVersion, newFeatureVersion);
			return;
		}
		const newFeatureTipsShowComplete = this.commonService.getLocalStorageValue(LocalStorageKey.NewFeatureTipsVersion);
		if (!newFeatureTipsShowComplete || newFeatureTipsShowComplete < newFeatureVersion) {
			this.getMenuItems().then(async (items) => {
				const privacyItem = getItemByItemId('privacy');
				const securityItem = getItemByItemId('security');
				const chsItem = getItemByItemId('home-security');
				let isHideMenuToggle = true;
				if (window.innerWidth < 1200) { isHideMenuToggle = false; }
				if (((privacyItem && this.showItem(privacyItem)) ||
						(securityItem && this.showItem(securityItem)) ||
						(chsItem && this.showItem(chsItem))
					) && isHideMenuToggle) {
					this.newFeatureTipService.create();
				}
				this.commonService.setLocalStorageValue(LocalStorageKey.NewFeatureTipsVersion, newFeatureVersion);
				function getItemByItemId(itemId: string) { return items.find((item: any) => item.id === itemId); }
			});
		}
	}
}
