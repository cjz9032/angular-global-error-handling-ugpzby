import { Antivirus, McAfeeInfo, WindowsDefender, OtherInfo } from '@lenovo/tan-client-bridge';
import { EventTypes } from '@lenovo/tan-client-bridge';

export class AntiVirusViewMode {
	currentPage: string;
	mcafee: McAfeeInfo;
	windowsDefender: WindowsDefender;
	otherAntiVirus: OtherInfo;
	otherFirewall: OtherInfo;
	mcafeestatusList: Array<any>;
	windowsDefenderstatusList: Array<any>;
	othersAntistatusList: Array<any>;
	othersFirestatusList: Array<any>;
	constructor(antiVirus: Antivirus) {
		this.antiVirusPage(antiVirus);
		console.log(antiVirus);
		this.mcafee = antiVirus.mcafee;
		this.windowsDefender = antiVirus.windowsDefender;
		console.log('constructor');
		console.log(antiVirus);
		if (antiVirus.mcafee && antiVirus.mcafee.features && antiVirus.mcafee.features.length > 0) {
			this.mcafeestatusList = [{
				buttonClick: this.mcafee.launch.bind(this.mcafee),
				status: this.mcafee.status,
				title: 'VIRUS SCAN',
				buttonTitle: 'ENABLE VIRUS SCAN',
			}, {
				buttonClick: this.mcafee.launch.bind(this.mcafee),
				status: this.mcafee.firewallStatus,
				title: 'FIREWALL',
				buttonTitle: 'ENABLE FIREWALL',
			}];
		}
		if (antiVirus.windowsDefender) {
			this.windowsDefenderstatusList = [{
				status: this.windowsDefender.status,
				title: 'VIRUS SCAN',
			}, {
				status: this.windowsDefender.firewallStatus,
				title: 'FIREWALL',
			}];
		}
		if (antiVirus.others) {
			if (antiVirus.others.firewall && antiVirus.others.firewall.length > 0) {
				this.otherFirewall = antiVirus.others.firewall[0];
				this.othersFirestatusList = [{
					status: this.otherFirewall.status,
					title: 'FIREWALL',
				}];
			}
			if (antiVirus.others.antiVirus && antiVirus.others.antiVirus.length > 0) {
				this.otherAntiVirus = antiVirus.others.antiVirus[0];
				this.othersAntistatusList = [{
					status: this.otherAntiVirus.status,
					title: 'VIRUS SCAN',
				}];
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
			this.antiVirusPage(antiVirus);
		}).on(EventTypes.avOthersEvent, () => {
			if (antiVirus.others) {
				if (antiVirus.others.firewall && antiVirus.others.firewall.length > 0) {
					this.othersFirestatusList = [{
						status: antiVirus.others.firewall[0].status,
						title: 'FIREWALL',
					}];
				}
				if (antiVirus.others.antiVirus && antiVirus.others.antiVirus.length > 0) {
					this.othersAntistatusList = [{
						status: antiVirus.others.antiVirus[0].status,
						title: 'VIRUS SCAN',
					}];
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
			this.antiVirusPage(antiVirus);
		}).on(EventTypes.avWindowsDefenderFirewallStatusEvent, () => {
			this.windowsDefenderstatusList = [{
				status: antiVirus.windowsDefender.status,
				title: 'VIRUS SCAN',
			}, {
				status: antiVirus.windowsDefender.firewallStatus,
				title: 'FIREWALL',
			}];
			this.antiVirusPage(antiVirus);
		});
	}

	antiVirusPage(antiVirus: Antivirus) {
		if (antiVirus.mcafee && (antiVirus.mcafee.enabled || !antiVirus.others.enabled)) {
			this.currentPage = 'mcafee';
		} else if (antiVirus.others && antiVirus.others.enabled) {
			this.currentPage = 'others';
		} else { this.currentPage = 'windows'; }
	}
}
