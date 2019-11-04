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
} from '../../../data-models/security-advisor/antivirus-landing.model';
import {
	PasswordManagerLandingViewModel
} from '../../../data-models/security-advisor/passwordmanager-landing.model';
import {
	VpnLandingViewModel
} from '../../../data-models/security-advisor/vpn-landing.model';
import {
	WifiSecurityLandingViewModel
} from '../../../data-models/security-advisor/wifisecurity-landing.model';
import {
	WindowsHelloLandingViewModel
} from '../../../data-models/security-advisor/windowshello-landing.model';
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
import { SecurityAdvisorMockService } from 'src/app/services/security/securityMock.service';
import { GuardService } from '../../../services/guard/security-guardService.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { WindowsHelloService } from 'src/app/services/security/windowsHello.service';
import { LocalInfoService } from 'src/app/services/local-info/local-info.service';


@Component({
	selector: 'vtr-page-security',
	templateUrl: './page-security.component.html',
	styleUrls: ['./page-security.component.scss']
})

export class PageSecurityComponent implements OnInit, OnDestroy {
	passwordManagerLandingViewModel: PasswordManagerLandingViewModel;
	antivirusLandingViewModel: AntiVirusLandingViewModel;
	vpnLandingViewModel: VpnLandingViewModel;
	windowsHelloLandingViewModel: WindowsHelloLandingViewModel;
	wifiSecurityLandingViewModel: WifiSecurityLandingViewModel;
	wifiHistory: Array<phoenix.WifiDetail>;
	securityAdvisor: phoenix.SecurityAdvisor;
	antivirus: phoenix.Antivirus;
	wifiSecurity: phoenix.WifiSecurity;
	passwordManager: phoenix.PasswordManager;
	vpn: phoenix.Vpn;
	windowsHello: phoenix.WindowsHello;
	score: number;
	maliciousWifi: number;
	cardContentPositionA: any = {};
	isOnline: boolean;
	notificationSubscription: Subscription;
	showVpn: boolean;
	backId = 'sa-ov-btn-back';
	isRS5OrLater: boolean;
	itemStatusClass = {
		0: 'good',
		1: 'orange',
		2: 'bad'
	};
	itemDetail = {
		0: 'security.landing.good',
		1: 'security.landing.suspicious',
		2: 'security.landing.malicious'
	};

	constructor(
		public vantageShellService: VantageShellService,
		private cmsService: CMSService,
		private commonService: CommonService,
		private translate: TranslateService,
		private localInfoService: LocalInfoService,
		private ngZone: NgZone,
		private securityAdvisorMockService: SecurityAdvisorMockService,
		private guard: GuardService,
		private router: Router,
		private windowsHelloService: WindowsHelloService
	) {	}

	@HostListener('window: focus')
	onFocus(): void {
		this.refreshAll();
	}

	ngOnInit() {
		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
		if (!this.securityAdvisor) {
			this.securityAdvisor = this.securityAdvisorMockService.getSecurityAdvisor();
		}
		this.passwordManager = this.securityAdvisor.passwordManager;
		this.antivirus = this.securityAdvisor.antivirus;
		this.vpn = this.securityAdvisor.vpn;
		this.wifiSecurity = this.securityAdvisor.wifiSecurity;

		this.createViewModels();
		this.score = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingScore, 0);
		this.maliciousWifi = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingMaliciousWifi, 0);
		this.isOnline = this.commonService.isOnline;

		this.notificationSubscription = this.commonService.notification.subscribe((notification: AppNotification) => {
			this.onNotification(notification);
		});
		this.localInfoService.getLocalInfo().then(result => {
			this.showVpn = true;
			if (result.GEO === 'cn') {
				this.showVpn = false;
			}
			if (this.guard.previousPageName !== 'Dashboard' && !this.guard.previousPageName.startsWith('Security')) {
				this.refreshAll();
			} else {
				this.getScore();
				this.getMaliciousWifi();
			}
		}).catch(e => {
			this.showVpn = true;
		});
		this.fetchCMSArticles();
	}

	ngOnDestroy() {
		if (this.router.routerState.snapshot.url.indexOf('security') === -1 && this.router.routerState.snapshot.url.indexOf('dashboard') === -1) {
			if (this.wifiSecurity) {
				this.wifiSecurity.cancelGetWifiSecurityState();
			}
		}
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	private refreshAll() {
		this.securityAdvisor.antivirus.refresh().then(() => {
			this.getScore();
		});
		this.securityAdvisor.wifiSecurity.refresh().then(() => {
			this.getMaliciousWifi();
		});
		this.securityAdvisor.wifiSecurity.getWifiSecurityState().then(() => {
			this.getScore();
		});
		this.securityAdvisor.passwordManager.refresh().then(() => {
			this.getScore();
		});
		this.securityAdvisor.vpn.refresh().then(() => {
			this.getScore();
		});
		this.securityAdvisor.windowsHello.refresh().then(() => {
			this.getScore();
		});
	}

	createViewModels() {
		this.antivirusLandingViewModel = new AntiVirusLandingViewModel(this.translate, this.antivirus, this.commonService);
		this.passwordManagerLandingViewModel = new PasswordManagerLandingViewModel(this.translate, this.passwordManager, this.commonService);
		this.vpnLandingViewModel = new VpnLandingViewModel(this.translate, this.vpn, this.commonService);
		this.wifiSecurityLandingViewModel = new WifiSecurityLandingViewModel(this.translate, this.wifiSecurity, this.commonService, this.ngZone);
		this.wifiHistory = this.wifiSecurityLandingViewModel.wifiHistory;
		const windowsHello = this.securityAdvisor.windowsHello;
		const cacheShowWindowsHello = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowWindowsHello);
		const wifiSecurity = this.securityAdvisor.wifiSecurity;
		if (cacheShowWindowsHello) {
			this.windowsHelloLandingViewModel = new WindowsHelloLandingViewModel(this.translate, windowsHello, this.commonService);
		}
		if (windowsHello.fingerPrintStatus) {
			this.showWindowsHelloItem(windowsHello);
		}
		windowsHello.on(EventTypes.helloFingerPrintStatusEvent, () => {
			this.showWindowsHelloItem(windowsHello);
		});
		wifiSecurity.on(EventTypes.wsStateEvent, () => {
			this.getScore();
		}).on(EventTypes.wsIsLocationServiceOnEvent, (data) => {
			this.ngZone.run(() => {
				this.getScore();
			});
		});

		// this.securityAdvisor.refresh();
	}

	getWifiStatus(good: string) {
		let itemStatClass = 'good';
		if (good) {
			if (this.itemStatusClass.hasOwnProperty(Number(good))) {
				itemStatClass = this.itemStatusClass[Number(good)];
			}
		}
		return itemStatClass;
	}

	getWifiDetail(good: string) {
		let itemDetail = 'good';
		if (good) {
			if (this.itemDetail.hasOwnProperty(Number(good))) {
				itemDetail = this.itemDetail[Number(good)];
				this.translate.stream(itemDetail).subscribe((res) => {
					itemDetail = res;
				});
			}
		}
		return itemDetail;
	}

	private getMaliciousWifi() {
		const wifiHistoryList = this.wifiHistory;
		if (wifiHistoryList && wifiHistoryList.length !== 0) {
			this.maliciousWifi = wifiHistoryList.filter(wifi => {
				const connected = new Date(wifi.info);
				const monthFirst = new Date();
				monthFirst.setDate(1);
				monthFirst.setHours(0);
				monthFirst.setMinutes(0);
				monthFirst.setSeconds(0);
				return wifi.good !== '0' && connected > monthFirst;
			}).length;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingMaliciousWifi, this.maliciousWifi);
		}
	}

	public getScore() {
		const antivirusScoreInit = [
			this.antivirusLandingViewModel.subject.status,
			this.passwordManagerLandingViewModel.subject.status,
			this.showVpn ? this.vpnLandingViewModel.subject.status : null,
			this.wifiSecurityLandingViewModel.subject.status,
			this.windowsHelloLandingViewModel ? this.windowsHelloLandingViewModel.subject.status : null
		];
		const antivirusScore = antivirusScoreInit.filter(current => {
			return current !== undefined && current !== null;
		});
		const valid = antivirusScore.filter(i => i === 0 || i === 2).length;
		this.score = Math.floor(valid / antivirusScore.length * 100);
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingScore, this.score);
		this.securityAdvisor.setScoreRegistry(this.score);
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
			this.windowsHelloLandingViewModel = new WindowsHelloLandingViewModel(this.translate, windowsHello, this.commonService);
		} else {
			this.windowsHelloLandingViewModel = null;
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
