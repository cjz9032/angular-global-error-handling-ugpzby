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
		const cacheAvStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus);
		const cacheFwStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus);
		if (cacheAvStatus !== undefined && cacheAvStatus !== null) {
			avStatus.status = cacheAvStatus === true ? 0 : 1;
			avStatus.detail = cacheAvStatus === true ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
			if (cacheFwStatus !== undefined && cacheFwStatus !== null) {
				fwStatus.status = cacheFwStatus === true ? 0 : 1;
				fwStatus.detail = cacheFwStatus === true ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
			}
			if (avStatus.status === 0 && fwStatus.status === 0) {
				subjectStatus.status = 0;
			} else if (avStatus.status === 0 || fwStatus.status === 0) {
				subjectStatus.status = 3;
			} else {
				subjectStatus.status = 1;
			}
		}
		if (avModel.mcafee && (avModel.mcafee.enabled || !avModel.others || !avModel.others.enabled)) {
			if (avModel.mcafee.status !== undefined && avModel.mcafee.status !== null) {
				avStatus.status = (avModel.mcafee.status === true) ? 0 : 1;
				avStatus.detail = (avModel.mcafee.status === true) ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
			}
			if (avModel.mcafee.firewallStatus !== undefined && avModel.mcafee.firewallStatus !== null) {
				fwStatus.status = (avModel.mcafee.firewallStatus === true) ? 0 : 1;
				fwStatus.detail = (avModel.mcafee.firewallStatus === true) ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
			}
			this.imgUrl = '../../../../assets/images/mcafee_logo.svg';
		} else if (avModel.others) {
			if (avModel.others.antiVirus.length > 0 && avModel.others.antiVirus[0].status !== undefined && avModel.others.antiVirus[0].status !== null) {
				avStatus.status = (avModel.others.antiVirus[0].status === true) ? 0 : 1;
				avStatus.detail = (avModel.others.antiVirus[0].status === true) ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
			}
			if (avModel.others.firewall.length > 0 && avModel.others.firewall[0].status !== undefined && avModel.others.firewall[0].status !== null) {
				fwStatus.status = (avModel.others.firewall[0].status === true) ? 0 : 1;
				fwStatus.detail = (avModel.others.firewall[0].status === true) ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
			}
		} else {
			if (avModel.windowsDefender && avModel.windowsDefender.status !== undefined && avModel.windowsDefender.status !== null) {
				avStatus.status = (avModel.windowsDefender.status === true) ? 0 : 1;
				avStatus.detail = (avModel.windowsDefender.status === true) ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
			}
			if (avModel.windowsDefender && avModel.windowsDefender.firewallStatus !== undefined && avModel.windowsDefender.firewallStatus !== null) {
				fwStatus.status = (avModel.windowsDefender.firewallStatus === true) ? 0 : 1;
				fwStatus.detail = (avModel.windowsDefender.firewallStatus === true) ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
			} else {
				fwStatus.status = undefined;
			}
			this.imgUrl = '../../../../assets/images/windows-logo.png';
		}
		commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, avStatus.status === 0 ? true : false);
		if (fwStatus.status !== undefined && fwStatus.status !== null) {
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, fwStatus.status === 0 ? true : false);
		}
		avModel.on(EventTypes.avWindowsDefenderAntivirusStatusEvent, (data) => {
			avStatus.status = (data === true) ? 0 : 1;
			avStatus.detail = (data === true) ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
			translate.get(avStatus.detail).subscribe((res) => {
				avStatus.detail = res;
			});
			this.updateStatus();
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, data);
		});
		avModel.on(EventTypes.avWindowsDefenderFirewallStatusEvent, (data) => {
			fwStatus.status = (data === true) ? 0 : 1;
			fwStatus.detail = (data === true) ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
			translate.get(fwStatus.detail).subscribe((res) => {
				fwStatus.detail = res;
			});
			this.updateStatus();
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, data);
		});
		avModel.on(EventTypes.avOthersEvent, (data) => {
			if (data.antivirus.length > 0) {
				avStatus.status = (data.antivirus[0].status === true) ? 0 : 1;
				avStatus.detail = (data.antivirus[0].status === true) ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
				translate.get(avStatus.detail).subscribe((res) => {
					avStatus.detail = res;
				});
				commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, data.antivirus[0].status);
			}
			if (data.firewall.length > 0) {
				fwStatus.status = (data.firewall[0].status === true) ? 0 : 1;
				fwStatus.detail = (data.firewall[0].status === true) ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
				translate.get(fwStatus.detail).subscribe((res) => {
					fwStatus.detail = res;
				});
				commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, data.firewall[0].status);
			} else {
				fwStatus.status = undefined;
			}
			this.updateStatus();
		});
		avModel.on(EventTypes.avMcafeeStatusEvent, (data) => {
			avStatus.status = (data === true) ? 0 : 1;
			avStatus.detail = (data === true) ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
			translate.get(avStatus.detail).subscribe((res) => {
				avStatus.detail = res;
			});
			this.updateStatus();
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, data);
		});
		avModel.on(EventTypes.avMcafeeFirewallStatusEvent, (data) => {
			fwStatus.status = (data === true) ? 0 : 1;
			fwStatus.detail = (data === true) ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
			translate.get(fwStatus.detail).subscribe((res) => {
				fwStatus.detail = res;
			});
			this.updateStatus();
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, data);
		});
		translate.get(avStatus.detail).subscribe((res) => {
			avStatus.detail = res;
		});
		translate.get(avStatus.title).subscribe((res) => {
			avStatus.title = res;
		});
		if (fwStatus.status !== undefined && fwStatus.status !== null) {
			translate.get(fwStatus.detail).subscribe((res) => {
				fwStatus.detail = res;
			});
		}
		translate.get(fwStatus.title).subscribe((res) => {
			fwStatus.title = res;
		});
		translate.get(subjectStatus.title).subscribe((res) => {
			subjectStatus.title = res;
		});
		this.statusList = new Array(avStatus, fwStatus);
		this.subject = subjectStatus;
		this.updateStatus();
	}

	updateStatus() {
		if (this.statusList[1].status === undefined) {
			this.subject.status = this.statusList[0].status === 0 ? 0 : 1;
		} else {
			if (this.statusList[0].status === 0 && this.statusList[1].status === 0) {
				this.subject.status = 0;
			} else if (this.statusList[0].status === 0 || this.statusList[1].status === 0) {
				this.subject.status = 3;
			} else {
				this.subject.status = 1;
			}
		}
	}
}
