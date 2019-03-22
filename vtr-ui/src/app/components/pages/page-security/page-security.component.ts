import { Component,	OnInit,	HostListener } from '@angular/core';
// import {	MockService} from '../../../services/mock/mock.service';
import { VantageShellService } from '../../../services/vantage-shell/vantage-shell.service';
import { MockSecurityAdvisorService } from '../../../services/mock/mockSecurityAdvisor.service';
import * as phoenix from '@lenovo/tan-client-bridge';
import { EventTypes, WifiSecurity, WindowsHello, Antivirus,	Vpn, PasswordManager, HomeProtection, WifiDetail } from '@lenovo/tan-client-bridge';

export class PasswordManagerLandingViewModel {
	passwordManager: PasswordManager;
	status: number;
	detail: string; // install or not-installed
	path = 'password-protection';
	title = 'Password Manager';

	subject =  'Password Health';
	subjectStatus: number;
	type = 'security';
	imgUrl = '../../../../assets/images/Dashlane_Logo_Teal _Web.png';

	constructor(pmModel: phoenix.PasswordManager) {
		this.passwordManager = pmModel;
		if (pmModel.status) {
			this.detail = pmModel.status;
			this.status = (pmModel.status === 'installed') ? 2 : 1;
			this.subjectStatus = (pmModel.status === 'installed') ? 2 : 1;
		}
		pmModel.on(EventTypes.pmStatusEvent, (data) => {
			this.detail = data;
			this.status = (data === 'installed') ? 2 : 1;
			this.subjectStatus = (data === 'installed') ? 2 : 1;
		});
	}
}

export class VpnLandingViewModel {
	vpn: Vpn;
	status: number;
	detail: string; // installed or not-installed
	path = 'internet-protection';
	title = 'Virtual Private Network';

	subject = 'VPN Security';
	subjectStatus: number;
	type = 'security';
	imgUrl = '../../../../assets/images/surfeasy-logo.svg';
	constructor(vpnModel: phoenix.Vpn) {
		this.vpn = vpnModel;
		if (vpnModel.status) {
			this.status = (vpnModel.status === 'installed') ? 2 : 1;
			this.detail = vpnModel.status;
			this.subjectStatus = (vpnModel.status === 'installed') ? 2 : 1;
		}

		vpnModel.on(EventTypes.vpnStatusEvent, (data) => {
			this.status = (data === 'installed') ? 2 : 1;
			this.detail = data;
			this.subjectStatus = (data === 'installed') ? 2 : 1;
		});
	}
}

export class AntiVirusLandingViewModel {
	antivirus: Antivirus;
	av: {
		status: number,
		detail: string,
		path: 'anti-virus',
		title: 'Anti-Virus',
	};
	fw: {
		status: number,
		detail: string,
		path: 'anti-virus',
		title: 'Firewall',
	};
	avStatus: boolean;
	fwStatus: boolean;

	status: number;
	detail: string;
	path = 'anti-virus';
	title = 'Anti-Virus';

	antivirusArray: Array<object>;
	// av: object;
	// fw: object;

	subject = 'Anti-Virus';
	subjectStatus: number;
	type = 'security';
	imgUrl = '../../../../assets/images/mcafee_logo.svg';
	constructor(avModel: phoenix.Antivirus) {
		this.antivirus = avModel;

		if (avModel.windowsDefender.status) {
			this.avStatus = (avModel.windowsDefender.status === true);
			this.status = (avModel.windowsDefender.status === true) ? 0 : 1;
			this.detail = (avModel.windowsDefender.status === true) ? 'enabled' : 'disabled';
		}
		if (avModel.windowsDefender.firewallStatus) {
			this.fwStatus = (avModel.windowsDefender.firewallStatus === true);
		}

		if (avModel.windowsDefender.firewallStatus === true && avModel.windowsDefender.status === true) {
			this.subjectStatus = 0;
		} else if (avModel.windowsDefender.firewallStatus === true || avModel.windowsDefender.status === true) {
			this.subjectStatus = 3;
		} else {
			this.subjectStatus = 1;
		}

		avModel.on(EventTypes.avWindowsDefenderAntivirusStatusEvent, (data) => {
			this.avStatus = (data === true);
		});
		avModel.on(EventTypes.avWindowsDefenderFirewallStatusEvent, (data) => {
			this.fwStatus = (data === true);
		});
	}
}
export class WindowsHelloLandingViewModel {
	windowsHello: WindowsHello;
	status: number;
	detail: string; // active or inactive
	path = 'windows-hello';
	title = 'Fingerprint reader';

	subject = 'Windows Hello';
	subjectStatus: number;
	imgUrl = '../../../../assets/images/windows-logo.svg';
	type = 'security';
	constructor(whModel: phoenix.WindowsHello) {
		if (whModel) {
			this.windowsHello = whModel;
			if (whModel.fingerPrintStatus) {
				this.status = (whModel.fingerPrintStatus === 'active') ? 0 : 1;
				this.detail = whModel.fingerPrintStatus;
				this.subjectStatus = (whModel.fingerPrintStatus === 'active') ? 0 : 1;
			}
			whModel.on(EventTypes.helloFingerPrintStatusEvent, (data) => {
				this.status = (data === 'active') ? 0 : 1;
				this.detail = data;
				this.subjectStatus = (data === 'active') ? 0 : 1;
			});
		}
	}
}

export class WifiSecurityLandingViewModel {
	wifiSecurity: WifiSecurity;
	status: number;
	detail: string; // enabled / disabled
	path = 'wifi-security';
	title = 'WiFi Security';

	subject = 'WiFi & Connected Home Security';
	subjectStatus: number;
	type = 'security';
	wifiHistory: Array < phoenix.WifiDetail > ;
	constructor(wfModel: phoenix.WifiSecurity, hpModel: phoenix.HomeProtection) {

		try {
			this.wifiSecurity = wfModel;
			if (wfModel.state) {
				this.status = (wfModel.state === 'enabled') ? 0 : 1;
				this.detail = wfModel.state;
				this.subjectStatus = (wfModel.state === 'enabled') ? 0 : 1;
			}
			if (wfModel.wifiHistory) {
				this.wifiHistory = wfModel.wifiHistory;
			}
		} catch (err) {}

		wfModel.on(EventTypes.wsWifiHistoryEvent, (data) => {
			this.wifiHistory = wfModel.wifiHistory;
		});

		wfModel.on(EventTypes.wsStateEvent, (data) => {
			this.status = (data === 'enabled') ? 0 : 1;
			this.detail = data;
			this.subjectStatus = (data === 'enabled') ? 0 : 1;
		});
	}
}

export class HomeProtectionLandingViewModel {
	homeProtection: HomeProtection;
	status: number;
	detail: string; // enabled / disabled
	path = 'wifi-security';
	title = 'Connected Home Security';
	type = 'security';
	constructor(hpModel: phoenix.HomeProtection, wfModel: phoenix.WifiSecurity) {
		this.homeProtection = hpModel;
		if (wfModel.state) {
			this.status = (wfModel.state === 'enabled') ? 0 : 1;
			this.detail = wfModel.state;
		}

		wfModel.on(EventTypes.wsStateEvent, (data) => {
			this.status = (data === 'enabled') ? 0 : 1;
			this.detail = data;
		});
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
	) {
		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
		this.passwordManager = this.vantageShellService.getSecurityAdvisor().passwordManager;
		this.antivirus = this.mockSecurityAdvisorService.getSecurityAdvisor().antivirus;
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
		console.log(this.windowsHelloLandingViewModel);
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

}
