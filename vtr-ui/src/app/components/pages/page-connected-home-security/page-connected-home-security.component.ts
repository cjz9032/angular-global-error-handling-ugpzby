import {
	Component,
	OnInit,
	NgZone,
	OnDestroy,
	HostListener,
	EventEmitter
} from '@angular/core';
import {
	EventTypes, ConnectedHomeSecurity, CHSDeviceOverview, CHSNotifications
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
import { HomeSecurityAllDevice } from 'src/app/data-models/home-security/home-security-overview-allDevice.model';
import { HomeSecurityOverviewMyDevice } from 'src/app/data-models/home-security/home-security-overview-my-device.model';
import { HomeSecurityNotifications } from 'src/app/data-models/home-security/home-security-notifications.model';

@Component({
	selector: 'vtr-page-connected-home-security',
	templateUrl: './page-connected-home-security.component.html',
	styleUrls: ['./page-connected-home-security.component.scss']
})
export class PageConnectedHomeSecurityComponent implements OnInit, OnDestroy {
	pageStatus: HomeSecurityPageStatus;
	eventEmitter = new EventEmitter();

	connectedHomeSecurity: ConnectedHomeSecurity;
	permission: any;
	welcomeModel: HomeSecurityWelcome;
	allDevicesInfo: HomeSecurityAllDevice;
	homeSecurityOverviewMyDevice: HomeSecurityOverviewMyDevice;
	notificationItems: HomeSecurityNotifications;
	account: HomeSecurityAccount;
	isOnline = true;
	testStatus = ['lessDevices-secure', 'moreDevices-needAttention', 'noneDevices', 'trialExpired', 'lessDevices-needAttention', 'moreDevices-secure', 'localAccount'];

	constructor(
		vantageShellService: VantageShellService,
		public homeSecurityMockService: HomeSecurityMockService,
		private translateService: TranslateService,
		private modalService: NgbModal,
		private commonService: CommonService,
		private ngZone: NgZone,
	) {
		this.connectedHomeSecurity = homeSecurityMockService.getConnectedHomeSecurity();
		this.permission = vantageShellService.getPermission();
		this.welcomeModel = new HomeSecurityWelcome();
	}

	ngOnInit() {
		this.welcomeModel.isLenovoIdLogin = false; // mock data;
		this.commonService.setSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, true);
		this.permission.getSystemPermissionShowed().then((response) => {
			this.welcomeModel.hasSystemPermissionShowed = response;
			if (typeof this.welcomeModel.hasSystemPermissionShowed === 'boolean') {
				this.openModal();
			}
		});
		this.connectedHomeSecurity.on(EventTypes.chsHasSystemPermissionShowedEvent, (data) => {
			this.welcomeModel.hasSystemPermissionShowed = data;
		});

		const cacheMyDevice = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityMyDevice);
		const cacheAllDevices = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAllDevices);
		if (cacheAllDevices) {
			this.allDevicesInfo = cacheAllDevices;
		}
		if (this.connectedHomeSecurity && this.connectedHomeSecurity.overview) {
			this.homeSecurityOverviewMyDevice = new HomeSecurityOverviewMyDevice(this.translateService, this.connectedHomeSecurity.overview);
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityMyDevice, this.homeSecurityOverviewMyDevice);
		} else if (cacheMyDevice) {
			this.homeSecurityOverviewMyDevice = cacheMyDevice;
		}
		if (this.connectedHomeSecurity && this.connectedHomeSecurity.overview && this.connectedHomeSecurity.overview.allDevices && this.connectedHomeSecurity.overview.allDevices.length > 0) {
			this.allDevicesInfo = new HomeSecurityAllDevice(this.connectedHomeSecurity.overview);
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAllDevices, this.allDevicesInfo);
		}
		const cacheAccount = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAccount);
		if (cacheAccount) {
			this.account = cacheAccount;
		}
		if (this.connectedHomeSecurity.account) {
			this.account = new HomeSecurityAccount(this.connectedHomeSecurity.account, this.modalService);
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAccount, {
				state: this.account.state,
				expiration: this.account.expiration,
				standardTime: this.account.standardTime,
				device: this.account.device,
				allDevice: this.account.allDevice,
			});
		}
		const cacheNotifications = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityNotifications);
		if (cacheNotifications) {
			this.notificationItems = cacheNotifications;
		}

		if (this.connectedHomeSecurity.notifications) {
			this.notificationItems = new HomeSecurityNotifications(this.connectedHomeSecurity.notifications);
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityNotifications, this.notificationItems)
		}

		this.connectedHomeSecurity.on(EventTypes.chsEvent, (chs: ConnectedHomeSecurity) => {
			if (chs && chs.overview) {
				this.homeSecurityOverviewMyDevice = new HomeSecurityOverviewMyDevice(this.translateService, chs.overview);
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityMyDevice, this.homeSecurityOverviewMyDevice);
			}
			if (chs.account) {
				this.account = new HomeSecurityAccount(chs.account, this.modalService);
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAccount, {
					state: this.account.state,
					expiration: this.account.expiration,
					standardTime: this.account.standardTime,
					device: this.account.device,
					allDevice: this.account.allDevice,
				});
			}
			if (chs.overview.allDevices && chs.overview.allDevices.length > 0) {
				this.allDevicesInfo = new HomeSecurityAllDevice(chs.overview);
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAllDevices, this.allDevicesInfo);
			}
			if (chs.notifications) {
				this.notificationItems = new HomeSecurityNotifications(chs.notifications);
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityNotifications, this.notificationItems);
			}
		});

	}

	ngOnDestroy() {
		this.commonService.setSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, false);
	}

	@HostListener('window: focus')
	onFocus(): void {
		this.permission.getSystemPermissionShowed().then(response => {
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
		if (this.connectedHomeSecurity.account.lenovoId.loggedIn) {
			this.connectedHomeSecurity.account.createAccount();
		} else {
			this.modalService.open(ModalLenovoIdComponent, {
				backdrop: 'static',
				centered: true,
				windowClass: 'lenovo-id-modal-size'
			});
			this.commonService.notification.subscribe((notification: AppNotification) => {
				if (notification && notification.type === LenovoIdStatus.SignedIn) {
					this.connectedHomeSecurity.account.createAccount();
				}
			});
		}
	}

	onManageAccount(feature?: string) {
		this.connectedHomeSecurity.account.visitWebConsole(feature);
	}

	onUpgradeAccount() {
		this.isOnline = !this.isOnline;
		this.connectedHomeSecurity.account.purchase();
	}

	haddleChange($event) {
		if ($event === 'visitCornet') {
			this.onManageAccount();
		} else if ($event === 'upgrade') {
			this.onUpgradeAccount();
		} else if ($event === 'startTrial') {
			this.onStartTrial();
		}
	}

	public switchStatus() {
		if (this.testStatus.length === 0) {
			this.testStatus = ['loading', 'lessDevices-secure', 'moreDevices-needAttention', 'noneDevices', 'trialExpired', 'lessDevices-needAttention', 'moreDevices-secure', 'localAccount'];
		}
		this.eventEmitter.emit(this.testStatus.shift());
	}
}
