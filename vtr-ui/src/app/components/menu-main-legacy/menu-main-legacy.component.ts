import {
	Component,
	ElementRef,
	HostListener,
	Input,
	OnDestroy,
	OnInit,
	QueryList,
	ViewChild,
	ViewChildren,
	ViewContainerRef,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { AppsForYouEnum } from 'src/app/enums/apps-for-you.enum';
import { LenovoIdStatus } from 'src/app/enums/lenovo-id-key.enum';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { MenuItemEvent } from 'src/app/enums/menuItemEvent.enum';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { AdPolicyService } from 'src/app/services/ad-policy/ad-policy.service';
import { AppsForYouService } from 'src/app/services/apps-for-you/apps-for-you.service';
import { CardService } from 'src/app/services/card/card.service';
import { CommonService } from 'src/app/services/common/common.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';
import { HardwareScanService } from 'src/app/modules/hardware-scan/services/hardware-scan.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { ModernPreloadService } from 'src/app/services/modern-preload/modern-preload.service';
import { NewFeatureTipService } from 'src/app/services/new-feature-tip/new-feature-tip.service';
import { StringBooleanEnum } from '../../data-models/common/common.interface';
import { ConfigService } from '../../services/config/config.service';
import { DeviceService } from '../../services/device/device.service';
import { UserService } from '../../services/user/user.service';
import { VantageShellService } from '../../services/vantage-shell/vantage-shell.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { MatDialog } from '@lenovo/material/dialog';
import { AppSearchService } from 'src/app/services/app-search/app-search.service';
import { RoutePath } from 'src/assets/menu/menu';

@Component({
	selector: 'vtr-menu-main-legacy',
	templateUrl: './menu-main-legacy.component.html',
	styleUrls: ['./menu-main-legacy.component.scss'],
})
export class MenuMainLegacyComponent implements OnInit, OnDestroy {
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
	public showSearchMenu = false;
	private subscription: Subscription;
	private relaySubscription: Subscription;
	public isLoggingOut = false;
	public selfSelectStatusVal: boolean;

	showMenu = false;
	showHWScanMenu = false;
	preloadImages: string[];
	isRS5OrLater: boolean;
	isGamingHome: boolean;
	currentUrl: string;
	isSMode: boolean;
	currentIsSearchPage: boolean;
	hideDropDown = false;
	segment: string;
	headerLogo: string;
	routerEventSubscription: Subscription;
	translateSubscription: Subscription;
	topRowFnSubscription: Subscription;
	private focusMenuDropDownTimer: any;

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
	upMenuLevel: boolean;
	private backlightCapabilitySubscription: Subscription;
	@ViewChildren(NgbDropdown) dropDowns: QueryList<NgbDropdown>;
	@ViewChild('menuMainNavbarToggler') navbarToggler: ElementRef;

	get appsForYouEnum() {
		return AppsForYouEnum;
	}

	constructor(
		private router: Router,
		public configService: ConfigService,
		public commonService: CommonService,
		public userService: UserService,
		public deviceService: DeviceService,
		private vantageShellService: VantageShellService,
		private logger: LoggerService,
		private dialogService: DialogService,
		private dialog: MatDialog,
		public modernPreloadService: ModernPreloadService,
		private adPolicyService: AdPolicyService,
		private hardwareScanService: HardwareScanService,
		private translate: TranslateService,
		public appsForYouService: AppsForYouService,
		public dashboardService: DashboardService,
		private newFeatureTipService: NewFeatureTipService,
		private viewContainerRef: ViewContainerRef,
		public cardService: CardService,
		private feedbackService: FeedbackService,
		private localCacheService: LocalCacheService,
		private hypService: HypothesisService,
		private appSearchService: AppSearchService
	) {
		newFeatureTipService.viewContainer = this.viewContainerRef;
	}

	ngOnInit() {
		this.headerLogo = '';
		this.checkLiteGaming();

		this.subscription = this.commonService.notification.subscribe(
			(notification: AppNotification) => {
				this.onNotification(notification);
			}
		);

		this.isDashboard = true;

		const cacheMachineFamilyName = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.MachineFamilyName,
			undefined
		);
		if (cacheMachineFamilyName) {
			this.machineFamilyName = cacheMachineFamilyName;
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
		menu.forEach((item) => {
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
		this.routerEventSubscription = this.router.events.subscribe((ev) => {
			if (ev instanceof NavigationEnd) {
				this.currentUrl = ev.url;
				if (this.currentUrl === '/device-gaming' || this.currentUrl === '/gaming') {
					this.isGamingHome = true;
				} else {
					this.isGamingHome = false;
				}

				this.currentIsSearchPage = ev.url.indexOf(`/${RoutePath.search}`) > -1;
			}
		});

		this.appSearchService.isAvailable().then(available => {
			this.showSearchMenu = available;
		});

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
	}

	@HostListener('window:focus')
	onFocus(): void {
		setTimeout(() => {
			if (this.focusMenuDropDownTimer) {
				clearTimeout(this.focusMenuDropDownTimer);
			}
		}, 0);
	}

	closeAllDD() {
		// Close all dropdowns
		this.dropDowns.toArray().forEach((elem) => {
			elem.close();
		});
	}

	closeAllOtherDD(activeDropdown: NgbDropdown) {
		// Close all dropdowns
		this.dropDowns.toArray().forEach((elem) => {
			if (activeDropdown !== elem) {
				elem.close();
			}
		});
	}

	showHideMenuOfItem($event, activeDropdown: NgbDropdown) {
		if (($event.shiftKey && $event.keyCode === 9) || $event.keyCode === 9) {
			const sourceElement = $event.srcElement as HTMLAnchorElement;
			const menuElement = sourceElement.parentElement.parentElement;
			const anchors = Array.from(menuElement.querySelectorAll('[class*=dropdown-item]'));
			const currentIndex = anchors.indexOf(sourceElement);
			const tabElements = Array.from(
				document.querySelectorAll('[tabindex]:not([tabindex=\'-1\']')
			);
			const curElementTabIndex = tabElements.indexOf(sourceElement);
			// SHIFT+TAB
			if ($event.shiftKey && $event.keyCode === 9) {
				// if previous tabbable element not in the current active dropdown menu then close menu
				const element = tabElements[curElementTabIndex - 1] as HTMLElement;
				if (element.getAttribute('class').includes('dropdown-item')) {
					$event.stopPropagation();
					$event.preventDefault();
					element.focus();
				}
				if (element.id === 'navbarDropdown' && anchors.indexOf(sourceElement)) {
					(tabElements[curElementTabIndex - 1] as HTMLElement).focus();
				} else {
					if (anchors.indexOf(element) === -1) {
						$event.stopPropagation();
						$event.preventDefault();
						element.focus();
						activeDropdown.close();
					}
				}
			}
			// TAB
			if (!$event.shiftKey && $event.keyCode === 9) {
				// if next tabbable element not in the current active dropdown menu then close menu
				const element = tabElements[curElementTabIndex + 1] as HTMLElement;
				if (anchors.indexOf(element) === -1) {
					if (element) {
						$event.stopPropagation();
						$event.preventDefault();
						element.focus();
						if (element.id && element.id === 'navbarDropdown') {
							const next = tabElements[curElementTabIndex + 2] as HTMLElement;
							if (next) {
								next.focus();
							}
						}
					}

					activeDropdown.close();
				}
			}
		}
	}

	@HostListener('window:keydown', ['$event'])
	scrollUpDown($event: KeyboardEvent) {
		if ($event.keyCode === 38 || $event.keyCode === 40) {
			const activeDom: any = document.activeElement;
			if (activeDom && activeDom.id.includes('menu-main')) {
				const contentArea = document.querySelector(
					'.vtr-app.container-fluid'
				) as HTMLElement;
				contentArea.focus();
				$event.stopPropagation();
				$event.preventDefault();
			}
		}
	}


	private checkLiteGaming() {
		const filter: Promise<any> = this.vantageShellService.calcDeviceFilter({
			var: 'DeviceTags.System.Profile.LiteGaming',
		});
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
		if (this.routerEventSubscription) {
			this.routerEventSubscription.unsubscribe();
		}
		if (this.translateSubscription) {
			this.translateSubscription.unsubscribe();
		}
		if (this.topRowFnSubscription) {
			this.topRowFnSubscription.unsubscribe();
		}
	}

	toggleMenu(event) {
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
					document
						.getElementById('keyboard-area' + i)
						.addEventListener('click', (event) => {
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

	isParentActive(item) { }

	showItem(item) {
		let showItem = true;

		if (item.id === 'app-search') {
			showItem = this.showSearchMenu;
		}

		if (item.hasOwnProperty('hide') && item.hide) {
			showItem = false;
		}
		return showItem;
	}

	isCommomItem(item) {
		return item.id !== 'user' && item.id !== 'app-search';
	}

	onFocusMenuDropDown(menuDropDown) {
		if (this.focusMenuDropDownTimer) {
			clearTimeout(this.focusMenuDropDownTimer);
		}
		this.focusMenuDropDownTimer = setTimeout(() => {
			this.closeAllOtherDD(menuDropDown);
			if (!this.dialog.openDialogs.length) {
				menuDropDown.open();
			}
		}, 30);
	}

	onMenuItemClick(item, event?) {
		window.getSelection().empty();
		this.showMenu = false;
		if (item.id === 'user' && event) {
			const target = event.target || event.srcElement || event.currentTarget;
			const idAttr = target.attributes.id;
			const id = idAttr.nodeValue;
			if (
				id === 'menu-main-lnk-open-lma' ||
				id === 'menu-main-lnk-open-adobe' ||
				id === 'menu-main-lnk-open-dcc'
			) {
				this.appsForYouService.updateUnreadMessageCount(id);
				if (id === 'menu-main-lnk-open-dcc') {
					this.cardService.openDccDetailModal();
				}
			}
		}
		this.navbarToggler.nativeElement.focus();
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
					this.localCacheService.setLocalCacheValue(
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
				case MenuItemEvent.MenuItemChange:
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


	openModernPreloadModal() {
		this.showMenu = false;
		this.dialogService.openModernPreloadModal();
	}

	openSurveyModal(surveyId) {
		this.showMenu = false;
		this.appsForYouService.lenovoSurvey.unread = false;
		this.appsForYouService.decreaseUnreadMessage(surveyId);
		this.feedbackService.openSurveyModal(surveyId);
	}
}
