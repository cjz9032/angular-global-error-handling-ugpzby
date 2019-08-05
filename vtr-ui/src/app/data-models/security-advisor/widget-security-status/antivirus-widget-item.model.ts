import { WidgetItem } from './widget-item.model';
import { Antivirus, EventTypes } from '@lenovo/tan-client-bridge';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class AntivirusWidgetItem extends WidgetItem {
	antivirus: Antivirus;
	constructor(antivirus: Antivirus, commonService: CommonService, private translateService: TranslateService) {
		super({
			id: 'sa-widget-lnk-av-loading',
			path: 'security/anti-virus',
			type: 'security',
			metricsItemName: 'Anti-Virus'
		}, translateService);
		this.translateService.stream('common.securityAdvisor.antiVirus').subscribe((value) => {
			this.title = value;
		});
		const cacheAvStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus);
		const cacheFwStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus);
		this.updateStatus(cacheAvStatus, cacheFwStatus, commonService);

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
		let avStatus: boolean;
		let fwStatus: boolean;
		if (mcafee && (mcafee.enabled || !others || !others.enabled)) {
			avStatus = typeof mcafee.status === 'boolean' ? mcafee.status : false;
			fwStatus = typeof mcafee.firewallStatus === 'boolean' ? mcafee.firewallStatus : false;
		} else if (others) {
			avStatus = null;
			fwStatus = null;
			if (others.antiVirus && others.antiVirus.length > 0) {
				avStatus = others.antiVirus[0].status;
			}
			if (others.firewall && others.firewall.length > 0) {
				fwStatus = others.firewall[0].status;
			}
		} else {
			avStatus = typeof defender.status === 'boolean' ? defender.status : false;
			fwStatus = typeof defender.firewallStatus === 'boolean' ? defender.firewallStatus : false;
		}
		this.updateStatus(avStatus, fwStatus, commonService);
	}

	updateStatus(avStatus: boolean, fwStatus: boolean, commonService: CommonService): void {
		if (typeof avStatus !== 'boolean' && typeof fwStatus !== 'boolean') { return; }
		if ((avStatus && fwStatus)
			|| (avStatus && typeof fwStatus !== 'boolean')
			|| (fwStatus && typeof avStatus !== 'boolean')) {
			this.translateService.stream('common.securityAdvisor.enabled').subscribe((value) => {
				this.detail = value;
				this.status = 0;
				this.id = 'sa-widget-lnk-av-enabled';
			});
		} else if (!avStatus && !fwStatus) {
			this.translateService.stream('common.securityAdvisor.disabled').subscribe((value) => {
				this.detail = value;
				this.status = 1;
				this.id = 'sa-widget-lnk-av-disabled';
			});
		} else {
			this.translateService.stream('common.securityAdvisor.partiallyProtected').subscribe((value) => {
				this.detail = value;
				this.status = 3;
				this.id = 'sa-widget-lnk-av-partiallyProtected';
			});
		}
		commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, avStatus);
		commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, fwStatus);
	}
}
