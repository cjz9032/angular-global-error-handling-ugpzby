import { Antivirus, McAfeeInfo, WindowsDefender, OtherInfo } from '@lenovo/tan-client-bridge';
import { EventTypes } from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from '../../enums/local-storage-key.enum';

export class AntiVirusViewMode {
	currentPage: string;
	mcafee: McAfeeInfo;
	windowsDefender: WindowsDefender;
	otherAntiVirus: OtherInfo;
	otherFirewall: OtherInfo;
	mcafeestatusList: Array<any>;
	windowsDefenderstatusList: Array<any>;
	othersAntistatusList: Array<any>;
	othersFirewallstatusList: Array<any>;
	constructor(antiVirus: Antivirus, private commonService: CommonService) {
		this.mcafee = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityMcAfee);
		this.windowsDefender = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityWindowsDefender);
		console.log(this.windowsDefender);
		this.otherAntiVirus = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityOthersAntiStatusList);
		this.otherFirewall = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityOthersFirewallStatusList);
		this.mcafeestatusList = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityMcAfeeStatusList);
		this.windowsDefenderstatusList = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityWindowsDefenderStatusList);
		this.othersAntistatusList = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityOthersAntiStatusList);
		this.othersFirewallstatusList = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityOthersFirewallStatusList);
		this.currentPage = this.commonService.getLocalStorageValue(LocalStorageKey.SecurityCurrentPage);
		if (antiVirus.mcafee || antiVirus.others || antiVirus.windowsDefender) {
			this.antiVirusPage(antiVirus);
		}
		if (antiVirus.mcafee && antiVirus.mcafee.features && antiVirus.mcafee.features.length > 0) {
			this.mcafee = antiVirus.mcafee;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfee, this.mcafee);
			this.mcafeestatusList = [{
				buttonClick: this.mcafee.launch.bind(this.mcafee),
				status: this.mcafee.status,
				title: 'VIRUS SCAN',
				buttonTitle: 'ENABLE VIRUS SCAN',
				metricsItem: 'launchMcafee',
			}, {
				buttonClick: this.mcafee.launch.bind(this.mcafee),
				status: this.mcafee.firewallStatus,
				title: 'FIREWALL',
				buttonTitle: 'ENABLE FIREWALL',
				metricsItem: 'launchMcafee',
			}];
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfeeStatusList, this.mcafeestatusList);
		}
		if (antiVirus.windowsDefender) {
			this.windowsDefender = antiVirus.windowsDefender;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsDefender, this.windowsDefender);
			this.windowsDefenderstatusList = [{
				status: this.windowsDefender.status,
				title: 'VIRUS SCAN',
			}, {
				status: this.windowsDefender.firewallStatus,
				title: 'FIREWALL',
			}];
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsDefenderStatusList, this.windowsDefenderstatusList);
			console.log(this.windowsDefenderstatusList);
		}
		if (antiVirus.others) {
			if (antiVirus.others.firewall && antiVirus.others.firewall.length > 0) {
				this.otherFirewall = antiVirus.others.firewall[0];
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOtherFirewall, this.otherFirewall);
				this.othersFirewallstatusList = [{
					status: this.otherFirewall.status,
					title: 'FIREWALL',
				}];
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOtherFirewall, this.othersFirewallstatusList);
			}
			if (antiVirus.others.antiVirus && antiVirus.others.antiVirus.length > 0) {
				this.otherAntiVirus = antiVirus.others.antiVirus[0];
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOtherAntiVirus, this.otherAntiVirus);
				this.othersAntistatusList = [{
					status: this.otherAntiVirus.status,
					title: 'VIRUS SCAN',
				}];
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOthersAntiStatusList, this.othersAntistatusList);
			}
		}

		antiVirus.on(EventTypes.avMcafeeFeaturesEvent, (data) => {
			this.mcafeestatusList = [{
				buttonClick: this.mcafee.launch.bind(this.mcafee),
				status: data.find(f => f.id === 'vso').value,
				title: 'VIRUS SCAN',
				buttonTitle: 'ENABLE VIRUS SCAN',
			}, {
				buttonClick: this.mcafee.launch.bind(this.mcafee),
				status: data.find(f => f.id === 'mpf').value,
				title: 'FIREWALL',
				buttonTitle: 'ENABLE FIREWALL',
			}];
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfeeStatusList, this.mcafeestatusList);
			this.antiVirusPage(antiVirus);
		}).on(EventTypes.avOthersEvent, () => {
			if (antiVirus.others) {
				if (antiVirus.others.firewall && antiVirus.others.firewall.length > 0) {
					this.othersFirewallstatusList = [{
						status: antiVirus.others.firewall[0].status,
						title: 'FIREWALL',
					}];
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOthersFirewallStatusList, this.othersFirewallstatusList);
				}
				if (antiVirus.others.antiVirus && antiVirus.others.antiVirus.length > 0) {
					this.othersAntistatusList = [{
						status: antiVirus.others.antiVirus[0].status,
						title: 'VIRUS SCAN',
					}];
					this.commonService.setLocalStorageValue(LocalStorageKey.SecurityOthersAntiStatusList, this.othersAntistatusList);
				}
			}
			this.antiVirusPage(antiVirus);
		}).on(EventTypes.avWindowsDefenderAntivirusStatusEvent, () => {
			this.windowsDefenderstatusList = [{
				status: antiVirus.windowsDefender.status,
				title: 'VIRUS SCAN',
			}, {
				status: antiVirus.windowsDefender.firewallStatus,
				title: 'FIREWALL',
			}];
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsDefenderStatusList, this.windowsDefenderstatusList);
			this.antiVirusPage(antiVirus);
		}).on(EventTypes.avWindowsDefenderFirewallStatusEvent, () => {
			this.windowsDefenderstatusList = [{
				status: antiVirus.windowsDefender.status,
				title: 'VIRUS SCAN',
			}, {
				status: antiVirus.windowsDefender.firewallStatus,
				title: 'FIREWALL',
			}];
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWindowsDefenderStatusList, this.windowsDefenderstatusList);
			this.antiVirusPage(antiVirus);
		}).on(EventTypes.avMcafeeExpireAtEvent, (data) => {
			this.mcafee.expireAt = data;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfee, this.mcafee);
		}).on(EventTypes.avMcafeeSubscriptionEvent, (data) => {
			this.mcafee.subscription = data;
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityMcAfee, this.mcafee);
		});
	}

	antiVirusPage(antiVirus: Antivirus) {
		if (antiVirus.mcafee && (antiVirus.mcafee.enabled || !antiVirus.others || !antiVirus.others.enabled)) {
			this.currentPage = 'mcafee';
		} else if (antiVirus.others) {
			this.currentPage = 'others';
		} else { this.currentPage = 'windows'; }
    this.commonService.setLocalStorageValue(LocalStorageKey.SecurityCurrentPage, this.currentPage);
    console.log(antiVirus);
	}
}
