import { WidgetItem } from './widget-item.model';
import { Vpn, EventTypes } from '@lenovo/tan-client-bridge';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { LocalCacheService } from 'src/app/services/local-cache/local-cache.service';

export class VPNWidgetItem extends WidgetItem {
	constructor(
		vpn: Vpn,
		commonService: CommonService,
		private localCacheService: LocalCacheService,
		private translateService: TranslateService
	) {
		super(
			{
				id: 'sa-widget-lnk-vpn',
				path: 'security/internet-protection',
				type: 'security',
				isSystemLink: false,
				metricsItemName: 'VPN',
			},
			translateService
		);
		this.translateService.stream('common.securityAdvisor.vpn').subscribe((value) => {
			this.title = value;
		});
		const cacheStatus = this.localCacheService.getLocalCacheValue(
			LocalStorageKey.SecurityVPNStatus
		);
		if (cacheStatus) {
			this.updateStatus(cacheStatus);
		}
		if (vpn.status) {
			this.updateStatus(vpn.status);
			this.localCacheService.setLocalCacheValue(
				LocalStorageKey.SecurityVPNStatus,
				vpn.status
			);
		}

		vpn.on(EventTypes.vpnStatusEvent, (status) => {
			this.updateStatus(status);
			this.localCacheService.setLocalCacheValue(LocalStorageKey.SecurityVPNStatus, status);
		});
	}

	updateStatus(status: string) {
		let translateKey: string;
		switch (status) {
			case 'installed':
				translateKey = 'common.securityAdvisor.installed';
				this.status = 'installState';
				break;
			case 'installing':
				translateKey = 'common.securityAdvisor.installing';
				this.status = 'loading';
				break;
			default:
				translateKey = 'common.securityAdvisor.notInstalled';
				this.status = 'installState';
		}
		this.translateService.stream(translateKey).subscribe((value: string) => {
			this.detail = value;
		});
	}
}
