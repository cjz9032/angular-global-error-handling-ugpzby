import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class AntiVirusLandingViewModel {
	statusList: Array<any>;
	subject: any;
	type = 'security';
	imgUrl = '';
	currentPage: string;
	constructor(avModel: phoenix.Antivirus, commonService: CommonService, translate: TranslateService) {
		const avStatus = {
			status: 2,
			detail: 'common.securityAdvisor.loading',
			path: 'security/anti-virus',
			title: 'common.securityAdvisor.antiVirus',
			type: 'security',
		};
		const fwStatus = {
			status: 2,
			detail: 'common.securityAdvisor.loading',
			path: 'security/anti-virus',
			title: 'security.landing.firewall',
			type: 'security',
		};
		const subjectStatus = {
			status: 2,
			title: 'common.securityAdvisor.antiVirus',
			type: 'security',
		};
		const setAntivirusStatus = (av: boolean, fw: boolean) => {
			if (av !== null && av !== undefined && fw !== null && fw !== undefined) {
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
			} else if (fw === null || fw === undefined) {
				avStatus.status = av === true ? 0 : 1;
				avStatus.detail = av === true ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
				fwStatus.status = null;
				commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, av);
				subjectStatus.status = av === true ? 0 : 1;
			} else if (av === null || av === undefined) {
				fwStatus.status = fw === true ? 0 : 1;
				fwStatus.detail = fw === true ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
				avStatus.status = null;
				subjectStatus.status = fw === true ? 0 : 1;
			} else {
				fwStatus.status = null;
				avStatus.status = null;
				subjectStatus.status = null;
			}

			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, fw);
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, av);

			if (av !== null && av !== undefined) {
				translate.get(avStatus.detail).subscribe((res) => {
					avStatus.detail = res;
				});
				translate.get(avStatus.title).subscribe((res) => {
					avStatus.title = res;
				});
			}
			if (fw !== null && fw !== undefined) {
				translate.get(fwStatus.detail).subscribe((res) => {
					fwStatus.detail = res;
				});
				translate.get(fwStatus.title).subscribe((res) => {
					fwStatus.title = res;
				});
			}
			translate.get(subjectStatus.title).subscribe((res) => {
				subjectStatus.title = res;
			});
		};
		const setPage = (av) => {
			if (av.mcafee && (av.mcafee.enabled || !av.others || !av.others.enabled)) {
				this.currentPage = 'mcafee';
				setAntivirusStatus(av.mcafee.status, av.mcafee.firewallStatus);
				this.imgUrl = '../../../../assets/images/mcafee_logo.svg';
			} else if (av.others) {
				this.currentPage = 'others';
				setAntivirusStatus(av.others.antiVirus.length > 0 ? av.others.antiVirus[0].status : null, av.others.firewall.length > 0 ? av.others.firewall[0].status : null);
				this.imgUrl = null;
			} else {
				this.currentPage = 'windows';
				setAntivirusStatus(av.windowsDefender.status, av.windowsDefender.firewallStatus);
				this.imgUrl = '../../../../assets/images/windows-logo.png';
			}
		};
		const cacheAvStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus);
		const cacheFwStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus);
		const cacheCurrentPage = commonService.getLocalStorageValue(LocalStorageKey.SecurityCurrentPage);
		if (cacheCurrentPage) {
			this.currentPage = cacheCurrentPage;
		}
		setAntivirusStatus(cacheAvStatus, cacheFwStatus);

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
