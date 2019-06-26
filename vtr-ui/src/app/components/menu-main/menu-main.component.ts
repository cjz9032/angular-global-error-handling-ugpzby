import { Component, OnInit, OnDestroy, DoCheck, HostListener, SimpleChanges, SimpleChange, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ConfigService } from '../../services/config/config.service';
import { DeviceService } from '../../services/device/device.service';
import { UserService } from '../../services/user/user.service';
import { ModalLenovoIdComponent } from '../modal/modal-lenovo-id/modal-lenovo-id.component';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslationService } from 'src/app/services/translation/translation.service';
import Translation from 'src/app/data-models/translation/translation';
import { environment } from '../../../environments/environment';
import { VantageShellService } from '../../services/vantage-shell/vantage-shell.service';
import { WindowsHello, EventTypes } from '@lenovo/tan-client-bridge';
import { LenovoIdKey } from 'src/app/enums/lenovo-id-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { RegionService } from 'src/app/services/region/region.service';
import { SmartAssistService } from 'src/app/services/smart-assist/smart-assist.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { ModalCommonConfirmationComponent } from '../modal/modal-common-confirmation/modal-common-confirmation.component';

@Component({
	selector: 'vtr-menu-main',
	templateUrl: './menu-main.component.html',
	styleUrls: ['./menu-main.component.scss']
})
export class MenuMainComponent implements OnInit, DoCheck, OnDestroy {
	@ViewChild('menuTarget') menuTarget;
	public deviceModel: string;
	public country: string;
	public firstName: 'User';
	commonMenuSubscription: Subscription;
	public appVersion: string = environment.appVersion;
	constantDevice = 'device';
	constantDeviceSettings = 'device-settings';
	region: string;
	public isDashboard = false;
	public countryCode: string;
	public locale: string;
	public items: any;
	showMenu = false;

	constructor(
		private router: Router,
		public route: ActivatedRoute,
		public configService: ConfigService,
		private commonService: CommonService,
		public userService: UserService,
		public translationService: TranslationService,
		private modalService: NgbModal,
		public deviceService: DeviceService,
		vantageShellService: VantageShellService,
		private translate: TranslateService,
		private regionService: RegionService,
		private smartAssist: SmartAssistService,
		private logger: LoggerService
	) {
		this.showVpn();
		this.getMenuItems().then((items) => {
			const cacheShowWindowsHello = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowWindowsHello);
			if (cacheShowWindowsHello) {

				const securityItem = items.find(item => item.id === 'security');
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
			const securityAdvisor = vantageShellService.getSecurityAdvisor();
			if (securityAdvisor) {
				const windowsHello: WindowsHello = securityAdvisor.windowsHello;
				if (windowsHello.fingerPrintStatus) {
					this.showWindowsHello(windowsHello);
				}
				windowsHello.on(EventTypes.helloFingerPrintStatusEvent, () => {
					this.showWindowsHello(windowsHello);
				});
			}
			this.commonMenuSubscription = this.translationService.subscription
				.subscribe((translation: Translation) => {
					this.onLanguageChange(translation);
				});
		});

		const machineType = this.commonService.getLocalStorageValue(LocalStorageKey.MachineType);
		// if IdeaPad or ThinkPad then call below function
		if (machineType === 0 || machineType === 1) {
			this.showSmartAssist();
		}
	}

	@HostListener('window: focus')
	onFocus(): void {
		this.showVpn();
	}
	@HostListener('document:click', ['$event.target'])
	onClick(targetElement) {

		const clickedInside = this.menuTarget.nativeElement.contains(targetElement);
		const toggleMenuButton = targetElement.classList.contains('navbar-toggler-icon ') || targetElement.classList.contains('fa-bars');
		if (!clickedInside && !toggleMenuButton) {
			this.showMenu = false;
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
	}
	ngDoCheck() {
		if (this.router.url !== null) {
			if (this.router.url.indexOf('dashboard', 0) > 0) {
				this.isDashboard = true;
			} else {
				this.isDashboard = false;
			}
		}
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
		if (!navigator.onLine) {
			const modalRef = this.modalService.open(ModalCommonConfirmationComponent, {
				backdrop: 'static',
				size: 'lg',
				centered: true,
				windowClass: 'common-confirmation-modal'
			});

			const header = 'lenovoId.ssoErrorTitle';
			modalRef.componentInstance.CancelText = '';
			modalRef.componentInstance.header = header;
			modalRef.componentInstance.description = 'lenovoId.ssoErrorNetworkDisconnected';
			return;
		}
		const modal: NgbModalRef = this.modalService.open(ModalLenovoIdComponent, {
			backdrop: 'static',
			centered: true,
			windowClass: 'lenovo-id-modal-size'
		});
		(<ModalLenovoIdComponent>modal.componentInstance).appFeature = appFeature;
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
					this.deviceModel = notification.payload.family;
					this.country = notification.payload.country;
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

	showWindowsHello(windowsHello: WindowsHello) {
		this.getMenuItems().then((items) => {
			const securityItem = items.find(item => item.id === 'security');
			if (!this.commonService.isRS5OrLater()
				|| (typeof windowsHello.fingerPrintStatus !== 'string')) {
				securityItem.subitems = securityItem.subitems.filter(subitem => subitem.id !== 'windows-hello');
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWindowsHello, false);
			} else {
				const windowsHelloItem = securityItem.subitems.find(item => item.id === 'windows-hello');
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
	showPrivacy() {


	}
	showVpn() {
		this.regionService.getRegion().subscribe({
			next: x => { this.region = x; },
			error: err => { this.region = 'US'; }
		});
		this.getMenuItems().then((items) => {
			const securityItemForVpn = items.find(item => item.id === 'security');
			if (securityItemForVpn !== undefined) {
				const vpnItem = securityItemForVpn.subitems.find(item => item.id === 'internet-protection');
				if (this.region !== 'CN') {
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
						securityItemForVpn.subitems = securityItemForVpn.subitems.filter(item => item.id !== 'internet-protection');
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

		this.getMenuItems().then((items) => {
			const myDeviceItem = items.find(item => item.id === this.constantDevice);
			if (myDeviceItem !== undefined) {
				const smartAssistItem = myDeviceItem.subitems.find(item => item.id === 'smart-assist');
				if (!smartAssistItem) {
					// if cache has value true for IsSmartAssistSupported, add menu item
					const isSmartAssistSupported = this.commonService.getLocalStorageValue(LocalStorageKey.IsSmartAssistSupported, false);
					if (isSmartAssistSupported) {
						this.addSmartAssistMenu(myDeviceItem);
					}

					// still check if any of the feature supported. if yes then add menu
					Promise.all([
						this.smartAssist.getHPDVisibilityInIdeaPad(),
						this.smartAssist.getHPDVisibilityInThinkPad(),
						this.smartAssist.isLenovoVoiceAvailable(),
						this.smartAssist.getVideoPauseResumeStatus(), // returns object
						this.smartAssist.getIntelligentScreenVisibility()
					]).then((responses: any[]) => {
						console.log('showSmartAssist.Promise.all()', responses);
						// const isAvailable = (responses[0] || responses[1] || responses[2].available || responses[3] || responses[4]);
						const isAvailable = (responses[0] || responses[1] || responses[2] || responses[3].available || responses[4]);
						// const isAvailable = true;
						this.commonService.setLocalStorageValue(LocalStorageKey.IsLenovoVoiceSupported, responses[2]);
						this.commonService.setLocalStorageValue(LocalStorageKey.IsSmartAssistSupported, isAvailable);
						// avoid duplicate entry. if not added earlier then add menu
						if (isAvailable && !isSmartAssistSupported) {
							this.addSmartAssistMenu(myDeviceItem);
						}
					}).catch(error => {
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
}
