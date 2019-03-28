import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

export class AntiVirusLandingViewModel {
	statusList: Array<any>;
	subject: any;
	type = 'security';
	imgUrl = '';
	constructor(avModel: phoenix.Antivirus, commonService: CommonService) {
		const avStatus = {
			status: 2,
			detail: 'disabled',
			path: 'anti-virus',
			title: 'Anti-Virus',
			type: 'security',
		};
		const fwStatus = {
			status: 2,
			detail: 'disabled',
			path: 'anti-virus',
			title: 'Firewall',
			type: 'security',
		};
		const subjectStatus = {
			status: 2,
			title: 'Anti-Virus',
			type: 'security',
		};
		const cacheAvStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus);
		const cacheFwStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus);
		if (cacheAvStatus && cacheFwStatus) {
			avStatus.status = cacheAvStatus === 'enabled' ? 0 : 1;
			avStatus.detail = cacheAvStatus;
			fwStatus.status = cacheFwStatus === 'enabled' ? 0 : 1;
			fwStatus.detail = cacheFwStatus;
			if (avStatus.status === 0 && fwStatus.status === 0) {
				subjectStatus.status = 0;
			} else if (avStatus.status === 0 || fwStatus.status === 0) {
				subjectStatus.status = 3;
			} else {
				subjectStatus.status = 1;
			}
		}
		if (avModel.mcafee && (avModel.mcafee.enabled || !avModel.others || !avModel.others.enabled)) {
			avStatus.status = (avModel.mcafee.status === true) ? 0 : 1;
			avStatus.detail = (avModel.mcafee.status === true) ? 'enabled' : 'disabled';
			fwStatus.status = (avModel.mcafee.firewallStatus === true) ? 0 : 1;
			fwStatus.detail = (avModel.mcafee.firewallStatus === true) ? 'enabled' : 'disabled';
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, avStatus.detail);
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, fwStatus.detail);
			this.imgUrl = '../../../../assets/images/mcafee_logo.svg';
		} else if (avModel.others) {
			if (avModel.others.antiVirus.length > 0) {
				avStatus.status = (avModel.others.antiVirus[0].status === true) ? 0 : 1;
				avStatus.detail = (avModel.others.antiVirus[0].status === true) ? 'enabled' : 'disabled';
				commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, avStatus.detail);
			}
			if (avModel.others.firewall.length > 0) {
				fwStatus.status = (avModel.others.firewall[0].status === true) ? 0 : 1;
				fwStatus.detail = (avModel.others.firewall[0].status === true) ? 'enabled' : 'disabled';
				commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, fwStatus.detail);
			}
		} else {
			avStatus.status = (avModel.windowsDefender.status === true) ? 0 : 1;
			avStatus.detail = (avModel.windowsDefender.status === true) ? 'enabled' : 'disabled';
			fwStatus.status = (avModel.windowsDefender.firewallStatus === true) ? 0 : 1;
			fwStatus.detail = (avModel.windowsDefender.firewallStatus === true) ? 'enabled' : 'disabled';
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, avStatus.detail);
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, fwStatus.detail);
			this.imgUrl = '../../../../assets/images/windows-logo.png';
		}

		if (avStatus.status === 0 && fwStatus.status === 0) {
			subjectStatus.status = 0;
		} else if (avStatus.status === 0 || fwStatus.status === 0) {
			subjectStatus.status = 3;
		} else {
			subjectStatus.status = 1;
		}

		avModel.on(EventTypes.avWindowsDefenderAntivirusStatusEvent, (data) => {
			avStatus.status = (data === true) ? 0 : 1;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, avStatus.detail);
		});
		avModel.on(EventTypes.avWindowsDefenderFirewallStatusEvent, (data) => {
			fwStatus.status = (data === true) ? 0 : 1;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, fwStatus.detail);
		});
		avModel.on(EventTypes.avOthersEvent, (data) => {
			if (data.antivirus.length > 0) {
				avStatus.status = (data.antivirus[0].status === true) ? 0 : 1;
				commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, avStatus.detail);
			}
			if (data.firewall.length > 0) {
				fwStatus.status = (data.firewall[0].status === true) ? 0 : 1;
				commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, fwStatus.detail);
			}
		});
		// avModel.on(EventTypes.avMcafeeStatusEvent, (data) => {
		// 	avStatus.status = (data === true) ? 0 : 1;
		// 	commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, avStatus.detail);
		// });
		// avModel.on(EventTypes.avMcafeeFirewallStatusEvent, (data) => {
		// 	fwStatus.status = (data === true) ? 0 : 1;
		// 	commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, fwStatus.detail);
		// });
		this.statusList = new Array(avStatus, fwStatus);
		this.subject = subjectStatus;
	}
}
