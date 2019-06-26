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
	testStatus = ['lessDevices-secure', 'moreDevices-needAttention', 'noneDevices', 'trialExpired', 'lessDevices-needAttention', 'moreDevices-secure', 'localAccount'];
	backId = 'chs-btn-back';

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
		this.commonService.setSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, true);
		const welcomeComplete = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, false);
		const showWelcome = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome, 0);
		if (welcomeComplete || showWelcome === 2) {
			this.permission.getSystemPermissionShowed().then((response: boolean) => {
				if (response) {
					this.permission.requestPermission('geoLocatorStatus').then((location: boolean) => {
						if (location) {
							return;
						}
						this.openPermissionModal();
					});
				} else {
					this.openPermissionModal();
				}
			});
		} else {
			this.openWelcomeModal(showWelcome);
		}

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
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityNotifications, this.notificationItems);
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
	}


	openWelcomeModal(showWelcome) {
		if (this.modalService.hasOpenModals()) {
			return;
		}

		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, true)) {
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome, showWelcome + 1);
			this.ngZone.run(() => {
				const welcomeModal = this.modalService.open(ModalChsWelcomeContainerComponent, {
					backdrop: 'static',
					size: 'lg',
					centered: true,
					windowClass: 'Welcome-container-Modal'
				});
			});
		}
	}

	openPermissionModal() {
		if (this.modalService.hasOpenModals()) {
			return;
		}
		this.ngZone.run(() => {
			const welcomeModal = this.modalService.open(ModalChsWelcomeContainerComponent, {
				backdrop: 'static',
				size: 'lg',
				centered: true,
				windowClass: 'Welcome-container-Modal'
			});
			welcomeModal.componentInstance.switchPage = 4;
		});
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
