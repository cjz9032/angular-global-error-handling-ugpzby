import { Component, OnInit, HostListener, ViewChild, Input, ElementRef, ViewContainerRef, OnDestroy } from '@angular/core';
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModernPreloadService } from 'src/app/services/modern-preload/modern-preload.service';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { AdPolicyService } from 'src/app/services/ad-policy/ad-policy.service';
import { AdPolicyId } from 'src/app/enums/ad-policy-id.enum';
import { Observable, Subscription } from 'rxjs';
import { HardwareScanService } from 'src/app/services/hardware-scan/hardware-scan.service';
import { AppsForYouEnum } from 'src/app/enums/apps-for-you.enum';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AppsForYouService } from 'src/app/services/apps-for-you/apps-for-you.service';
import { AppSearchService } from 'src/app/beta/app-search/app-search.service';
import { TopRowFunctionsIdeapadService } from '../pages/page-device-settings/children/subpage-device-settings-input-accessory/top-row-functions-ideapad/top-row-functions-ideapad.service';
import { catchError, map, tap } from 'rxjs/operators';
import { MenuItem } from 'src/app/enums/menuItem.enum';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { NewFeatureTipService } from 'src/app/services/new-feature-tip/new-feature-tip.service';
import { CardService } from 'src/app/services/card/card.service';
import { BacklightService } from '../pages/page-device-settings/children/subpage-device-settings-input-accessory/backlight/backlight.service';
import { StringBooleanEnum } from '../../data-models/common/common.interface';
import { BacklightLevelEnum } from '../pages/page-device-settings/children/subpage-device-settings-input-accessory/backlight/backlight.enum';
import { LenovoIdStatus } from 'src/app/enums/lenovo-id-key.enum';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';

@Component({
	selector: 'vtr-menu-main',
	templateUrl: './menu-main.component.html',
	styleUrls: ['./menu-main.component.scss']
})
export class MenuMainComponent implements OnInit, OnDestroy {
	@ViewChild('menuTarget', { static: false })
	menuTarget: ElementRef;
	@Input() loadMenuItem: any = {};
	public machineFamilyName: string;
	public country: string;
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
	public isLoggingOut = false;
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
	gamingLogo = 'assets/images/gaming/gaming-logo-small.png';
	private backlightCapabilitySubscription: Subscription;

	get appsForYouEnum() { return AppsForYouEnum; }

	constructor(
		private router: Router,
		public configService: ConfigService,
		public commonService: CommonService,
		public userService: UserService,
		public languageService: LanguageService,
		public deviceService: DeviceService,
		private vantageShellService: VantageShellService,
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
		public cardService: CardService,
		private feedbackService: FeedbackService,
		private backlightService: BacklightService
	) {
		newFeatureTipService.viewContainer = this.viewContainerRef;
	}

	ngOnInit() {
		this.headerLogo = '';
		this.checkLiteGaming();

		this.subscription = this.commonService.notification.subscribe((notification: AppNotification) => {
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
		this.initComponent();
	}

	updateMenu(menu) {
		if (menu && menu.length > 0) {
			this.items = menu;
			this.preloadImages = this.collectPreloadAssets(menu);
		}
	}

	private collectPreloadAssets(menu: Array<any>): string[] {
		let assets = [];
		menu.forEach(item => {
			if (!item.hide && item.pre) {
				assets = assets.concat(item.pre);
			}

			if (item.subitems.length > 0) {
				assets = assets.concat(this.collectPreloadAssets(item.subitems));
			}
		});

		return assets;
	}

	private initComponent() {
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
		// if IdeaPad or ThinkPad then call below function
		if (machineType === 0 || machineType === 1) {
			// add try catch for backlight exception; this is temp solution, dongwq2 should add error handle in backlight
			try {
				// this.commonService.setLocalStorageValue(LocalStorageKey.BacklightCapability, false);
				this.backlightCapabilitySubscription = this.backlightService.backlight.pipe(
					map(res => res.find(item => item.key === 'KeyboardBacklightLevel')),
					map(res => res.value !== BacklightLevelEnum.NO_CAPABILITY),
					tap(res => {
						this.commonService.setLocalStorageValue(LocalStorageKey.BacklightCapability, res);
					}),
					catchError(() => {
						window.localStorage.removeItem(LocalStorageKey.BacklightCapability);
						return undefined;
					})
				).subscribe();
			} catch (error) { }

		}

		const machineFamily = this.commonService.getLocalStorageValue(LocalStorageKey.MachineFamilyName, undefined);
		// Added special case for KEI machine
		if (machineFamily) {
			const familyName = machineFamily.replace(/\s+/g, '');
			if (machineType === 1 && familyName !== 'LenovoTablet10') {
				this.initInputAccessories();
			}
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

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
		if (this.backlightCapabilitySubscription) {
			this.backlightCapabilitySubscription.unsubscribe();
		}
	}

	toggleMenu(event) {
		this.updateSearchBoxState(false);
		this.showMenu = !this.showMenu;
		this.colorPickerFun();
		event.stopPropagation();
	}

	public colorPickerFun() {
		if (this.showMenu) {
			if (document.getElementById('colorBtn')) {
				document.getElementById('colorBtn').addEventListener('click', (event) => {
					this.showMenu = false;
				});
			}
			for (let i = 0; i < 4; i++) {
				if (document.getElementById('keyboard-area' + i)) {
					document.getElementById('keyboard-area' + i).addEventListener('click', (event) => {
						this.showMenu = false;
					});
				}
			}
		}
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
		window.getSelection().empty();
		this.showMenu = false;
		if (item.id === 'app-search') {
			this.updateSearchBoxState(!this.showSearchBox);
			if (event) {
				event.fromSearchMenu = true;
			}
		} else if (item.id === 'user' && event) {
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

	menuItemKeyDown(path, subpath?) {
		if (path) {
			if (!subpath) {
				this.router.navigateByUrl(`/${path}`);
			} else {
				this.router.navigateByUrl(`/${path}/${subpath}`);
			}
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
				case MenuItem.MenuItemChange:
					this.updateMenu(notification.payload);
					break;
				case LenovoIdStatus.LoggingOut:
					this.isLoggingOut = notification.payload;
					break;
				default:
					break;
			}
		}
	}

	public openExternalLink(link) {
		if (link) {
			window.open(link);
		}
	}

	async initInputAccessories() {
		this.logger.error('MenuMainComponent.initInputAccessories before API call');
		await Promise.all([
			this.keyboardService.GetAllCapability(),
			this.keyboardService.GetKeyboardVersion()
		])
			.then((responses) => {
				try {
					this.logger.error('MenuMainComponent.initInputAccessories after API call'
						, { GetAllCapability: responses[0], GetKeyboardVersion: responses[1] });
					let inputAccessoriesCapability: InputAccessoriesCapability = this.commonService.getLocalStorageValue(LocalStorageKey.InputAccessoriesCapability, undefined);
					if (inputAccessoriesCapability === undefined) {
						inputAccessoriesCapability = new InputAccessoriesCapability();
					}
					inputAccessoriesCapability.isUdkAvailable = (responses[0] != null && Object.keys(responses[0]).indexOf('uDKCapability') !== -1) ? responses[0].uDKCapability : false;
					inputAccessoriesCapability.isKeyboardMapAvailable = (responses[0] != null && Object.keys(responses[0]).indexOf('keyboardMapCapability') !== -1) ? responses[0].keyboardMapCapability : false;
					inputAccessoriesCapability.keyboardVersion = (responses[1] != null) ? responses[1] : '-1';
					this.commonService.setLocalStorageValue(LocalStorageKey.InputAccessoriesCapability,
						inputAccessoriesCapability
					);
				} catch (error) {
					this.logger.exception('initInputAccessories', error);
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

	openFeedbackModal() {
		this.showMenu = false;
		this.feedbackService.openFeedbackModal();
	}
}
