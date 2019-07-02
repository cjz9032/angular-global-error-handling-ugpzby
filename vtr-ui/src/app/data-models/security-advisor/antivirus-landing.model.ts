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
	statusList: Array < any > ;
	subject: any;
	type = 'security';
	imgUrl = '';
	currentPage: string;
	constructor(translate: TranslateService, avModel: phoenix.Antivirus, commonService: CommonService, ) {
		const avStatus = {
			status: 4,
			detail: 'common.securityAdvisor.loading',
			path: 'security/anti-virus',
			title: 'common.securityAdvisor.antiVirus',
			type: 'security',
			id: 'sa-ov-link-antivirus'
		};
		const fwStatus = {
			status: 4,
			detail: 'common.securityAdvisor.loading',
			path: 'security/anti-virus',
			title: 'security.landing.firewall',
			type: 'security',
			id: 'sa-ov-link-firewall'
		};
		const subjectStatus = {
			status: 2,
			title: 'common.securityAdvisor.antiVirus',
			type: 'security',
		};
		translate.stream(avStatus.detail).subscribe((res) => {
			avStatus.detail = res;
		});
		translate.stream(avStatus.title).subscribe((res) => {
			avStatus.title = res;
		});
		translate.stream(fwStatus.detail).subscribe((res) => {
			fwStatus.detail = res;
		});
		translate.stream(fwStatus.title).subscribe((res) => {
			fwStatus.title = res;
		});
		translate.stream(subjectStatus.title).subscribe((res) => {
			subjectStatus.title = res;
		});
		const setAntivirusStatus = (av: boolean, fw: boolean, currentPage: string) => {
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, fw !== undefined ? fw : null);
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, av !== undefined ? av : null);

			if (typeof av === 'boolean' && typeof fw === 'boolean') {
				avStatus.status = av === true ? 0 : 1;
				avStatus.detail = av === true ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
				fwStatus.status = fw === true ? 0 : 1;
				fwStatus.detail = fw === true ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
				if (av && fw) {
					subjectStatus.status = 0;
				} else if (av || fw) {
					subjectStatus.status = 3;
				} else {
					subjectStatus.status = 1;
				}
			} else if (typeof fw !== 'boolean' && typeof av === 'boolean') {
				avStatus.status = av === true ? 0 : 1;
				avStatus.detail = av === true ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
				fwStatus.status = null;
				subjectStatus.status = av === true ? 0 : 1;
				if (currentPage === 'windows') {
					fwStatus.status = 4;
					fwStatus.detail = 'common.securityAdvisor.loading';
					subjectStatus.status = av === true ? 3 : 1;
				}
			} else if (typeof av !== 'boolean' && typeof fw === 'boolean') {
				fwStatus.status = fw === true ? 0 : 1;
				fwStatus.detail = fw === true ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
				avStatus.status = null;
				subjectStatus.status = fw === true ? 0 : 1;
				if (currentPage === 'windows') {
					avStatus.status = 4;
					avStatus.detail = 'common.securityAdvisor.loading';
					subjectStatus.status = fw === true ? 3 : 1;
				}
			} else {
				fwStatus.status = null;
				avStatus.status = null;
				subjectStatus.status = null;
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

			translate.stream(avStatus.detail).subscribe((res) => {
				avStatus.detail = res;
			});
			translate.stream(avStatus.title).subscribe((res) => {
				avStatus.title = res;
			});
			translate.stream(fwStatus.detail).subscribe((res) => {
				fwStatus.detail = res;
			});
			translate.stream(fwStatus.title).subscribe((res) => {
				fwStatus.title = res;
			});
			translate.stream(subjectStatus.title).subscribe((res) => {
				subjectStatus.title = res;
			});
		};
		const setPage = (av) => {
			if (av.mcafee && (av.mcafee.enabled || !av.others || !av.others.enabled)) {
				this.currentPage = 'mcafee';
				setAntivirusStatus(
					av.mcafee.status !== undefined ? av.mcafee.status : null,
					av.mcafee.firewallStatus !== undefined ? av.mcafee.firewallStatus : null,
					this.currentPage
				);
				this.imgUrl = '../../../../assets/images/mcafee_logo.svg';
			} else if (av.others) {
				this.currentPage = 'others';
				setAntivirusStatus(
					av.others.antiVirus.length > 0 ? av.others.antiVirus[0].status : null,
					av.others.firewall.length > 0 ? av.others.firewall[0].status : null,
					this.currentPage
				);
				this.imgUrl = null;
			} else {
				this.currentPage = 'windows';
				setAntivirusStatus(
					av.windowsDefender.status !== undefined ? av.windowsDefender.status : null,
					av.windowsDefender.firewallStatus !== undefined ? av.windowsDefender.firewallStatus : null,
					this.currentPage
				);
				this.imgUrl = '../../../../assets/images/windows-logo.png';
			}
		};
		const cacheAvStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus);
		const cacheFwStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus);
		const cacheCurrentPage = commonService.getLocalStorageValue(LocalStorageKey.SecurityCurrentPage);
		if (cacheCurrentPage) {
			this.currentPage = cacheCurrentPage;
		}
		if (cacheAvStatus || cacheFwStatus) {
			setAntivirusStatus(cacheAvStatus, cacheFwStatus, cacheCurrentPage);
		}

		if (avModel) {
			setPage(avModel);
		}

		avModel.on(EventTypes.avRefreshedEvent, (av) => {
			setPage(av);

			this.statusList = new Array(avStatus, fwStatus.status !== null ? fwStatus : null).filter(current => {
				return current !== undefined && current !== null;
			});
			this.subject = subjectStatus;
		});

		const statusList = new Array(avStatus, fwStatus.status !== null ? fwStatus : null);
		this.statusList = statusList.filter(current => {
			return current !== undefined && current !== null;
		});
		this.subject = subjectStatus;
	}
}
