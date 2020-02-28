import { WidgetItem } from './widget-item.model';
import { Antivirus, EventTypes } from '@lenovo/tan-client-bridge';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class AntivirusWidgetItem extends WidgetItem {
	currentPage: string;
	constructor(public antivirus: Antivirus, public commonService: CommonService, public translateService: TranslateService) {
		super({
			id: 'sa-widget-lnk-av',
			path: 'security/anti-virus',
			type: 'security',
			isSystemLink: false,
			metricsItemName: 'Anti-Virus',
		}, translateService);

		this.waitTimeout();
		this.translateService.stream('common.securityAdvisor.antiVirus').subscribe((value) => {
			this.title = value;
		});
		const cacheAvStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus);
		const cacheFwStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus);
		const cacheCurrentPage = commonService.getLocalStorageValue(LocalStorageKey.SecurityCurrentPage);

		if (antivirus.mcafee || antivirus.windowsDefender || antivirus.others) {
			this.setPage(antivirus);
		} else if (cacheAvStatus !== undefined || cacheFwStatus !== undefined) {
			this.setAntivirusStatus(cacheAvStatus, cacheFwStatus, cacheCurrentPage);
		}

		antivirus.on(EventTypes.avRefreshedEvent, (av) => {
			this.setPage(av);
		}).on(EventTypes.avStartRefreshEvent, () => {
			if (this.status === 7) {
				this.translateService.stream('common.securityAdvisor.loading').subscribe((value) => {
					this.detail = value;
					this.status = 4;
					this.retryText = undefined;
				});
				this.waitTimeout();
			}
		});
	}

	setPage(antiVirus: Antivirus) {
		if (antiVirus.mcafee && (antiVirus.mcafee.enabled || !antiVirus.others || !antiVirus.others.enabled) && antiVirus.mcafee.expireAt > 0) {
			this.currentPage = 'mcafee';
			this.setAntivirusStatus(
				antiVirus.mcafee.status !== undefined ? antiVirus.mcafee.status : null,
				antiVirus.mcafee.firewallStatus !== undefined ? antiVirus.mcafee.firewallStatus : null,
				this.currentPage
			);
		} else if (antiVirus.others) {
			this.currentPage = 'others';
			this.setAntivirusStatus(
				antiVirus.others.antiVirus.length > 0 ? antiVirus.others.antiVirus[0].status : null,
				antiVirus.others.firewall.length > 0 ? antiVirus.others.firewall[0].status : antiVirus.windowsDefender.firewallStatus,
				this.currentPage
			);
		} else {
			this.currentPage = 'windows';
			if (antiVirus.windowsDefender) {
				this.setAntivirusStatus(
					antiVirus.windowsDefender.status !== undefined ? antiVirus.windowsDefender.status : null,
					antiVirus.windowsDefender.firewallStatus !== undefined ? antiVirus.windowsDefender.firewallStatus : null,
					this.currentPage
				);
			}
		}
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityCurrentPage, this.currentPage);
	}

	setAntivirusStatus(av: boolean | undefined, fw: boolean | undefined, currentPage: string) {
		av = undefined;
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusFirewallStatus, fw !== undefined ? fw : null);
		this.commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingAntivirusStatus, av !== undefined ? av : null);

		if (av && fw) {
			this.translateService.stream('common.securityAdvisor.enabled').subscribe((value) => {
				this.detail = value;
				this.status = 0;
			});
		} else if (av === false && fw === false) {
			this.translateService.stream('common.securityAdvisor.disabled').subscribe((value) => {
				this.detail = value;
				this.status = 1;
			});
		}  else if (typeof av === 'boolean' && typeof fw === 'boolean') {
			this.translateService.stream('common.securityAdvisor.partiallyProtected').subscribe((value) => {
				this.detail = value;
				this.status = 3;
			});
		}
	}

	retry() {
		this.translateService.stream('common.securityAdvisor.loading').subscribe((value) => {
			this.detail = value;
			this.status = 4;
			this.retryText = undefined;
		});
		this.waitTimeout();
		this.antivirus.refresh();
	}

	waitTimeout() {
		setTimeout(() => {
			if (this.status === 4) {
				this.status = 7;
				this.translateService.stream('common.ui.failedLoad').subscribe((value) => {
					this.detail = value;
				});
				this.translateService.stream('common.ui.retry').subscribe((value) => {
					this.retryText = value;
				});
			}
		}, 15000)
	}
}
