import {
	Component,
	OnInit,
	HostListener,
	NgZone,
	OnDestroy
} from '@angular/core';
import {
	VantageShellService
} from '../../../services/vantage-shell/vantage-shell.service';
import * as phoenix from '@lenovo/tan-client-bridge';
import {
	CMSService
} from '../../../services/cms/cms.service';
import {
	AntiVirusLandingViewModel
} from '../../../data-models/security-advisor/widegt-security-landing/antivirus-landing.model';
import {
	PasswordManagerLandingViewModel
} from '../../../data-models/security-advisor/widegt-security-landing/passwordmanager-landing.model';
import {
	VpnLandingViewModel
} from '../../../data-models/security-advisor/widegt-security-landing/vpn-landing.model';
import {
	WifiSecurityLandingViewModel
} from '../../../data-models/security-advisor/widegt-security-landing/wifisecurity-landing.model';
import {
	CommonService
} from 'src/app/services/common/common.service';
import {
	TranslateService
} from '@ngx-translate/core';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { AppNotification } from 'src/app/data-models/common/app-notification.model';
import { NetworkStatus } from 'src/app/enums/network-status.enum';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { WindowsHelloService } from 'src/app/services/security/windowsHello.service';
import { FingerPrintLandingViewModel } from 'src/app/data-models/security-advisor/widegt-security-landing/fingerPrint-landing.model';
import { WindowsActiveLandingViewModel } from 'src/app/data-models/security-advisor/widegt-security-landing/windowsActive-landing.model';
import { UacLandingViewModel } from 'src/app/data-models/security-advisor/widegt-security-landing/uac-landing.model';
import { BitLockerLandingViewModel } from 'src/app/data-models/security-advisor/widegt-security-landing/bitLocker-landing.model';
import { SecurityTypeConst } from 'src/app/data-models/security-advisor/status-info.model';
import { AntivirusErrorHandle } from 'src/app/data-models/security-advisor/antivirus-error-handle.model';
import { DeviceService } from 'src/app/services/device/device.service';
import { HypothesisService } from 'src/app/services/hypothesis/hypothesis.service';
import { LandingView } from 'src/app/data-models/security-advisor/widegt-security-landing/landing-view.model';


@Component({
	selector: 'vtr-page-security',
	templateUrl: './page-security.component.html',
	styleUrls: ['./page-security.component.scss']
})

export class PageSecurityComponent implements OnInit, OnDestroy {
	passwordManagerLandingViewModel: PasswordManagerLandingViewModel;
	antivirusLandingViewModel: AntiVirusLandingViewModel;
	vpnLandingViewModel: VpnLandingViewModel;
	wifiSecurityLandingViewModel: WifiSecurityLandingViewModel;
	fingerPrintLandingViewModel: FingerPrintLandingViewModel;
	windowsActiveLandingViewModel: WindowsActiveLandingViewModel;
	bitLockerLandingViewModel: BitLockerLandingViewModel;
	uacLandingViewModel: UacLandingViewModel;
	windowsActive: phoenix.WindowsActivation;
	uac: phoenix.UAC;
	bitLocker: phoenix.BitLocker;
	securityAdvisor: phoenix.SecurityAdvisor;
	antivirus: phoenix.Antivirus;
	wifiSecurity: phoenix.WifiSecurity;
	passwordManager: phoenix.PasswordManager;
	vpn: phoenix.Vpn;
	windowsHello: phoenix.WindowsHello;
	cardContentPositionA: any = {};
	isOnline: boolean;
	notificationSubscription: Subscription;
	showVpn: boolean;
	baseItems = [];
	intermediateItems = [];
	advanceItems = [];
	landingStatus: LandingView;
	pluginSupport = true;

	constructor(
		public vantageShellService: VantageShellService,
		private cmsService: CMSService,
		private commonService: CommonService,
		private translate: TranslateService,
		private deviceService: DeviceService,
		private ngZone: NgZone,
		private router: Router,
		private windowsHelloService: WindowsHelloService,
		private hypSettings: HypothesisService
	) { }

	@HostListener('window: focus')
	onFocus(): void {
		this.refreshAll();
	}

	ngOnInit() {
		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
		this.passwordManager = this.securityAdvisor.passwordManager;
		this.antivirus = this.securityAdvisor.antivirus;
		this.vpn = this.securityAdvisor.vpn;
		this.wifiSecurity = this.securityAdvisor.wifiSecurity;
		this.windowsHello = this.securityAdvisor.windowsHello;
		this.uac = this.securityAdvisor.uac;
		this.windowsActive = this.securityAdvisor.windowsActivation;
		this.bitLocker = this.securityAdvisor.bitLocker;
		this.isOnline = this.commonService.isOnline;
		this.landingStatus = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingLevel);
		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});

		if (this.wifiSecurity) {
			this.wifiSecurity.getWifiSecurityState();
		}
		this.refreshAll();
		this.deviceService.getMachineInfo().then(result => {
			this.showVpn = true;
			if ((result && result.country ? result.country : 'US').toLowerCase() === 'cn') {
				this.showVpn = false;
			}
			if (this.wifiSecurity) {
				this.wifiSecurity.getWifiSecurityState();
			}
			this.refreshAll();
		}).catch(e => {
			this.showVpn = true;
		}).finally(() => {
			this.hypSettings.getFeatureSetting('SecurityAdvisor').then((result) => {
				this.pluginSupport = result === 'true';
			}).catch((e) => {
				this.pluginSupport = false;
			}).finally(() => {
				this.createViewModels();
			});
		});
		this.fetchCMSArticles();
		const antivirus = new AntivirusErrorHandle(this.antivirus);
		antivirus.refreshAntivirus();
	}

	ngOnDestroy() {
		if (this.router.routerState.snapshot.url.indexOf('security') === -1 && this.wifiSecurity) {
			this.wifiSecurity.cancelGetWifiSecurityState();
		}
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	private refreshAll() {
		this.securityAdvisor.refresh().then(() => {
			this.ngZone.run(() => {
				this.updateViewModels();
				this.updateStatus();
			});
		});
	}

	createViewModels() {
		this.antivirusLandingViewModel = new AntiVirusLandingViewModel(this.translate, this.antivirus, this.commonService);
		this.windowsActiveLandingViewModel = new WindowsActiveLandingViewModel(this.translate, this.windowsActive, this.commonService);
		this.passwordManagerLandingViewModel = new PasswordManagerLandingViewModel(this.translate, this.passwordManager, this.commonService);
		this.uacLandingViewModel = new UacLandingViewModel(this.translate, this.uac, this.commonService);
		this.bitLockerLandingViewModel = new BitLockerLandingViewModel(this.translate, this.bitLocker, this.commonService);
		if (this.showVpn) {
			this.vpnLandingViewModel = new VpnLandingViewModel(this.translate, this.vpn, this.commonService);
		} else {
			this.vpnLandingViewModel = undefined;
		}
		const cacheShowWindowsHello = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowWindowsHello);
		const cacheShowWifiSecurity = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity);
		if (cacheShowWindowsHello) {
			this.fingerPrintLandingViewModel = new FingerPrintLandingViewModel(this.translate, this.windowsHello, this.commonService);
		}
		if (cacheShowWifiSecurity || this.wifiSecurity.isSupported) {
			this.wifiSecurityLandingViewModel = new WifiSecurityLandingViewModel(this.translate, this.wifiSecurity, this.commonService, this.ngZone);
		}
		this.windowsHello.on(phoenix.EventTypes.helloFingerPrintStatusEvent, () => {
			this.showWindowsHelloItem(this.windowsHello);
			this.updateViewModels();
		});
		this.updateStatus();
		this.wifiSecurity.on(phoenix.EventTypes.wsIsSupportWifiEvent, () => {
			this.showWifiSecurityItem();
			this.updateViewModels();
		}).on(phoenix.EventTypes.wsStateEvent, () => {
			this.updateStatus();
		}).on(phoenix.EventTypes.wsIsLocationServiceOnEvent, () => {
			this.ngZone.run(() => {
				this.updateStatus();
			});
		});
		this.updateViewModels();
		this.securityAdvisor.refresh();
	}

	updateViewModels() {
		this.baseItems = [];
		this.intermediateItems = [];
		this.advanceItems = [];
		if (!this.pluginSupport) {
			this.windowsActiveLandingViewModel = undefined;
			this.uacLandingViewModel = undefined;
			this.bitLockerLandingViewModel = undefined;
		}
		this.baseItems.push(this.antivirusLandingViewModel.avStatus,
			this.antivirusLandingViewModel.fwStatus,
			this.windowsActiveLandingViewModel ? this.windowsActiveLandingViewModel.waStatus : undefined);
		this.intermediateItems.push(
			this.passwordManagerLandingViewModel.pmStatus,
			this.fingerPrintLandingViewModel ? this.fingerPrintLandingViewModel.whStatus : undefined,
			this.uacLandingViewModel ? this.uacLandingViewModel.uacStatus : undefined);
		this.advanceItems.push(
			this.wifiSecurityLandingViewModel ? this.wifiSecurityLandingViewModel.wfStatus : undefined,
			this.bitLockerLandingViewModel ? this.bitLockerLandingViewModel.blStatus : undefined,
			this.vpnLandingViewModel ? this.vpnLandingViewModel.vpnStatus : undefined);
		this.baseItems = this.baseItems.filter(i => i !== undefined && i !== null);
		this.intermediateItems = this.intermediateItems.filter(i => i !== undefined && i !== null);
		this.advanceItems = this.advanceItems.filter(i => i !== undefined && i !== null);
	}

	public updateStatus(haveOwnList?) {
		const statusList = {
			basic: [],
			intermediate: [],
			advanced: []
		};
		if (!this.pluginSupport) {
			this.windowsActiveLandingViewModel = undefined;
			this.uacLandingViewModel = undefined;
			this.bitLockerLandingViewModel = undefined;
		}
		statusList.basic = new Array(
			this.antivirusLandingViewModel.avStatus.status,
			this.antivirusLandingViewModel.fwStatus.status,
			this.windowsActiveLandingViewModel ? this.windowsActiveLandingViewModel.waStatus.status : undefined
		).filter(i => i !== undefined);
		let pmOwnStatus;
		let wfOwnStatus;
		let vpnOwnStatus;
		if (haveOwnList) {
			pmOwnStatus = haveOwnList.passwordManager === true;
			wfOwnStatus = haveOwnList.wifiSecurity === true;
			vpnOwnStatus = haveOwnList.vpn === true;
		} else {
			pmOwnStatus = this.passwordManagerLandingViewModel.pmStatus.showOwn === true;
			wfOwnStatus = this.wifiSecurityLandingViewModel ? this.wifiSecurityLandingViewModel.wfStatus.showOwn === true : undefined;
			vpnOwnStatus = this.vpnLandingViewModel ? (this.vpnLandingViewModel.vpnStatus.showOwn === true) : undefined;
		}
		statusList.intermediate = new Array(
			pmOwnStatus ? 'true' : this.passwordManagerLandingViewModel.pmStatus.status,
			this.fingerPrintLandingViewModel ? this.fingerPrintLandingViewModel.whStatus.status : undefined,
			this.uacLandingViewModel ? this.uacLandingViewModel.uacStatus.status : undefined
		).filter(i => i !== undefined);
		statusList.advanced = new Array(
			wfOwnStatus ? 'true' : this.wifiSecurityLandingViewModel ? this.wifiSecurityLandingViewModel.wfStatus.status : undefined,
			this.bitLockerLandingViewModel ? this.bitLockerLandingViewModel.blStatus.status : undefined,
			vpnOwnStatus ? 'true' : this.vpnLandingViewModel ? this.vpnLandingViewModel.vpnStatus.status : undefined,
		).filter(i => i !== undefined);

		this.getLevelStatus(statusList);
	}

	public getLevelStatus(statusList) {
		const levelStatus = {
			basicValid: 0,
			basicSuccess: false,
			basicLength: 0,
			intermediateValid: 0,
			intermediateSuccess: false,
			intermediateLength: 0,
			advancedValid: 0,
			advancedSuccess: false,
			advancedLength: 0
		};
		for (const key in statusList) {
			if (statusList.hasOwnProperty(key)) {
				const element = statusList[key];
				switch (key) {
					case SecurityTypeConst.Basic:
						levelStatus.basicValid = element.filter(i => i === 'true' || i === 'enabled' || i === 'installed' || i === 'registered').length;
						levelStatus.basicSuccess = element.length === levelStatus.basicValid;
						levelStatus.basicLength = element.length;
						break;
					case SecurityTypeConst.Intermediate:
						levelStatus.intermediateValid = element.filter(i => i === 'true' || i === 'enabled' || i === 'installed' || i === 'registered').length;
						levelStatus.intermediateSuccess = element.length === levelStatus.intermediateValid;
						levelStatus.intermediateLength = element.length;
						break;
					case SecurityTypeConst.Advanced:
						levelStatus.advancedValid = element.filter(i => i === 'true' || i === 'enabled' || i === 'installed' || i === 'registered').length;
						levelStatus.advancedSuccess = element.length === levelStatus.advancedValid;
						levelStatus.advancedLength = element.length;
						break;
					default:
						break;
				}
			}
		}
		this.calcSecurityLevel(levelStatus);
	}

	public calcSecurityLevel(levelStatus) {
		this.landingStatus = new LandingView();
		const allItems = levelStatus.basicLength + levelStatus.intermediateLength + levelStatus.advancedLength;
		if (levelStatus.basicValid > 0) {
			if (levelStatus.intermediateValid > 0 && levelStatus.basicSuccess) {
				if (levelStatus.advancedValid > 0 && levelStatus.intermediateSuccess) {
					this.landingStatus.status = 3;
					this.landingStatus.fullyProtected = true;
					this.landingStatus.percent = (levelStatus.advancedValid + levelStatus.basicLength + levelStatus.intermediateLength) / allItems;
				} else {
					this.landingStatus.status = 2;
					this.landingStatus.fullyProtected = false;
					this.landingStatus.percent = (levelStatus.intermediateValid + levelStatus.basicLength) / allItems;
				}
			} else {
				this.landingStatus.status = 1;
				this.landingStatus.fullyProtected = false;
				this.landingStatus.percent = (levelStatus.basicValid) / allItems;
			}

		} else {
			this.landingStatus.status = 0;
			this.landingStatus.fullyProtected = false;
			this.landingStatus.percent = 0;
		}

		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingLevel, this.landingStatus);
	}

	fetchCMSArticles() {
		const queryOptions = {
			Page: 'security'
		};

		this.cmsService.fetchCMSContent(queryOptions).subscribe(
			(response: any) => {
				const cardContentPositionA = this.cmsService.getOneCMSContent(response, 'inner-page-right-side-article-image-background', 'position-A')[0];
				if (cardContentPositionA) {
					this.cardContentPositionA = cardContentPositionA;
					if (this.cardContentPositionA.BrandName) {
						this.cardContentPositionA.BrandName = this.cardContentPositionA.BrandName.split('|')[0];
					}
				}
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}

	showWindowsHelloItem(windowsHello: phoenix.WindowsHello) {
		if (this.windowsHelloService.showWindowsHello(this.windowsHello)) {
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWindowsHello, true);
			this.fingerPrintLandingViewModel = new FingerPrintLandingViewModel(this.translate, windowsHello, this.commonService);
		} else {
			this.fingerPrintLandingViewModel = null;
		}
	}

	showWifiSecurityItem() {
		if (this.wifiSecurity.isSupported) {
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity, true);
			this.wifiSecurityLandingViewModel = new WifiSecurityLandingViewModel(this.translate, this.wifiSecurity, this.commonService, this.ngZone);
		} else {
			this.wifiSecurityLandingViewModel = null;
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
}
