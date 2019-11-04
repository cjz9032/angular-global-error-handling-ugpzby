import {
	EventTypes, Antivirus
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
import { StatusInfo } from './status-info.model';

export class AntiVirusLandingViewModel {
	statusList: Array<StatusInfo>;
	type = 'security';
	imgUrl = '';
	currentPage: string;

	avStatus = {
		status: 4,
		detail: '',
		path: 'security/anti-virus',
		title: '',
		type: 'security',
		id: 'sa-ov-link-antivirus'
	};
	fwStatus = {
		status: 4,
		detail: '',
		path: 'security/anti-virus',
		title: '',
		type: 'security',
		id: 'sa-ov-link-firewall'
	};
	subject = {
		status: 1,
		title: '',
		type: 'security',
	};
	translateString: any;
	constructor(public translate: TranslateService, avModel: phoenix.Antivirus, public commonService: CommonService, ) {
		avModel.on(EventTypes.avRefreshedEvent, (av) => {
			this.setPage(av);

			this.statusList = new Array(this.avStatus, this.fwStatus.status !== null ? this.fwStatus : null).filter(current => {
				return current !== undefined && current !== null;
			});
		});

		translate.stream([
			'common.securityAdvisor.enabled',
			'common.securityAdvisor.disabled',
			'common.securityAdvisor.antiVirus',
			'security.landing.firewall',
			'common.securityAdvisor.loading'
		]).subscribe((res: any) => {
			this.translateString = res;
			if (!this.avStatus.detail) {
				this.avStatus.detail = res['common.securityAdvisor.loading'];
			}
			if (!this.fwStatus.detail) {
				this.fwStatus.detail = res['common.securityAdvisor.loading'];
			}
			this.avStatus.title = res['common.securityAdvisor.antiVirus'];
			this.fwStatus.title = res['security.landing.firewall'];
			this.subject.title = res['common.securityAdvisor.antiVirus'];
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
			const statusList = new Array(this.avStatus, this.fwStatus.status !== null ? this.fwStatus : null);
			this.statusList = statusList.filter(current => {
				return current !== undefined && current !== null;
			});
		});
	}

	setPage(antiVirus: Antivirus) {
		if (antiVirus.mcafee && (antiVirus.mcafee.enabled || !antiVirus.others || !antiVirus.others.enabled) && antiVirus.mcafee.expireAt > 0) {
			this.currentPage = 'mcafee';
			this.imgUrl = '/assets/images/mcafee_logo.svg';
			this.setAntivirusStatus(
				antiVirus.mcafee.status !== undefined ? antiVirus.mcafee.status : null,
				antiVirus.mcafee.firewallStatus !== undefined ? antiVirus.mcafee.firewallStatus : null,
				this.currentPage
			);
		} else if (antiVirus.others) {
			this.currentPage = 'others';
			this.setAntivirusStatus(
				antiVirus.others.antiVirus.length > 0 ? antiVirus.others.antiVirus[0].status : null,
				antiVirus.others.firewall.length > 0 ? antiVirus.others.firewall[0].status : null,
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
			this.imgUrl = '/assets/images/windows-logo.png';
		}
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityCurrentPage, this.currentPage);
	}

	setAntivirusStatus(av: boolean | undefined, fw: boolean | undefined, currentPage: string) {
		if (!this.translateString) {
			return;
		}
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, fw !== undefined ? fw : null);
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, av !== undefined ? av : null);

		if (typeof av === 'boolean' && typeof fw === 'boolean') {
			this.avStatus.status = av ? 0 : 1;
			this.avStatus.detail = this.translateString[`common.securityAdvisor.${av ? 'enabled' : 'disabled'}`];
			this.fwStatus.status = fw ? 0 : 1;
			this.fwStatus.detail = this.translateString[`common.securityAdvisor.${fw ? 'enabled' : 'disabled'}`];
			if (av && fw) {
				this.subject.status = 0;
			} else if (av || fw) {
				this.subject.status = 3;
			} else {
				this.subject.status = 1;
			}
		} else if (typeof fw !== 'boolean' && typeof av === 'boolean') {
			this.avStatus.status = av ? 0 : 1;
			this.avStatus.detail = this.translateString[`common.securityAdvisor.${av ? 'enabled' : 'disabled'}`];
			this.fwStatus.status = null;
			this.subject.status = av ? 0 : 1;
			if (currentPage === 'windows') {
				this.fwStatus.status = 4;
				this.fwStatus.detail = this.translateString['common.securityAdvisor.loading'];
				this.subject.status = av ? 3 : 1;
			}
		} else if (typeof av !== 'boolean' && typeof fw === 'boolean') {
			this.fwStatus.status = fw ? 0 : 1;
			this.fwStatus.detail = this.translateString[`common.securityAdvisor.${fw ? 'enabled' : 'disabled'}`];
			this.avStatus.status = null;
			this.subject.status = fw ? 0 : 1;
			if (currentPage === 'windows') {
				this.avStatus.status = 4;
				this.avStatus.detail = this.translateString['common.securityAdvisor.loading'];
				this.subject.status = fw ? 3 : 1;
			}
		} else {
			this.fwStatus.status = null;
			this.avStatus.status = null;
			this.subject.status = null;
		}
		switch (currentPage) {
			case 'mcafee':
				this.imgUrl = '../../../../assets/images/mcafee_logo.svg';
				break;
			case 'windows':
				this.imgUrl = '../../../../assets/images/windows-logo.png';
				break;
			default:
				this.imgUrl = '';
				break;
		}
	}
}
