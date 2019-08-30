import {
	Component,
	OnInit,
	OnDestroy,
	HostListener,
	AfterViewInit
} from '@angular/core';
import {
	EventTypes, ConnectedHomeSecurity, PluginMissingError, CHSAccountState, WifiSecurity, DevicePosture
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
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { LenovoIdDialogService } from 'src/app/services/dialog/lenovoIdDialog.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { HomeSecurityMockService } from 'src/app/services/home-security/home-security-mock.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { HomeSecurityWelcome } from 'src/app/data-models/home-security/home-security-welcome.model';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { HomeSecurityAllDevice } from 'src/app/data-models/home-security/home-security-overview-allDevice.model';
import { HomeSecurityCommon } from 'src/app/data-models/home-security/home-security-common.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { SecurityAdvisorMockService } from 'src/app/services/security/securityMock.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { DevicePostureMockService } from 'src/app/services/device-posture/device-posture-mock.service';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';
import { CMSService } from 'src/app/services/cms/cms.service';
import { HomeSecurityDevicePosture } from 'src/app/data-models/home-security/home-security-device-posture.model';


@Component({
	selector: 'vtr-page-connected-home-security',
	templateUrl: './page-connected-home-security.component.html',
	styleUrls: ['./page-connected-home-security.component.scss']
})
export class PageConnectedHomeSecurityComponent implements OnInit, OnDestroy, AfterViewInit {
	pageStatus: HomeSecurityPageStatus;

	chs: ConnectedHomeSecurity;
	devicePosture: DevicePosture;
	wifiSecurity: WifiSecurity;
	permission: any;
	welcomeModel: HomeSecurityWelcome;
	allDevicesInfo: HomeSecurityAllDevice;
	homeSecurityDevicePosture: HomeSecurityDevicePosture;
	account: HomeSecurityAccount;
	common: HomeSecurityCommon;
	backId = 'chs-btn-back';
	isOnline = true;
	notificationSubscription: Subscription;
	intervalId: number;
	interval = 15000;
	devicePostureArticleId = '9CEBB4794F534648A64C5B376FBC2E39';
	devicePostureArticleCategory: string;

	constructor(
		vantageShellService: VantageShellService,
		public homeSecurityMockService: HomeSecurityMockService,
		public devicePostureMockService: DevicePostureMockService,
		private securityAdvisorMockService: SecurityAdvisorMockService,
		private translateService: TranslateService,
		private modalService: NgbModal,
		private commonService: CommonService,
		private dialogService: DialogService,
		private lenovoIdDialogService: LenovoIdDialogService,
		private cmsService: CMSService,
	) {
		this.chs = vantageShellService.getConnectedHomeSecurity();
		this.devicePosture = vantageShellService.getDevicePosture();
		if (vantageShellService.getSecurityAdvisor()) {
			this.wifiSecurity = vantageShellService.getSecurityAdvisor().wifiSecurity;
		} else {
			this.wifiSecurity = securityAdvisorMockService.getSecurityAdvisor().wifiSecurity;
		}
		if (!this.chs) {
			this.chs = this.homeSecurityMockService.getConnectedHomeSecurity();
		}
		if (!this.devicePosture) {
			this.devicePosture = this.devicePostureMockService.getDevicePosture();
		}
		this.permission = vantageShellService.getPermission();
		this.common = new HomeSecurityCommon(this.chs, this.isOnline, this.modalService, this.dialogService, this.lenovoIdDialogService);
		this.welcomeModel = new HomeSecurityWelcome();
		this.account = new HomeSecurityAccount();
		this.allDevicesInfo = new HomeSecurityAllDevice(this.translateService, this.homeSecurityMockService.getConnectedHomeSecurity().overview.allDevices);
		this.homeSecurityDevicePosture = new HomeSecurityDevicePosture();
		this.fetchCMSArticles();
	}

	ngOnInit() {
		this.commonService.setSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, true);
		this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog, 'unknow');
		this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowWelcomeDialog, 'unknow');
		this.isOnline = this.commonService.isOnline;
		let cacheIsOnline = true;
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
			if (this.common) {
				this.common.isOnline = this.isOnline;
			}
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

		const cacheAllDevices = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAllDevices);
		if (cacheAllDevices) {
			this.allDevicesInfo = cacheAllDevices;
		}
		if (this.chs && this.chs.overview && this.homeSecurityMockService.getConnectedHomeSecurity().overview.allDevices) {
			this.allDevicesInfo = new HomeSecurityAllDevice(this.translateService, this.homeSecurityMockService.getConnectedHomeSecurity().overview.allDevices);
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAllDevices, this.allDevicesInfo);
		}
		const cacheAccount = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAccount);
		if (cacheAccount) {
			this.account = cacheAccount;
			if (this.chs.account) {
				this.common = new HomeSecurityCommon(this.chs, this.isOnline, this.modalService, this.dialogService, this.lenovoIdDialogService);
				this.account = new HomeSecurityAccount(this.chs, this.common, this.lenovoIdDialogService);
			}
		}
		if (this.chs.account && this.chs.account.state) {
			this.common = new HomeSecurityCommon(this.chs, this.isOnline, this.modalService, this.dialogService, this.lenovoIdDialogService);
			this.account = new HomeSecurityAccount(this.chs, this.common, this.lenovoIdDialogService);
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAccount, {
				state: this.account.state,
				expiration: this.account.expiration,
				standardTime: this.account.standardTime,
				device: this.account.device,
				allDevice: this.account.allDevice,
			});
			if (this.account.lenovoIdLoggedIn && this.account.state !== CHSAccountState.local) {
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
			}
		}
		const cacheDevicePosture = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityDevicePosture);
		if (this.wifiSecurity && this.devicePosture && this.devicePosture.value.length > 0) {
			this.homeSecurityDevicePosture = new HomeSecurityDevicePosture(this.wifiSecurity, this.devicePosture, this.translateService);
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityDevicePosture, {
				isLocationServiceOn: this.homeSecurityDevicePosture.isLocationServiceOn,
				homeDevicePosture: this.homeSecurityDevicePosture.homeDevicePosture
			});
		} else if (cacheDevicePosture) {
			this.homeSecurityDevicePosture = cacheDevicePosture;
		}

		this.chs.on(EventTypes.chsEvent, (chs: ConnectedHomeSecurity) => {
			if (chs.account) {
				this.common = new HomeSecurityCommon(chs, this.isOnline, this.modalService, this.dialogService, this.lenovoIdDialogService);
				this.account = new HomeSecurityAccount(chs, this.common, this.lenovoIdDialogService);
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAccount, {
					state: this.account.state,
					expiration: this.account.expiration,
					standardTime: this.account.standardTime,
					device: this.account.device,
					allDevice: this.account.allDevice,
				});
				if (this.account.lenovoIdLoggedIn && this.account.state !== CHSAccountState.local) {
					this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
				}
			}
			if (chs.overview.allDevices) {
				this.allDevicesInfo = new HomeSecurityAllDevice(this.translateService, this.homeSecurityMockService.getConnectedHomeSecurity().overview.allDevices);
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAllDevices, this.allDevicesInfo);
			}
		});

		this.chs.on(EventTypes.devicePostureEvent, (devicePosture) => {
			if (devicePosture && devicePosture.value.length > 0) {
				this.homeSecurityDevicePosture = new HomeSecurityDevicePosture(this.wifiSecurity, devicePosture, this.translateService);
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityDevicePosture, {
					isLocationServiceOn: this.homeSecurityDevicePosture.isLocationServiceOn,
					homeDevicePosture: this.homeSecurityDevicePosture.homeDevicePosture
				});
			}
		});

		this.chs.on(EventTypes.wsIsLocationServiceOnEvent, (location: boolean) => {
			if (location) {
				if (!this.commonService.getSessionStorageValue(SessionStorageKey.ChsIsGetDevicePosture)) {
					this.commonService.setSessionStorageValue(SessionStorageKey.ChsIsGetDevicePosture, true);
					this.devicePosture.getDevicePosture()
						.then(() => {
							this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog, 'notShow');
						})
						.catch((err: Error) => this.handleResponseError(err));
				}
				this.commonService.setSessionStorageValue(SessionStorageKey.ChsLocationDialogNextShowFlag, true);
			} else if (!location
				&& this.commonService.getSessionStorageValue(SessionStorageKey.ChsLocationDialogNextShowFlag, false)
				&& this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, false)) {
				setTimeout(() => {
					const openPermissionModal = this.dialogService.openCHSPermissionModal();
					if (openPermissionModal) {
						openPermissionModal.result.then(() => {
							this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowWelcomeDialog, 'finish');
						});
					}
				}, 0);
			}
			this.homeSecurityDevicePosture = new HomeSecurityDevicePosture(this.wifiSecurity, this.devicePosture, this.translateService);
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityDevicePosture, {
				isLocationServiceOn: this.homeSecurityDevicePosture.isLocationServiceOn,
				homeDevicePosture: this.homeSecurityDevicePosture.homeDevicePosture
			});
		});

		if (this.commonService.getSessionStorageValue(SessionStorageKey.WidgetWifiStatus)) {
			this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog, 'notShow');
		}

		if (this.chs) {
			if (this.devicePosture && this.wifiSecurity) {
				if (this.wifiSecurity.isLocationServiceOn) {
					this.commonService.setSessionStorageValue(SessionStorageKey.ChsIsGetDevicePosture, true);
					this.devicePosture.getDevicePosture()
						.then(() => {
							this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog, 'notShow');
						})
						.catch((err: Error) => this.handleResponseError(err));
				}
			}
			this.chs.refresh()
				.then(() => {
					this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog, 'notShow');
				})
				.catch((err: Error) => this.handleResponseError(err));
			this.pullCHS();
		}
	}

	ngAfterViewInit(): void {
		if (this.account.lenovoIdLoggedIn && this.account.state !== CHSAccountState.local) {
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
		}
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
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		if (this.devicePosture) {
			if (this.commonService.getSessionStorageValue(SessionStorageKey.ChsIsGetDevicePosture)) {
				this.commonService.setSessionStorageValue(SessionStorageKey.ChsIsGetDevicePosture, false);
				this.devicePosture.cancelGetDevicePosture();
			}
		}
	}

	showWelcomeDialog() {
		const showPluginMissingDialog = this.commonService.getSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog);
		if (showPluginMissingDialog === 'unknow') {
			setTimeout(this.showWelcomeDialog.bind(this), 16);
		} else if (showPluginMissingDialog === 'notShow') {
			const welcomeComplete = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, false) === true;
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
							if (this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, false)) {
								this.dialogService.openCHSPermissionModal().result.then(() => {
									this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowWelcomeDialog, 'finish');
								});
							}
						});
					} else {
						this.dialogService.openCHSPermissionModal().result.then(() => {
							this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowWelcomeDialog, 'finish');
						});
					}
				});
			} else {
				this.dialogService.openWelcomeModal(showWelcome).result.then(() => {
					this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowWelcomeDialog, 'finish');
				});
			}
		} else {
			this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowWelcomeDialog, 'notShow');
		}
	}

	fetchCMSArticles() {
		this.cmsService.fetchCMSArticle(this.devicePostureArticleId, { Lang: 'EN' }).then((response: any) => {
			if (response && response.Results && response.Results.Category) {
				this.devicePostureArticleCategory = response.Results.Category.map((category: any) => category.Title).join(' ');
			}
		});
	}

	openDevicePostureArticle(): void {
		const articleDetailModal: NgbModalRef = this.modalService.open(ModalArticleDetailComponent, {
			size: 'lg',
			centered: true,
			windowClass: 'Article-Detail-Modal',
			keyboard: false,
			backdrop: true,
			beforeDismiss: () => {
				if (articleDetailModal.componentInstance.onBeforeDismiss) {
					articleDetailModal.componentInstance.onBeforeDismiss();
				}
				return true;
			}
		});

		articleDetailModal.componentInstance.articleId = this.devicePostureArticleId;
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
			if (this.common) {
				this.common.startTrialDisabled = true;
			}
			if (showPluginMissing !== 'show' && showPluginMissing !== 'finish') {
				this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog, 'show');
				this.dialogService.homeSecurityPluginMissingDialog();
			}
		} else {
			this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog, 'notShow');
		}
	}

	private pullCHS(): void {
		this.intervalId = window.setInterval(() => {
			this.chs.refresh().then(() => {
				this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog, 'notShow');
			}).catch((err: Error) => this.handleResponseError(err));
		}, this.interval);
	}

	public switchState() {
		if (this.homeSecurityMockService.state === 'notRegister') {
			this.homeSecurityMockService.state = 'register';
		} else {
			this.homeSecurityMockService.state = 'notRegister';
		}
	}
}
