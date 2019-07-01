import {
	Component,
	OnInit,
	OnDestroy,
	HostListener,
	AfterViewInit
} from '@angular/core';
import {
	EventTypes, ConnectedHomeSecurity
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
import { ModalChsWelcomeContainerComponent } from '../page-connected-home-security/component/modal-chs-welcome-container/modal-chs-welcome-container.component';
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
import { HomeSecurityCommon } from 'src/app/data-models/home-security/home-security-common.model';


@Component({
	selector: 'vtr-page-connected-home-security',
	templateUrl: './page-connected-home-security.component.html',
	styleUrls: ['./page-connected-home-security.component.scss']
})
export class PageConnectedHomeSecurityComponent implements OnInit, OnDestroy, AfterViewInit {
	pageStatus: HomeSecurityPageStatus;

	connectedHomeSecurity: ConnectedHomeSecurity;
	permission: any;
	welcomeModel: HomeSecurityWelcome;
	allDevicesInfo: HomeSecurityAllDevice;
	homeSecurityOverviewMyDevice: HomeSecurityOverviewMyDevice;
	notificationItems: HomeSecurityNotifications;
	account: HomeSecurityAccount;
	common: HomeSecurityCommon;
	backId = 'chs-btn-back';

	constructor(
		vantageShellService: VantageShellService,
		public homeSecurityMockService: HomeSecurityMockService,
		private translateService: TranslateService,
		private modalService: NgbModal,
		private commonService: CommonService,
	) {
		this.connectedHomeSecurity = vantageShellService.getConnectedHomeSecurity();
		if (!this.connectedHomeSecurity) {
			this.connectedHomeSecurity = this.homeSecurityMockService.getConnectedHomeSecurity();
		}
		this.permission = vantageShellService.getPermission();
		this.welcomeModel = new HomeSecurityWelcome();
	}

	ngOnInit() {
		if (this.connectedHomeSecurity) {
			this.connectedHomeSecurity.startPullingCHS();
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
		if (this.connectedHomeSecurity && this.connectedHomeSecurity.overview && this.connectedHomeSecurity.overview.allDevices) {
			this.allDevicesInfo = new HomeSecurityAllDevice(this.connectedHomeSecurity.overview);
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAllDevices, this.allDevicesInfo);
		}
		const cacheAccount = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAccount);
		if (cacheAccount) {
			this.account = cacheAccount;
			if (this.connectedHomeSecurity.account) {
				this.account.createAccount = this.connectedHomeSecurity.account.createAccount;
				this.account.purchase = this.connectedHomeSecurity.account.purchase;
				const cacheLid = this.connectedHomeSecurity.account.lenovoId.loggedIn;
				this.account = new HomeSecurityAccount(this.account, this.modalService, cacheLid);
			}
		}
		if (this.connectedHomeSecurity.account && this.connectedHomeSecurity.account.state) {
			this.account = new HomeSecurityAccount(this.connectedHomeSecurity.account, this.modalService);
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAccount, {
				state: this.account.state,
				expiration: this.account.expiration,
				standardTime: this.account.standardTime,
				device: this.account.device,
				allDevice: this.account.allDevice,
			});
			this.common = new HomeSecurityCommon(this.connectedHomeSecurity, this.modalService);
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
				this.common = new HomeSecurityCommon(this.connectedHomeSecurity, this.modalService);
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAccount, {
					state: this.account.state,
					expiration: this.account.expiration,
					standardTime: this.account.standardTime,
					device: this.account.device,
					allDevice: this.account.allDevice,
				});
			}
			if (chs.overview.allDevices) {
				this.allDevicesInfo = new HomeSecurityAllDevice(chs.overview);
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAllDevices, this.allDevicesInfo);
			}
			if (chs.notifications) {
				this.notificationItems = new HomeSecurityNotifications(chs.notifications);
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityNotifications, this.notificationItems);
			}
		});
	}

	ngAfterViewInit(): void {
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
	}

	ngOnDestroy() {
		this.commonService.setSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, false);
		if (this.connectedHomeSecurity) {
			this.connectedHomeSecurity.stopPullingCHS();
		}
	}

	@HostListener('window: focus')
	onFocus(): void {
		this.permission.getSystemPermissionShowed().then(response => {
			this.welcomeModel.hasSystemPermissionShowed = response;
		});
	}


	openWelcomeModal(showWelcome) {
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage)) {
			if (this.modalService.hasOpenModals()) {
				return;
			}
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome, showWelcome + 1);
			this.modalService.open(ModalChsWelcomeContainerComponent, {
				backdrop: 'static',
				size: 'lg',
				centered: true,
				windowClass: 'Welcome-container-Modal'
			});
		}
	}

	openPermissionModal() {
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage)) {
			if (this.modalService.hasOpenModals()) {
				return;
			}
			const welcomeModal = this.modalService.open(ModalChsWelcomeContainerComponent, {
				backdrop: 'static',
				size: 'lg',
				centered: true,
				windowClass: 'Welcome-container-Modal'
			});
			welcomeModal.componentInstance.switchPage = 4;
		}
	}
}
