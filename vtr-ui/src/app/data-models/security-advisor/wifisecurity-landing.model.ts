import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';

export class WifiSecurityLandingViewModel {
	statusList: Array<any>;
	subject: any;
	type = 'security';
	wifiHistory: Array<phoenix.WifiDetail>;
	imgUrl = '../../../../assets/images/coronet-logo.svg';
	constructor(wfModel: phoenix.WifiSecurity, hpModel: phoenix.HomeProtection, commonService: CommonService) {
		const wfStatus = {
			status: 2,
			detail: 'common.securityAdvisor.disabled', // enabled / disabled
			path: 'security/wifi-security',
			title: 'common.securityAdvisor.wifi',
			type: 'security',
		};
		const subjectStatus = {
			title: 'security.landing.wifiConnected',
			status: 2,
			type: 'security',
		};
		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingWifiSecurityStatus);
		if (cacheStatus) {
			wfStatus.status = cacheStatus === 'enabled' ? 0 : 1;
			wfStatus.detail = cacheStatus === 'enabled' ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
			subjectStatus.status = cacheStatus === 'enabled' ? 0 : 1;
		}
		const cacheWifiHistory = commonService.getLocalStorageValue(LocalStorageKey.SecurityLandingWifiHistory);
		if (cacheWifiHistory) {
			this.wifiHistory = cacheWifiHistory;
		}
		if (wfModel.state) {
			wfStatus.status = wfModel.state === 'enabled' ? 0 : 1;
			wfStatus.detail = wfModel.state === 'enabled' ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingWifiSecurityStatus, wfModel.state);
			subjectStatus.status = (wfModel.state === 'enabled') ? 0 : 1;
		}
		if (wfModel.wifiHistory) {
			this.wifiHistory = wfModel.wifiHistory;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingWifiHistory, wfModel.wifiHistory);
		}

		wfModel.on(EventTypes.wsWifiHistoryEvent, (data) => {
			this.wifiHistory = data;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingWifiHistory, data);
		});

		wfModel.on(EventTypes.wsStateEvent, (data) => {
			wfStatus.status = data === 'enabled' ? 0 : 1;
			wfStatus.detail = data === 'enabled' ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingWifiSecurityStatus, wfStatus.detail);
			subjectStatus.status = (data === 'enabled') ? 0 : 1;
		});
		this.statusList = new Array(wfStatus);
		this.subject = subjectStatus;
	}
}
