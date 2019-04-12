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
			avStatus.status = av === true ? 0 : 1;
			avStatus.detail = av === true ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, av);
			if (fw !== null && fw !== undefined) {
				fwStatus.status = fw === true ? 0 : 1;
				fwStatus.detail = fw === true ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
				commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, fw);
				if (av && fw) {
					subjectStatus.status = 0;
				} else if (av || fw) {
					subjectStatus.status = 3;
				} else {
					subjectStatus.status = 1;
				}
			} else {
				fwStatus.status = null;
				subjectStatus.status = av === true ? 0 : 1;
			}

			translate.get(avStatus.detail).subscribe((res) => {
				avStatus.detail = res;
			});
			translate.get(avStatus.title).subscribe((res) => {
				avStatus.title = res;
			});
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
		const cacheAvStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus);
		const cacheFwStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus);
		const cacheCurrentPage = commonService.getLocalStorageValue(LocalStorageKey.SecurityCurrentPage);
		if (cacheCurrentPage) {
			this.currentPage = cacheCurrentPage;
		}
		if (cacheAvStatus !== undefined && cacheAvStatus !== null) {
			setAntivirusStatus(cacheAvStatus, cacheFwStatus);
		}
		if (avModel.mcafee && (avModel.mcafee.enabled || !avModel.others || !avModel.others.enabled)) {
			this.currentPage = 'mcafee';
			setAntivirusStatus(avModel.mcafee.status, avModel.mcafee.firewallStatus);
			this.imgUrl = '../../../../assets/images/mcafee_logo.svg';
		} else if (avModel.others) {
			this.currentPage = 'others';
			setAntivirusStatus(avModel.others.antiVirus[0].status, avModel.others.firewall ? avModel.others.firewall[0].status : null);
		} else {
			this.currentPage = 'windows';
			setAntivirusStatus(avModel.windowsDefender.status, avModel.windowsDefender.firewallStatus);
			this.imgUrl = '../../../../assets/images/windows-logo.png';
		}
		avModel.on(EventTypes.avWindowsDefenderAntivirusStatusEvent, (data) => {
			if (this.currentPage === 'windows') {
				setAntivirusStatus(data, avModel.windowsDefender.firewallStatus);
			}
		});
		avModel.on(EventTypes.avWindowsDefenderFirewallStatusEvent, (data) => {
			if (this.currentPage === 'windows') {
				setAntivirusStatus(avModel.windowsDefender.status, data);
			}
		});
		avModel.on(EventTypes.avOthersEvent, (data) => {
			if (this.currentPage === 'others') {
				setAntivirusStatus(data.antivirus[0].status, data.firewall ? data.firewall[0].status : null);
			}
		});
		avModel.on(EventTypes.avMcafeeStatusEvent, (data) => {
			if (this.currentPage === 'mcafee') {
				setAntivirusStatus(data, avModel.mcafee.firewallStatus);
			}
		});
		avModel.on(EventTypes.avMcafeeFirewallStatusEvent, (data) => {
			if (this.currentPage === 'mcafee') {
				setAntivirusStatus(avModel.mcafee.status, data);
			}
		});
		const statusList = new Array(avStatus, fwStatus.status !== null ? fwStatus : null);
		this.statusList = statusList.filter(current => {
			return current !== undefined && current !== null;
		});
		this.subject = subjectStatus;
	}
}
