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
			type: 'security'
		}, translateService);
		this.translateService.stream('common.securityAdvisor.wifi').subscribe((value) => {
			this.title = value;
		});
		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState);
		if (cacheStatus) {
			this.updateStatus(cacheStatus, wifiSecurity.isLocationServiceOn);
		}

		if (wifiSecurity.state) {
			this.updateStatus(wifiSecurity.state, wifiSecurity.isLocationServiceOn);
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, wifiSecurity.state);
		}

		wifiSecurity.on(EventTypes.wsStateEvent, (status) => {
			this.updateStatus(status, wifiSecurity.isLocationServiceOn);
			if (status) {
				commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, status);
			}
		}).on(EventTypes.geolocatorPermissionEvent, (status) => {
			this.updateStatus(wifiSecurity.state, status);
		}).on(EventTypes.wsIsLocationServiceOnEvent, (status) => {
			this.updateStatus(wifiSecurity.state, status);
		});
	}

	updateStatus(status: string, location: boolean) {
		if (!status) { return; }
		if (location) {
			this.status = status === 'enabled' ? 0 : 1;
			this.detail = status;
		} else {
			this.status = 1;
			this.detail = 'disabled';
		}

		this.translateStatus(this.detail);
	}

	translateStatus(status: string) {
		const translateKey = status === 'enabled' ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
		this.translateService.stream(translateKey).subscribe((value) => {
			this.detail = value;
		});
	}
}
