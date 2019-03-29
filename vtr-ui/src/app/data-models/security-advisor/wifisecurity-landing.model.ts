import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

export class WifiSecurityLandingViewModel {
	statusList: Array<any>;
	subject: any;
	type = 'security';
	wifiHistory: Array<phoenix.WifiDetail>;
	constructor(wfModel: phoenix.WifiSecurity, hpModel: phoenix.HomeProtection, commonService: CommonService) {
		const wfStatus = {
			status: 2,
			detail: 'disabled', // enabled / disabled
			path: 'wifi-security',
			title: 'WiFi Security',
			type: 'security',
		};
		const subjectStatus = {
			title: 'WiFi & Connected Home Security',
			status: 2,
			type: 'security',
		};
		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingWifiSecurityStatus);
		if (cacheStatus) {
			wfStatus.status = cacheStatus === 'enabled' ? 0 : 1;
			wfStatus.detail = cacheStatus;
			subjectStatus.status = cacheStatus === 'enabled' ? 0 : 1;
		}
		const cacheWifiHistory = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingWifiHistory);
		if (cacheWifiHistory) {
			this.wifiHistory = cacheWifiHistory;
		}
		if (wfModel.state) {
			wfStatus.status = (wfModel.state === 'enabled') ? 0 : 1;
			wfStatus.detail = wfModel.state;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingWifiSecurityStatus, wfStatus.detail);
			subjectStatus.status = (wfModel.state === 'enabled') ? 0 : 1;
		}
		if (wfModel.wifiHistory) {
			this.wifiHistory = wfModel.wifiHistory;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingWifiHistory, wfStatus.detail);
		}

		wfModel.on(EventTypes.wsWifiHistoryEvent, (data) => {
			this.wifiHistory = wfModel.wifiHistory;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingWifiHistory, wfStatus.detail);
		});

		wfModel.on(EventTypes.wsStateEvent, (data) => {
			wfStatus.status = (data === 'enabled') ? 0 : 1;
			wfStatus.detail = data;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingWifiSecurityStatus, wfStatus.detail);
			subjectStatus.status = (data === 'enabled') ? 0 : 1;
		});
		this.statusList = new Array(wfStatus);
		this.subject = subjectStatus;
	}
}
