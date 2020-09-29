import { Injectable, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import * as phoenix from '@lenovo/tan-client-bridge';
import { EventTypes, UAC } from '@lenovo/tan-client-bridge';

import { AntivirusService } from './antivirus.service';
import { DeviceService } from '../device/device.service';
import { HypothesisService } from '../hypothesis/hypothesis.service';
import { WindowsHelloService } from './windowsHello.service';
import { SecurityTypeConst } from 'src/app/data-models/security-advisor/status-info.model';
import { LandingView } from 'src/app/data-models/security-advisor/widegt-security-landing/landing-view.model';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { VantageShellService } from '../vantage-shell/vantage-shell.service';
import { AntivirusCommonData } from 'src/app/data-models/security-advisor/antivirus-common.data.model';
import { toLower } from 'lodash';
import { LocalCacheService } from '../local-cache/local-cache.service';


@Injectable({
	providedIn: 'root',
})
export class SecurityStatusService {

	antivirus: phoenix.Antivirus;
	passwordManager: phoenix.PasswordManager;
	securityAdvisor: phoenix.SecurityAdvisor;
	uac: UAC;
	vpn: phoenix.Vpn;
	wifiSecurity: phoenix.WifiSecurity;
	windowsActive: phoenix.WindowsActivation;
	windowsHello: phoenix.WindowsHello;

	antivirusCommonData: AntivirusCommonData;

	landingStatus: LandingView = {
		status: 0,
		fullyProtected: false,
		percent: 0,
	};
	pageToGo: string;
	pluginSupport = true;
	showDashlane: boolean;
	showVpn: boolean;
	isWifiSecuritySupported = false;
	isVpnSupported = false;
	isUacSupported = false;
	isFingerPrintSupported = false;
	isPasswordManagerSupported = false;
	isWondowsActiveSupported = false;

	baseItems = [];
	intermediateItems = [];
	advanceItems = [];
	loadTime = 15000;
	avCurrentPage: string;

	whStatus = {
		status: 'loading',
		icon: 'landing-finger',
		title: 'security.landing.fingerprint',
		content: 'security.landing.fingerprintContent',
		buttonLabel: 'security.landing.visitFingerprint',
		buttonHref: 'ms-settings:signinoptions',
		noneCheck: true,
		id: 'sa-ov-btn-fingerPrint',
		detail: '',
	};

	pmStatus = {
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
	};

	uacStatus = {
		status: 'loading',
		icon: 'landing-uac',
		title: 'security.landing.uac',
		content: 'security.landing.uacContent',
		buttonLabel: 'security.landing.visitUac',
		launch() {},
		noneCheck: true,
		detail: '',
		id: 'sa-ov-btn-uac',
	};

	vpnStatus = {
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
	};

	wfStatus  = {
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
	};

	waStatus = {
		status: 'loading',
		icon: 'landing-windows',
		title: 'security.landing.windows',
		content: 'security.landing.windowsActiveContent',
		buttonLabel: 'security.landing.visitWindows',
		buttonHref: 'ms-settings:activation',
		noneCheck: true,
		detail: '',
		id: 'sa-ov-btn-windowsActive',
	};

	avStatus = {
		status: 'loading',
		icon: 'landing-antivirus',
		title: 'common.securityAdvisor.antiVirus',
		content: 'security.landing.antivirusContent',
		buttonLabel: 'security.landing.goAntivirus',
		buttonLink: '/security/anti-virus',
		noneCheck: true,
		detail: '',
		id: 'sa-ov-link-antivirus',
	};

	fwStatus = {
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
	};

	translateString: any;

	constructor(
		private antivirusService: AntivirusService,
		private deviceService: DeviceService,
		private hypSettings: HypothesisService,
		private ngZone: NgZone,
		private translate: TranslateService,
		private localCacheService: LocalCacheService,
		private vantageShellService: VantageShellService,
		private windowsHelloService: WindowsHelloService
	) {
		this.securityAdvisor = this.vantageShellService.getSecurityAdvisor();
		if (this.securityAdvisor) {
			this.antivirus = this.securityAdvisor.antivirus;
			this.passwordManager = this.securityAdvisor.passwordManager;
			this.uac = this.securityAdvisor.uac;
			this.vpn = this.securityAdvisor.vpn;
			this.wifiSecurity = this.securityAdvisor.wifiSecurity;
			this.windowsActive = this.securityAdvisor.windowsActivation;
			this.windowsHello = this.securityAdvisor.windowsHello;
		}
	}

	init(): Promise<void> {
		return this.deviceService.getMachineInfo().then(result => {
			this.showVpn = true;
			this.showDashlane = true;
			if (toLower(result && result.country ? result.country : 'US') === 'cn') {
				this.showVpn = false;
				this.showDashlane = false;
			}
			if (this.wifiSecurity) {
				this.wifiSecurity.getWifiSecurityState();
			}
			this.refreshAll();
		}).catch(e => {
			this.showVpn = true;
			this.showDashlane = true;
		}).finally(() => {
			this.hypSettings.getFeatureSetting('SecurityAdvisor').then((result) => {
				this.pluginSupport = result === 'true';
			})
			.catch((e) => {
				this.pluginSupport = false;
			}).finally(() => {
				this.getSecurityStatus();
			});
		});
	}

	setSecurityUI() {
		this.translate.stream([
			'common.securityAdvisor.loading',
			'common.securityAdvisor.enrolled',
			'common.securityAdvisor.notEnrolled',
			'common.securityAdvisor.installed',
			'common.securityAdvisor.installing',
			'common.securityAdvisor.notInstalled',
			'common.securityAdvisor.enabled',
			'common.securityAdvisor.disabled',
			'common.securityAdvisor.wifi',
			'common.securityAdvisor.antiVirus',
			'common.ui.failedLoad',
			'security.landing.fingerprint',
			'security.landing.fingerprintContent',
			'security.landing.visitFingerprint',
			'security.landing.pwdHealth',
			'security.landing.passwordContent',
			'security.landing.haveOwnPassword',
			'security.landing.goPassword',
			'security.landing.uac',
			'security.landing.uacContent',
			'security.landing.visitUac',
			'security.landing.vpnVirtual',
			'security.landing.haveOwnVpn',
			'security.landing.vpnContent',
			'security.landing.goVpn',
			'security.landing.goWifi',
			'security.landing.wifiContent',
			'security.landing.haveOwnWifi',
			'security.landing.windows',
			'security.landing.windowsActiveContent',
			'security.landing.visitWindows',
			'security.landing.firewall',
			'security.landing.antivirusContent',
			'security.landing.goAntivirus',
			'security.landing.firewallContent',
			'security.landing.goFirewall',
		]).subscribe((res: any) => {
			this.translateString = res;
			this.setInitSecurityUI(res);
		});
	}

	setInitSecurityUI(trans: any) {
		const whCacheStatus = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityLandingWindowsHelloFingerprintStatus);
		const pmCacheStatus = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityWindowsActiveStatus);
		const uacCacheStatus = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityUacStatus);
		const vpnCacheStatus = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityVPNStatus);
		const wsCacheStatus = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityWifiSecurityState);
		const wsCacheShowOwn = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityLandingWifiSecurityShowOwn, null);
		const waCacheStatus = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityWindowsActiveStatus);

		if (!this.avStatus.detail) {
			this.avStatus.detail = trans['common.securityAdvisor.loading'];
		}
		if (!this.fwStatus.detail) {
			this.fwStatus.detail = trans['common.securityAdvisor.loading'];
		}
		this.avStatus.title = trans['common.securityAdvisor.antiVirus'];
		this.avStatus.content = trans['security.landing.antivirusContent'];
		this.avStatus.buttonLabel = trans['security.landing.goAntivirus'];
		this.fwStatus.title = trans['security.landing.firewall'];
		this.fwStatus.content = trans['security.landing.firewallContent'];
		this.fwStatus.buttonLabel = trans['security.landing.goFirewall'];
		this.setAvUI(this.antivirusService.GetAntivirusStatus());

		if (!this.waStatus.detail) {
			this.waStatus.detail = trans['common.securityAdvisor.loading'];
		}
		this.waStatus.title = trans['security.landing.windows'];
		this.waStatus.content = trans['security.landing.windowsActiveContent'];
		this.waStatus.buttonLabel = trans['security.landing.visitWindows'];
		if (this.windowsActive.status !== 'unknown') {
			this.setWindowsActivationStatus(this.windowsActive.status);
		} else if (waCacheStatus) {
			this.setWindowsActivationStatus(waCacheStatus);
		}

		if (!this.pmStatus.detail) {
			this.pmStatus.detail = trans['common.securityAdvisor.loading'];
		}
		this.pmStatus.title = trans['security.landing.pwdHealth'];
		this.pmStatus.content = trans['security.landing.passwordContent'];
		this.pmStatus.buttonLabel = trans['security.landing.goPassword'];
		this.pmStatus.ownTitle = trans['security.landing.haveOwnPassword'];
		if (this.passwordManager.status) {
			this.setPasswordManagerStatus(this.passwordManager.status);
		} else if (pmCacheStatus) {
			this.setPasswordManagerStatus(pmCacheStatus);
		}

		if (!this.uacStatus.detail) {
			this.uacStatus.detail = trans['common.securityAdvisor.loading'];
		}
		this.uacStatus.title = trans['security.landing.uac'];
		this.uacStatus.content = trans['security.landing.uacContent'];
		this.uacStatus.buttonLabel = trans['security.landing.visitUac'];
		this.uacStatus.launch = this.uac.launch.bind(this.uac);
		if (this.uac.status !== 'unknown') {
			this.setUacStatus(this.uac.status);
		} else if (uacCacheStatus) {
			this.setUacStatus(uacCacheStatus);
		}

		if (!this.vpnStatus.detail) {
			this.vpnStatus.detail = trans['common.securityAdvisor.loading'];
		}
		this.vpnStatus.title = trans['security.landing.vpnVirtual'];
		this.vpnStatus.buttonLabel = trans['security.landing.goVpn'];
		this.vpnStatus.content = trans['security.landing.vpnContent'];
		this.vpnStatus.ownTitle = trans['security.landing.haveOwnVpn'];
		if (this.vpn.status) {
			this.setVpnStatus(this.vpn.status);
		} else if (vpnCacheStatus) {
			this.setVpnStatus(vpnCacheStatus);
		}

		if (!this.wfStatus.detail) {
			this.wfStatus.detail = trans['common.securityAdvisor.loading'];
		}
		this.wfStatus.title = trans['common.securityAdvisor.wifi'];
		this.wfStatus.content = trans['security.landing.wifiContent'];
		this.wfStatus.ownTitle = trans['security.landing.haveOwnWifi'];
		this.wfStatus.buttonLabel = trans['security.landing.goWifi'];
		this.wfStatus.showOwn = wsCacheShowOwn ? wsCacheShowOwn : false;
		if (this.wifiSecurity && this.wifiSecurity.state) {
			if (this.wifiSecurity.isLocationServiceOn !== undefined) {
				this.setWiFiSecurityState(this.wifiSecurity.state, this.wifiSecurity.isLocationServiceOn);
			}
		} else if (wsCacheStatus) {
			if (this.wifiSecurity && this.wifiSecurity.isLocationServiceOn !== undefined) {
				this.setWiFiSecurityState(wsCacheStatus, this.wifiSecurity.isLocationServiceOn);
			}
		}

		if (!this.whStatus.detail) {
			this.whStatus.detail = trans['common.securityAdvisor.loading'];
		}
		this.whStatus.title = trans['security.landing.fingerprint'];
		this.whStatus.content = trans['security.landing.fingerprintContent'];
		this.whStatus.buttonLabel = trans['security.landing.visitFingerprint'];
		if (this.windowsHello && this.windowsHello.fingerPrintStatus) {
			this.setWindowsHelloStatus(this.windowsHello.fingerPrintStatus);
		} else if (whCacheStatus) {
			this.setWindowsHelloStatus(whCacheStatus);
		}
	}

	getSecurityStatus() {
		this.waitTimeout('antivirus');
		this.waitTimeout('firewall');
		this.antivirus.on(EventTypes.avRefreshedEvent, () => {
			this.setAvUI(this.antivirusService.GetAntivirusStatus());
		}).on(EventTypes.avStartRefreshEvent, () => {
			if (this.avCurrentPage === 'windows') {
				if (this.avStatus.status === 'failedLoad') {
					this.avStatus.status = 'loading';
					this.avStatus.detail = this.translateString['common.securityAdvisor.loading'];
					this.waitTimeout('antivirus');
				}
				if (this.fwStatus.status === 'failedLoad') {
					this.fwStatus.status = 'loading';
					this.fwStatus.detail = this.translateString['common.securityAdvisor.loading'];
					this.waitTimeout('firewall');
				}
			}
		});
		this.antivirusCommonData = this.antivirusService.GetAntivirusStatus();
		this.setAvUI(this.antivirusService.GetAntivirusStatus());

		this.windowsActive.on(EventTypes.waStatusEvent, (data) => {
			if (data !== 'unknown') {
				this.isWondowsActiveSupported = true;
				this.setWindowsActivationStatus(data);
			}
		});

		if (this.showDashlane) {
			this.passwordManager.on(EventTypes.pmStatusEvent, (data) => {
				this.setPasswordManagerStatus(data);
			});
			this.isPasswordManagerSupported = true;
		}
		this.uac.on(EventTypes.uacStatusEvent, (data) => {
			if (data !== 'unknown') {
				this.isUacSupported = true;
				this.setUacStatus(data);
				this.updateSecurityItems();
			}
		});
		if (this.showVpn) {
			this.vpn.on(EventTypes.vpnStatusEvent, (data) => {
				this.setVpnStatus(data);
			});
			this.isVpnSupported = true;
		}
		const cacheShowWindowsHello = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityShowWindowsHello);
		const cacheShowWifiSecurity = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityShowWifiSecurity);
		if (cacheShowWindowsHello) {
			this.windowsHello.on(EventTypes.helloFingerPrintStatusEvent, (data) => {
				this.setWindowsHelloStatus(data);
			});
			this.isFingerPrintSupported = true;
		}
		if (cacheShowWifiSecurity || this.wifiSecurity.isSupported) {
			this.wifiSecurity.on(EventTypes.wsIsLocationServiceOnEvent, (data) => {
				this.ngZone.run(() => {
					this.setWiFiSecurityState(this.wifiSecurity.state, data);
				});
			});
			this.wifiSecurity.on(EventTypes.wsStateEvent, (data) => {
				this.setWiFiSecurityState(data, this.wifiSecurity.isLocationServiceOn);
			});
			this.isWifiSecuritySupported = true;
		}
		this.windowsHello.on(EventTypes.helloFingerPrintStatusEvent, (data) => {
			if (this.windowsHelloService.showWindowsHello(this.windowsHello)) {
				this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityShowWindowsHello, true);
				this.setWindowsHelloStatus(data);
				this.isFingerPrintSupported = true;
			} else {
				this.isFingerPrintSupported = false;
			}
			this.updateSecurityItems();
		});
		this.updateStatus();
		this.wifiSecurity.on(EventTypes.wsIsSupportWifiEvent, () => {
			if (this.wifiSecurity.isSupported) {
				this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityShowWifiSecurity, true);
				this.wifiSecurity.on(EventTypes.wsIsLocationServiceOnEvent, (data) => {
					this.ngZone.run(() => {
						this.setWiFiSecurityState(this.wifiSecurity.state, data);
					});
				});
				this.wifiSecurity.on(EventTypes.wsStateEvent, (data) => {
					this.setWiFiSecurityState(data, this.wifiSecurity.isLocationServiceOn);
				});
				this.isWifiSecuritySupported = true;
			} else {
				this.isWifiSecuritySupported = false;
			}
			this.updateSecurityItems();
		}).on(EventTypes.wsStateEvent, () => {
			this.updateStatus();
		}).on(EventTypes.wsIsLocationServiceOnEvent, () => {
			this.ngZone.run(() => {
				this.updateStatus();
			});
		});
		this.updateSecurityItems();
		this.securityAdvisor.refresh();
	}

	setAntiVirusStatus(av: boolean | undefined, fw: boolean | undefined) {
		if (!this.translateString || ((typeof av !== 'boolean' && typeof fw !== 'boolean'))) {
			return;
		}
		if (typeof av === 'boolean' && typeof fw === 'boolean') {
			this.avStatus.status = av ? 'enabled' : 'disabled';
			this.avStatus.detail = this.translateString[`common.securityAdvisor.${av ? 'enabled' : 'disabled'}`];
			this.fwStatus.status = fw ? 'enabled' : 'disabled';
			this.fwStatus.detail = this.translateString[`common.securityAdvisor.${fw ? 'enabled' : 'disabled'}`];
		} else if (typeof fw !== 'boolean' && typeof av === 'boolean') {
			this.avStatus.status = av ? 'enabled' : 'disabled';
			this.avStatus.detail = this.translateString[`common.securityAdvisor.${av ? 'enabled' : 'disabled'}`];
		} else if (typeof av !== 'boolean' && typeof fw === 'boolean') {
			this.fwStatus.status = fw ? 'enabled' : 'disabled';
			this.fwStatus.detail = this.translateString[`common.securityAdvisor.${fw ? 'enabled' : 'disabled'}`];
		}
	}

	setAvUI(antivirusCommonData: AntivirusCommonData) {
		this.avCurrentPage = antivirusCommonData.currentPage;
		if (antivirusCommonData.firewallLink.includes('ms-settings')) {
			this.fwStatus.buttonLink = '';
			this.fwStatus.buttonHref = antivirusCommonData.firewallLink;
		} else {
			this.fwStatus.buttonHref = '';
			this.fwStatus.buttonLink = antivirusCommonData.firewallLink;
		}
		this.setAntiVirusStatus(antivirusCommonData.antivirus, antivirusCommonData.firewall);
	}

	setWindowsActivationStatus(status: string) {
		if (!this.translateString) {
			return;
		}
		this.waStatus.detail = this.translateString[`common.securityAdvisor.${status === 'enable' ? 'enabled' : 'disabled'}`];
		this.waStatus.status = status === 'enable' ? 'enabled' : 'disabled';
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityWindowsActiveStatus, status);
	}

	setPasswordManagerStatus(status: string) {
		if (!this.translateString) {
			return;
		}
		const cacheShowOwn: boolean = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityLandingPasswordManagerShowOwn, null);
		this.pmStatus.showOwn = cacheShowOwn ? cacheShowOwn : false;
		switch (status) {
			case 'installed':
				this.pmStatus.status = 'installed';
				this.pmStatus.detail = this.translateString['common.securityAdvisor.installed'];
				break;
			case 'installing':
				this.pmStatus.status = 'installing';
				this.pmStatus.detail = this.translateString['common.securityAdvisor.installing'];
				break;
			default:
				this.pmStatus.status = 'not-installed';
				this.pmStatus.detail = this.translateString['common.securityAdvisor.notInstalled'];
		}
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityPasswordManagerStatus, status);
	}

	setWindowsHelloStatus(finger: string) {
		if (!this.translateString) {
			return;
		}
		this.whStatus.detail = this.translateString[`common.securityAdvisor.${finger === 'active' ? 'enrolled' : 'notEnrolled'}`];
		this.whStatus.status = finger === 'active' ? 'enabled' : 'disabled';
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityLandingWindowsHelloFingerprintStatus, finger);
	}

	setUacStatus(status: string) {
		if (!this.translateString) {
			return;
		}
		this.uacStatus.detail = this.translateString[`common.securityAdvisor.${status === 'enable' ? 'enabled' : 'disabled'}`];
		this.uacStatus.status = status === 'enable' ? 'enabled' : 'disabled';
		this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityUacStatus, status);
	}

	setWiFiSecurityState(state: string, location: any) {
		if (!this.translateString) {
			return;
		}
		const cacheShowOwn: boolean = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityLandingWifiSecurityShowOwn, null);
		this.wfStatus.showOwn = cacheShowOwn ? cacheShowOwn : false;
		if (location) {
			this.wfStatus.status = state === 'enabled' ? 'enabled' : 'disabled';
			this.wfStatus.detail = this.translateString[`common.securityAdvisor.${state === 'enabled' ? 'enabled' : 'disabled'}`];
		} else {
			this.wfStatus.status = 'disabled';
			this.wfStatus.detail = this.translateString['common.securityAdvisor.disabled'];
		}
		if (state) {
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityWifiSecurityState, state);
		}
	}

	setVpnStatus(status: string) {
		if (!this.translateString) {
			return;
		}
		const cacheShowOwn: boolean = this.localCacheService.getLocalCacheValue(LocalStorageKey.SecurityLandingVPNShowOwn, null);
		this.vpnStatus.showOwn = cacheShowOwn ? cacheShowOwn : false;
		switch (status) {
			case 'installed':
				this.vpnStatus.status = 'installed';
				this.vpnStatus.detail = this.translateString['common.securityAdvisor.installed'];
				break;
			case 'installing':
				this.vpnStatus.status = 'installing';
				this.vpnStatus.detail = this.translateString['common.securityAdvisor.installing'];
				break;
			default:
				this.vpnStatus.status = 'not-installed';
				this.vpnStatus.detail = this.translateString['common.securityAdvisor.notInstalled'];
		}

		this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityVPNStatus, status);
	}

	waitTimeout(type: string) {
		setTimeout(() => {
			if ((this.avStatus.status === undefined || this.avStatus.status === 'loading') && type === 'antivirus') {
				this.avStatus.status = 'failedLoad';
				this.avStatus.detail = this.translateString['common.ui.failedLoad'];
			}
			if ((this.fwStatus.status === undefined || this.fwStatus.status === 'loading') && type === 'firewall') {
				this.fwStatus.status = 'failedLoad';
				this.fwStatus.detail = this.translateString['common.ui.failedLoad'];
			}
		}, this.loadTime);
	}

	retry(id: any) {
		if (id.includes('antivirus')) {
			this.avStatus.status = 'loading';
			this.avStatus.detail = this.translateString['common.securityAdvisor.loading'];
			this.waitTimeout('antivirus');
		}
		if (id.includes('firewall')) {
			this.fwStatus.status = 'loading';
			this.fwStatus.detail = this.translateString['common.securityAdvisor.loading'];
			this.waitTimeout('firewall');
		}

		this.antivirus.refresh();
	}

	refreshAll(): Promise<void> {
		return this.securityAdvisor.refresh().then(() => {
			this.ngZone.run(() => {
				this.updateSecurityItems();
				this.updateStatus();
			});
		});
	}

	updateSecurityItems() {
		this.baseItems = [];
		this.intermediateItems = [];
		this.advanceItems = [];
		if (!this.pluginSupport) {
			this.isWondowsActiveSupported = false;
			this.isUacSupported = false;
		}
		this.baseItems.push(
			this.avStatus,
			this.fwStatus,
			this.isWondowsActiveSupported
				? this.waStatus
				: undefined
		);
		this.intermediateItems.push(
			this.isPasswordManagerSupported
				? this.pmStatus
				: undefined,
			this.isFingerPrintSupported
				? this.whStatus
				: undefined,
			this.isUacSupported
				? this.uacStatus
				: undefined
		);
		this.advanceItems.push(
			this.isWifiSecuritySupported
				? this.wfStatus
				: undefined,
			this.isVpnSupported
				? this.vpnStatus
				: undefined
		);
		this.baseItems = this.baseItems.filter(
			(i) => i !== undefined && i !== null
		);
		this.intermediateItems = this.intermediateItems.filter(
			(i) => i !== undefined && i !== null
		);
		this.advanceItems = this.advanceItems.filter(
			(i) => i !== undefined && i !== null
		);
	}

	updateStatus(haveOwnList?: any) {
		const statusList = {
			basic: [],
			intermediate: [],
			advanced: [],
		};
		if (!this.pluginSupport) {
			this.isWondowsActiveSupported = false;
			this.isUacSupported = false;
		}
		statusList.basic = new Array(
			this.avStatus.status,
			this.fwStatus.status,
			this.isWondowsActiveSupported
				? this.waStatus.status
				: undefined
		).filter((i) => i !== undefined);
		let pmOwnStatus: boolean;
		let wfOwnStatus: boolean;
		let vpnOwnStatus: boolean;
		if (haveOwnList) {
			pmOwnStatus = haveOwnList.passwordManager === true;
			wfOwnStatus = haveOwnList.wifiSecurity === true;
			vpnOwnStatus = haveOwnList.vpn === true;
		} else {
			pmOwnStatus = this.isPasswordManagerSupported
				? this.pmStatus.showOwn === true
				: undefined;
			wfOwnStatus = this.isWifiSecuritySupported
				? this.wfStatus.showOwn === true
				: undefined;
			vpnOwnStatus = this.isVpnSupported
				? this.vpnStatus.showOwn === true
				: undefined;
		}
		statusList.intermediate = new Array(
			pmOwnStatus
				? 'true'
				: this.isPasswordManagerSupported
					? this.pmStatus.status
					: undefined,
			this.isFingerPrintSupported
				? this.whStatus.status
				: undefined,
			this.isUacSupported
				? this.uacStatus.status
				: undefined
		).filter((i) => i !== undefined);
		statusList.advanced = new Array(
			wfOwnStatus
				? 'true'
				: this.isWifiSecuritySupported
					? this.wfStatus.status
					: undefined,
			vpnOwnStatus
				? 'true'
				: this.isVpnSupported
					? this.vpnStatus.status
					: undefined
		).filter((i) => i !== undefined);

		this.getLevelStatus(statusList);
	}

	getLevelStatus(statusList: any) {
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
							(i) =>
								i === 'true' ||
								i === 'enabled' ||
								i === 'installed' ||
								i === 'enrolled'
						).length;
						levelStatus.basicSuccess =
							element.length === levelStatus.basicValid;
						levelStatus.basicLength = element.length;
						break;
					case SecurityTypeConst.Intermediate:
						levelStatus.intermediateValid = element.filter(
							(i) =>
								i === 'true' ||
								i === 'enabled' ||
								i === 'installed' ||
								i === 'enrolled'
						).length;
						levelStatus.intermediateSuccess =
							element.length === levelStatus.intermediateValid;
						levelStatus.intermediateLength = element.length;
						break;
					case SecurityTypeConst.Advanced:
						levelStatus.advancedValid = element.filter(
							(i) =>
								i === 'true' ||
								i === 'enabled' ||
								i === 'installed' ||
								i === 'enrolled'
						).length;
						levelStatus.advancedSuccess =
							element.length === levelStatus.advancedValid;
						levelStatus.advancedLength = element.length;
						break;
					default:
						break;
				}
			}
		}
		this.calcSecurityLevel(levelStatus);
	}

	calcSecurityLevel(levelStatus: any) {
		this.landingStatus = new LandingView();
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
					this.landingStatus.status = 3;
					this.landingStatus.fullyProtected = true;
					this.landingStatus.percent =
						(levelStatus.advancedValid +
							levelStatus.basicLength +
							levelStatus.intermediateLength) /
						allItems;
				} else {
					this.landingStatus.status = 2;
					this.landingStatus.fullyProtected = false;
					this.landingStatus.percent =
						(levelStatus.intermediateValid +
							levelStatus.basicLength) /
						allItems;
				}
			} else {
				this.landingStatus.status = 1;
				this.landingStatus.fullyProtected = false;
				this.landingStatus.percent = levelStatus.basicValid / allItems;
			}
		} else {
			this.landingStatus.status = 0;
			this.landingStatus.fullyProtected = false;
			this.landingStatus.percent = 0;
		}
		this.localCacheService.setLocalCacheValue(
			LocalStorageKey.SecurityLandingLevel,
			this.landingStatus
		);
	}
}
