import { Component,	OnInit,	HostListener } from '@angular/core';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { MockSecurityAdvisorService } from '../../../services/mock/mockSecurityAdvisor.service';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CMSService } from '../../../services/cms/cms.service';
import { AntiVirusLandingViewModel } from '../../../data-models/security-advisor/antivirus-landing.model';
import { HomeProtectionLandingViewModel } from '../../../data-models/security-advisor/homeprotection-landing.model';
import { LandingView } from '../../../data-models/security-advisor/landing-view.model';
import { PasswordManagerLandingViewModel } from '../../../data-models/security-advisor/passwordmanager-landing.model';
import { StatusInfo } from '../../../data-models/security-advisor/status-info.model';
import { VpnLandingViewModel } from '../../../data-models/security-advisor/vpn-landing.model';
import { WifiSecurityLandingViewModel } from '../../../data-models/security-advisor/wifisecurity-landing.model';
import { WindowsHelloLandingViewModel } from '../../../data-models/security-advisor/windowshello-landing.model';

@Component({
	selector: 'vtr-page-security',
	templateUrl: './page-security.component.html',
	styleUrls: ['./page-security.component.scss']
})

export class PageSecurityComponent implements OnInit {

	constructor(
		public vantageShellService: VantageShellService,
		private cmsService: CMSService
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

		if (localStorage.getItem('pmViewModel')) {
			this.passwordManagerLandingViewModel = JSON.parse(localStorage.getItem('pmViewModel'));
    } else {
      this.passwordManagerLandingViewModel = new PasswordManagerLandingViewModel(this.passwordManager);
    }
		if (this.passwordManager.status) {
      Object.assign(this.passwordManagerLandingViewModel, new PasswordManagerLandingViewModel(this.passwordManager));
      localStorage.setItem('pmViewModel', JSON.stringify(this.passwordManagerLandingViewModel));
		}

		if (localStorage.getItem('avViewModel')) {
			this.antivirusLandingViewModel = JSON.parse(localStorage.getItem('avViewModel'));
		} else {
      this.antivirusLandingViewModel = new AntiVirusLandingViewModel(this.antivirus);
    }
		if (this.antivirus.mcafee || this.antivirus.windowsDefender || this.antivirus.others) {
			Object.assign(this.antivirusLandingViewModel, new AntiVirusLandingViewModel(this.antivirus));
			localStorage.setItem('avViewModel', JSON.stringify(this.antivirusLandingViewModel));
		}

		if (localStorage.getItem('vpnViewModel')) {
			this.vpnLandingViewModel = JSON.parse(localStorage.getItem('vpnViewModel'));
		} else {
      this.vpnLandingViewModel = new VpnLandingViewModel(this.vpn);
    }
		if (this.vpn.status) {
			Object.assign(this.vpnLandingViewModel, new VpnLandingViewModel(this.vpn));
			localStorage.setItem('vpnViewModel', JSON.stringify(this.vpnLandingViewModel));
		}

		if (localStorage.getItem('wifiViewModel')) {
			this.wifiSecurityLandingViewModel = JSON.parse(localStorage.getItem('wifiViewModel'));
		} else {
      this.wifiSecurityLandingViewModel = new WifiSecurityLandingViewModel(this.wifiSecurity, this.homeProtection);
    }
		if (this.homeProtection.status || this.wifiSecurity.state) {
			Object.assign(this.wifiSecurityLandingViewModel, new WifiSecurityLandingViewModel(this.wifiSecurity, this.homeProtection));
			localStorage.setItem('wifiViewModel', JSON.stringify(this.wifiSecurityLandingViewModel));
		}

		if (localStorage.getItem('hpViewModel')) {
			this.homeProtectionLandingViewModel = JSON.parse(localStorage.getItem('hpViewModel'));
		} else {
      this.homeProtectionLandingViewModel = new HomeProtectionLandingViewModel(this.homeProtection, this.wifiSecurity);
    }
		if (this.homeProtection.status || this.wifiSecurity.state) {
			Object.assign(this.homeProtectionLandingViewModel, new HomeProtectionLandingViewModel(this.homeProtection, this.wifiSecurity));
			localStorage.setItem('hpViewModel', JSON.stringify(this.homeProtectionLandingViewModel));
		}

		if (localStorage.getItem('whViewModel')) {
			this.windowsHelloLandingViewModel = JSON.parse(localStorage.getItem('whViewModel'));
		} else {
      this.windowsHelloLandingViewModel = new WindowsHelloLandingViewModel(this.windowsHello);
    }
		if (this.windowsHello && (this.windowsHello.fingerPrintStatus !== undefined || this.windowsHello.facialIdStatus !== undefined)) {
			Object.assign(this.windowsHelloLandingViewModel, new WindowsHelloLandingViewModel(this.windowsHello));
			localStorage.setItem('whViewModel', JSON.stringify(this.windowsHelloLandingViewModel));
		}

		if (localStorage.getItem('wifiHistoryModel')) {
			this.wifiHistory = JSON.parse(localStorage.getItem('wifiHistoryModel'));
		} else {
      this.wifiHistory = this.wifiSecurityLandingViewModel.wifiHistory;
    }
    if (this.wifiSecurityLandingViewModel && this.wifiSecurityLandingViewModel.wifiHistory) {
      Object.assign(this.wifiHistory, this.wifiSecurityLandingViewModel.wifiHistory);
      localStorage.setItem('wifiHistoryModel', JSON.stringify(this.wifiHistory));
    }

		if (localStorage.getItem('scoreModel')) {
			this.antivirusScore = JSON.parse(localStorage.getItem('scoreModel'));
    }
    
    this.antivirusScore = [
      this.antivirusLandingViewModel.subjectStatus, 
      this.passwordManagerLandingViewModel.subjectStatus, 
      this.vpnLandingViewModel.subjectStatus, 
      this.wifiSecurityLandingViewModel.subjectStatus, 
      this.windowsHelloLandingViewModel.subjectStatus
    ];
		localStorage.setItem('scoreModel', JSON.stringify(this.antivirusScore));

		this.fetchCMSArticles();
	}
	title = 'Security';

	passwordManagerLandingViewModel: PasswordManagerLandingViewModel;
	antivirusLandingViewModel: AntiVirusLandingViewModel;
	vpnLandingViewModel: VpnLandingViewModel;
	windowsHelloLandingViewModel: WindowsHelloLandingViewModel;
	wifiSecurityLandingViewModel: WifiSecurityLandingViewModel;
	homeProtectionLandingViewModel: HomeProtectionLandingViewModel;
	wifiHistory: Array<phoenix.WifiDetail>;
	securityAdvisor: phoenix.SecurityAdvisor;
	antivirus: phoenix.Antivirus;
	wifiSecurity: phoenix.WifiSecurity;
	homeProtection: phoenix.HomeProtection;
	passwordManager: phoenix.PasswordManager;
	vpn: phoenix.Vpn;
	windowsHello: phoenix.WindowsHello;
	antivirusScore: Array<any>;
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
