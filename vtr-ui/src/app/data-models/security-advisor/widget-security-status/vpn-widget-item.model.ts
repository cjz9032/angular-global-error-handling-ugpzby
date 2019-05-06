import { WidgetItem } from './widget-item.model';
import { Vpn, EventTypes } from '@lenovo/tan-client-bridge';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class VPNWidgetItem extends WidgetItem {
	constructor(vpn: Vpn, commonService: CommonService, private translateService: TranslateService) {
		super({
			id: 'vpn',
			path: 'security/internet-protection',
			type: 'security'
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
		this.status = 5;
		this.detail = status;

		const translateKey = status === 'installed' ? 'common.securityAdvisor.installed' : 'common.securityAdvisor.notInstalled';
		this.translateService.stream(translateKey).subscribe((value) => {
			this.detail = value;
		});
	}
}
