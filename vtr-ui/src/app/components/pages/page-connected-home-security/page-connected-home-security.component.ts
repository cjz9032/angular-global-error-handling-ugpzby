import { Component, OnInit, OnDestroy, HostListener, AfterViewInit } from '@angular/core';
import {
	EventTypes,
	ConnectedHomeSecurity,
	PluginMissingError,
	CHSAccountState,
	WifiSecurity,
	DevicePosture,
	CHSDeviceOverview,
	DeviceCondition,
} from '@lenovo/tan-client-bridge';
import { HomeSecurityAccount } from 'src/app/data-models/home-security/home-security-account.model';
import { HomeSecurityPageStatus } from 'src/app/data-models/home-security/home-security-page-status.model';
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
import { WindowsVersionService } from 'src/app/services/windows-version/windows-version.service';
import { isEqual, pick, cloneDeep, findIndex } from 'lodash';
import { DeviceService } from 'src/app/services/device/device.service';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

@Component({
	selector: 'vtr-page-connected-home-security',
	templateUrl: './page-connected-home-security.component.html',
	styleUrls: ['./page-connected-home-security.component.scss'],
})
export class PageConnectedHomeSecurityComponent implements OnInit, OnDestroy, AfterViewInit {
	pageStatus: HomeSecurityPageStatus;
	url = 'ms-settings:privacy-location';
	chs: ConnectedHomeSecurity;
	devicePosture: DevicePosture;
	wifiSecurity: WifiSecurity;
	permission: any;
	welcomeModel: HomeSecurityWelcome;
	allDevicesInfo: HomeSecurityAllDevice;
	preDeviceOverview: CHSDeviceOverview;
	homeSecurityDevicePosture: HomeSecurityDevicePosture;
	preDevicePostureValue: DeviceCondition[] = [];
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
		FeatureImage: 'assets/images/connected-home-security/card-gamestore.png',
	};
	cardContentPositionB: any = {
		FeatureImage: 'assets/images/connected-home-security/card-gamestore.png',
	};
	devicePostureEventHandler = (devicePosture: DevicePosture) => {
		if (devicePosture && Array.isArray(devicePosture.value) && devicePosture.value.length > 0) {
			if (this.devicePostureHasChange(this.preDevicePostureValue, devicePosture.value)) {
				const cacheDevicePosture = this.localCacheService.getLocalCacheValue(
					LocalStorageKey.ConnectedHomeSecurityDevicePosture
				);
				this.homeSecurityDevicePosture = new HomeSecurityDevicePosture(
					this.windowsVersionService,
					devicePosture,
					cacheDevicePosture,
					this.translateService
				);
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.ConnectedHomeSecurityDevicePosture,
					{
						homeDevicePosture: this.homeSecurityDevicePosture.homeDevicePosture,
					}
				);
			}
		}
	};

	private devicePostureHasChange(
		preDevicePostureValue: DeviceCondition[],
		newDevicePostureValue: DeviceCondition[]
	): boolean {
		let hasChange = false;
		if (isEqual(preDevicePostureValue, newDevicePostureValue)) {
			return false;
		}
		if (preDevicePostureValue.length <= newDevicePostureValue.length) {
			this.preDevicePostureValue = cloneDeep(newDevicePostureValue);
			hasChange = true;
		} else {
			newDevicePostureValue.forEach((item) => {
				const index = findIndex(preDevicePostureValue, { name: item.name });
				if (preDevicePostureValue[index].vulnerable !== item.vulnerable) {
					preDevicePostureValue[index].vulnerable = item.vulnerable;
					hasChange = true;
				}
			});
			if (hasChange) {
				this.preDevicePostureValue = cloneDeep(preDevicePostureValue);
			}
		}
		return hasChange;
	}

	chsEventHandler = (chs: ConnectedHomeSecurity) => {
		if (chs.account) {
			this.common = new HomeSecurityCommon(chs, this.isOnline, this.dialogService);
			this.account = new HomeSecurityAccount(chs, this.common);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.ConnectedHomeSecurityAccount,
				{
					state: this.account.state,
					role: this.account.role,
					expirationDay: this.account.expirationDay,
				}
			);
			if (this.account.state !== CHSAccountState.local) {
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.ConnectedHomeSecurityWelcomeComplete,
					true
				);
			}
		}
		if (chs.deviceOverview) {
			if (this.deviceOverviewHasChange(this.preDeviceOverview, chs.deviceOverview)) {
				this.preDeviceOverview = Object.assign({}, this.chs.deviceOverview);
				this.allDevicesInfo = new HomeSecurityAllDevice(
					this.translateService,
					this.chs.deviceOverview
				);
			}
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.ConnectedHomeSecurityAllDevices,
				this.allDevicesInfo
			);
		}
	};

	private deviceOverviewHasChange(
		preDeviceOverview: CHSDeviceOverview,
		newDeviceOverview: CHSDeviceOverview
	): boolean {
		const attrNeedToCompare = [
			'familyMembersCount',
			'placesCount',
			'personalDevicesCount',
			'wifiNetworkCount',
			'homeDevicesCount',
		];
		return isEqual(
			pick(preDeviceOverview, attrNeedToCompare),
			pick(newDeviceOverview, attrNeedToCompare)
		)
			? false
			: true;
	}

	wsPluginMissingEventHandler = () => {
		this.handleResponseError(new PluginMissingError());
	};
	wsIsLocationServiceOnEventHanler = (location: boolean) => {
		if (location) {
			this.devicePosture.getDevicePosture();
			this.commonService.setSessionStorageValue(
				SessionStorageKey.ChsLocationDialogNextShowFlag,
				true
			);
			if (!this.isOnline) {
				this.dialogService.homeSecurityOfflineDialog();
			}
		}
		this.updateHomeSecurityLocationModel();
	};
	wsIsDevicePermissionOnEventHandler = () => {
		this.updateHomeSecurityLocationModel();
	};
	wsIsAllAppsPermissionOnEventHandler = () => {
		this.updateHomeSecurityLocationModel();
	};
	wsHasSystemPermissionShowedEventHandler = () => {
		this.updateHomeSecurityLocationModel();
	};

	constructor(
		public vantageShellService: VantageShellService,
		public dialogService: DialogService,
		private translateService: TranslateService,
		private modalService: NgbModal,
		private commonService: CommonService,
		private localCacheService: LocalCacheService,
		private cmsService: CMSService,
		private windowsVersionService: WindowsVersionService,
		private deviceService: DeviceService
	) {}

	ngOnInit() {
		this.homeSecurityDevicePosture = new HomeSecurityDevicePosture(this.windowsVersionService);
		this.chs = this.vantageShellService.getConnectedHomeSecurity();
		this.devicePosture = this.vantageShellService.getDevicePosture();
		if (this.vantageShellService.getSecurityAdvisor()) {
			this.wifiSecurity = this.vantageShellService.getSecurityAdvisor().wifiSecurity;
		}
		this.permission = this.vantageShellService.getPermission();
		this.welcomeModel = new HomeSecurityWelcome();
		this.fetchCMSArticles();

		this.commonService.setSessionStorageValue(SessionStorageKey.HomeProtectionInCHSPage, true);
		this.commonService.setSessionStorageValue(
			SessionStorageKey.HomeSecurityShowPluginMissingDialog,
			'unknow'
		);
		this.commonService.setSessionStorageValue(
			SessionStorageKey.HomeSecurityShowWelcomeDialog,
			'unknow'
		);
		this.isOnline = this.commonService.isOnline;
		let cacheIsOnline = true;
		this.notificationSubscription = this.commonService.notification.subscribe(
			(notification: AppNotification) => {
				this.onNotification(notification);
				if (this.common) {
					this.common.isOnline = this.isOnline;
				}
				const showPluginMissingDialog = this.commonService.getSessionStorageValue(
					SessionStorageKey.HomeSecurityShowPluginMissingDialog
				);
				if (showPluginMissingDialog === 'notShow') {
					const showWelcomeDialog = this.commonService.getSessionStorageValue(
						SessionStorageKey.HomeSecurityShowWelcomeDialog
					);
					if (showWelcomeDialog === 'notShow' || showWelcomeDialog === 'finish') {
						if (
							!this.isOnline &&
							this.isOnline !== cacheIsOnline &&
							(this.locationPermission.isLocationServiceOn ||
								this.account.state === CHSAccountState.local)
						) {
							this.dialogService.homeSecurityOfflineDialog();
						}
						cacheIsOnline = this.isOnline;
					}
				}
			}
		);

		const cacheAllDevices = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.ConnectedHomeSecurityAllDevices
		);
		if (cacheAllDevices) {
			this.allDevicesInfo = cacheAllDevices;
		}
		if (this.chs && this.chs.deviceOverview) {
			this.preDeviceOverview = Object.assign({}, this.chs.deviceOverview);
			this.allDevicesInfo = new HomeSecurityAllDevice(
				this.translateService,
				this.chs.deviceOverview
			);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.ConnectedHomeSecurityAllDevices,
				this.allDevicesInfo
			);
		}
		const cacheAccount = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.ConnectedHomeSecurityAccount
		);
		if (cacheAccount) {
			this.account = cacheAccount;
			if (this.chs && this.chs.account) {
				this.common = new HomeSecurityCommon(this.chs, this.isOnline, this.dialogService);
				this.account = new HomeSecurityAccount(this.chs, this.common);
			}
		}
		if (this.chs && this.chs.account && this.chs.account.state) {
			this.common = new HomeSecurityCommon(this.chs, this.isOnline, this.dialogService);
			this.account = new HomeSecurityAccount(this.chs, this.common);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.ConnectedHomeSecurityAccount,
				{
					state: this.account.state,
					role: this.account.role,
					expirationDay: this.account.expirationDay,
				}
			);
			if (this.account.state !== CHSAccountState.local) {
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.ConnectedHomeSecurityWelcomeComplete,
					true
				);
			}
		}
		const cacheDevicePosture = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.ConnectedHomeSecurityDevicePosture
		);
		if (
			this.devicePosture &&
			Array.isArray(this.devicePosture.value) &&
			this.devicePosture.value.length > 0
		) {
			this.preDevicePostureValue = cloneDeep(this.devicePosture.value);
			this.homeSecurityDevicePosture = new HomeSecurityDevicePosture(
				this.windowsVersionService,
				this.devicePosture,
				cacheDevicePosture,
				this.translateService
			);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.ConnectedHomeSecurityDevicePosture,
				{
					homeDevicePosture: this.homeSecurityDevicePosture.homeDevicePosture,
				}
			);
		} else if (cacheDevicePosture) {
			this.homeSecurityDevicePosture = cacheDevicePosture;
		}
		const cacheLocation = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.ConnectedHomeSecurityLocation
		);
		if (this.wifiSecurity) {
			this.wifiSecurity.getWifiSecurityState();
			this.updateHomeSecurityLocationModel();
		} else if (cacheLocation) {
			this.locationPermission = cacheLocation;
		}
		this.chs.on(EventTypes.chsEvent, this.chsEventHandler);
		this.chs.on(EventTypes.wsPluginMissingEvent, this.wsPluginMissingEventHandler);
		this.chs.on(EventTypes.devicePostureEvent, this.devicePostureEventHandler);
		this.chs.on(EventTypes.wsIsLocationServiceOnEvent, this.wsIsLocationServiceOnEventHanler);
		this.chs.on(
			EventTypes.wsIsDevicePermissionOnEvent,
			this.wsIsDevicePermissionOnEventHandler
		);
		this.chs.on(
			EventTypes.wsIsAllAppsPermissionOnEvent,
			this.wsIsAllAppsPermissionOnEventHandler
		);
		this.chs.on(
			EventTypes.wsHasSystemPermissionShowedEvent,
			this.wsHasSystemPermissionShowedEventHandler
		);

		if (this.commonService.getSessionStorageValue(SessionStorageKey.WidgetWifiStatus)) {
			this.commonService.setSessionStorageValue(
				SessionStorageKey.HomeSecurityShowPluginMissingDialog,
				'notShow'
			);
		}

		if (this.chs) {
			if (this.devicePosture && this.wifiSecurity) {
				if (this.wifiSecurity.isLocationServiceOn) {
					this.devicePosture.getDevicePosture();
				}
			}
			this.chs.refresh().then(() => {
				this.commonService.setSessionStorageValue(
					SessionStorageKey.HomeSecurityShowPluginMissingDialog,
					'notShow'
				);
			});
			this.getCHSStatus();
		}
	}

	ngAfterViewInit(): void {
		if (this.account && this.account.state !== CHSAccountState.local) {
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.ConnectedHomeSecurityWelcomeComplete,
				true
			);
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
		if (this.wifiSecurity) {
			this.wifiSecurity.cancelGetWifiSecurityState();
		}
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
		if (this.devicePosture) {
			this.devicePosture.cancelGetDevicePosture();
		}
		this.chs.off(EventTypes.chsEvent, this.chsEventHandler);
		this.chs.off(EventTypes.wsPluginMissingEvent, this.wsPluginMissingEventHandler);
		this.chs.off(EventTypes.devicePostureEvent, this.devicePostureEventHandler);
		this.chs.off(EventTypes.wsIsLocationServiceOnEvent, this.wsIsLocationServiceOnEventHanler);
		this.chs.off(
			EventTypes.wsIsAllAppsPermissionOnEvent,
			this.wsIsAllAppsPermissionOnEventHandler
		);
		this.chs.off(
			EventTypes.wsIsDevicePermissionOnEvent,
			this.wsIsDevicePermissionOnEventHandler
		);
		this.chs.off(
			EventTypes.wsHasSystemPermissionShowedEvent,
			this.wsHasSystemPermissionShowedEventHandler
		);
	}

	showWelcomeDialog() {
		const showPluginMissingDialog = this.commonService.getSessionStorageValue(
			SessionStorageKey.HomeSecurityShowPluginMissingDialog
		);
		if (showPluginMissingDialog === 'unknow') {
			setTimeout(this.showWelcomeDialog.bind(this), 16);
		} else if (showPluginMissingDialog === 'notShow') {
			const welcomeComplete =
				this.localCacheService.getLocalCacheValue(
					LocalStorageKey.ConnectedHomeSecurityWelcomeComplete,
					false
				) === true;
			const showWelcome = this.localCacheService.getLocalCacheValue(
				LocalStorageKey.ConnectedHomeSecurityShowWelcome,
				0
			);
			if (welcomeComplete) {
				if (
					(this.locationPermission &&
						this.locationPermission.hasSystemPermissionShowed &&
						this.locationPermission.isLocationServiceOn) ||
					this.chs.account.state === CHSAccountState.local
				) {
					this.commonService.setSessionStorageValue(
						SessionStorageKey.HomeSecurityShowWelcomeDialog,
						'notShow'
					);
					return;
				}
			} else {
				this.dialogService
					.openWelcomeModal(showWelcome, this.locationPermission)
					.result.then(() => {
						this.commonService.setSessionStorageValue(
							SessionStorageKey.HomeSecurityShowWelcomeDialog,
							'finish'
						);
					});
			}
		}
	}

	fetchCMSArticles() {
		const queryOptions = {
			Page: 'connected-home-security',
			Lang: 'EN',
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
					this.cardContentPositionB.BrandName = this.cardContentPositionB.BrandName.split(
						'|'
					)[0];
				}
			} else {
				this.showContentB = false;
			}
		});
		this.cmsService
			.fetchCMSArticle(this.devicePostureArticleId, { Lang: 'EN' })
			.then((response: any) => {
				if (response && response.Results && response.Results.Category) {
					this.devicePostureArticleCategory = response.Results.Category.map(
						(category: any) => category.Title
					).join(' ');
				}
			});
	}

	openDevicePostureArticle(): void {
		const articleDetailModal: NgbModalRef = this.modalService.open(
			ModalArticleDetailComponent,
			{
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
				},
			}
		);

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
		const showPluginMissing = this.commonService.getSessionStorageValue(
			SessionStorageKey.HomeSecurityShowPluginMissingDialog
		);
		if (err instanceof PluginMissingError) {
			if (this.common) {
				this.common.startTrialDisabled = true;
			}
			if (showPluginMissing !== 'show' && showPluginMissing !== 'finish') {
				this.commonService.setSessionStorageValue(
					SessionStorageKey.HomeSecurityShowPluginMissingDialog,
					'show'
				);
				this.dialogService.homeSecurityPluginMissingDialog();
			}
		} else {
			this.commonService.setSessionStorageValue(
				SessionStorageKey.HomeSecurityShowPluginMissingDialog,
				'notShow'
			);
		}
	}

	private pullCHS(): void {
		this.intervalId = window.setInterval(() => {
			this.chs.refresh().then(() => {
				this.commonService.setSessionStorageValue(
					SessionStorageKey.HomeSecurityShowPluginMissingDialog,
					'notShow'
				);
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
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.ConnectedHomeSecurityLocation,
			this.locationPermission
		);
	}

	launchLocationSettings() {
		if (
			this.locationPermission &&
			this.locationPermission.isAllAppsServiceOn &&
			this.locationPermission.isDeviceServiceOn &&
			!this.locationPermission.hasSystemPermissionShowed
		) {
			this.requestVantagePermission();
		} else {
			this.permission.openSettingsApp(this.url);
		}
	}

	requestVantagePermission() {
		this.permission.requestPermission('geoLocatorStatus').then((status: boolean) => {
			if (status) {
				this.localCacheService.setLocalCacheValue(
					LocalStorageKey.ConnectedHomeSecurityWelcomeComplete,
					true
				);
			}
		});
	}
}
