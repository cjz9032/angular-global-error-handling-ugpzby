import { Antivirus, McAfeeInfo, WindowsDefender, OtherInfo } from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from '../../enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

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
		additionalCapabilities: '',
	};
	windowsDefender: WindowsDefender = {
		firewallStatus: undefined,
		status: undefined,
		enabled: false
	};
	otherAntiVirus: OtherInfo = {
		status: false,
		name: 'security.antivirus.others.unknown',
	};
	metricsList: Array<any> = [];
	otherFirewall: OtherInfo;
	mcafeestatusList: Array<any> = [];
	windowsDefenderstatusList: Array<any> = [{
		status: this.windowsDefender.status,
		title: 'security.antivirus.windowsDefender.virus',
	}, {
		status: this.windowsDefender.firewallStatus,
		title: 'security.antivirus.windowsDefender.homeNetwork',
	}];
	othersAntistatusList: Array<any> = [];
	othersFirewallstatusList: Array<any> = [];
	showMetricsList = true;
	showMetricButton = true;
	showMcafee = true;

	constructor(antiVirus: Antivirus, private commonService: CommonService, private translate: TranslateService, ) {
		translate.stream(this.otherAntiVirus.name).subscribe((res) => {
			this.otherAntiVirus.name = res;
		});
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
		const cacheShowMetricButton = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowMetricButton);
		if (typeof cacheShowMetricButton === 'boolean') {
			this.showMetricButton = cacheShowMetricButton;
		}
		const cacheShowMetricList = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowMetricList);
		if (typeof cacheShowMetricList === 'boolean') {
			this.showMetricsList = cacheShowMetricList;
		}
		const cacheShowMcafee = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityShowMcafee);
		if (typeof cacheShowMcafee === 'boolean') {
			this.showMcafee = cacheShowMcafee;
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
		} else if (antiVirus.others && antiVirus.others.enabled) {
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
