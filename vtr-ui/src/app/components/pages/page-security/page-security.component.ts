import {
	Component,
	OnInit,
	HostListener
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
	HomeProtectionLandingViewModel
} from '../../../data-models/security-advisor/homeprotection-landing.model';
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
	RegionService
} from 'src/app/services/region/region.service';

@Component({
	selector: 'vtr-page-security',
	templateUrl: './page-security.component.html',
	styleUrls: ['./page-security.component.scss']
})

export class PageSecurityComponent implements OnInit {
	passwordManagerLandingViewModel: PasswordManagerLandingViewModel;
	antivirusLandingViewModel: AntiVirusLandingViewModel;
	vpnLandingViewModel: VpnLandingViewModel;
	windowsHelloLandingViewModel: WindowsHelloLandingViewModel;
	wifiSecurityLandingViewModel: WifiSecurityLandingViewModel;
	homeProtectionLandingViewModel: HomeProtectionLandingViewModel;
	wifiHistory: Array < phoenix.WifiDetail > ;
	securityAdvisor: phoenix.SecurityAdvisor;
	antivirus: phoenix.Antivirus;
	wifiSecurity: phoenix.WifiSecurity;
	homeProtection: phoenix.HomeProtection;
	passwordManager: phoenix.PasswordManager;
	vpn: phoenix.Vpn;
	windowsHello: phoenix.WindowsHello;
	score: number;
	maliciousWifi: number;
	cardContentPositionA: any = {};
	region: string;

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
		private regionService: RegionService
	) {
		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
		this.passwordManager = this.securityAdvisor.passwordManager;
		this.antivirus = this.securityAdvisor.antivirus;
		this.vpn = this.securityAdvisor.vpn;
		this.wifiSecurity = this.securityAdvisor.wifiSecurity;
		this.homeProtection = this.securityAdvisor.homeProtection;

		this.createViewModels();
		this.score = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingScore);
	}

	@HostListener('window: focus')
	onFocus(): void {
		this.refreshAll();
	}

	ngOnInit() {
		this.refreshAll();
		this.fetchCMSArticles();
	}

	private refreshAll() {
		this.securityAdvisor.antivirus.refresh().then(() => {
			this.getScore();
		});
		this.securityAdvisor.wifiSecurity.refresh().then(() => {
			this.getScore();
			this.getMaliciousWifi();
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
		this.regionService.getRegion().subscribe({
			next: x => { this.region = x; },
			error: err => { console.error(err); },
			complete: () => { console.log('Done'); }
		});
	}

	createViewModels() {
		this.passwordManagerLandingViewModel = new PasswordManagerLandingViewModel(this.passwordManager, this.commonService, this.translate);
		this.antivirusLandingViewModel = new AntiVirusLandingViewModel(this.antivirus, this.commonService, this.translate);
		this.vpnLandingViewModel = new VpnLandingViewModel(this.vpn, this.commonService, this.translate);
		this.wifiSecurityLandingViewModel = new WifiSecurityLandingViewModel(this.wifiSecurity, this.commonService, this.translate);
		this.homeProtectionLandingViewModel = new HomeProtectionLandingViewModel(this.translate);
		this.wifiHistory = this.wifiSecurityLandingViewModel.wifiHistory;
		const windowsHello = this.securityAdvisor.windowsHello;
		const cacheShowWindowsHello = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowWindowsHello);
		const wifiSecurity = this.securityAdvisor.wifiSecurity;
		if (cacheShowWindowsHello) {
			this.windowsHelloLandingViewModel = new WindowsHelloLandingViewModel(windowsHello, this.commonService, this.translate);
		}
		if (windowsHello.facialIdStatus || windowsHello.fingerPrintStatus) {
			this.showWindowsHello(windowsHello);
		}
		windowsHello.on(EventTypes.helloFacialIdStatusEvent, () => {
			this.showWindowsHello(windowsHello);
		}).on(EventTypes.helloFingerPrintStatusEvent, () => {
			this.showWindowsHello(windowsHello);
		});
		wifiSecurity.on(EventTypes.wsStateEvent, () => {
			this.getScore();
		}).on(EventTypes.geolocatorPermissionEvent, (data) => {
			this.getScore();
		});

		// this.securityAdvisor.refresh();
	}

	getWifiStatus(good) {
		let itemStatClass = 'good';
		if (good !== undefined && good !== '') {
			if (this.itemStatusClass.hasOwnProperty(good)) {
				itemStatClass = this.itemStatusClass[good];
			}
		}
		return itemStatClass;
	}

	getWifiDetail(good) {
		let itemDetail = 'good';
		if (good !== undefined && good !== '') {
			if (this.itemDetail.hasOwnProperty(good)) {
				itemDetail = this.itemDetail[good];
			}
		}
		return itemDetail;
	}

	private getMaliciousWifi() {
		this.maliciousWifi = 0;
		const wifiHistoryList = this.wifiHistory;
		if (wifiHistoryList && wifiHistoryList.length !== 0) {
			this.maliciousWifi = wifiHistoryList.filter(wifi => {
				const connected = new Date(wifi.info);
				const monthFirst = new Date();
				monthFirst.setDate(1);
				return wifi.good !== '0' && connected > monthFirst;
			}).length;
		}
	}

	public getScore() {
		const antivirusScoreInit = [
			this.antivirusLandingViewModel.subject.status,
			this.passwordManagerLandingViewModel.subject.status,
			this.vpnLandingViewModel.subject.status,
			this.wifiSecurityLandingViewModel.subject.status,
			this.windowsHelloLandingViewModel ? this.windowsHelloLandingViewModel.subject.status : null
		];
		let flag;
		let scoreTotal = 0;
		const antivirusScore = antivirusScoreInit.filter(current => {
			return current !== undefined && current !== null && current !== '';
		});
		flag = 100 / antivirusScore.length;
		antivirusScore.forEach(item => {
			if (item === 0 || item === 2) {
				scoreTotal += flag;
			}
		});
		this.score = scoreTotal;
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingScore, this.score);
	}

	fetchCMSArticles() {
		const queryOptions = {
			'Page': 'security',
			'Lang': 'EN',
			'GEO': 'US',
			'OEM': 'Lenovo',
			'OS': 'Windows',
			'Segment': 'SMB',
			'Brand': 'Lenovo'
		};

		this.cmsService.fetchCMSContent(queryOptions).then(
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

	showWindowsHello(windowsHello: phoenix.WindowsHello): void {
		if (this.commonService.isRS5OrLater() &&
			(windowsHello.fingerPrintStatus || windowsHello.facialIdStatus)) {
			this.windowsHelloLandingViewModel = new WindowsHelloLandingViewModel(windowsHello, this.commonService, this.translate);
		} else {
			this.windowsHelloLandingViewModel = null;
		}
	}
}
