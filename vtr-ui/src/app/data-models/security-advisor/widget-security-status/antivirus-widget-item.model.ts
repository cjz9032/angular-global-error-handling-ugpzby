import { WidgetItem } from './widget-item.model';
import { Antivirus, EventTypes } from '@lenovo/tan-client-bridge';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class AntivirusWidgetItem extends WidgetItem {
	antivirus: Antivirus;
	constructor(antivirus: Antivirus, commonService: CommonService, private translateService: TranslateService) {
		super({
			id: 'anti-virus',
			path: 'security/anti-virus',
			title: 'Anti-Virus',
			type: 'security'
		});
		const cacheAvStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus);
		const cacheFwStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus);
		this.updateStatus(cacheAvStatus === 'enabled', cacheFwStatus === 'enabled');

		if (antivirus.mcafee || antivirus.windowsDefender || antivirus.others) {
			this.updateStatusByAv(antivirus, commonService);
		}

		antivirus.on(EventTypes.avMcafeeFeaturesEvent, () => {
			this.updateStatusByAv(antivirus, commonService);
		}).on(EventTypes.avOthersEvent, () => {
			this.updateStatusByAv(antivirus, commonService);
		}).on(EventTypes.avWindowsDefenderAntivirusStatusEvent, () => {
			this.updateStatusByAv(antivirus, commonService);
		}).on(EventTypes.avWindowsDefenderFirewallStatusEvent, () => {
			this.updateStatusByAv(antivirus, commonService);
		});
	}

	updateStatusByAv(antivirus: Antivirus, commonService: CommonService): void {
		const mcafee = antivirus.mcafee;
		const defender = antivirus.windowsDefender;
		const others = antivirus.others;
		if (mcafee && (mcafee.enabled || !others || !others.enabled)) {
			this.updateStatus(mcafee.status, mcafee.firewallStatus);
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, mcafee.status ? 'enabled' : 'disabled');
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, mcafee.firewallStatus ? 'enabled' : 'disabled');
		} else if (others) {
			let avStatus = false;
			let fwStatus = false;
			if (others.antiVirus.length > 0) {
				avStatus = others.antiVirus[0].status;
				commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, others.antiVirus[0].status ? 'enabled' : 'disabled');
			}
			if (others.firewall.length > 0) {
				fwStatus = others.firewall[0].status;
				commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, others.firewall[0].status ? 'enabled' : 'disabled');
			}
			this.updateStatus(avStatus, fwStatus);
		} else {
			this.updateStatus(defender.status, defender.firewallStatus);
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, defender.status ? 'enabled' : 'disabled');
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, defender.firewallStatus ? 'enabled' : 'disabled');
		}
	}

	updateStatus(avStatus: boolean, fwStatus: boolean): void {
		if (avStatus && fwStatus) {
			this.status = 0;
			this.detail = 'enabled';
			this.translateService.get('common.securityAdvisor.enabled').subscribe((value) => {
				this.detail = value;
			});
		} else if (!avStatus && !fwStatus) {
			this.status = 1;
			this.detail = 'disabled';
			this.translateService.get('common.securityAdvisor.disabled').subscribe((value) => {
				this.detail = value;
			});
		} else {
			this.status = 3;
			this.detail = 'TO DO';
		}
	}
}
