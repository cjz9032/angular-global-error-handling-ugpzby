import { Component, OnInit, OnDestroy, HostListener, ViewChild, AfterViewInit, Input, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

import { ConfigService } from '../../services/config/config.service';
import { DeviceService } from '../../services/device/device.service';
import { UserService } from '../../services/user/user.service';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import Translation from 'src/app/data-models/translation/translation';
import { VantageShellService } from '../../services/vantage-shell/vantage-shell.service';
import { WindowsHello, EventTypes, SecurityAdvisor } from '@lenovo/tan-client-bridge';
import { LenovoIdKey } from 'src/app/enums/lenovo-id-key.enum';
import { TranslateService } from '@ngx-translate/core';
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

@Component({
	selector: 'vtr-menu-main',
	templateUrl: './menu-main.component.html',
	styleUrls: ['./menu-main.component.scss']
})
export class MenuMainComponent implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild('menuTarget', { static: false }) menuTarget: ElementRef;
	@Input() loadMenuItem: any = {};
	public machineFamilyName: string;
	public country: string;
	public firstName: 'User';
	commonMenuSubscription: Subscription;
	constantDevice = 'device';
	constantDeviceSettings = 'device-settings';
	region: string;
	public isDashboard = false;
	public countryCode: string;
	public locale: string;
	public items: any = [];
	showMenu = false;
	preloadImages: string[];
	securityAdvisor: SecurityAdvisor;
	isRS5OrLater: boolean;
	isGamingHome: boolean;
	currentUrl: string;


	constructor(
		private router: Router,
		public configService: ConfigService,
		public commonService: CommonService,
		public userService: UserService,
		public languageService: LanguageService,
		public deviceService: DeviceService,
		private vantageShellService: VantageShellService,
		private translate: TranslateService,
		private localInfoService: LocalInfoService,
		private smartAssist: SmartAssistService,
		private logger: LoggerService,
		private securityAdvisorMockService: SecurityAdvisorMockService,
		private dialogService: LenovoIdDialogService,
		private keyboardService: InputAccessoriesService,
		private windowsHelloService: WindowsHelloService
	) {
		localInfoService.getLocalInfo().then(result => {
			this.region = result.GEO;
			this.showVpn();
		}).catch(e => {
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
			this.commonMenuSubscription = this.languageService.subscription.subscribe((translation: Translation) => {
				this.onLanguageChange(translation);
			});
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
	}

	@HostListener('window: focus')
	onFocus(): void {
		this.showVpn();
	}
	@HostListener('document:click', ['$event.target'])
	onClick(targetElement) {
		if (this.menuTarget) {
			const clickedInside = this.menuTarget.nativeElement.contains(targetElement);
			const toggleMenuButton =
				targetElement.classList.contains('navbar-toggler-icon ') || targetElement.classList.contains('fa-bars') || targetElement.parentElement.classList.contains('fa-bars') || targetElement.localName === 'path';
			if (!clickedInside && !toggleMenuButton) {
				this.showMenu = false;
			}
		}
	}

	ngOnInit() {
		const self = this;
		this.translate.stream('lenovoId.user').subscribe((value) => {
			if (!self.userService.auth) {
				self.firstName = value;
			}
		});
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
				.catch((error) => {
					console.error('checkIsDesktopMachine', error);
				});
		}

		const cacheMachineFamilyName = this.commonService.getLocalStorageValue(
			LocalStorageKey.MachineFamilyName,
			undefined
		);
		if (cacheMachineFamilyName) {
			this.machineFamilyName = cacheMachineFamilyName;
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

	ngAfterViewInit(): void {
		this.getMenuItems().then((items) => {
			const chsItem = items.find(item => item.id === 'home-security');
			if (!chsItem) { return; }
			this.preloadImages = [].concat(chsItem.pre);
		});
	}

	ngOnDestroy() {
		if (this.commonMenuSubscription) {
			this.commonMenuSubscription.unsubscribe();
		}
	}

	toggleMenu(event) {
		this.showMenu = !this.showMenu;
		console.log('TOGGLE MENU', this.showMenu);
	}

	isParentActive(item) {
		// console.log('IS PARENT ACTIVE', item.id, item.path);
	}

	showItem(item) {
		let showItem = true;
		if (this.deviceService.isArm) {
			if (!item.forArm) {
				showItem = false;
			}
		}
		if (!this.deviceService.showPrivacy) {
			if (item.onlyPrivacy) {
				showItem = false;
			}
		}

		if (item.hasOwnProperty('hide') && item.hide) {
			showItem = false;
		}

		return showItem;
	}

	menuItemClick(event, path) {
		// console.log (path);
		this.router.navigateByUrl(path);
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
				case LenovoIdKey.FirstName:
					this.firstName = notification.payload;
					break;
				case 'MachineInfo':
					this.machineFamilyName = notification.payload.family;
					this.commonService.setLocalStorageValue(LocalStorageKey.MachineFamilyName, notification.payload.family);
					this.country = notification.payload.country;
					break;
				case LocalStorageKey.MachineFamilyName:
					this.machineFamilyName = notification.payload;
					break;
				default:
					break;
			}
		}
	}

	onLanguageChange(translation: Translation) {
		// this.getMenuItems().then((items)=>{
		// 	if (translation && translation.type === TranslationSection.CommonMenu && !this.deviceService.isGaming) {
		// 		items[0].label = translation.payload.dashboard;
		// 	}
		// })
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
	showPrivacy() { }
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
		console.log('Getting menu items for the Gaming device?', this.deviceService.isGaming);
		return this.configService.getMenuItemsAsync(this.deviceService.isGaming).then((items) => {
			this.items = items;
			return this.items;
		});
	}

	private showSmartAssist() {
		this.logger.error('inside showSmartAssist');
		this.getMenuItems().then((items) => {
			const myDeviceItem = items.find((item) => item.id === this.constantDevice);
			if (myDeviceItem !== undefined) {
				const smartAssistItem = myDeviceItem.subitems.find((item) => item.id === 'smart-assist');
				if (!smartAssistItem) {
					this.logger.error('get IsSmartAssistSupported');

					// if cache has value true for IsSmartAssistSupported, add menu item
					const isSmartAssistSupported = this.commonService.getLocalStorageValue(LocalStorageKey.IsSmartAssistSupported, false);

					if (isSmartAssistSupported) {
						this.addSmartAssistMenu(myDeviceItem);
					}
					this.logger.error('before Promise.all JS Bridge call');

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
					]).then((responses: any[]) => {
						this.logger.error('inside Promise.all THEN JS Bridge call', responses);

						console.log('showSmartAssist.Promise.all()', responses);
						console.log('Smart Assist Expressions', responses[0] || responses[1] || responses[2] || responses[3].available || responses[4] || (responses[5] && responses[6] && (responses[7] > 0)));
						// cache smart assist capability
						const smartAssistCapability: SmartAssistCapability = new SmartAssistCapability();
						smartAssistCapability.isIntelligentSecuritySupported = responses[0] || responses[1];
						smartAssistCapability.isLenovoVoiceSupported = responses[2];
						smartAssistCapability.isIntelligentMediaSupported = responses[3];
						smartAssistCapability.isIntelligentScreenSupported = responses[4];
						smartAssistCapability.isAPSSupported = (responses[5] && responses[6] && (responses[7] > 0));
						this.commonService.setLocalStorageValue(LocalStorageKey.SmartAssistCapability, smartAssistCapability);
						this.logger.error('inside Promise.all THEN JS Bridge call', smartAssistCapability);

						const isAvailable =
							(responses[0] || responses[1] || responses[2] || responses[3].available || responses[4]) || (responses[5] && responses[6] && (responses[7] > 0));
						// const isAvailable = true;
						this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartAssistSupported, isAvailable);

						// avoid duplicate entry. if not added earlier then add menu
						if (isAvailable && !isSmartAssistSupported) {
							this.addSmartAssistMenu(myDeviceItem);
						}
					}).catch((error) => {
						this.logger.error('error in initSmartAssist.Promise.all()', error);
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
			this.keyboardService.GetKeyboardMapCapability()
		]).then((responses: any[]) => {
			const inputAccessoriesCapability: InputAccessoriesCapability = new InputAccessoriesCapability();
			inputAccessoriesCapability.isUdkAvailable = responses[0];
			inputAccessoriesCapability.isKeyboardMapAvailable = responses[1];
			this.commonService.setLocalStorageValue(LocalStorageKey.InputAccessoriesCapability, inputAccessoriesCapability);
		}).catch((error) => {
			console.error('error in initSmartAssist.Promise.all()', error);
		});
	}
}
