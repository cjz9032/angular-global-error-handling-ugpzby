import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';

export class AntiVirusLandingViewModel {
	// antivirus: Antivirus;
	statusList: Array<any>;

	subject = 'Anti-Virus';
	subjectStatus: number;
	type = 'security';
	imgUrl = '';
	constructor(avModel: phoenix.Antivirus) {
		// this.antivirus = avModel;
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
		if (avModel.mcafee) { // mcafee
			if (avModel.mcafee.enabled || (!avModel.others.enabled && !avModel.mcafee.enabled)) {
				avStatus.status = (avModel.mcafee.status === true) ? 0 : 1;
				avStatus.detail = (avModel.mcafee.status === true) ? 'enabled' : 'disabled';
				fwStatus.status = (avModel.mcafee.firewallStatus === true) ? 0 : 1;
				fwStatus.detail = (avModel.mcafee.firewallStatus === true) ? 'enabled' : 'disabled';
				this.imgUrl = '../../../../assets/images/mcafee_logo.svg';
				// console.log('mcafee');
			}
		} else if ((avModel.others && avModel.others.enabled) || (avModel.others && !avModel.others.enabled)) { // others
      if (avModel.others.antiVirus.length > 0) {
        avStatus.status = (avModel.others.antiVirus[0].status === true) ? 0 : 1;
        avStatus.detail = (avModel.others.antiVirus[0].status === true) ? 'enabled' : 'disabled';     
      }
      if (avModel.others.firewall.length > 0) {
        fwStatus.status = (avModel.others.firewall[0].status === true) ? 0 : 1;
        fwStatus.detail = (avModel.others.firewall[0].status === true) ? 'enabled' : 'disabled';  
      }
			// console.log('others');
		} else if (avModel.windowsDefender) { // windows defender
			avStatus.status = (avModel.windowsDefender.status === true) ? 0 : 1;
			avStatus.detail = (avModel.windowsDefender.status === true) ? 'enabled' : 'disabled';
			fwStatus.status = (avModel.windowsDefender.firewallStatus === true) ? 0 : 1;
			fwStatus.detail = (avModel.windowsDefender.firewallStatus === true) ? 'enabled' : 'disabled';
			this.imgUrl = '../../../../assets/images/windows-logo.png';
			// console.log('defender');
		}


		if (avStatus.status === 0 && fwStatus.status === 0) {
			this.subjectStatus = 0;
		} else if (avStatus.status === 0 || fwStatus.status === 0) {
			this.subjectStatus = 3;
		} else {
			this.subjectStatus = 1;
		}

		avModel.on(EventTypes.avWindowsDefenderAntivirusStatusEvent, (data) => {
			avStatus.status = (data === true) ? 0 : 1;
		});
		avModel.on(EventTypes.avWindowsDefenderFirewallStatusEvent, (data) => {
			fwStatus.status = (data === true) ? 0 : 1;
		});
		avModel.on(EventTypes.avOthersEvent, (data) => {
      if (data.antivirus.length > 0) avStatus.status = (data.antivirus[0].status === true) ? 0 : 1;
			if (data.firewall.length > 0) fwStatus.status = (data.firewall[0].status === true) ? 0 : 1;
		});
		// avModel.on(EventTypes.avMcafeeStatusEvent, (data) => {
		// 	avStatus.status = (data === true) ? 0 : 1;
		// });
		// avModel.on(EventTypes.avMcafeeFirewallStatusEvent, (data) => {
		// 	fwStatus.status = (data === true) ? 0 : 1;
		// });
		this.statusList = new Array(avStatus, fwStatus);
	}
}