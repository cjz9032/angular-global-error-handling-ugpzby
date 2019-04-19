import { WidgetItem } from './widget-item.model';
import { Antivirus, EventTypes } from '@lenovo/tan-client-bridge';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';

export class AntivirusWidgetItem extends WidgetItem {
	antivirus: Antivirus;
	constructor(antivirus: Antivirus, commonService: CommonService, private translateService: TranslateService) {
		super({
			id: 'anti-virus',
			path: 'security/anti-virus',
			type: 'security'
		}, translateService);
		this.translateService.stream('common.securityAdvisor.antiVirus').subscribe((value) => {
			this.title = value;
		});
		const cacheAvStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus);
		const cacheFwStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus);
		if (typeof cacheAvStatus === 'boolean' || typeof cacheFwStatus === 'boolean') {
			this.updateStatus(cacheAvStatus, cacheFwStatus, commonService);
		}

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
			this.updateStatus(mcafee.status, mcafee.firewallStatus, commonService);
		} else if (others) {
			this.updateStatus(others.antiVirus.length > 0 ? others.antiVirus[0].status : null, others.firewall.length > 0 ? others.firewall[0].status : null, commonService);
		} else {
			this.updateStatus(defender.status, defender.firewallStatus !== undefined ? defender.firewallStatus : null, commonService);
		}
	}

	updateStatus(avStatus: boolean, fwStatus: boolean, commonService): void {
		if (avStatus && fwStatus) {
			this.status = 0;
			this.detail = 'enabled';
			this.translateService.stream('common.securityAdvisor.enabled').subscribe((value) => {
				this.detail = value;
			});
		} else if (!avStatus && !fwStatus) {
			this.status = 1;
			this.detail = 'disabled';
			this.translateService.stream('common.securityAdvisor.disabled').subscribe((value) => {
				this.detail = value;
			});
		} else {
			this.status = 3;
			this.detail = 'partially protected';
			this.translateService.stream('common.securityAdvisor.partiallyProtected').subscribe((value) => {
				this.detail = value;
			});
		}
		commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, avStatus !== undefined ? avStatus : null);
		commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, fwStatus !== undefined ? fwStatus : null);
	}
}
