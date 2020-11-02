import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, ViewChildren, QueryList, ViewContainerRef, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { throttle } from 'lodash';

import { MatMenuTrigger } from '@lenovo/material/menu';

import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { AppsForYouService } from 'src/app/services/apps-for-you/apps-for-you.service';
import { MenuItemEvent } from 'src/app/enums/menuItemEvent.enum';
import { DeviceService } from 'src/app/services/device/device.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { UserService } from 'src/app/services/user/user.service';
import { CardService } from 'src/app/services/card/card.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { ModernPreloadService } from 'src/app/services/modern-preload/modern-preload.service';
import { LenovoIdStatus } from 'src/app/enums/lenovo-id-key.enum';
import { AppsForYouEnum } from 'src/app/enums/apps-for-you.enum';
import { StringBooleanEnum } from 'src/app/data-models/common/common.interface';
import { NewFeatureTipService } from 'src/app/services/new-feature-tip/new-feature-tip.service';
import { AppSearchService } from 'src/app/beta/app-search/app-search.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { InputAccessoriesService } from 'src/app/services/input-accessories/input-accessories.service';
import { InputAccessoriesCapability } from 'src/app/data-models/input-accessories/input-accessories-capability.model';
import { BacklightService } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-input-accessory/backlight/backlight.service';
import { TopRowFunctionsIdeapadService } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-input-accessory/top-row-functions-ideapad/top-row-functions-ideapad.service';
import { BacklightLevelEnum } from 'src/app/components/pages/page-device-settings/children/subpage-device-settings-input-accessory/backlight/backlight.enum';

@Component({
  selector: 'vtr-material-menu',
  templateUrl: './material-menu.component.html',
  styleUrls: ['./material-menu.component.scss']
})
export class MaterialMenuComponent implements OnInit, OnDestroy {
	@ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
	@Input() loadMenuItem: any = {};
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
	machineFamilyName: string;
	items: Array<any> = [];
	preloadImages: string[];
	isLoggingOut = false;
	appsForYouEnum = AppsForYouEnum;
	showSearchMenu = false;
	translateSubscription: Subscription;
	unsupportedFeatureSubscription: Subscription;
	searchTips = '';
	showSearchBox = false;
	activeItemId: string;
	currentRoutePath: string;
	private subscription: Subscription;
	private backlightCapabilitySubscription: Subscription;
	private topRowFnSubscription: Subscription;
	private routerEventSubscription: Subscription;
	private unsupportFeatureEvt: Observable<string>;
	private searchTipsTimeout: any;
	constructor(
		public dashboardService: DashboardService,
		public configService: ConfigService,
		public appsForYouService: AppsForYouService,
		public deviceService: DeviceService,
		public languageService: LanguageService,
		public userService: UserService,
		public commonService: CommonService,
		public modernPreloadService: ModernPreloadService,
		private localCacheService: LocalCacheService,
		private cardService: CardService,
		private dialogService: DialogService,
		private feedbackService: FeedbackService,
		private backlightService: BacklightService,
		private topRowFunctionsIdeapadService: TopRowFunctionsIdeapadService,
		private router: Router,
		private newFeatureTipService: NewFeatureTipService,
		private viewContainerRef: ViewContainerRef,
		private translate: TranslateService,
		private searchService: AppSearchService,
		private logger: LoggerService,
		private keyboardService: InputAccessoriesService,
		) {
			newFeatureTipService.viewContainer = this.viewContainerRef;
		}

	ngOnInit(): void {
		const cacheMachineFamilyName = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.MachineFamilyName,
			undefined
		);
		if (cacheMachineFamilyName) {
			this.machineFamilyName = cacheMachineFamilyName;
		}
		this.subscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
		this.initComponent();
		window.addEventListener('resize', throttle(() => {
			this.closeAllMatMenu();
		}, 100, { leading: true }));
		this.routerEventSubscription = this.router.events.subscribe((ev) => {
			if (ev instanceof NavigationEnd) {
				this.currentRoutePath = ev.url;
			}
		});
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
		if (this.backlightCapabilitySubscription) {
			this.backlightCapabilitySubscription.unsubscribe();
		}
		if (this.topRowFnSubscription) {
			this.topRowFnSubscription.unsubscribe();
		}
		if (this.translateSubscription) {
			this.translateSubscription.unsubscribe();
		}
		if (this.unsupportedFeatureSubscription) {
			this.unsupportedFeatureSubscription.unsubscribe();
		}
		if (this.topRowFnSubscription) {
			this.topRowFnSubscription.unsubscribe();
		}
		if (this.routerEventSubscription) {
			this.routerEventSubscription.unsubscribe();
		}
	}

	public updateMenu(menu) {
		if (menu && menu.length > 0) {
			this.items = menu;
			this.preloadImages = this.collectPreloadAssets(menu);
		}
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case LocalStorageKey.MachineFamilyName:
					this.machineFamilyName = notification.payload;
					break;
				case MenuItemEvent.MenuItemChange:
					this.updateMenu(notification.payload);
					break;
				case 'MachineInfo':
					this.machineFamilyName = notification.payload.family;
					this.localCacheService.setLocalCacheValue(
						LocalStorageKey.MachineFamilyName,
						notification.payload.family
					);
					break;
				case NetworkStatus.Online:
					this.modernPreloadService.getIsEntitled();
					break;
				case LenovoIdStatus.LoggingOut:
					this.isLoggingOut = notification.payload;
					break;
				default:
					break;
			}
		}
	}

	private initComponent() {
		this.translateSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			if (this.translate.currentLang === 'en') {
				this.showSearchMenu = true;
			}
		});
		this.unsupportFeatureEvt = this.searchService.getUnsupportFeatureEvt();
		this.unsupportedFeatureSubscription = this.unsupportFeatureEvt.subscribe(featureDesc => {
			if (this.searchTipsTimeout) {
				clearTimeout(this.searchTipsTimeout);
			}
			this.searchTips = featureDesc;
			this.searchTipsTimeout = setTimeout(() => {
				this.searchTips = '';
				this.searchTipsTimeout = null;
			}, 3000);
		});
		const machineType = this.localCacheService.getLocalCacheValue(LocalStorageKey.MachineType, undefined);
		if (machineType !== undefined) {
			this.loadMenuOptions(machineType);
		} else if (this.deviceService.isShellAvailable) {
			this.deviceService.getMachineType()
			.then((value: number) => {
				this.loadMenuOptions(value);
			});
		}
	}

	@HostListener('document:click', ['$event'])
	onClick(event) {
		if (!event.fromSearchBox && !event.fromSearchMenu) {
			this.updateSearchBoxState(false);
		}
	}

	updateSearchBoxState(isActive) {
		this.searchTips = '';
		this.showSearchBox = isActive;
		if (isActive && this.searchTipsTimeout) {
			this.searchTipsTimeout = clearTimeout(this.searchTipsTimeout);
			this.searchTipsTimeout = null;
		}
	}

	private loadMenuOptions(machineType: number) {
		// if IdeaPad then call below function
		if (machineType === 0 || machineType === 1) {
			this.backlightCapabilitySubscription = this.backlightService.backlight.pipe(
				map(res => res.find(item => item.key === 'KeyboardBacklightLevel')),
				map(res => res.value !== BacklightLevelEnum.NO_CAPABILITY),
				tap(res => {
					this.localCacheService.setLocalCacheValue(LocalStorageKey.BacklightCapability, res);
				}),
				catchError(() => {
					window.localStorage.removeItem(LocalStorageKey.BacklightCapability);
					return undefined;
				})
			).subscribe();
		}
		const machineFamily = this.localCacheService.getLocalCacheValue(LocalStorageKey.MachineFamilyName, undefined);
		// Added special case for KEI machine
		if (machineFamily) {
			const familyName = machineFamily.replace(/\s+/g, '');
			if (machineType === 1 && familyName !== 'LenovoTablet10') {
				this.initInputAccessories();
			}
		}
		if (machineType === 0) {
			// todo: in case unexpected showing up in edge case when u remove drivers. should be a safety way to check capability.
			this.localCacheService.setLocalCacheValue(LocalStorageKey.TopRowFunctionsCapability, false);
			this.topRowFnSubscription = this.topRowFunctionsIdeapadService.capability.pipe(
					catchError(() => {
						window.localStorage.removeItem(LocalStorageKey.TopRowFunctionsCapability);
						return undefined;
					})
				).subscribe((capabilities: Array<any>) => {
					if (Array.isArray(capabilities)) {
						if (capabilities.length === 0) {
							this.localCacheService.setLocalCacheValue(LocalStorageKey.TopRowFunctionsCapability, false);
						}
						capabilities.forEach(capability => {
							if (capability.key === 'FnLock') {
								this.localCacheService.setLocalCacheValue(LocalStorageKey.TopRowFunctionsCapability, capability.value === StringBooleanEnum.TRUTHY);
							}
						});
					}
				});
		}
	}

	async initInputAccessories() {
		this.logger.error('MenuMainComponent.initInputAccessories before API call');
		const responses = await Promise.all([
			this.keyboardService.GetAllCapability(),
			this.keyboardService.GetKeyboardVersion()
		]);
		try {
			if (responses) {
				this.logger.error('MenuMainComponent.initInputAccessories after API call'
					, { GetAllCapability: responses[0], GetKeyboardVersion: responses[1] });
				let inputAccessoriesCapability: InputAccessoriesCapability = this.localCacheService.getLocalCacheValue(LocalStorageKey.InputAccessoriesCapability, undefined);
				if (inputAccessoriesCapability === undefined) {
					inputAccessoriesCapability = new InputAccessoriesCapability();
				}
				inputAccessoriesCapability.isUdkAvailable = (responses[0] != null && Object.keys(responses[0]).indexOf('uDKCapability') !== -1) ? responses[0].uDKCapability : false;
				inputAccessoriesCapability.isKeyboardMapAvailable = (responses[0] != null && Object.keys(responses[0]).indexOf('keyboardMapCapability') !== -1) ? responses[0].keyboardMapCapability : false;
				inputAccessoriesCapability.keyboardVersion = (responses[1] != null) ? responses[1] : '-1';
				this.localCacheService.setLocalCacheValue(LocalStorageKey.InputAccessoriesCapability,
					inputAccessoriesCapability
				);
			}
		} catch (error) {
			this.logger.exception('initInputAccessories', error);
		}
		this.keyboardService.getVoipHotkeysSettings()
			.then(response => {
				if (response.capability) {
					this.localCacheService.setLocalCacheValue(LocalStorageKey.VOIPCapability, response.capability);
				}
				return response;
			});
	}

	toggleMenu(event) {
		this.updateSearchBoxState(false);
		event.stopPropagation();
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

	onMenuItemClick(item, event?) {
		if (item.id === 'app-search') {
			this.updateSearchBoxState(!this.showSearchBox);
			if (event) {
				event.fromSearchMenu = true;
			}
		} else if (item && item.id === 'user' && event) {
			const target = event.currentTarget || event.srcElement;
			const id = target?.attributes?.id?.nodeValue;
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
		this.updateSearchBoxState(false);
	}

	menuItemKeyDown(path, subpath?) {
		subpath ? this.router.navigateByUrl(`/${path}/${subpath}`)
			: path ? this.router.navigateByUrl(`/${path}`) : this.router.navigateByUrl(`/`);
	}

	openMatMenu(menuTrigger: MatMenuTrigger) {
		menuTrigger.openMenu();
	}

	closeMatMenu(menuTrigger: MatMenuTrigger) {
		menuTrigger.closeMenu();
	}

	closeAllMatMenu() {
		this.triggers.toArray().forEach(elem => {
			elem.closeMenu();
		});
	}

	closeAllOtherMatMenu(activeDropdown: MatMenuTrigger) {
		this.triggers.toArray().forEach(elem => {
			if (activeDropdown !== elem) {
				elem.closeMenu();
			}
		});
	}

	openExternalLink(link) {
		if (link) {
			window.open(link);
		}
	}

	onLogout() {
		this.userService.removeAuth();
	}

	openModernPreloadModal() {
		this.dialogService.openModernPreloadModal();
	}

	openFeedbackModal() {
		this.feedbackService.openFeedbackModal();
	}

	openSurveyModal(surveyId: string) {
		this.appsForYouService.lenovoSurvey.unread = false;
		this.appsForYouService.decreaseUnreadMessage(surveyId);
		this.feedbackService.openSurveyModal(surveyId);
	}

	OpenLenovoId(appFeature = null) {
		this.dialogService.openLenovoIdDialog(appFeature);
	}

	updateActiveItem(id: string): boolean {
		if (id === 'security') {
			return this.currentRoutePath === '/home-security' || this.currentRoutePath?.startsWith('/security');
		}
		if (id === 'support') {
			return this.currentRoutePath === '/hardware-scan' || this.currentRoutePath?.startsWith('/support');
		}
		return false;
	}
}
