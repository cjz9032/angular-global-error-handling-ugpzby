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
	HomeSecurityAccount
} from 'src/app/data-models/home-security/home-security-account.model';
import {
	HomeSecurityPageStatus
} from 'src/app/data-models/home-security/home-security-page-status.model';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common/common.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { HomeSecurityWelcome } from 'src/app/data-models/home-security/home-security-welcome.model';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { HomeSecurityAllDevice } from 'src/app/data-models/home-security/home-security-overview-allDevice.model';
import { HomeSecurityCommon } from 'src/app/data-models/home-security/home-security-common.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { Subscription } from 'rxjs/internal/Subscription';
import { ModalArticleDetailComponent } from '../../modal/modal-article-detail/modal-article-detail.component';
import { CMSService } from 'src/app/services/cms/cms.service';
import { HomeSecurityDevicePosture } from 'src/app/data-models/home-security/home-security-device-posture.model';
import { DeviceLocationPermission } from 'src/app/data-models/home-security/device-location-permission.model';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';
import { AppEvent } from 'src/app/data-models/common/app-event.model';


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
	locationPermission: DeviceLocationPermission;
	account: HomeSecurityAccount;
	common: HomeSecurityCommon;
	backId = 'chs-btn-back';
	isOnline = true;
	notificationSubscription: Subscription;
	intervalId: number;
	interval = 15000;
	devicePostureArticleId = '9CEBB4794F534648A64C5B376FBC2E39';
	devicePostureArticleCategory: string;
	showContentA = false;
	showContentB = false;

	cardContentPositionA: any = {
		FeatureImage: 'assets/images/connected-home-security/card-gamestore.png'
	};
	cardContentPositionB: any = {
		FeatureImage: 'assets/images/connected-home-security/card-gamestore.png'
	};

	appEvent: AppEvent;

	constructor(
		public vantageShellService: VantageShellService,
		public dialogService: DialogService,
		private translateService: TranslateService,
		private modalService: NgbModal,
		private commonService: CommonService,
		private cmsService: CMSService,
	) { }

	ngOnInit() {
		this.homeSecurityDevicePosture = new HomeSecurityDevicePosture();
		this.chs = this.vantageShellService.getConnectedHomeSecurity();
		this.devicePosture = this.vantageShellService.getDevicePosture();
		if (this.vantageShellService.getSecurityAdvisor()) {
			this.wifiSecurity = this.vantageShellService.getSecurityAdvisor().wifiSecurity;
		}
		this.permission = this.vantageShellService.getPermission();
		this.welcomeModel = new HomeSecurityWelcome();
		this.appEvent = new AppEvent();
		this.fetchCMSArticles();

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
		if (this.chs && this.chs.deviceOverview) {
			this.allDevicesInfo = new HomeSecurityAllDevice(this.translateService, this.chs.deviceOverview);
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAllDevices, this.allDevicesInfo);
		}
		const cacheAccount = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAccount);
		if (cacheAccount) {
			this.account = cacheAccount;
			if (this.chs.account) {
				this.common = new HomeSecurityCommon(this.chs, this.isOnline, this.dialogService);
				this.account = new HomeSecurityAccount(this.chs, this.common);
			}
		}
		if (this.chs.account && this.chs.account.state) {
			this.common = new HomeSecurityCommon(this.chs, this.isOnline, this.dialogService);
			this.account = new HomeSecurityAccount(this.chs, this.common);
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAccount, {
				state: this.account.state,
				role: this.account.role,
				expirationDay: this.account.expirationDay
			});
			if (this.account.state !== CHSAccountState.local) {
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
			}
		}
		let cacheDevicePosture = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityDevicePosture);
		if (this.devicePosture && this.devicePosture.value.length > 0) {
			this.homeSecurityDevicePosture = new HomeSecurityDevicePosture(this.devicePosture, cacheDevicePosture, this.translateService);
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityDevicePosture, {
				homeDevicePosture: this.homeSecurityDevicePosture.homeDevicePosture
			});
		} else if (cacheDevicePosture) {
			this.homeSecurityDevicePosture = cacheDevicePosture;
		}
		const cacheLocation = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityLocation);
		if (this.wifiSecurity) {
			this.wifiSecurity.getWifiSecurityState();
			this.updateHomeSecurityLocationModel();
		} else if (cacheLocation) {
			this.locationPermission = cacheLocation;
		}
		this.appEvent.chsEvent = (chs: ConnectedHomeSecurity) => {
			if (chs.account) {
				this.common = new HomeSecurityCommon(chs, this.isOnline, this.dialogService);
				this.account = new HomeSecurityAccount(chs, this.common);
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAccount, {
					state: this.account.state,
					role: this.account.role,
					expirationDay: this.account.expirationDay
				});
				if (this.account.state !== CHSAccountState.local) {
					this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
				}
			}
			if (chs.deviceOverview) {
				this.allDevicesInfo = new HomeSecurityAllDevice(this.translateService, this.chs.deviceOverview);
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityAllDevices, this.allDevicesInfo);
			}
		};

		this.chs.on(EventTypes.chsEvent, this.appEvent.chsEvent);

		this.appEvent.wsPluginMissingEvent = () => {
			this.handleResponseError(new PluginMissingError());
		};
		this.chs.on(EventTypes.wsPluginMissingEvent, this.appEvent.wsPluginMissingEvent);

		this.appEvent.devicePostureEvent = (devicePosture: DevicePosture) => {
			if (devicePosture && devicePosture.value.length > 0) {
				cacheDevicePosture = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityDevicePosture);
				this.homeSecurityDevicePosture = new HomeSecurityDevicePosture(devicePosture, cacheDevicePosture, this.translateService);
				this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityDevicePosture, {
					homeDevicePosture: this.homeSecurityDevicePosture.homeDevicePosture
				});
			}
		};
		this.chs.on(EventTypes.devicePostureEvent, this.appEvent.devicePostureEvent);

		this.appEvent.wsIsLocationServiceOnEvent = (location: boolean) => {
			if (location) {
				this.devicePosture.getDevicePosture();
				this.commonService.setSessionStorageValue(SessionStorageKey.ChsLocationDialogNextShowFlag, true);
			} else if (!location
				&& this.commonService.getSessionStorageValue(SessionStorageKey.ChsLocationDialogNextShowFlag, false)
				&& this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, false)) {
				setTimeout(() => {
					if (this.chs.account.state !== CHSAccountState.local) {
						const openPermissionModal = this.dialogService.openCHSPermissionModal(this.locationPermission);
						if (openPermissionModal) {
							openPermissionModal.result.then(() => {
								this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowWelcomeDialog, 'finish');
							});
						}
					}
				}, 0);
			}
			this.updateHomeSecurityLocationModel();
		};
		this.chs.on(EventTypes.wsIsLocationServiceOnEvent, this.appEvent.wsIsLocationServiceOnEvent);

		this.appEvent.wsIsDevicePermissionOnEvent = () => {
			this.updateHomeSecurityLocationModel();
		};
		this.appEvent.wsIsAllAppsPermissionOnEvent = () => {
			this.updateHomeSecurityLocationModel();
		};
		this.appEvent.wsHasSystemPermissionShowedEvent = () => {
			this.updateHomeSecurityLocationModel();
		};
		this.chs.on(EventTypes.wsIsDevicePermissionOnEvent, this.appEvent.wsIsDevicePermissionOnEvent);

		this.chs.on(EventTypes.wsIsAllAppsPermissionOnEvent, this.appEvent.wsIsAllAppsPermissionOnEvent);

		this.chs.on(EventTypes.wsHasSystemPermissionShowedEvent, this.appEvent.wsHasSystemPermissionShowedEvent);

		if (this.commonService.getSessionStorageValue(SessionStorageKey.WidgetWifiStatus)) {
			this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog, 'notShow');
		}

		if (this.chs) {
			if (this.devicePosture && this.wifiSecurity) {
				if (this.wifiSecurity.isLocationServiceOn) {
					this.devicePosture.getDevicePosture();
				}
			}
			this.chs.refresh()
				.then(() => {
					this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog, 'notShow');
				});
			this.getCHSStatus();
		}
	}

	ngAfterViewInit(): void {
		if (this.account.state !== CHSAccountState.local) {
			this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, true);
		}
		this.showWelcomeDialog();
	}

	@HostListener('window: focus')
	onFocus(): void {
		if (this.chs) {
			this.getCHSStatus();
		}
		if (!this.showContentA || !this.showContentB) {
			this.fetchCMSArticles();
		}
	}

	@HostListener('document: visibilitychange')
	onVisibilityChange(): void {
		const visibility = document.visibilityState;
		if (visibility === 'visible') {
			this.getCHSStatus();
		} else if (visibility === 'hidden') {
			this.cancelPullingCHS();
		}
	}

	ngOnDestroy() {
		this.commonService.setSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, false);
		this.cancelPullingCHS();
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		if (this.devicePosture) {
			this.devicePosture.cancelGetDevicePosture();
		}
		this.chs.off(EventTypes.chsEvent, this.appEvent.chsEvent);
		this.chs.off(EventTypes.wsPluginMissingEvent, this.appEvent.wsPluginMissingEvent);
		this.chs.off(EventTypes.devicePostureEvent, this.appEvent.devicePostureEvent);
		this.chs.off(EventTypes.wsIsLocationServiceOnEvent, this.appEvent.wsIsLocationServiceOnEvent);
		this.chs.off(EventTypes.wsIsAllAppsPermissionOnEvent, this.appEvent.wsIsAllAppsPermissionOnEvent);
		this.chs.off(EventTypes.wsIsDevicePermissionOnEvent, this.appEvent.wsIsDevicePermissionOnEvent);
		this.chs.off(EventTypes.wsHasSystemPermissionShowedEvent, this.appEvent.wsHasSystemPermissionShowedEvent);
	}

	showWelcomeDialog() {
		const showPluginMissingDialog = this.commonService.getSessionStorageValue(SessionStorageKey.HomeSecurityShowPluginMissingDialog);
		if (showPluginMissingDialog === 'unknow') {
			setTimeout(this.showWelcomeDialog.bind(this), 16);
		} else if (showPluginMissingDialog === 'notShow') {
			const welcomeComplete = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityWelcomeComplete, false) === true;
			const showWelcome = this.commonService.getLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityShowWelcome, 0);
			if (welcomeComplete) {
				if (this.locationPermission.hasSystemPermissionShowed) {
					if (this.locationPermission.isLocationServiceOn) {
						this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowWelcomeDialog, 'notShow');
						return;
					}
					if (this.chs.account.state !== CHSAccountState.local) {
						this.dialogService.openCHSPermissionModal(this.locationPermission).result.then(() => {
							this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowWelcomeDialog, 'finish');
						});
					}
				} else {
					if (this.chs.account.state !== CHSAccountState.local) {
						this.dialogService.openCHSPermissionModal(this.locationPermission).result.then(() => {
							this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowWelcomeDialog, 'finish');
						});
					}
				}
			} else {
				this.dialogService.openWelcomeModal(showWelcome, this.locationPermission).result.then(() => {
					this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowWelcomeDialog, 'finish');
				});
			}
		} else {
			this.commonService.setSessionStorageValue(SessionStorageKey.HomeSecurityShowWelcomeDialog, 'notShow');
		}
	}

	fetchCMSArticles() {
		const queryOptions = {
			Page: 'connected-home-security',
			Lang: 'EN'
		};

		this.cmsService.fetchCMSContent(queryOptions).subscribe((response: any) => {
			const cardContentPositionA = this.cmsService.getOneCMSContent(
				response,
				'full-width-title-image-background',
				'position-left-content-row-1'
			)[0];
			if (cardContentPositionA) {
				this.showContentA = true;
				this.cardContentPositionA = cardContentPositionA;
			} else {
				this.showContentA = false;
			}

			const cardContentPositionB = this.cmsService.getOneCMSContent(
				response,
				'inner-page-right-side-article-image-background',
				'position-right-sidebar-row-1'
			)[0];
			if (cardContentPositionB) {
				this.showContentB = true;
				this.cardContentPositionB = cardContentPositionB;
				if (this.cardContentPositionB.BrandName) {
					this.cardContentPositionB.BrandName = this.cardContentPositionB.BrandName.split('|')[0];
				}
			} else {
				this.showContentB = false;
			}
		});
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
			});
		}, this.interval);
	}

	private getCHSStatus(): void {
		if (!this.intervalId) {
			this.pullCHS();
		}
	}

	private cancelPullingCHS(): void {
		window.clearInterval(this.intervalId);
		delete this.intervalId;
	}

	private updateHomeSecurityLocationModel(): void {
		this.locationPermission = new DeviceLocationPermission(this.wifiSecurity);
		this.commonService.setLocalStorageValue(LocalStorageKey.ConnectedHomeSecurityLocation, this.locationPermission);
	}
}
