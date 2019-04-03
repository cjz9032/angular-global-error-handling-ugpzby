import { Component, OnInit, OnDestroy } from '@angular/core';
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

@Component({
	selector: 'vtr-menu-main',
	templateUrl: './menu-main.component.html',
	styleUrls: ['./menu-main.component.scss']
})
export class MenuMainComponent implements OnInit, OnDestroy {

	public deviceModel: string;
	commonMenuSubscription: Subscription;
	public appVersion: string = environment.appVersion;
	constantDevice = 'device';
	constantDeviceSettings = 'device-settings';

	items = [
		{
			id: 'dashboard',
			label: 'Dashboard',
			path: 'dashboard',
			icon: ['fal', 'columns'],
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.dashboard',
			routerLinkActiveOptions: { exact: true },
			subitems: []
		}, {
			id: 'device',
			label: 'Device',
			path: 'device',
			icon: ['fal', 'laptop'],
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.device',
			subitems: [{
				id: 'device',
				label: 'My device',
				path: '',
				icon: '',
				metricsEvent: 'itemClick',
				metricsParent: 'navbar',
				metricsItem: 'link.mydevice',
				routerLinkActiveOptions: { exact: true },
				subitems: []
			}, {
				id: 'device-settings',
				label: 'My device settings',
				path: 'device-settings',
				icon: '',
				metricsEvent: 'itemClick',
				metricsParent: 'navbar',
				metricsItem: 'link.mydevicesettings',
				routerLinkActiveOptions: { exact: false },
				subitems: []
			}, {
				id: 'system-updates',
				label: 'System updates',
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
			label: 'Security',
			path: 'security',
			icon: ['fal', 'lock'],
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.security',
			subitems: [{
				id: 'security',
				label: 'My Security',
				path: '',
				icon: '',
				metricsEvent: 'itemClick',
				metricsParent: 'navbar',
				metricsItem: 'link.mysecurity',
				routerLinkActiveOptions: { exact: true },
				subitems: []
			}, {
				id: 'anti-virus',
				label: 'Anti-Virus',
				path: 'anti-virus',
				icon: '',
				metricsEvent: 'itemClick',
				metricsParent: 'navbar',
				metricsItem: 'link.antivirus',
				routerLinkActiveOptions: { exact: true },
				subitems: []
			}, {
				id: 'wifi-security',
				label: 'WiFi Security',
				path: 'wifi-security',
				icon: '',
				metricsEvent: 'itemClick',
				metricsParent: 'navbar',
				metricsItem: 'link.wifisecurity',
				routerLinkActiveOptions: { exact: true },
				subitems: []
			}, {
				id: 'password-protection',
				label: 'Password Protection',
				path: 'password-protection',
				metricsEvent: 'itemClick',
				metricsParent: 'navbar',
				metricsItem: 'link.passwordprotection',
				routerLinkActiveOptions: { exact: true },
				icon: '',
				subitems: []
			}, {
				id: 'internet-protection',
				label: 'Internet Protection',
				path: 'internet-protection',
				metricsEvent: 'itemClick',
				metricsParent: 'navbar',
				metricsItem: 'link.internetprotection',
				routerLinkActiveOptions: { exact: true },
				icon: '',
				subitems: []
			}, {
				id: 'windows-hello',
				label: 'Windows Hello',
				path: 'windows-hello',
				icon: '',
				metricsEvent: 'itemClick',
				metricsParent: 'navbar',
				metricsItem: 'link.windowshello',
				routerLinkActiveOptions: { exact: true },
				subitems: []
			}]
		}, {
			id: 'support',
			label: 'Support',
			path: 'support',
			icon: ['fal', 'wrench'],
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.support',
			routerLinkActiveOptions: { exact: true },
			forArm: true,
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
			metricsEvent: 'itemClick',
			metricsParent: 'navbar',
			metricsItem: 'link.user',
			routerLinkActiveOptions: { exact: true },
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
		private deviceService: DeviceService
	) {
		this.commonMenuSubscription = this.translationService.subscription
			.subscribe((translation: Translation) => {
				this.onLanguageChange(translation);
			});
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
}
