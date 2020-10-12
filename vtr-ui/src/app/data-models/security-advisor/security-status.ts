import * as phoenix from '@lenovo/tan-client-bridge';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { AntivirusService } from 'src/app/services/security/antivirus.service';
import { WindowsHelloService } from 'src/app/services/security/windowsHello.service';
import { SecurityTypeConst } from './status-info.model';
import { LandingView } from './widegt-security-landing/landing-view.model';

export type SecurityFeature = {
	pluginSupport: boolean;
	vpnSupport: boolean;
	pwdSupport: boolean;
};

export const securityStatus = {
	whStatus: {
		status: 'loading',
		icon: 'landing-finger',
		title: 'security.landing.fingerprint',
		content: 'security.landing.fingerprintContent',
		buttonLabel: 'security.landing.visitFingerprint',
		buttonHref: 'ms-settings:signinoptions',
		noneCheck: true,
		id: 'sa-ov-btn-fingerPrint',
		detail: '',
	},
	pmStatus: {
		status: 'loading',
		icon: 'landing-password',
		title: 'security.landing.pwdHealth',
		buttonLabel: 'security.landing.goPassword',
		buttonLink: '/security/password-protection',
		showOwn: false,
		content: 'security.landing.passwordContent',
		ownTitle: 'security.landing.haveOwnPassword',
		id: 'sa-ov-link-passwordManager',
		detail: ''
	},
	uacStatus: {
		status: 'loading',
		icon: 'landing-uac',
		title: 'security.landing.uac',
		content: 'security.landing.uacContent',
		buttonLabel: 'security.landing.visitUac',
		launch() {},
		noneCheck: true,
		detail: '',
		id: 'sa-ov-btn-uac',
	},
	vpnStatus: {
		status: 'loading',
		icon: 'landing-vpn',
		title: 'security.landing.vpnVirtual',
		buttonLabel: 'security.landing.goVpn',
		buttonLink: '/security/internet-protection',
		content: 'security.landing.vpnContent',
		showOwn: false,
		ownTitle: 'security.landing.haveOwnVpn',
		id: 'sa-ov-link-vpn',
		detail: ''
	},
	wfStatus: {
		status: 'loading',
		icon: 'landing-wifi',
		title: 'common.securityAdvisor.wifi',
		buttonLabel: 'security.landing.goWifi',
		buttonLink: '/security/wifi-security',
		content: 'security.landing.wifiContent',
		showOwn: false,
		ownTitle: 'security.landing.haveOwnWifi',
		id: 'sa-ov-link-wifiSecurity',
		detail: '',
	},
	waStatus: {
		status: 'loading',
		icon: 'landing-windows',
		title: 'security.landing.windows',
		content: 'security.landing.windowsActiveContent',
		buttonLabel: 'security.landing.visitWindows',
		buttonHref: 'ms-settings:activation',
		noneCheck: true,
		detail: '',
		id: 'sa-ov-btn-windowsActive',
	},
	avStatus: {
		status: 'loading',
		icon: 'landing-antivirus',
		title: 'common.securityAdvisor.antiVirus',
		content: 'security.landing.antivirusContent',
		buttonLabel: 'security.landing.goAntivirus',
		buttonLink: '/security/anti-virus',
		noneCheck: true,
		detail: '',
		id: 'sa-ov-link-antivirus',
	},
	fwStatus: {
		status: 'loading',
		icon: 'landing-firewall',
		title: 'security.landing.firewall',
		content: 'security.landing.firewallContent',
		buttonLabel: 'security.landing.goFirewall',
		buttonLink: '',
		buttonHref: '',
		noneCheck: true,
		detail: '',
		id: 'sa-ov-link-firewall'
	},
};

let transString: any;
const loadingTime = 15000;

export const getSecurityLevel = (
	securityAdvisor: phoenix.SecurityAdvisor,
	translationString: any,
	haveOwnList: any,
	securityFeature: SecurityFeature,
	antivirusService: AntivirusService,
	windowsHelloService: WindowsHelloService,
	localCacheService: LocalCacheService
	) => {
	transString = translationString;
	const wifiSecurity = securityAdvisor.wifiSecurity;
	const antiVirus = securityAdvisor.antivirus;
	const pwdManager = securityAdvisor.passwordManager;
	const vpn = securityAdvisor.vpn;
	const windowsHello = securityAdvisor.windowsHello;
	const windowsActive = securityAdvisor.windowsActivation;
	const uac = securityAdvisor.uac;
	const avStatus = antivirusService.GetAntivirusStatus();
	let currentPage = '';

	if (haveOwnList) {
		securityStatus.pmStatus.showOwn = haveOwnList.passwordManager === true;
		securityStatus.wfStatus.showOwn = haveOwnList.wifiSecurity === true;
		securityStatus.vpnStatus.showOwn = haveOwnList.vpn === true;
	}
	if (!translationString) {
		return;
	}
	// antivirus and firewall
	if (!securityStatus.avStatus.detail) {
		securityStatus.avStatus.detail = translationString['common.securityAdvisor.loading'];
	}
	if (!securityStatus.fwStatus.detail) {
		securityStatus.fwStatus.detail = translationString['common.securityAdvisor.loading'];
	}
	securityStatus.avStatus.title = translationString['common.securityAdvisor.antiVirus'];
	securityStatus.avStatus.content = translationString['security.landing.antivirusContent'];
	securityStatus.avStatus.buttonLabel = translationString['security.landing.goAntivirus'];
	securityStatus.fwStatus.title = translationString['security.landing.firewall'];
	securityStatus.fwStatus.content = translationString['security.landing.firewallContent'];
	securityStatus.fwStatus.buttonLabel = translationString['security.landing.goFirewall'];
	const antivirusCommonData = antivirusService.GetAntivirusStatus();
	currentPage = antivirusCommonData.currentPage;
	if (antivirusCommonData.firewallLink.includes('ms-settings')) {
		securityStatus.fwStatus.buttonLink = '';
		securityStatus.fwStatus.buttonHref = antivirusCommonData.firewallLink;
	} else {
		securityStatus.fwStatus.buttonHref = '';
		securityStatus.fwStatus.buttonLink = antivirusCommonData.firewallLink;
	}
	if (currentPage === 'windows') {
		if (securityStatus.avStatus.status === 'failedLoad') {
			securityStatus.avStatus.status = 'loading';
			securityStatus.avStatus.detail = translationString['common.securityAdvisor.loading'];
			waitTimeout('antivirus');
		}
		if (securityStatus.fwStatus.status === 'failedLoad') {
			securityStatus.fwStatus.status = 'loading';
			securityStatus.fwStatus.detail = translationString['common.securityAdvisor.loading'];
			waitTimeout('firewall');
		}
	}

	if (typeof avStatus.antivirus !== 'boolean' && typeof avStatus.firewall !== 'boolean') {
		securityStatus.avStatus = undefined;
	}
	if (typeof avStatus.antivirus === 'boolean' && typeof avStatus.firewall === 'boolean') {
		securityStatus.avStatus.status = avStatus.antivirus ? 'enabled' : 'disabled';
		securityStatus.fwStatus.status = avStatus.firewall ? 'enabled' : 'disabled';
		securityStatus.avStatus.detail = translationString[`common.securityAdvisor.${avStatus.antivirus ? 'enabled' : 'disabled'}`];
		securityStatus.fwStatus.detail = translationString[`common.securityAdvisor.${avStatus.firewall ? 'enabled' : 'disabled'}`];
	} else if (typeof avStatus.firewall !== 'boolean' && typeof avStatus.antivirus === 'boolean') {
		securityStatus.avStatus.status = avStatus.antivirus ? 'enabled' : 'disabled';
		securityStatus.avStatus.detail = translationString[`common.securityAdvisor.${avStatus.antivirus ? 'enabled' : 'disabled'}`];
	} else if (typeof avStatus.antivirus !== 'boolean' && typeof avStatus.firewall === 'boolean') {
		securityStatus.fwStatus.status = avStatus.firewall ? 'enabled' : 'disabled';
		securityStatus.fwStatus.detail = translationString[`common.securityAdvisor.${avStatus.firewall ? 'enabled' : 'disabled'}`];
	}
	// windows activation and uac
	if (securityFeature.pluginSupport) {
		if (!securityStatus.waStatus.detail) {
			securityStatus.waStatus.detail = translationString['common.securityAdvisor.loading'];
		}
		securityStatus.waStatus.title = translationString['security.landing.windows'];
		securityStatus.waStatus.content = translationString['security.landing.windowsActiveContent'];
		securityStatus.waStatus.buttonLabel = translationString['security.landing.visitWindows'];

		if (!securityStatus.uacStatus.detail) {
			securityStatus.uacStatus.detail = translationString['common.securityAdvisor.loading'];
		}
		securityStatus.uacStatus.title = translationString['security.landing.uac'];
		securityStatus.uacStatus.content = translationString['security.landing.uacContent'];
		securityStatus.uacStatus.buttonLabel = translationString['security.landing.visitUac'];
		securityStatus.uacStatus.launch = securityAdvisor.uac.launch.bind(securityAdvisor.uac);

		const cacheWaStatus = localCacheService.getLocalCacheValue(LocalStorageKey.SecurityWindowsActiveStatus);
		if (windowsActive.status !== 'unknown') {
			securityStatus.waStatus.status = windowsActive.status === 'enable' ? 'enabled' : 'disabled';
			securityStatus.waStatus.detail = translationString[`common.securityAdvisor.${windowsActive.status === 'enable' ? 'enabled' : 'disabled'}`];
			localCacheService.setLocalCacheValue(LocalStorageKey.SecurityWindowsActiveStatus, windowsActive.status);
		} else if (cacheWaStatus) {
			securityStatus.waStatus.status = cacheWaStatus;
			securityStatus.waStatus.detail = translationString[`common.securityAdvisor.${cacheWaStatus === 'enable' ? 'enabled' : 'disabled'}`];
		}

		const cacheUacStatus = localCacheService.getLocalCacheValue(LocalStorageKey.SecurityUacStatus);
		if (uac.status !== 'unknown') {
			securityStatus.uacStatus.status = uac.status === 'enable' ? 'enabled' : 'disabled';
			securityStatus.uacStatus.detail = translationString[`common.securityAdvisor.${uac.status === 'enable' ? 'enabled' : 'disabled'}`];
			localCacheService.setLocalCacheValue(LocalStorageKey.SecurityUacStatus, uac.status);
		} else if (cacheUacStatus) {
			securityStatus.uacStatus.status = cacheUacStatus;
			securityStatus.uacStatus.detail = translationString[`common.securityAdvisor.${cacheUacStatus === 'enable' ? 'enabled' : 'disabled'}`];
		}
	} else {
		securityStatus.waStatus.status = undefined;
		securityAdvisor.uac.status = undefined;
	}
	// password manager
	if (securityFeature.pwdSupport) {
		if (!securityStatus.pmStatus.detail) {
			securityStatus.pmStatus.detail = translationString['common.securityAdvisor.loading'];
		}
		securityStatus.pmStatus.title = translationString['security.landing.pwdHealth'];
		securityStatus.pmStatus.content = translationString['security.landing.passwordContent'];
		securityStatus.pmStatus.buttonLabel = translationString['security.landing.goPassword'];
		securityStatus.pmStatus.ownTitle = translationString['security.landing.haveOwnPassword'];

		const cachePmStatus = localCacheService.getLocalCacheValue(LocalStorageKey.SecurityPasswordManagerStatus);
		let pmStatus: string;
		if (pwdManager.status !== 'unknown') {
			pmStatus = pwdManager.status;
			localCacheService.setLocalCacheValue(LocalStorageKey.SecurityPasswordManagerStatus, pwdManager.status);
		} else if (cachePmStatus) {
			pmStatus = cachePmStatus;
		}
		switch (pmStatus) {
			case 'installed':
				securityStatus.pmStatus.status = 'installed';
				securityStatus.pmStatus.detail = translationString['common.securityAdvisor.installed'];
				break;
			case 'installing':
				securityStatus.pmStatus.status = 'installing';
				securityStatus.pmStatus.detail = translationString['common.securityAdvisor.installing'];
				break;
			default:
				securityStatus.pmStatus.status = 'not-installed';
				securityStatus.pmStatus.detail = translationString['common.securityAdvisor.notInstalled'];
		}
	} else {
		securityStatus.pmStatus.status = undefined;
	}
	// fingerprint
	if (windowsHelloService.showWindowsHello(securityAdvisor.windowsHello)) {
		if (!securityStatus.whStatus.detail) {
			securityStatus.whStatus.detail = translationString['common.securityAdvisor.loading'];
		}
		securityStatus.whStatus.title = translationString['security.landing.fingerprint'];
		securityStatus.whStatus.content = translationString['security.landing.fingerprintContent'];
		securityStatus.whStatus.buttonLabel = translationString['security.landing.visitFingerprint'];

		const cacheWhStatus = localCacheService.getLocalCacheValue(LocalStorageKey.SecurityLandingWindowsHelloFingerprintStatus);
		if (windowsHello && windowsHello.fingerPrintStatus) {
			securityStatus.whStatus.status = windowsHello.fingerPrintStatus === 'active' ? 'enabled' : 'disabled';
			securityStatus.whStatus.detail = translationString[`common.securityAdvisor.${windowsHello.fingerPrintStatus === 'active' ? 'enrolled' : 'notEnrolled'}`];
			localCacheService.setLocalCacheValue(LocalStorageKey.SecurityLandingWindowsHelloFingerprintStatus, windowsHello.fingerPrintStatus);
		} else if (cacheWhStatus) {
			securityStatus.whStatus.status = cacheWhStatus === 'active' ? 'enabled' : 'disabled';
			securityStatus.whStatus.detail = translationString[`common.securityAdvisor.${cacheWhStatus === 'active' ? 'enrolled' : 'notEnrolled'}`];
		}
	} else {
		securityStatus.whStatus.status = undefined;
	}
	// wifi security
	if (wifiSecurity.isSupported) {
		if (!securityStatus.wfStatus.detail) {
			securityStatus.wfStatus.detail = translationString['common.securityAdvisor.loading'];
		}
		securityStatus.wfStatus.title = translationString['common.securityAdvisor.wifi'];
		securityStatus.wfStatus.content = translationString['security.landing.wifiContent'];
		securityStatus.wfStatus.ownTitle = translationString['security.landing.haveOwnWifi'];
		securityStatus.wfStatus.buttonLabel = translationString['security.landing.goWifi'];

		const cacheWfStatus = localCacheService.getLocalCacheValue(LocalStorageKey.SecurityWifiSecurityState);
		let wifiStatus: string;
		if (wifiSecurity && wifiSecurity.state) {
			wifiStatus = wifiSecurity.state;
			localCacheService.setLocalCacheValue(LocalStorageKey.SecurityWifiSecurityState, wifiSecurity.state);
		} else if (cacheWfStatus) {
			wifiStatus = cacheWfStatus;
		}
		if (wifiSecurity.isLocationServiceOn !== undefined) {
			if (wifiSecurity.isLocationServiceOn) {
				securityStatus.wfStatus.status = wifiStatus === 'enabled' ? 'enabled' : 'disabled';
				securityStatus.wfStatus.detail = translationString[`common.securityAdvisor.${ wifiStatus === 'enabled' ? 'enabled' : 'disabled'}`];
			} else {
				securityStatus.wfStatus.status = 'disabled';
				securityStatus.wfStatus.detail = translationString['common.securityAdvisor.disabled'];
			}
		}
	} else {
		securityStatus.wfStatus.status = undefined;
	}
	// vpn
	if (securityFeature.vpnSupport) {
		if (!securityStatus.vpnStatus.detail) {
			securityStatus.vpnStatus.detail = translationString['common.securityAdvisor.loading'];
		}
		securityStatus.vpnStatus.title = translationString['security.landing.vpnVirtual'];
		securityStatus.vpnStatus.buttonLabel = translationString['security.landing.goVpn'];
		securityStatus.vpnStatus.content = translationString['security.landing.vpnContent'];
		securityStatus.vpnStatus.ownTitle = translationString['security.landing.haveOwnVpn'];

		const cacheVpnStatus = localCacheService.getLocalCacheValue(LocalStorageKey.SecurityVPNStatus);
		let vpnStatus: string;
		if (vpn.status) {
			vpnStatus = vpn.status;
			localCacheService.setLocalCacheValue(LocalStorageKey.SecurityVPNStatus, vpn.status);
		} else if (cacheVpnStatus) {
			vpnStatus = cacheVpnStatus;
		}
		switch (vpnStatus) {
			case 'installed':
				securityStatus.vpnStatus.status = 'installed';
				securityStatus.vpnStatus.detail = translationString['common.securityAdvisor.installed'];
				break;
			case 'installing':
				securityStatus.vpnStatus.status = 'installing';
				securityStatus.vpnStatus.detail = translationString['common.securityAdvisor.installing'];
				break;
			default:
				securityStatus.vpnStatus.status = 'not-installed';
				securityStatus.vpnStatus.detail = translationString['common.securityAdvisor.notInstalled'];
		}
	} else {
		securityStatus.vpnStatus.status = undefined;
	}

	const statusList = {
		basic: [],
		intermediate: [],
		advanced: []
	};
	statusList.basic = new Array(
		securityStatus.avStatus.status,
		securityStatus.fwStatus.status,
		securityStatus.waStatus.status
	).filter((i) => i !== undefined);

	statusList.intermediate = new Array(
		securityStatus.pmStatus.showOwn ? 'true' : securityStatus.pmStatus.status,
		securityStatus.whStatus.status,
		securityStatus.uacStatus.status
	).filter((i) => i !== undefined);
	statusList.advanced = new Array(
		securityStatus.wfStatus.showOwn ? 'true' : securityStatus.wfStatus.status,
		securityStatus.vpnStatus.showOwn ? 'true' : securityStatus.vpnStatus.status
	).filter((i) => i !== undefined);

	const levelStatus = {
		basicValid: 0,
		basicSuccess: false,
		basicLength: 0,
		intermediateValid: 0,
		intermediateSuccess: false,
		intermediateLength: 0,
		advancedValid: 0,
		advancedSuccess: false,
		advancedLength: 0,
	};
	for (const key in statusList) {
		if (statusList.hasOwnProperty(key)) {
			const element = statusList[key];
			switch (key) {
				case SecurityTypeConst.Basic:
					levelStatus.basicValid = element.filter(
						(i) => i === 'true' || i === 'enabled' || i === 'installed' || i === 'enrolled'
					).length;
					levelStatus.basicSuccess = element.length === levelStatus.basicValid;
					levelStatus.basicLength = element.length;
					break;
				case SecurityTypeConst.Intermediate:
					levelStatus.intermediateValid = element.filter(
						(i) => i === 'true' || i === 'enabled' || i === 'installed' || i === 'enrolled'
					).length;
					levelStatus.intermediateSuccess = element.length === levelStatus.intermediateValid;
					levelStatus.intermediateLength = element.length;
					break;
				case SecurityTypeConst.Advanced:
					levelStatus.advancedValid = element.filter(
						(i) => i === 'true' || i === 'enabled' || i === 'installed' || i === 'enrolled'
					).length;
					levelStatus.advancedSuccess = element.length === levelStatus.advancedValid;
					levelStatus.advancedLength = element.length;
					break;
				default:
					break;
			}
		}
	}
	const landingStatus = new LandingView();
	const allItems =
		levelStatus.basicLength +
		levelStatus.intermediateLength +
		levelStatus.advancedLength;
	if (levelStatus.basicValid > 0) {
		if (levelStatus.intermediateValid > 0 && levelStatus.basicSuccess) {
			if (
				levelStatus.advancedValid > 0 &&
				levelStatus.intermediateSuccess
			) {
				landingStatus.status = 3;
				landingStatus.fullyProtected = true;
				landingStatus.percent =
					(levelStatus.advancedValid +
						levelStatus.basicLength +
						levelStatus.intermediateLength) /
					allItems;
			} else {
				landingStatus.status = 2;
				landingStatus.fullyProtected = false;
				landingStatus.percent =
					(levelStatus.intermediateValid +
						levelStatus.basicLength) /
					allItems;
			}
		} else {
			landingStatus.status = 1;
			landingStatus.fullyProtected = false;
			landingStatus.percent = levelStatus.basicValid / allItems;
		}
	} else {
		landingStatus.status = 0;
		landingStatus.fullyProtected = false;
		landingStatus.percent = 100;
	}

	const basicView = [securityStatus.avStatus, securityStatus.fwStatus, securityFeature.pluginSupport ? securityStatus.waStatus : undefined].filter(i => i !== undefined);
	const intermediateView = [securityFeature.pwdSupport ? securityStatus.pmStatus : undefined, securityFeature.pluginSupport ? securityStatus.whStatus : undefined, securityFeature.pluginSupport ? securityStatus.uacStatus : undefined].filter(i => i !== undefined);
	const advancedView = [securityAdvisor.wifiSecurity.isSupported ? securityStatus.wfStatus : undefined, securityFeature.vpnSupport ? securityStatus.vpnStatus : undefined].filter(i => i !== undefined);

	return {landingStatus, statusList, basicView, intermediateView, advancedView};
};

const waitTimeout = (type: string) => {
	setTimeout(() => {
		if ((securityStatus.avStatus.status === undefined || securityStatus.avStatus.status === 'loading') && type === 'antivirus') {
			securityStatus.avStatus.status = 'failedLoad';
			securityStatus.avStatus.detail = transString['common.ui.failedLoad'];
		}
		if ((securityStatus.fwStatus.status === undefined || securityStatus.fwStatus.status === 'loading') && type === 'firewall') {
			securityStatus.fwStatus.status = 'failedLoad';
			securityStatus.fwStatus.detail = transString['common.ui.failedLoad'];
		}
	}, loadingTime);
};


export const retry = (id: any, securityAdvisor: phoenix.SecurityAdvisor) => {
	if (id.includes('antivirus')) {
		securityStatus.avStatus.status = 'loading';
		securityStatus.avStatus.detail = transString['common.securityAdvisor.loading'];
		waitTimeout('antivirus');
	}
	if (id.includes('firewall')) {
		securityStatus.fwStatus.status = 'loading';
		securityStatus.fwStatus.detail = transString['common.securityAdvisor.loading'];
		waitTimeout('firewall');
	}

	securityAdvisor.antivirus.refresh();
}
