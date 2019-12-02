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
import {
	EventTypes
} from '@lenovo/tan-client-bridge';
import {
	LocalStorageKey
} from '../../../enums/local-storage-key.enum';
import {
	AppNotification
} from 'src/app/data-models/common/app-notification.model';
import {
	NetworkStatus
} from 'src/app/enums/network-status.enum';
import { GuardService } from '../../../services/guard/guardService.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { WindowsHelloService } from 'src/app/services/security/windowsHello.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';
import { FingerPrintLandingViewModel } from 'src/app/data-models/security-advisor/widegt-security-landing/fingerPrint-landing.model';
import { WindowsActiveLandingViewModel } from 'src/app/data-models/security-advisor/widegt-security-landing/windowsActive-landing.model';
import { UacLandingViewModel } from 'src/app/data-models/security-advisor/widegt-security-landing/uac-landing.model';
import { BitLockerLandingViewModel } from 'src/app/data-models/security-advisor/widegt-security-landing/bitLocker-landing.model';
import { SecurityTypeConst } from 'src/app/data-models/security-advisor/status-info.model';


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
	windowsActive;
	uac;
	bitLocker;
	securityAdvisor: phoenix.SecurityAdvisor;
	antivirus: phoenix.Antivirus;
	wifiSecurity: phoenix.WifiSecurity;
	passwordManager: phoenix.PasswordManager;
	vpn: phoenix.Vpn;
	windowsHello: phoenix.WindowsHello;
	// statusList: any;
	maliciousWifi: number;
	cardContentPositionA: any = {};
	isOnline: boolean;
	notificationSubscription: Subscription;
	showVpn: boolean;
	isRS5OrLater: boolean;
	baseItems = [];
	intermediateItems = [];
	advanceItems = [];
	statusItem: any;

	constructor(
		public vantageShellService: VantageShellService,
		private cmsService: CMSService,
		private commonService: CommonService,
		private translate: TranslateService,
		private localInfoService: LocalInfoService,
		private ngZone: NgZone,
		private guard: GuardService,
		private router: Router,
		private windowsHelloService: WindowsHelloService
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

		this.createViewModels();
		this.isOnline = this.commonService.isOnline;

		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});

		if (this.wifiSecurity) {
			this.wifiSecurity.getWifiSecurityState();
		}
		this.refreshAll();

		this.localInfoService.getLocalInfo().then(result => {
			this.showVpn = true;
			if (result.GEO === 'cn') {
				this.showVpn = false;
			}
			if (this.wifiSecurity) {
				this.wifiSecurity.getWifiSecurityState();
			}
			this.refreshAll();
		}).catch(e => {
			this.showVpn = true;
		}).finally(() => {
			this.getLevelStatus();
		});
		this.fetchCMSArticles();
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
			this.getLevelStatus();
		});
	}

	createViewModels() {
		this.antivirusLandingViewModel = new AntiVirusLandingViewModel(this.translate, this.antivirus, this.commonService);
		this.windowsActiveLandingViewModel = new WindowsActiveLandingViewModel(this.translate, this.windowsActive, this.commonService);
		this.passwordManagerLandingViewModel = new PasswordManagerLandingViewModel(this.translate, this.passwordManager, this.commonService);
		this.vpnLandingViewModel = new VpnLandingViewModel(this.translate, this.vpn, this.commonService);
		this.uacLandingViewModel = new UacLandingViewModel(this.translate, this.uac, this.commonService);
		this.bitLockerLandingViewModel = new BitLockerLandingViewModel(this.translate, this.bitLocker, this.commonService);
		this.baseItems.push(this.antivirusLandingViewModel.avStatus, this.antivirusLandingViewModel.fwStatus, this.windowsActiveLandingViewModel.waStatus);
		const windowsHello = this.securityAdvisor.windowsHello;
		const cacheShowWindowsHello = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowWindowsHello);
		const cacheShowWifiSecurity = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowWifiSecurity);
		const wifiSecurity = this.securityAdvisor.wifiSecurity;
		if (cacheShowWindowsHello) {
			this.fingerPrintLandingViewModel = new FingerPrintLandingViewModel(this.translate, windowsHello, this.commonService);
		}
		if (cacheShowWifiSecurity) {
			this.wifiSecurityLandingViewModel = new WifiSecurityLandingViewModel(this.translate, this.wifiSecurity, this.commonService, this.ngZone);
		}
		if (windowsHello.fingerPrintStatus) {
			this.showWindowsHelloItem(windowsHello);
		}
		this.intermediateItems.push(this.passwordManagerLandingViewModel.pmStatus,
			this.fingerPrintLandingViewModel ? this.fingerPrintLandingViewModel.whStatus : undefined,
			this.uacLandingViewModel.uacStatus);
		this.intermediateItems = this.intermediateItems.filter(i => i !== undefined && i !== null);
		if (wifiSecurity.isSupported !== undefined) {
			this.showWifiSecurityItem();
		}
		this.advanceItems.push(this.wifiSecurityLandingViewModel.wfStatus,
			this.bitLockerLandingViewModel.blStatus,
			this.vpnLandingViewModel ? this.vpnLandingViewModel.vpnStatus : undefined);
		this.advanceItems = this.advanceItems.filter(i => i !== undefined && i !== null);
		windowsHello.on(EventTypes.helloFingerPrintStatusEvent, () => {
			this.showWindowsHelloItem(windowsHello);
		});
		this.getLevelStatus();
		wifiSecurity.on(EventTypes.wsIsSupportWifiEvent, () => {
			this.showWifiSecurityItem();
		});
		wifiSecurity.on(EventTypes.wsStateEvent, () => {
			this.getLevelStatus();
		}).on(EventTypes.wsIsLocationServiceOnEvent, (data) => {
			this.ngZone.run(() => {
				this.getLevelStatus();
			});
		});

		this.securityAdvisor.refresh();
	}

	public getLevelStatus() {
		const statusList = {
			basic: [],
			intermediate: [],
			advanced: []
		};
		statusList.basic = new Array(
			this.antivirusLandingViewModel.avStatus.status,
			this.antivirusLandingViewModel.fwStatus.status,
			this.windowsActiveLandingViewModel.waStatus.status
		).filter(i => i !== undefined);
		statusList.intermediate = new Array(
			this.passwordManagerLandingViewModel.pmStatus.status,
			this.fingerPrintLandingViewModel ? this.fingerPrintLandingViewModel.whStatus.status : undefined,
			this.uacLandingViewModel.uacStatus.status
		).filter(i => i !== undefined);
		statusList.advanced = new Array(
			this.wifiSecurityLandingViewModel.wfStatus.status,
			this.bitLockerLandingViewModel.blStatus.status,
			this.vpnLandingViewModel.vpnStatus.status,
		).filter(i => i !== undefined);

		const levelStatus = {
			basicValid: 0,
			basicSuccess: false,
			intermediateValid: 0,
			intermediateSuccess: false,
			advancedValid: 0,
			advancedSuccess: false
		};
		for (const key in statusList) {
			if (statusList.hasOwnProperty(key)) {
				const element = statusList[key];
				switch (key) {
					case SecurityTypeConst.Basic:
						levelStatus.basicValid = element.filter(i => i === true || i === 'enabled' || i === 'installed' || i === 'registered').length;
						levelStatus.basicSuccess = element.length === levelStatus.basicValid;
						break;
					case SecurityTypeConst.Intermediate:
						levelStatus.intermediateValid = element.filter(i => i === true || i === 'enabled' || i === 'installed' || i === 'registered').length;
						levelStatus.intermediateSuccess = element.length === levelStatus.intermediateValid;
						break;
					case SecurityTypeConst.Advanced:
						levelStatus.advancedValid = element.filter(i => i === true || i === 'enabled' || i === 'installed' || i === 'registered').length;
						levelStatus.advancedSuccess = element.length === levelStatus.advancedValid;
						break;
					default:
						break;
				}
			}
		}
		const item = {
			status: 0,
			fullyProtected: false,
			icon: 0
		};
		if (levelStatus.basicValid > 0 || levelStatus.intermediateValid > 0 || levelStatus.advancedValid > 0) {
			if (levelStatus.intermediateValid > 0 && levelStatus.basicSuccess) {
				if (levelStatus.advancedValid > 0 && levelStatus.intermediateSuccess) {
					item.status = 3;
					item.fullyProtected = true;
					item.icon = levelStatus.advancedValid;
				} else {
					item.status = 2;
					item.fullyProtected = false;
					item.icon = levelStatus.intermediateValid;
				}
			} else {
				item.status = 1;
				item.fullyProtected = false;
				item.icon = levelStatus.basicValid;
			}

		} else {
			item.status = 0;
			item.fullyProtected = false;
			item.icon = 0;
		}

		this.statusItem = item;
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
		if (this.windowsHelloService.showWindowsHello()) {
			this.fingerPrintLandingViewModel = new FingerPrintLandingViewModel(this.translate, windowsHello, this.commonService);
		} else {
			this.fingerPrintLandingViewModel = null;
		}
	}

	showWifiSecurityItem() {
		if (this.wifiSecurity.isSupported) {
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
