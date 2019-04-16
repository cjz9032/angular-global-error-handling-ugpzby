import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfigService } from '../../services/config/config.service';
import { DeviceService } from '../../services/device/device.service';
import { UserService } from '../../services/user/user.service';
import { ModalLenovoIdComponent } from '../modal/modal-lenovo-id/modal-lenovo-id.component';
import { CommonService } from 'src/app/services/common/common.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslationService } from 'src/app/services/translation/translation.service';
import Translation from 'src/app/data-models/translation/translation';
import { TranslationSection } from 'src/app/enums/translation-section.enum';
import { environment } from '../../../environments/environment';
import { VantageShellService } from '../../services/vantage-shell/vantage-shell.service';
import { WindowsHello, EventTypes } from '@lenovo/tan-client-bridge';
import { RegionService } from 'src/app/services/region/region.service';

@Component({
	selector: 'vtr-menu-main',
	templateUrl: './menu-main.component.html',
	styleUrls: ['./menu-main.component.scss']
})
export class MenuMainComponent implements OnInit, OnDestroy {

	public deviceModel: string;
	public country: string;
	commonMenuSubscription: Subscription;
	public appVersion: string = environment.appVersion;
	constantDevice = 'device';
	constantDeviceSettings = 'device-settings';
	region: string;
	items: Array<any> = [
		{
			id: 'dashboard',
			label: 'common.menu.dashboard',
			path: 'dashboard',
			icon: ['fal', 'columns'],
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.dashboard',
			routerLinkActiveOptions: { exact: true },
			forArm: true,
			subitems: []
		}, {
			id: 'device',
			label: 'common.menu.device.title',
			path: 'device',
			icon: ['fal', 'laptop'],
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.device',
			forArm: false,
			subitems: [{
				id: 'device',
				label: 'common.menu.device.sub1',
				path: '',
				icon: '',
				metricsEvent: 'itemClick',
				metricsParent: 'navbar',
				metricsItem: 'link.mydevice',
				routerLinkActiveOptions: { exact: true },
				subitems: []
			}, {
				id: 'device-settings',
				label: 'common.menu.device.sub2',
				path: 'device-settings',
				icon: '',
				metricsEvent: 'itemClick',
				metricsParent: 'navbar',
				metricsItem: 'link.mydevicesettings',
				routerLinkActiveOptions: { exact: false },
				subitems: []
			}, {
				id: 'system-updates',
				label: 'common.menu.device.sub3',
				path: 'system-updates',
				icon: '',
				metricsEvent: 'itemClick',
				metricsParent: 'navbar',
				metricsItem: 'link.systemupdates',
				routerLinkActiveOptions: { exact: true },
				subitems: []
			}]
		}, {
			id: 'security',
			label: 'common.menu.security.title',
			path: 'security',
			icon: ['fal', 'lock'],
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.security',
			forArm: false,
			subitems: [{
				id: 'security',
				label: 'common.menu.security.sub1',
				path: '',
				icon: '',
				metricsEvent: 'itemClick',
				metricsParent: 'navbar',
				metricsItem: 'link.mysecurity',
				routerLinkActiveOptions: { exact: true },
				subitems: []
			}, {
				id: 'anti-virus',
				label: 'common.menu.security.sub2',
				path: 'anti-virus',
				icon: '',
				metricsEvent: 'itemClick',
				metricsParent: 'navbar',
				metricsItem: 'link.antivirus',
				routerLinkActiveOptions: { exact: true },
				subitems: []
			}, {
				id: 'wifi-security',
				label: 'common.menu.security.sub3',
				path: 'wifi-security',
				icon: '',
				metricsEvent: 'itemClick',
				metricsParent: 'navbar',
				metricsItem: 'link.wifisecurity',
				routerLinkActiveOptions: { exact: true },
				subitems: []
			}, {
				id: 'password-protection',
				label: 'common.menu.security.sub4',
				path: 'password-protection',
				metricsEvent: 'itemClick',
				metricsParent: 'navbar',
				metricsItem: 'link.passwordprotection',
				routerLinkActiveOptions: { exact: true },
				icon: '',
				subitems: []
			}]
		}, {
			id: 'support',
			label: 'common.menu.support',
			path: 'support',
			icon: ['fal', 'wrench'],
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.support',
			routerLinkActiveOptions: { exact: true },
			forArm: false,
			subitems: []
		}, {
            id: 'privacy',
            label: 'Privacy',
            path: 'privacy',
            icon: 'privacy',
            subitems: []
        }, {
			id: 'user',
			label: 'User',
			path: 'user',
			icon: 'user',
			metricsEvent: 'ItemClick',
			metricsParent: 'NavigationLenovoAccount.Submenu',
			metricsItem: 'link.user',
			routerLinkActiveOptions: { exact: true },
			forArm: true,
			subitems: []
		}
	];

	constructor(
		private router: Router,
		public route: ActivatedRoute,
		public configService: ConfigService,
		private commonService: CommonService,
		public userService: UserService,
		public translationService: TranslationService,
		private modalService: NgbModal,
		private deviceService: DeviceService,
		vantageShellService: VantageShellService,
		private regionService: RegionService
	) {
		this.showVpn();
		const cacheShowWindowsHello = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowWindowsHello);
		if (cacheShowWindowsHello) {
			const securityItem = this.items.find(item => item.id === 'security');
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
			if (windowsHello.facialIdStatus || windowsHello.fingerPrintStatus) {
				this.showWindowsHello(windowsHello);
			}
			windowsHello.on(EventTypes.helloFacialIdStatusEvent, () => {
				this.showWindowsHello(windowsHello);
			}).on(EventTypes.helloFingerPrintStatusEvent, () => {
				this.showWindowsHello(windowsHello);
			});
		}
		this.commonMenuSubscription = this.translationService.subscription
			.subscribe((translation: Translation) => {
				this.onLanguageChange(translation);
			});
	}

	@HostListener('window: focus')
	onFocus(): void {
		this.showVpn();
	}

	ngOnInit() {
		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
	}
	ngOnDestroy() {
		if (this.commonMenuSubscription) {
			this.commonMenuSubscription.unsubscribe();
		}
	}

	isParentActive(item) {
		// console.log('IS PARENT ACTIVE', item, this.router, this.route);
	}

	showItem(item) {
		let showItem = true;
		if (this.deviceService.isArm) {
			if (!item.forArm) {
				showItem = false;
			}
		}
		return showItem;
	}

	menuItemClick(event, path) {
		this.router.navigateByUrl(path);
	}

	//  to popup Lenovo ID modal dialog
	OpenLenovoId() {
		this.modalService.open(ModalLenovoIdComponent, {
			backdrop: 'static',
			centered: true,
			windowClass: 'lenovo-id-modal-size'
		});
	}

	onLogout() {
		this.userService.removeAuth();
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case LocalStorageKey.MachineInfo:
					this.deviceModel = notification.payload.family;
					this.country = notification.payload.country;
					break;
				default:
					break;
			}
		}
	}

	onLanguageChange(translation: Translation) {
		if (translation && translation.type === TranslationSection.CommonMenu) {
			this.items[0].label = translation.payload.dashboard;
		}
	}

	showWindowsHello(windowsHello: WindowsHello) {
		const securityItem = this.items.find(item => item.id === 'security');
		if (!this.commonService.isRS5OrLater()
			|| (typeof windowsHello.facialIdStatus !== 'string'
				&& typeof windowsHello.fingerPrintStatus !== 'string')) {
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
	}
	showVpn() {
		this.regionService.getRegion().subscribe({
			next: x => { this.region = x; },
			error: err => { console.error(err); },
			complete: () => { console.log('Done'); }
		});
		const securityItemForVpn = this.items.find(item => item.id === 'security');
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
}
