import { Component, OnInit, HostListener } from '@angular/core';
// import {	MockService} from '../../../services/mock/mock.service';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { MockSecurityAdvisorService } from '../../../services/mock/mockSecurityAdvisor.service';
import * as phoenix from '@lenovo/tan-client-bridge';
import { EventTypes, WifiSecurity, WindowsHello, Antivirus, Vpn, PasswordManager, HomeProtection, WifiDetail } from '@lenovo/tan-client-bridge';
import { CMSService } from '../../../services/cms/cms.service';

export class PasswordManagerLandingViewModel {
	passwordManager: PasswordManager;
	statusList: Array<any>;
	subject = 'Password Health';
	subjectStatus: number;
	type = 'security';
	imgUrl = '../../../../assets/images/Dashlane_Logo_Teal _Web.png';

	constructor(pmModel: phoenix.PasswordManager) {
		this.passwordManager = pmModel;
		const pmStatus = {
			status: 2,
			detail: 'not-installed', // install or not-installed
			path: 'password-protection',
			title: 'Password Manager',
			type: 'security',
		};
		if (pmModel.status) {
			pmStatus.detail = pmModel.status;
			pmStatus.status = (pmModel.status === 'installed') ? 2 : 1;
			this.subjectStatus = (pmModel.status === 'installed') ? 2 : 1;
		}
		pmModel.on(EventTypes.pmStatusEvent, (data) => {
			pmStatus.detail = data;
			pmStatus.status = (data === 'installed') ? 2 : 1;
			this.subjectStatus = (data === 'installed') ? 2 : 1;
		});
		this.statusList = new Array(pmStatus);
	}
}

export class VpnLandingViewModel {
	vpn: Vpn;
	statusList: Array<any>;
	subject = 'VPN Security';
	subjectStatus: number;
	type = 'security';
	imgUrl = '../../../../assets/images/surfeasy-logo.svg';
	constructor(vpnModel: phoenix.Vpn) {
		this.vpn = vpnModel;
		const vpnStatus = {
			status: 2,
			detail: 'not-installed', // installed or not-installed
			path: 'internet-protection',
			title: 'Virtual Private Network',
			type: 'security',
		};
		if (vpnModel.status) {
			vpnStatus.status = (vpnModel.status === 'installed') ? 2 : 1;
			vpnStatus.detail = vpnModel.status;
			this.subjectStatus = (vpnModel.status === 'installed') ? 2 : 1;
		}

		vpnModel.on(EventTypes.vpnStatusEvent, (data) => {
			vpnStatus.status = (data === 'installed') ? 2 : 1;
			vpnStatus.detail = data;
			this.subjectStatus = (data === 'installed') ? 2 : 1;
		});
		this.statusList = new Array(vpnStatus);
	}
}

export class AntiVirusLandingViewModel {
	antivirus: Antivirus;
	statusList: Array<any>;

	subject = 'Anti-Virus';
	subjectStatus: number;
	type = 'security';
	imgUrl = '../../../../assets/images/mcafee_logo.svg';
	constructor(avModel: phoenix.Antivirus) {
		this.antivirus = avModel;
		const avStatus = {
			status: 2,
			detail: 'disabled',
			path: 'anti-virus',
			title: 'Anti-Virus',
			type: 'security',
		};
		const fwStatus = {
			status: 2,
			detail: 'disabled',
			path: 'anti-virus',
			title: 'Firewall',
			type: 'security',
		};
		if (avModel.windowsDefender.status) {
			avStatus.status = (avModel.windowsDefender.status === true) ? 0 : 1;
			avStatus.detail = (avModel.windowsDefender.status === true) ? 'enabled' : 'disabled';
		}
		if (avModel.windowsDefender.firewallStatus !== undefined || avModel.windowsDefender.firewallStatus !== null) {
			fwStatus.status = (avModel.windowsDefender.firewallStatus === true) ? 0 : 1;
			fwStatus.detail = (avModel.windowsDefender.firewallStatus === true) ? 'enabled' : 'disabled';
		}

		if (avModel.windowsDefender.firewallStatus === true && avModel.windowsDefender.status === true) {
			this.subjectStatus = 0;
		} else if (avModel.windowsDefender.firewallStatus === true || avModel.windowsDefender.status === true) {
			this.subjectStatus = 3;
		} else {
			this.subjectStatus = 1;
		}

		avModel.on(EventTypes.avWindowsDefenderAntivirusStatusEvent, (data) => {
			avStatus.status = (data === true) ? 0 : 1;
		});
		avModel.on(EventTypes.avWindowsDefenderFirewallStatusEvent, (data) => {
			fwStatus.status = (data === true) ? 0 : 1;
		});
		this.statusList = new Array(avStatus, fwStatus);
	}
}
export class WindowsHelloLandingViewModel {
	windowsHello: WindowsHello;
	statusList: Array<any>;

	subject = 'Windows Hello';
	subjectStatus: number;
	imgUrl = '../../../../assets/images/windows-logo.svg';
	type = 'security';
	constructor(whModel: phoenix.WindowsHello) {
		if (whModel) {
			this.windowsHello = whModel;
			const whStatus = {
				status: 2,
				detail: 'inactive', // active or inactive
				path: 'windows-hello',
				title: 'Fingerprint reader',
				type: 'security',
			};
			let fingerStatus = 'inactive';
			let faciaStatus = 'inactive';
			if (whModel.fingerPrintStatus || whModel.facialIdStatus) {
				whStatus.status = (whModel.fingerPrintStatus === 'active') ? 0 : 1;
				whStatus.detail = whModel.fingerPrintStatus === 'active' ? 'enabled' : 'disabled';
				this.subjectStatus = (whModel.fingerPrintStatus === 'active' || whModel.facialIdStatus === 'active') ? 0 : 1;
			}
			whModel.on(EventTypes.helloFingerPrintStatusEvent, (data) => {
				whStatus.status = (data === 'active') ? 0 : 1;
				whStatus.detail = data;
				fingerStatus = data;
				this.subjectStatus = (faciaStatus === 'active' || fingerStatus === 'active') ? 0 : 1;
			});
			whModel.on(EventTypes.helloFacialIdStatusEvent, (data) => {
				faciaStatus = data;
				this.subjectStatus = (faciaStatus === 'active' || fingerStatus === 'active') ? 0 : 1;
			});
			this.statusList = new Array(whStatus);

		}
	}
}

export class WifiSecurityLandingViewModel {
	wifiSecurity: WifiSecurity;
	statusList: Array<any>;

	subject = 'WiFi & Connected Home Security';
	subjectStatus: number;
	type = 'security';
	wifiHistory: Array<phoenix.WifiDetail>;
	constructor(wfModel: phoenix.WifiSecurity, hpModel: phoenix.HomeProtection) {
		this.wifiSecurity = wfModel;
		const wfStatus = {
			status: 2,
			detail: 'disabled', // enabled / disabled
			path: 'wifi-security',
			title: 'WiFi Security',
			type: 'security',
		};
		if (wfModel.state) {
			wfStatus.status = (wfModel.state === 'enabled') ? 0 : 1;
			wfStatus.detail = wfModel.state;
			this.subjectStatus = (wfModel.state === 'enabled') ? 0 : 1;
		}
		if (wfModel.wifiHistory) {
			this.wifiHistory = wfModel.wifiHistory;
		}

		wfModel.on(EventTypes.wsWifiHistoryEvent, (data) => {
			this.wifiHistory = wfModel.wifiHistory;
		});

		wfModel.on(EventTypes.wsStateEvent, (data) => {
			wfStatus.status = (data === 'enabled') ? 0 : 1;
			wfStatus.detail = data;
			this.subjectStatus = (data === 'enabled') ? 0 : 1;
		});
		this.statusList = new Array(wfStatus);
	}
}

export class HomeProtectionLandingViewModel {
	homeProtection: HomeProtection;
	statusList: Array<any>;

	type = 'security';
	constructor(hpModel: phoenix.HomeProtection, wfModel: phoenix.WifiSecurity) {
		this.homeProtection = hpModel;
		const hpStatus = {
			status: 2,
			detail: 'disabled', // enabled / disabled
			path: 'wifi-security',
			title: 'Connected Home Security',
			type: 'security',
		};
		if (wfModel.state) {
			hpStatus.status = (wfModel.state === 'enabled') ? 0 : 1;
			hpStatus.detail = wfModel.state;
		}

		wfModel.on(EventTypes.wsStateEvent, (data) => {
			hpStatus.status = (data === 'enabled') ? 0 : 1;
			hpStatus.detail = data;
		});
		this.statusList = new Array(hpStatus);
	}
}

@Component({
	selector: 'vtr-page-security',
	templateUrl: './page-security.component.html',
	styleUrls: ['./page-security.component.scss']
})

export class PageSecurityComponent implements OnInit {

	constructor(
		// public mockService: MockService,
		public vantageShellService: VantageShellService,
		public mockSecurityAdvisorService: MockSecurityAdvisorService,
		private cmsService: CMSService
	) {
		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
		this.passwordManager = this.vantageShellService.getSecurityAdvisor().passwordManager;
		this.antivirus = this.vantageShellService.getSecurityAdvisor().antivirus;
		this.vpn = this.vantageShellService.getSecurityAdvisor().vpn;
		this.wifiSecurity = this.vantageShellService.getSecurityAdvisor().wifiSecurity;
		if (this.vantageShellService.getSecurityAdvisor().windowsHello) {
			this.windowsHello = this.vantageShellService.getSecurityAdvisor().windowsHello;
		} else {
			this.windowsHello = null;
		}
		this.homeProtection = this.vantageShellService.getSecurityAdvisor().homeProtection;
		this.passwordManagerLandingViewModel = new PasswordManagerLandingViewModel(this.passwordManager);
		this.antivirusLandingViewModel = new AntiVirusLandingViewModel(this.antivirus);
		this.vpnLandingViewModel = new VpnLandingViewModel(this.vpn);
		this.wifiSecurityLandingViewModel = new WifiSecurityLandingViewModel(this.wifiSecurity, this.homeProtection);
		this.homeProtectionLandingViewModel = new HomeProtectionLandingViewModel(this.homeProtection, this.wifiSecurity);
		this.windowsHelloLandingViewModel = new WindowsHelloLandingViewModel(this.windowsHello);
		this.wifiHistory = this.wifiSecurityLandingViewModel.wifiHistory;
		this.fetchCMSArticles();
	}
	title = 'Security';

	passwordManagerLandingViewModel: PasswordManagerLandingViewModel;
	antivirusLandingViewModel: AntiVirusLandingViewModel;
	vpnLandingViewModel: VpnLandingViewModel;
	windowsHelloLandingViewModel: WindowsHelloLandingViewModel;
	wifiSecurityLandingViewModel: WifiSecurityLandingViewModel;
	homeProtectionLandingViewModel: HomeProtectionLandingViewModel;
	wifiHistory: Array<any>;
	securityAdvisor: phoenix.SecurityAdvisor;
	antivirus: phoenix.Antivirus;
	wifiSecurity: phoenix.WifiSecurity;
	homeProtection: phoenix.HomeProtection;
	passwordManager: phoenix.PasswordManager;
	vpn: phoenix.Vpn;
	windowsHello: phoenix.WindowsHello;
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
