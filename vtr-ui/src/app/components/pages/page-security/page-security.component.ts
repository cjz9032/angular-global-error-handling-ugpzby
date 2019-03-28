import { Component,	OnInit,	HostListener } from '@angular/core';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { MockSecurityAdvisorService } from '../../../services/mock/mockSecurityAdvisor.service';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CMSService } from '../../../services/cms/cms.service';
import { AntiVirusLandingViewModel } from '../../../data-models/security-advisor/antivirus-landing.model';
import { HomeProtectionLandingViewModel } from '../../../data-models/security-advisor/homeprotection-landing.model';
import { PasswordManagerLandingViewModel } from '../../../data-models/security-advisor/passwordmanager-landing.model';
import { VpnLandingViewModel } from '../../../data-models/security-advisor/vpn-landing.model';
import { WifiSecurityLandingViewModel } from '../../../data-models/security-advisor/wifisecurity-landing.model';
import { WindowsHelloLandingViewModel } from '../../../data-models/security-advisor/windowshello-landing.model';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
	selector: 'vtr-page-security',
	templateUrl: './page-security.component.html',
	styleUrls: ['./page-security.component.scss']
})

export class PageSecurityComponent implements OnInit {

	constructor(
		public vantageShellService: VantageShellService,
		private mockSecurityAdvisorService: MockSecurityAdvisorService,
		private cmsService: CMSService,
		private commonService: CommonService,
	) {
		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
		this.passwordManager = this.securityAdvisor.passwordManager;
		this.antivirus = this.securityAdvisor.antivirus;
		this.vpn = this.securityAdvisor.vpn;
		this.wifiSecurity = this.securityAdvisor.wifiSecurity;
		if (this.securityAdvisor.windowsHello.fingerPrintStatus || this.securityAdvisor.windowsHello.facialIdStatus) {
			this.windowsHello = this.securityAdvisor.windowsHello;
		} else {
			this.windowsHello = null;
		}
		this.homeProtection = this.securityAdvisor.homeProtection;

		this.passwordManagerLandingViewModel = new PasswordManagerLandingViewModel(this.passwordManager, this.commonService);
		this.antivirusLandingViewModel = new AntiVirusLandingViewModel(this.antivirus, this.commonService);
		this.vpnLandingViewModel = new VpnLandingViewModel(this.vpn, this.commonService);
		this.wifiSecurityLandingViewModel = new WifiSecurityLandingViewModel(this.wifiSecurity, this.homeProtection, this.commonService);
		this.homeProtectionLandingViewModel = new HomeProtectionLandingViewModel(this.homeProtection, this.wifiSecurity, this.commonService);
		this.windowsHelloLandingViewModel = new WindowsHelloLandingViewModel(this.windowsHello, this.commonService);
		this.wifiHistory = this.wifiSecurityLandingViewModel.wifiHistory;

		this.antivirusScore = [
			this.antivirusLandingViewModel.subject.status,
			this.passwordManagerLandingViewModel.subject.status,
			this.vpnLandingViewModel.subject.status,
			this.wifiSecurityLandingViewModel.subject.status,
			this.windowsHelloLandingViewModel.subject.status
		];

		this.fetchCMSArticles();
	}
	title = 'Security';

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
	antivirusScore: Array < any > ;
	articles: [];

	itemStatusClass = {
		0: 'good',
		1: 'bad',
		2: 'orange'
	};
	itemDetail = {
		0: 'Good',
		1: 'Malicious',
		2: 'Suspicious'
	};

	@HostListener('window: focus')
	onFocus(): void {
		this.securityAdvisor.refresh();
	}

	ngOnInit() {

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

	getMaliciousWifi(wifiHistory) {
		const num = 1;
		let total = 0;
		wifiHistory.forEach(wifi => {
			if (wifi.good === 1) {
				total += num;
			}
		});
		return total;
	}

	getScore(items) {
		let flag;
		let score = 0;
		items = items.filter(current => {
			return current !== undefined && current !== null && current !== '';
		});
		flag = 100 / items.length;
		items.forEach(item => {
			if (item === 0 || item === 2) {
				score += flag;
			}
		});
		return score;
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

		this.cmsService.fetchCMSArticles(queryOptions).then(
			(response: any) => {
				this.articles = response;
			},
			error => {
				console.log('fetchCMSContent error', error);
			}
		);
	}
}
