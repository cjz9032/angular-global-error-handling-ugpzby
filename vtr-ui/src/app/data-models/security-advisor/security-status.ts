import { Antivirus, SecurityAdvisor } from '@lenovo/tan-client-bridge';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';
import { AntivirusService } from 'src/app/services/security/antivirus.service';
import { AntivirusCommonData } from './antivirus-common.data.model';
import { SecurityTypeConst } from './status-info.model';
import { LandingView } from './widegt-security-landing/landing-view.model';

export type SecurityFeature = {
	pluginSupport: boolean;
	vpnSupport: boolean;
	pwdSupport: boolean;
	fingerprintSupport: boolean;
};

export type SecurityLevel = {
	landingStatus: LandingView;
	basicView?: any;
	intermediateView?: any;
	advancedView?: any;
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
	securityAdvisor: SecurityAdvisor,
	translationString: any,
	haveOwnList: any,
	securityFeature: SecurityFeature,
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

	let currentPage = '';
	const cacheShowWindowsHello = localCacheService.getLocalCacheValue(LocalStorageKey.SecurityShowWindowsHello);
	const cacheShowWifiSecurity = localCacheService.getLocalCacheValue(LocalStorageKey.SecurityShowWifiSecurity);
	if (haveOwnList) {
		securityStatus.pmStatus.showOwn = haveOwnList.passwordManager === true;
		securityStatus.wfStatus.showOwn = haveOwnList.wifiSecurity === true;
		securityStatus.vpnStatus.showOwn = haveOwnList.vpn === true;
	}

	// antivirus and firewall
	const antivirusStatus = getAntivirusStatus(localCacheService, antiVirus);
	currentPage = antivirusStatus.currentPage;
	if (antivirusStatus.firewallLink.includes('ms-settings')) {
		securityStatus.fwStatus.buttonLink = '';
		securityStatus.fwStatus.buttonHref = antivirusStatus.firewallLink;
	} else {
		securityStatus.fwStatus.buttonHref = '';
		securityStatus.fwStatus.buttonLink = antivirusStatus.firewallLink;
	}
	if (currentPage === 'windows') {
		if (securityStatus.avStatus.status === 'failedLoad') {
			securityStatus.avStatus.status = 'loading';
			if (translationString) {
				securityStatus.avStatus.detail = translationString['common.securityAdvisor.loading'];
			}
			waitTimeout('antivirus');
		}
		if (securityStatus.fwStatus.status === 'failedLoad') {
			securityStatus.fwStatus.status = 'loading';
			if (translationString) {
				securityStatus.fwStatus.detail = translationString['common.securityAdvisor.loading'];
			}
			waitTimeout('firewall');
		}
	}
	if (typeof antivirusStatus.antivirus !== 'boolean' && typeof antivirusStatus.firewall !== 'boolean') {
		securityStatus.avStatus.status = 'loading';
		securityStatus.fwStatus.status = 'loading';
		if (translationString) {
			securityStatus.avStatus.detail = translationString['common.securityAdvisor.loading'];
			securityStatus.fwStatus.detail = translationString['common.securityAdvisor.loading'];
		}
	}
	if (typeof antivirusStatus.antivirus === 'boolean' && typeof antivirusStatus.firewall === 'boolean') {
		securityStatus.avStatus.status = antivirusStatus.antivirus ? 'enabled' : 'disabled';
		securityStatus.fwStatus.status = antivirusStatus.firewall ? 'enabled' : 'disabled';
		if (translationString) {
			securityStatus.avStatus.detail = translationString[`common.securityAdvisor.${antivirusStatus.antivirus ? 'enabled' : 'disabled'}`];
			securityStatus.fwStatus.detail = translationString[`common.securityAdvisor.${antivirusStatus.firewall ? 'enabled' : 'disabled'}`];
		}
	} else if (typeof antivirusStatus.firewall !== 'boolean' && typeof antivirusStatus.antivirus === 'boolean') {
		securityStatus.avStatus.status = antivirusStatus.antivirus ? 'enabled' : 'disabled';
		if (translationString) {
			securityStatus.avStatus.detail = translationString[`common.securityAdvisor.${antivirusStatus.antivirus ? 'enabled' : 'disabled'}`];
		}
	} else if (typeof antivirusStatus.antivirus !== 'boolean' && typeof antivirusStatus.firewall === 'boolean') {
		securityStatus.fwStatus.status = antivirusStatus.firewall ? 'enabled' : 'disabled';
		if (translationString) {
			securityStatus.fwStatus.detail = translationString[`common.securityAdvisor.${antivirusStatus.firewall ? 'enabled' : 'disabled'}`];
		}
	}
	// windows activation and uac
	if (securityFeature.pluginSupport) {
		securityStatus.uacStatus.launch = securityAdvisor.uac.launch.bind(securityAdvisor.uac);
		const cacheWaStatus = localCacheService.getLocalCacheValue(LocalStorageKey.SecurityWindowsActiveStatus);
		if (windowsActive.status !== 'unknown') {
			securityStatus.waStatus.status = windowsActive.status === 'enable' ? 'enabled' : 'disabled';
			if (translationString) {
				securityStatus.waStatus.detail = translationString[`common.securityAdvisor.${windowsActive.status === 'enable' ? 'enabled' : 'disabled'}`];
			}
			localCacheService.setLocalCacheValue(LocalStorageKey.SecurityWindowsActiveStatus, windowsActive.status);
		} else if (cacheWaStatus) {
			securityStatus.waStatus.status = cacheWaStatus === 'enable' ? 'enabled' : 'disabled';
			if (translationString) {
				securityStatus.waStatus.detail = translationString[`common.securityAdvisor.${cacheWaStatus === 'enable' ? 'enabled' : 'disabled'}`];
			}
		}

		const cacheUacStatus = localCacheService.getLocalCacheValue(LocalStorageKey.SecurityUacStatus);
		if (uac.status !== 'unknown') {
			securityStatus.uacStatus.status = uac.status === 'enable' ? 'enabled' : 'disabled';
			if (translationString) {
				securityStatus.uacStatus.detail = translationString[`common.securityAdvisor.${uac.status === 'enable' ? 'enabled' : 'disabled'}`];
			}
			localCacheService.setLocalCacheValue(LocalStorageKey.SecurityUacStatus, uac.status);
		} else if (cacheUacStatus) {
			securityStatus.uacStatus.status = cacheUacStatus === 'enable' ? 'enabled' : 'disabled';
			if (translationString) {
				securityStatus.uacStatus.detail = translationString[`common.securityAdvisor.${cacheUacStatus === 'enable' ? 'enabled' : 'disabled'}`];
			}
		}
	} else {
		securityStatus.waStatus.status = undefined;
		securityAdvisor.uac.status = undefined;
	}
	// password manager
	if (securityFeature.pwdSupport) {
		const cachePmStatus = localCacheService.getLocalCacheValue(LocalStorageKey.SecurityPasswordManagerStatus);
		let pmStatus: string;
		if (pwdManager.status) {
			pmStatus = pwdManager.status;
			localCacheService.setLocalCacheValue(LocalStorageKey.SecurityPasswordManagerStatus, pwdManager.status);
		} else if (cachePmStatus) {
			pmStatus = cachePmStatus;
		}
		switch (pmStatus) {
			case 'installed':
				securityStatus.pmStatus.status = 'installed';
				if (translationString) {
					securityStatus.pmStatus.detail = translationString['common.securityAdvisor.installed'];
				}
				break;
			case 'installing':
				securityStatus.pmStatus.status = 'installing';
				if (translationString) {
					securityStatus.pmStatus.detail = translationString['common.securityAdvisor.installing'];
				}
				break;
			default:
				securityStatus.pmStatus.status = 'not-installed';
				if (translationString) {
					securityStatus.pmStatus.detail = translationString['common.securityAdvisor.notInstalled'];
				}
		}
	} else {
		securityStatus.pmStatus.status = undefined;
	}
	// fingerprint
	if (securityFeature.fingerprintSupport || cacheShowWindowsHello) {
		localCacheService.setLocalCacheValue(LocalStorageKey.SecurityShowWindowsHello, true);
		const cacheWhStatus = localCacheService.getLocalCacheValue(LocalStorageKey.SecurityLandingWindowsHelloFingerprintStatus);
		if (windowsHello && windowsHello.fingerPrintStatus) {
			securityStatus.whStatus.status = windowsHello.fingerPrintStatus === 'active' ? 'enabled' : 'disabled';
			if (translationString) {
				securityStatus.whStatus.detail = translationString[`common.securityAdvisor.${windowsHello.fingerPrintStatus === 'active' ? 'enrolled' : 'notEnrolled'}`];
			}
			localCacheService.setLocalCacheValue(LocalStorageKey.SecurityLandingWindowsHelloFingerprintStatus, windowsHello.fingerPrintStatus);
		} else if (cacheWhStatus) {
			securityStatus.whStatus.status = cacheWhStatus === 'active' ? 'enabled' : 'disabled';
			if (translationString) {
				securityStatus.whStatus.detail = translationString[`common.securityAdvisor.${cacheWhStatus === 'active' ? 'enrolled' : 'notEnrolled'}`];
			}
		}
	} else {
		securityStatus.whStatus.status = undefined;
	}
	// wifi security
	if (wifiSecurity.isSupported || cacheShowWifiSecurity) {
		localCacheService.setLocalCacheValue(LocalStorageKey.SecurityShowWifiSecurity, true);
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
				if (translationString) {
					securityStatus.wfStatus.detail = translationString[`common.securityAdvisor.${ wifiStatus === 'enabled' ? 'enabled' : 'disabled'}`];
				}
			} else {
				securityStatus.wfStatus.status = 'disabled';
				if (translationString) {
					securityStatus.wfStatus.detail = translationString['common.securityAdvisor.disabled'];
				}
			}
		}
	} else {
		securityStatus.wfStatus.status = undefined;
	}
	// vpn
	if (securityFeature.vpnSupport) {
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
				if (translationString) {
					securityStatus.vpnStatus.detail = translationString['common.securityAdvisor.installed'];
				}
				break;
			case 'installing':
				securityStatus.vpnStatus.status = 'installing';
				if (translationString) {
					securityStatus.vpnStatus.detail = translationString['common.securityAdvisor.installing'];
				}
				break;
			default:
				securityStatus.vpnStatus.status = 'not-installed';
				if (translationString) {
					securityStatus.vpnStatus.detail = translationString['common.securityAdvisor.notInstalled'];
				}
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
	const intermediateView = [securityFeature.pwdSupport ? securityStatus.pmStatus : undefined, (securityFeature.fingerprintSupport || cacheShowWindowsHello) ? securityStatus.whStatus : undefined, securityFeature.pluginSupport ? securityStatus.uacStatus : undefined].filter(i => i !== undefined);
	const advancedView = [(securityAdvisor.wifiSecurity.isSupported || cacheShowWifiSecurity) ? securityStatus.wfStatus : undefined, securityFeature.vpnSupport ? securityStatus.vpnStatus : undefined].filter(i => i !== undefined);
	localCacheService.setLocalCacheValue(LocalStorageKey.SecurityLandingLevel, landingStatus);
	if (transString) {
		return {landingStatus, basicView, intermediateView, advancedView};
	} else {
		return {landingStatus};
	}
};

export const waitTimeout = (type: string) => {
	setTimeout(() => {
		if ((securityStatus.avStatus.status === undefined || securityStatus.avStatus.status === 'loading') && type === 'antivirus') {
			securityStatus.avStatus.status = 'failedLoad';
			if (transString) {
				securityStatus.avStatus.detail = transString['common.ui.failedLoad'];
			}
		}
		if ((securityStatus.fwStatus.status === undefined || securityStatus.fwStatus.status === 'loading') && type === 'firewall') {
			securityStatus.fwStatus.status = 'failedLoad';
			if (transString) {
				securityStatus.fwStatus.detail = transString['common.ui.failedLoad'];
			}
		}
	}, loadingTime);
};


export const retryAntivirus = (id: any, securityAdvisor: SecurityAdvisor) => {
	if (id.includes('antivirus')) {
		securityStatus.avStatus.status = 'loading';
		if (transString) {
			securityStatus.avStatus.detail = transString['common.securityAdvisor.loading'];
		}
		waitTimeout('antivirus');
	}
	if (id.includes('firewall')) {
		securityStatus.fwStatus.status = 'loading';
		if (transString) {
			securityStatus.fwStatus.detail = transString['common.securityAdvisor.loading'];
		}
		waitTimeout('firewall');
	}

	securityAdvisor.antivirus.refresh();
};

const getAntivirusStatus = (localCacheService: LocalCacheService, antivirus: Antivirus) => {
	const cacheAvStatus = localCacheService.getLocalCacheValue(LocalStorageKey.SecurityLandingAntivirusStatus);
	const cacheFwStatus = localCacheService.getLocalCacheValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus);
	const cacheCurrentPage = localCacheService.getLocalCacheValue(LocalStorageKey.SecurityCurrentPage);
	const cacheFirewallLink = localCacheService.getLocalCacheValue(LocalStorageKey.SecurityFirewallLink, '/security/anti-virus');
	let antivirusCommonData = new AntivirusCommonData();
	if (antivirus.mcafee || antivirus.windowsDefender || antivirus.others) {
		antivirusCommonData = setAntivirusPage(antivirus, antivirusCommonData, localCacheService);
	} else if (cacheAvStatus !== undefined || cacheFwStatus !== undefined || cacheCurrentPage || cacheFirewallLink) {
		setAntivirusStatus(cacheAvStatus, cacheFwStatus, antivirusCommonData, localCacheService);
		antivirusCommonData.currentPage = cacheCurrentPage;
		antivirusCommonData.firewallLink = cacheFirewallLink;
	}

	return antivirusCommonData;
};

const setAntivirusPage = (antiVirus: Antivirus, antivirusCommonData: AntivirusCommonData, localCacheService: LocalCacheService) => {
	let av: boolean | undefined;
	let fw: boolean | undefined;
	if (antiVirus.mcafee && (antiVirus.mcafee.enabled || !antiVirus.others || !antiVirus.others.enabled) && antiVirus.mcafee.expireAt > 0) {
		antivirusCommonData.currentPage = 'mcafee';
		antivirusCommonData.isMcAfeeInstalled = true;
		av = antiVirus.mcafee.status;
		fw = antiVirus.mcafee.firewallStatus;
		antivirusCommonData.firewallLink = '/security/anti-virus';
	} else if (antiVirus.others && antiVirus.others.enabled) {
		antivirusCommonData.currentPage = 'others';
		antivirusCommonData.isMcAfeeInstalled = Boolean(antiVirus.mcafee);
		av = antiVirus.others.antiVirus.length > 0 ? antiVirus.others.antiVirus[0].status : undefined;
		if (antiVirus.windowsDefender) {
			fw = antiVirus.others.firewall.length > 0 ? antiVirus.others.firewall[0].status : antiVirus.windowsDefender.firewallStatus;
			antivirusCommonData.firewallLink = antiVirus.others.firewall.length > 0 ? '/security/anti-virus' : 'ms-settings:windowsdefender';
		} else {
			fw = antiVirus.others.firewall.length > 0 ? antiVirus.others.firewall[0].status : undefined;
			antivirusCommonData.firewallLink = '/security/anti-virus';
		}
	} else {
		antivirusCommonData.currentPage = 'windows';
		antivirusCommonData.isMcAfeeInstalled = false;
		if (antiVirus.windowsDefender) {
			av = antiVirus.windowsDefender.status;
			fw = antiVirus.windowsDefender.firewallStatus;
		}
		antivirusCommonData.firewallLink = '/security/anti-virus';
	}

	antivirusCommonData = setAntivirusStatus(av, fw, antivirusCommonData, localCacheService);
	localCacheService.setLocalCacheValue(LocalStorageKey.SecurityCurrentPage, antivirusCommonData.currentPage);
	localCacheService.setLocalCacheValue(LocalStorageKey.SecurityFirewallLink, antivirusCommonData.firewallLink);
	return antivirusCommonData;
};

const setAntivirusStatus = (av: boolean | undefined, fw: boolean | undefined, antivirusCommonData: AntivirusCommonData, localCacheService: LocalCacheService) => {
	localCacheService.setLocalCacheValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, fw !== undefined ? fw : null);
	localCacheService.setLocalCacheValue(LocalStorageKey.SecurityLandingAntivirusStatus, av !== undefined ? av : null);
	antivirusCommonData.antivirus = av;
	antivirusCommonData.firewall = fw;
	return antivirusCommonData;
};
