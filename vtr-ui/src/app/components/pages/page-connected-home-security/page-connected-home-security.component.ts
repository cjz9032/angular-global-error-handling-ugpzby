import {
	Component,
	OnInit,
	NgZone,
	OnDestroy,
	HostListener,
	EventEmitter
} from '@angular/core';
import {
	EventTypes, ConnectedHomeSecurity, WinRT
} from '@lenovo/tan-client-bridge';
import {
	VantageShellService
} from '../../../services/vantage-shell/vantage-shell.service';
import {
	HomeSecurityAccount
} from 'src/app/data-models/home-security/home-security-account.model';
import {
	HomeSecurityPageStatus
} from 'src/app/data-models/home-security/home-security-page-status.model';
import { HomeSecurityNotification } from 'src/app/data-models/home-security/home-security-notification.model';
import { WidgetItem } from 'src/app/data-models/security-advisor/widget-security-status/widget-item.model';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalChsWelcomeContainerComponent } from '../../modal/modal-chs-welcome-container/modal-chs-welcome-container.component';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { HomeSecurityMockService } from 'src/app/services/home-security/home-security.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { HomeSecurityWelcome } from 'src/app/data-models/home-security/home-security-welcome.model';
import { ModalLenovoIdComponent } from 'src/app/components/modal/modal-lenovo-id/modal-lenovo-id.component';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { LenovoIdStatus } from 'src/app/enums/lenovo-id-key.enum';
import { UserService } from '../../../services/user/user.service';

@Component({
	selector: 'vtr-page-connected-home-security',
	templateUrl: './page-connected-home-security.component.html',
	styleUrls: ['./page-connected-home-security.component.scss']
})
export class PageConnectedHomeSecurityComponent implements OnInit, OnDestroy {
	notifications: HomeSecurityNotification;
	account: HomeSecurityAccount;
	pageStatus: HomeSecurityPageStatus;
	eventEmitter = new EventEmitter();

	welcomeModel: HomeSecurityWelcome;
	connectedHomeSecurity: any;
	permission: any;



	testStatus = ['lessDevices-secure', 'moreDevices-needAttention', 'noneDevices', 'trialExpired', 'lessDevices-needAttention', 'moreDevices-secure', 'localAccount'];

	constructor(
		vantageShellService: VantageShellService,
		public  homeSecurityMockService: HomeSecurityMockService,
		private translateService: TranslateService,
		private modalService: NgbModal,
		private commonService: CommonService,
		private userService: UserService,
		private ngZone: NgZone
	) {
		this.connectedHomeSecurity = vantageShellService.getConnectedHomeSecurity();
		this.permission = vantageShellService.getPermission();
		this.createMockData();
		this.welcomeModel = new HomeSecurityWelcome();
	}

	private createMockData() {
		this.notifications = {items: []};
		this.notifications.items.push(new WidgetItem({id: '2', title: '5 minutes disconnect', iconPath: 'assets/images/qa/svg_icon_qa_backup.svg',
		notificationDetail: 'Antivirus was disabled'}, this.translateService));
		this.notifications.items.push(new WidgetItem({id: '3', title: '10 minutes disconnect', iconPath: 'assets/images/qa/svg_icon_qa_pcbit.svg',
		notificationDetail: 'Antivirus was disabled'}, this.translateService));
		this.notifications.items.push(new WidgetItem({id: '1', title: 'Antivirus was disabled', iconPath: 'assets/images/qa/svg_icon_qa_battery.svg',
		notificationDetail: 'Antivirus was disabled'}, this.translateService));
		this.notifications.items.push(new WidgetItem({id: '1', title: 'Passcode lock disabled 3 hours', iconPath: 'assets/images/qa/svg_icon_qa_tablet.svg',
		notificationDetail: 'Antivirus was disabled'}, this.translateService));
		this.notifications.items.push(new WidgetItem({id: '1', title: '3 hours disconnect', iconPath: 'assets/images/qa/svg_icon_qa_cortana.svg',
		notificationDetail: 'Antivirus was disabled'}, this.translateService));
		this.notifications.items.push(new WidgetItem({id: '1', title: '8 minutes disconnect', iconPath: 'assets/images/qa/svg_icon_qa_battery.svg',
		notificationDetail: 'Antivirus was disabled'}, this.translateService));
		this.notifications.items.push(new WidgetItem({id: '1', title: 'Antivirus was disabled', iconPath: 'assets/images/qa/svg_icon_qa_pcbit.svg',
		notificationDetail: 'Antivirus was disabled'}, this.translateService));
		this.notifications.items.push(new WidgetItem({id: '1', title: 'Passcode lock disabled 3 hours', iconPath: 'assets/images/qa/svg_icon_qa_refresh.svg',
		notificationDetail: 'Antivirus was disabled'}, this.translateService));
		this.account = this.homeSecurityMockService.account;
		this.connectedHomeSecurity.account = {
			id: '',
			name: '',
			state: 'localAccount',
			lenovoIdEmail: '',
			enabledEmail: true,
			trialRemaining: new Date(),
			ExpirationDate: new Date('apr 15, 2020')
		};
		this.connectedHomeSecurity.consoleUrl = 'https://homesecurity.coro.net/login';
		this.connectedHomeSecurity.upgradeUrl = 'https://vantagestore.lenovo.com/en/shop/product/connectedhomesecurityoneyearlicense-windows';
	}

	ngOnInit() {
		this.welcomeModel.isLenovoIdLogin = false; // mock data;
		this.commonService.setSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, true);
		const cacheSystemLocationShow = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecuritySystemLocationPermissionShowed);
		if (typeof cacheSystemLocationShow === 'boolean') {
			this.welcomeModel.hasSystemPermissionShowed = cacheSystemLocationShow;
			this.openModal();
		} else {
			this.permission.getSystemPermissionShowed().then((response) =>  {
				this.welcomeModel.hasSystemPermissionShowed = response;
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecuritySystemLocationPermissionShowed, response);
				if (typeof this.welcomeModel.hasSystemPermissionShowed === 'boolean') {
					this.openModal();
				}
			});
		}
		this.connectedHomeSecurity.on(EventTypes.chsHasSystemPermissionShowedEvent, (data) => {
			this.welcomeModel.hasSystemPermissionShowed = data;
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecuritySystemLocationPermissionShowed, data);
		});
	}

	ngOnDestroy() {
		this.commonService.setSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, false);
	}

	@HostListener('window: focus')
	onFocus(): void {
		this.permission.getSystemPermissionShowed().then(response =>  {
			this.welcomeModel.hasSystemPermissionShowed = response;
		});
		this.welcomeModel.isLenovoIdLogin = false; // mock data;
	}

	openModal() {
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, true)) {
			if (this.modalService.hasOpenModals()) {
				return;
			}
			if (this.welcomeModel.hasSystemPermissionShowed) {
				this.requireLocationModal();
			} else if (this.welcomeModel.hasSystemPermissionShowed === false) {
				this.notRequireLocationModal();
			}
		}
	}

	requireLocationModal() {
		const showW = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome, 1);
		this.permission.requestPermission('geoLocatorStatus').then((status) => {
			this.welcomeModel.isLocationServiceOn = status;
			this.getSwitchAndContainerPage(status, this.welcomeModel.isLenovoIdLogin);
			if (showW < 3 || status === false) {
				this.ngZone.run(() => {
					const welcomeModal = this.modalService.open(ModalChsWelcomeContainerComponent, {
						backdrop: 'static',
						size: 'lg',
						centered: true,
						windowClass: 'Welcome-container-Modal'
					});
					welcomeModal.componentInstance.hasSystemPermissionShowed = this.welcomeModel.hasSystemPermissionShowed;
					welcomeModal.componentInstance.isLocationServiceOn = this.welcomeModel.isLocationServiceOn;
					welcomeModal.componentInstance.isLenovoIdLogin = this.welcomeModel.isLenovoIdLogin;
					welcomeModal.componentInstance.containerPage = this.welcomeModel.containerPage;
					welcomeModal.componentInstance.switchPage = this.welcomeModel.switchPage;
					this.welcomeModel.showWelcome = showW + 1;
					this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome, this.welcomeModel.showWelcome);
				});
			}
		});
	}

	notRequireLocationModal() {
		const showW = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome, 1);
		this.getSwitchAndContainerPage(false, this.welcomeModel.isLenovoIdLogin);
		this.ngZone.run(() => {
			const welcomeModal = this.modalService.open(ModalChsWelcomeContainerComponent, {
				backdrop: 'static',
				size: 'lg',
				centered: true,
				windowClass: 'Welcome-container-Modal'
			});
			welcomeModal.componentInstance.hasSystemPermissionShowed = this.welcomeModel.hasSystemPermissionShowed;
			welcomeModal.componentInstance.isLenovoIdLogin = this.welcomeModel.isLenovoIdLogin;
			welcomeModal.componentInstance.containerPage = this.welcomeModel.containerPage;
			welcomeModal.componentInstance.switchPage = this.welcomeModel.switchPage;
			this.welcomeModel.showWelcome = showW + 1;
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome, this.welcomeModel.showWelcome);
		});
	}

	getSwitchAndContainerPage(isLocationServiceOn, isLenovoIdLogin) {
		const showW = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome, 1);
		if (isLocationServiceOn === false && isLenovoIdLogin === false) {
			this.welcomeModel.containerPage = 4;
		} else if (isLocationServiceOn && isLenovoIdLogin) {
			this.welcomeModel.containerPage = 2;
		} else {
			this.welcomeModel.containerPage = 3;
		}
		if (showW < 3) {
			this.welcomeModel.switchPage = 1;
		} else {
			if (isLocationServiceOn === false) {
				this.welcomeModel.switchPage = 4;
			}
		}
	}

	onStartTrial() {
		if (this.userService.auth) {
			// connectedHomeSecurity.startTrial()
		} else {
			this.modalService.open(ModalLenovoIdComponent, {
				backdrop: 'static',
				centered: true,
				windowClass: 'lenovo-id-modal-size'
			});
			this.commonService.notification.subscribe((notification: AppNotification) => {
				if (notification && notification.type === LenovoIdStatus.SignedIn) {
					// connectedHomeSecurity.startTrial()
				}
			});
		}
	}

	onManageAccount() {
		WinRT.launchUri(this.connectedHomeSecurity.consoleUrl);
	}

	onUpgradeAccount() {
		WinRT.launchUri(this.connectedHomeSecurity.upgradeUrl);
	}

	public switchStatus() {
		if (this.testStatus.length === 0) {
			this.testStatus = ['loading', 'lessDevices-secure', 'moreDevices-needAttention', 'noneDevices', 'trialExpired', 'lessDevices-needAttention', 'moreDevices-secure', 'localAccount'];
		}
		this.eventEmitter.emit(this.testStatus.shift());
	}
}
