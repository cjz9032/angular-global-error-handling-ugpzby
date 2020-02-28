import {
	EventTypes
} from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import {
	CommonService
} from 'src/app/services/common/common.service';
import {
	LocalStorageKey
} from 'src/app/enums/local-storage-key.enum';
import {
	TranslateService
} from '@ngx-translate/core';

export class AntiVirusLandingViewModel {
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
		buttonLink: '/security/anti-virus',
		noneCheck: true,
		detail: '',
		id: 'sa-ov-link-firewall'
	};
	currentPage: string;
	translateString: any;
	loadTime = 15000;
	constructor(translate: TranslateService, public avModel: phoenix.Antivirus, public commonService: CommonService) {
		this.waitTimeout('antivirus');
		this.waitTimeout('firewall');
		avModel.on(EventTypes.avRefreshedEvent, (av) => {
			this.setPage(av);
		}).on(EventTypes.avStartRefreshEvent, () => {
			if (this.currentPage === 'windows') {
				if (this.avStatus.status === 'failedLoad') {
					this.avStatus.status = 'loading';
					this.waitTimeout('antivirus');
				} else if (this.fwStatus.status === 'failedLoad') {
					this.fwStatus.status = 'loading';
					this.waitTimeout('firewall');
				}
			}
		});
		translate.stream([
			'common.securityAdvisor.enabled',
			'common.securityAdvisor.disabled',
			'common.securityAdvisor.antiVirus',
			'security.landing.firewall',
			'common.securityAdvisor.loading',
			'security.landing.antivirusContent',
			'security.landing.goAntivirus',
			'security.landing.firewallContent',
			'security.landing.goFirewall',
			'common.ui.failedLoad'
		]).subscribe((res: any) => {
			this.translateString = res;
			if (!this.avStatus.detail) {
				this.avStatus.detail = res['common.securityAdvisor.loading'];
			}
			if (!this.fwStatus.detail) {
				this.fwStatus.detail = res['common.securityAdvisor.loading'];
			}
			this.avStatus.title = res['common.securityAdvisor.antiVirus'];
			this.avStatus.content = res['security.landing.antivirusContent'];
			this.avStatus.buttonLabel = res['security.landing.goAntivirus'];
			this.fwStatus.title = res['security.landing.firewall'];
			this.fwStatus.content = res['security.landing.firewallContent'];
			this.fwStatus.buttonLabel = res['security.landing.goFirewall'];
			const cacheAvStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus);
			const cacheFwStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus);
			const cacheCurrentPage = commonService.getLocalStorageValue(LocalStorageKey.SecurityCurrentPage);
			if (cacheCurrentPage) {
				this.currentPage = cacheCurrentPage;
			}
			if (avModel.mcafee || avModel.windowsDefender || avModel.others) {
				this.setPage(avModel);
			} else if (cacheAvStatus !== undefined || cacheFwStatus !== undefined) {
				this.setAntivirusStatus(cacheAvStatus, cacheFwStatus, cacheCurrentPage);
			}

		});
	}

	setPage(antiVirus: phoenix.Antivirus) {
		if (antiVirus.mcafee && (antiVirus.mcafee.enabled || !antiVirus.others || !antiVirus.others.enabled) && antiVirus.mcafee.expireAt > 0) {
			this.currentPage = 'mcafee';
			this.setAntivirusStatus(
				antiVirus.mcafee.status !== undefined ? antiVirus.mcafee.status : null,
				antiVirus.mcafee.firewallStatus !== undefined ? antiVirus.mcafee.firewallStatus : null,
				this.currentPage
			);
		} else if (antiVirus.others) {
			this.currentPage = 'others';
			this.setAntivirusStatus(
				antiVirus.others.antiVirus.length > 0 ? antiVirus.others.antiVirus[0].status : null,
				antiVirus.others.firewall.length > 0 ? antiVirus.others.firewall[0].status : antiVirus.windowsDefender.firewallStatus,
				this.currentPage
			);
		} else {
			this.currentPage = 'windows';
			if (antiVirus.windowsDefender) {
				this.setAntivirusStatus(
					antiVirus.windowsDefender.status !== undefined ? antiVirus.windowsDefender.status : null,
					antiVirus.windowsDefender.firewallStatus !== undefined ? antiVirus.windowsDefender.firewallStatus : null,
					this.currentPage
				);
			}
		}
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityCurrentPage, this.currentPage);
	}

	setAntivirusStatus(av: boolean | undefined, fw: boolean | undefined, currentPage: string) {
		fw = undefined;
		if (!this.translateString) {
			return;
		}
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, fw !== undefined ? fw : null);
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, av !== undefined ? av : null);

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

	retry(id) {
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

		this.avModel.refresh();
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
}
