import { WidgetItem } from './widget-item.model';
import { Vpn, EventTypes } from '@lenovo/tan-client-bridge';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class VPNWidgetItem extends WidgetItem {
	constructor(vpn: Vpn, commonService: CommonService, private translateService: TranslateService) {
		super({
			id: 'sa-widget-lnk-vpn',
			path: 'security/internet-protection',
			type: 'security',
			isSystemLink: false,
			metricsItemName: 'VPN'
		}, translateService);
		this.translateService.stream('common.securityAdvisor.vpn').subscribe((value) => {
			this.title = value;
		});
		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityVPNStatus);
		if (cacheStatus) {
			this.updateStatus(cacheStatus);
		}
		if (vpn.status) {
			this.updateStatus(vpn.status);
			commonService.setLocalStorageValue(LocalStorageKey.SecurityVPNStatus, vpn.status);
		}

		vpn.on(EventTypes.vpnStatusEvent, (status) => {
			this.updateStatus(status);
			commonService.setLocalStorageValue(LocalStorageKey.SecurityVPNStatus, status);
		});
	}

	updateStatus(status: string) {
		let translateKey: string;
		switch (status) {
			case 'installed':
				translateKey = 'common.securityAdvisor.installed';
				this.status = 5;
				break;
			case 'installing':
				translateKey = 'common.securityAdvisor.installing';
				this.status = 4;
				break;
			default:
				translateKey = 'common.securityAdvisor.notInstalled';
				this.status = 5;
		}
		this.translateService.stream(translateKey).subscribe((value: string) => {
			this.detail = value;
		});
	}
}
