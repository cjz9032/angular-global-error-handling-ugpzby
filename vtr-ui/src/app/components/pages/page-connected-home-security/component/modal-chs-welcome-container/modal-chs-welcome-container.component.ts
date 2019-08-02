import {
	Component,
	OnInit,
	AfterViewInit,
	OnDestroy
} from '@angular/core';
import {
	NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { LenovoIdDialogService } from 'src/app/services/dialog/lenovoIdDialog.service';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { EventTypes, WinRT, CHSAccountState } from '@lenovo/tan-client-bridge';
import * as Phoenix from '@lenovo/tan-client-bridge';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { HomeSecurityMockService } from 'src/app/services/home-security/home-security-mock.service';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { Subscription } from 'rxjs';

@Component({
	selector: 'vtr-modal-chs-welcome-container',
	templateUrl: './modal-chs-welcome-container.component.html',
	styleUrls: ['./modal-chs-welcome-container.component.scss']
})
export class ModalChsWelcomeContainerComponent implements OnInit, AfterViewInit, OnDestroy {
	containerPage: number;
	switchPage = 1;
	isLenovoIdLogin: boolean;
	url = 'ms-settings:privacy-location';
	showPageLocation = false;
	showPageLenovoId = false;
	hasSystemPermissionShowed: boolean;
	isLocationServiceOn: boolean;
	chs: Phoenix.ConnectedHomeSecurity;
	permission: any;
	loading = false;
	isOnline = true;
	notificationSubscription: Subscription;
	metricsParent = 'ConnectedHomeSecurity';
	lenovoIdCallback;
	welcomeFlag: boolean;
	constructor(
		public activeModal: NgbActiveModal,
		public homeSecurityMockService: HomeSecurityMockService,
		private vantageShellService: VantageShellService,
		private commonService: CommonService,
		private dialogService: LenovoIdDialogService
	) {
		this.chs = vantageShellService.getConnectedHomeSecurity();
		if (!this.chs) {
			this.chs = this.homeSecurityMockService.getConnectedHomeSecurity();
		}
		this.permission = vantageShellService.getPermission();
	}

	ngOnInit() {
		switch (this.switchPage) {
			case 3:
				this.showPageLenovoId = true;
				break;
			case 4:
				this.showPageLocation = true;
				break;
			default:
				break;
		}

		this.isOnline = this.commonService.isOnline;
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});

		this.chs.on(EventTypes.wsIsLocationServiceOnEvent, (data) => {
			this.isLocationServiceOn = data;
			if (this.switchPage === 4) {
				this.showPageLocation = true;
			} else {
				this.showPageLocation = !this.isLocationServiceOn;
			}
		});

		this.chs.on(EventTypes.chsEvent, (chsData) => {
			if (chsData.account.lenovoId) {
				this.isLenovoIdLogin = chsData.account.lenovoId.loggedIn;
				if (this.switchPage === 3) {
					this.showPageLenovoId = true;
				} else {
					this.showPageLenovoId = !this.isLenovoIdLogin;
				}
			}
		});
	}

	ngAfterViewInit(): void {
		this.refreshPage();
	}

	ngOnDestroy() {
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}


	refreshPage() {
		if (this.hasSystemPermissionShowed) {
			this.permission.requestPermission('geoLocatorStatus').then((status: boolean) => {
				this.isLocationServiceOn = status;
			});
		} else {
			this.permission.getSystemPermissionShowed().then((response: boolean) => {
				this.hasSystemPermissionShowed = response;
				if (!response) { return; }
				this.permission.requestPermission('geoLocatorStatus').then((status: boolean) => {
					this.isLocationServiceOn = status;
				});
			});
		}
		this.isLenovoIdLogin = this.chs.account.lenovoId.loggedIn;
	}

	closeModal(reason) {
		this.activeModal.close(reason);
		this.chs.off(EventTypes.lenovoIdStatusChange, this.lenovoIdCallback);
	}

	next(switchPage, isLenovoIdLogin, isLocationServiceOn) {
		this.lenovoIdCallback = (lenovoIdStatus) => {
			if (this.isLocationServiceOn) {
				if (lenovoIdStatus && this.chs.account.state === CHSAccountState.local && this.isOnline) {
					this.startTrial();
				} else {
					this.closeModal('success');
				}
			} else {
				this.switchPage = 4;
				this.showPageLocation = true;
			}
			this.chs.off(EventTypes.lenovoIdStatusChange, this.lenovoIdCallback);
		};
		if (switchPage === 1) {
			this.switchPage = 2;
		} else if (switchPage === 2) {
			if (isLenovoIdLogin) {
				if (isLocationServiceOn) {
					if (this.chs.account.state === CHSAccountState.local && this.isOnline) {
						this.startTrial();
					} else {
						this.closeModal('success');
					}
				} else {
					this.switchPage = 4;
					this.showPageLocation = true;
				}
			} else {
				this.switchPage = 3;
				this.showPageLenovoId = true;
				this.chs.on(EventTypes.lenovoIdStatusChange, this.lenovoIdCallback);
			}
		} else if (switchPage === 3) {
			this.showPageLenovoId = true;
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
			this.chs.off(EventTypes.lenovoIdStatusChange, this.lenovoIdCallback);
			if (isLocationServiceOn) {
				this.closeModal('success');
			} else {
				this.switchPage = 4;
				this.showPageLocation = true;
			}
		} else if (switchPage === 4) {
			if (isLenovoIdLogin && this.chs.account.state === CHSAccountState.local && this.isOnline && this.welcomeFlag) {
				this.startTrial();
			} else {
				this.closeModal('success');
			}
		}
	}

	prev(switchPage) {
		if (switchPage > 0) {
			this.switchPage = switchPage - 1;
		}
		if (switchPage === 3) {
			this.chs.off(EventTypes.lenovoIdStatusChange, this.lenovoIdCallback);
		}
	}

	public openLocation($event: any) {
		this.permission.isComputerPermissionOn().then((result) => {
			if (result) {
				this.permission.getIsDevicePermissionOn().then((response) => {
					if (response) {
						this.permission.getSystemPermissionShowed().then((res) => {
							this.hasSystemPermissionShowed = res;
							if (res) {
								WinRT.launchUri(this.url);
							}
							this.permission.requestPermission('geoLocatorStatus').then((status) => {
								this.isLocationServiceOn = status;
							});
						});
					} else {
						WinRT.launchUri(this.url);
					}
				});
			} else {
				WinRT.launchUri(this.url);
			}
		});
	}

	startTrial() {
		this.loading = true;
		this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
		this.chs.createAndGetAccount().then((trial: boolean) => {
			if (!trial) {
				this.closeModal('startTrailError');
			} else {
				this.closeModal('success');
			}
		}).catch(() => {
			this.closeModal('startTrailError');
		});
	}

	openLenovoId() {
		const callback = (loggedIn: boolean) => {
			if (loggedIn) {
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
			}
		};
		this.dialogService.openLenovoIdDialog('ConnectedHomeSecurity.Welcome').then(() => {
			this.chs.off(EventTypes.lenovoIdStatusChange, callback);
		}).catch(() => {
			this.chs.off(EventTypes.lenovoIdStatusChange, callback);
		});
		this.chs.on(EventTypes.lenovoIdStatusChange, callback);
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
}
