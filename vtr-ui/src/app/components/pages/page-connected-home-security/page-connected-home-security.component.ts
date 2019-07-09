import {
	Component,
	OnInit,
	OnDestroy,
	HostListener,
	AfterViewInit
} from '@angular/core';
import {
	EventTypes, ConnectedHomeSecurity, PluginMissingError, LocationPermissionOffError, CHSAccountState
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
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { HomeSecurityMockService } from 'src/app/services/home-security/home-security-mock.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { HomeSecurityWelcome } from 'src/app/data-models/home-security/home-security-welcome.model';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { HomeSecurityAllDevice } from 'src/app/data-models/home-security/home-security-overview-allDevice.model';
import { HomeSecurityOverviewMyDevice } from 'src/app/data-models/home-security/home-security-overview-my-device.model';
import { HomeSecurityNotifications } from 'src/app/data-models/home-security/home-security-notifications.model';
import { HomeSecurityCommon } from 'src/app/data-models/home-security/home-security-common.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';


@Component({
	selector: 'vtr-page-connected-home-security',
	templateUrl: './page-connected-home-security.component.html',
	styleUrls: ['./page-connected-home-security.component.scss']
})
export class PageConnectedHomeSecurityComponent implements OnInit, OnDestroy, AfterViewInit {
	pageStatus: HomeSecurityPageStatus;

	chs: ConnectedHomeSecurity;
	permission: any;
	welcomeModel: HomeSecurityWelcome;
	allDevicesInfo: HomeSecurityAllDevice;
	homeSecurityOverviewMyDevice: HomeSecurityOverviewMyDevice;
	notificationItems: HomeSecurityNotifications;
	account: HomeSecurityAccount;
	common: HomeSecurityCommon;
	backId = 'chs-btn-back';
	isOnline = true;
	intervalId: number;
	interval = 15000;

	constructor(
		vantageShellService: VantageShellService,
		public homeSecurityMockService: HomeSecurityMockService,
		private translateService: TranslateService,
		private modalService: NgbModal,
		private commonService: CommonService,
		private dialogService: DialogService
	) {
		this.chs = vantageShellService.getConnectedHomeSecurity();
		if (!this.chs) {
			this.chs = this.homeSecurityMockService.getConnectedHomeSecurity();
		}
		this.permission = vantageShellService.getPermission();
		this.common = new HomeSecurityCommon(this.chs, this.modalService, this.commonService, this.dialogService);
		this.welcomeModel = new HomeSecurityWelcome();
		this.homeSecurityOverviewMyDevice = new HomeSecurityOverviewMyDevice();
		this.allDevicesInfo = new HomeSecurityAllDevice();
		this.notificationItems = new HomeSecurityNotifications();
		this.account = new HomeSecurityAccount();
	}

	ngOnInit() {
		this.commonService.setSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, true);
		this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog, 'unknow');
		this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowWelcomeDialog, 'unknow');
		this.isOnline = this.commonService.isOnline;
		let cacheIsOnline = true;
		this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
			const showPluginMissingDialog = this.commonService.getSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog);
			if (showPluginMissingDialog === 'notShow' || showPluginMissingDialog === 'finish') {
				const showWelcomeDialog = this.commonService.getSessionStorageValue(SessionStorageKey.HomeSecurityShowWelcomeDialog);
				if (showWelcomeDialog === 'notShow' || showWelcomeDialog === 'finish') {
					if (!this.isOnline && this.isOnline !== cacheIsOnline) {
						this.dialogService.homeSecurityOfflineDialog();
					}
					cacheIsOnline = this.isOnline;
				}
			}
		});

		const cacheMyDevice = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityMyDevice);
		if (cacheMyDevice) {
			this.homeSecurityOverviewMyDevice = cacheMyDevice;
		}
		if (this.chs && this.chs.overview) {
			this.homeSecurityOverviewMyDevice = new HomeSecurityOverviewMyDevice(this.chs.overview);
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityMyDevice, this.homeSecurityOverviewMyDevice);
		}
		const cacheAllDevices = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAllDevices);
		if (cacheAllDevices) {
			this.allDevicesInfo = cacheAllDevices;
		}
		if (this.chs && this.chs.overview && this.chs.overview.allDevices) {
			this.allDevicesInfo = new HomeSecurityAllDevice(this.chs.overview);
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAllDevices, this.allDevicesInfo);
		}
		const cacheAccount = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAccount);
		if (cacheAccount) {
			this.account = cacheAccount;
			if (this.chs.account) {
				this.common = new HomeSecurityCommon(this.chs, this.modalService, this.commonService, this.dialogService);
				this.account = new HomeSecurityAccount(this.modalService, this.chs, this.common);
			}
		}
		if (this.chs.account && this.chs.account.state) {
			this.common = new HomeSecurityCommon(this.chs, this.modalService, this.commonService, this.dialogService);
			this.account = new HomeSecurityAccount(this.modalService, this.chs, this.common);
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

		if (this.chs.notifications) {
			this.notificationItems = new HomeSecurityNotifications(this.chs.notifications);
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityNotifications, this.notificationItems);
		}

		this.chs.on(EventTypes.chsEvent, (chs: ConnectedHomeSecurity) => {
			if (chs && chs.overview) {
				this.homeSecurityOverviewMyDevice = new HomeSecurityOverviewMyDevice(chs.overview);
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityMyDevice, this.homeSecurityOverviewMyDevice);
			}
			if (chs.account) {
				this.common = new HomeSecurityCommon(this.chs, this.modalService, this.commonService, this.dialogService);
				this.account = new HomeSecurityAccount(this.modalService, chs, this.common);
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

		if (this.commonService.getSessionStorageValue(SessionStorageKey.WidgetWifiStatus)) {
			this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog, 'notShow');
		}

		if (this.chs) {
			this.chs.refresh()
			.then(() => {
				this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog, 'notShow');
			})
			.catch((err: Error) => this.handleResponseError(err));
			this.pullCHS();
		}
	}

	ngAfterViewInit(): void {
		this.showWelcomeDialog();
	}

	@HostListener('window: focus')
	onFocus(): void {
		if (this.chs && !this.intervalId) {
			this.chs.refresh()
			.then(() => {
				this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog, 'notShow');
			})
			.catch((err: Error) => this.handleResponseError(err));
			this.pullCHS();
		}
	}

	@HostListener('document: visibilitychange')
	onVisibilityChange(): void {
		const visibility = document.visibilityState;
		if (visibility === 'visible' && !this.intervalId) {
			this.chs.refresh()
			.then(() => {
				this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog, 'notShow');
			})
			.catch((err: Error) => this.handleResponseError(err));
			this.pullCHS();
		} else if (visibility === 'hidden') {
			window.clearInterval(this.intervalId);
			delete this.intervalId;
		}
	}

	ngOnDestroy() {
		this.commonService.setSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, false);
		window.clearInterval(this.intervalId);
	}

	showWelcomeDialog() {
		const showPluginMissingDialog = this.commonService.getSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog);
		if (showPluginMissingDialog === 'unknow') {
			setTimeout(this.showWelcomeDialog.bind(this), 16);
		} else if (showPluginMissingDialog === 'notShow') {
			const welcomeComplete = this.chs.account.state !== CHSAccountState.local
			|| this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, false) === true;
			const showWelcome = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome, 0);
			if (welcomeComplete) {
				this.permission.getSystemPermissionShowed().then((response: boolean) => {
					this.welcomeModel.hasSystemPermissionShowed = response;
					if (response) {
						this.permission.requestPermission('geoLocatorStatus').then((location: boolean) => {
							if (location) {
								this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowWelcomeDialog, 'notShow');
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
		} else {
			this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowWelcomeDialog, 'notShow');
		}
	}

	openWelcomeModal(showWelcome) {
		if (this.commonService.getSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage)) {
			if (this.modalService.hasOpenModals()) {
				return;
			}
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome, showWelcome + 1);

			if (showWelcome === 1) {
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
			}

			const welcomeModal = this.modalService.open(ModalChsWelcomeContainerComponent, {
				backdrop: 'static',
				size: 'lg',
				centered: true,
				windowClass: 'Welcome-container-Modal'
			});
			welcomeModal.result.then(() => {
				this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowWelcomeDialog, 'finish');
			}).catch(() => {
				this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowWelcomeDialog, 'finish');
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
			welcomeModal.componentInstance.hasSystemPermissionShowed = this.welcomeModel.hasSystemPermissionShowed;
			welcomeModal.result.then(() => {
				this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowWelcomeDialog, 'finish');
			}).catch(() => {
				this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowWelcomeDialog, 'finish');
			});
		}
	}

	private onNotification(notification: AppNotification) {
		if (notification) {
			switch (notification.type) {
				case NetworkStatus.Online:
				case NetworkStatus.Offline:
					this.isOnline = notification.payload.isOnline;
					break;
				default:
					break;
			}
		}
	}

	private handleResponseError(err: Error) {
		const showPluginMissing = this.commonService.getSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog);
		if (err instanceof PluginMissingError) {
			if (showPluginMissing !== 'show' && showPluginMissing !== 'finish') {
				this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog, 'show');
				this.dialogService.homeSecurityPluginMissingDialog();
			}
		} else {
			this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog, 'notShow');
		}
		if (err instanceof LocationPermissionOffError) {
			this.dialogService.openCHSPermissionModal();
		}
	}

	private pullCHS(): void {
		this.intervalId = window.setInterval(() => {
			this.chs.refresh().then(() => {
				this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog, 'notShow');
			}).catch((err: Error) => this.handleResponseError(err));
		}, this.interval);
	}
}
