import { Antivirus, McAfeeInfo, WindowsDefender, OtherInfo } from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from '../../enums/local-storage-key.enum';
import * as phoenix from '@lenovo/tan-client-bridge';
export class AntiVirusViewModel {
	currentPage = 'windows';
	mcafeeInstall: boolean;
	mcafee: McAfeeInfo = {
		localName: 'McAfee LiveSafe',
		subscription: 'unknown',
		expireAt: 30,
		registered: false,
		trialUrl: 'unknown',
		features: [],
		firewallStatus: false,
		status: false,
		enabled: false,
		metrics: [],
		launch() { return Promise.resolve(true); }
	};
	windowsDefender: WindowsDefender = {
		firewallStatus: undefined,
		status: undefined,
		enabled: false
	};
	otherAntiVirus: OtherInfo = {
		status: false,
		name: 'unknown',
	};
	metricsList: Array<any> = [0, 0, 0, 0];
	otherFirewall: OtherInfo ;
	mcafeestatusList: Array<any> = [];
	windowsDefenderstatusList: Array<any> = [{
		status: this.windowsDefender.status,
		title: 'security.antivirus.common.virus',
	}, {
		status: this.windowsDefender.firewallStatus,
		title: 'security.antivirus.common.homeNetwork',
	}];
	othersAntistatusList: Array<any> = [];
	othersFirewallstatusList: Array<any> = [];

	constructor(antiVirus: phoenix.Antivirus, private commonService: CommonService) {
		const cacheCurrentPage = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityCurrentPage);
		if (cacheCurrentPage) {
			this.currentPage = cacheCurrentPage;
		}
		const cacheMcafee = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityMcAfee);
		if (cacheMcafee) {
			this.mcafee = cacheMcafee;
		}
		const cacheWindowsDefender = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityWindowsDefender);
		if (cacheWindowsDefender) {
			this.windowsDefender = cacheWindowsDefender;
		}
		const cacheOtherAntiVirus = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityOtherAntiVirus);
		if (cacheOtherAntiVirus) {
			this.otherAntiVirus = cacheOtherAntiVirus;
		}
		const cacheOtherFirewall = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityOtherFirewall);
		if (cacheOtherFirewall) {
			this.otherFirewall = cacheOtherFirewall;
		}
		const cacheMcafeeStatusList = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityMcAfeeStatusList);
		if (cacheMcafeeStatusList) {
			this.mcafeestatusList = cacheMcafeeStatusList;
		}
		const cacheMcafeeMetricsList = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityMcAfeeMetricList);
		if (cacheMcafeeMetricsList) {
			this.metricsList = cacheMcafeeMetricsList;
		}
		const cacheWindowsList = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityWindowsDefenderStatusList);
		if (cacheWindowsList) {
			this.windowsDefenderstatusList = cacheWindowsList;
		}
		const cacheOtherAntiVirusList = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityOthersAntiStatusList);
		if (cacheOtherAntiVirusList) {
			this.othersAntistatusList = cacheOtherAntiVirusList;
		}
		const cacheOtherFirewallList = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityOthersFirewallStatusList);
		if (cacheOtherFirewallList) {
			this.othersFirewallstatusList = cacheOtherFirewallList;
		}
	}

	antiVirusPage(antiVirus: Antivirus) {
		if (antiVirus.mcafee && (antiVirus.mcafee.enabled || !antiVirus.others || !antiVirus.others.enabled) && antiVirus.mcafee.expireAt > 0) {
			this.currentPage = 'mcafee';
			this.mcafeeInstall = true;
		} else if (antiVirus.others) {
			if (antiVirus.mcafee) {
				this.mcafeeInstall = true;
			} else { this.mcafeeInstall = false; }
			this.currentPage = 'others';
		} else {
			this.currentPage = 'windows';
			this.mcafeeInstall = false;
		}
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityCurrentPage, this.currentPage);
	}
}
