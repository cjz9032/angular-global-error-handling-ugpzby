import { Antivirus, McAfeeInfo, WindowsDefender, OtherInfo } from '@lenovo/tan-client-bridge';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from '../../enums/local-storage-key.enum';

export class AntiVirusviewModel {
	currentPage: string;
	mcafee: McAfeeInfo = {
		localName: 'McAfee LiveSafe',
		subscription: 'unknown',
		expireAt: new Date,
		registered: false,
		trailUrl: 'unknown',
		features: [],
		firewallStatus: false,
		status: false,
		enabled: false,
		launch() { return Promise.resolve(true); }
	};
	windowsDefender: WindowsDefender = {
		firewallStatus: false,
		status: false,
		enabled: false
	};
	otherAntiVirus: OtherInfo = {
		status: false,
		name: 'unknown',
	};
	otherFirewall: OtherInfo = {
		status: false,
		name: 'unknown',
	};
	mcafeestatusList: Array<any> = [];
	windowsDefenderstatusList: Array<any> = [];
	othersAntistatusList: Array<any> = [];
	othersFirewallstatusList: Array<any> = [];


	constructor(public antiVirus: Antivirus, private commonService: CommonService) {
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
		if (antiVirus.mcafee && (antiVirus.mcafee.enabled || !antiVirus.others || !antiVirus.others.enabled)) {
			this.currentPage = 'mcafee';
		} else if (antiVirus.others) {
			this.currentPage = 'others';
		} else { this.currentPage = 'windows'; }
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityCurrentPage, this.currentPage);
	}
}
