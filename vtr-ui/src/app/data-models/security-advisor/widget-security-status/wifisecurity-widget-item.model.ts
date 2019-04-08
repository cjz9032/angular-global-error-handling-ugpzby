import { WidgetItem } from './widget-item.model';
import { WifiSecurity, EventTypes } from '@lenovo/tan-client-bridge';
import { CommonService } from '../../../services/common/common.service';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class WifiSecurityWidgetItem extends WidgetItem {
	constructor(wifiSecurity: WifiSecurity, commonService: CommonService, private translateService: TranslateService) {
		super({
			id: 'wifi-security',
			path: 'security/wifi-security',
			title: 'WiFi Security',
			type: 'security'
		});
		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState);
		this.updateStatus(cacheStatus);

		this.updateStatus(wifiSecurity.state);
		if (wifiSecurity.state) {
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, wifiSecurity.state);
		}

		wifiSecurity.on(EventTypes.wsStateEvent, (status) => {
			this.updateStatus(status);
			if (status) {
				commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, status);
			}
		});
	}

	updateStatus(status: string) {
		if (status) {
			this.status = status === 'enabled' ? 0 : 1;
			this.detail = status;
		}

		this.translateString(this.detail);
	}

	translateString(status: string) {
		const translateKey = status === 'enabled' ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
		this.translateService.get(translateKey).subscribe((value) => {
			this.detail = value;
		});
	}
}
