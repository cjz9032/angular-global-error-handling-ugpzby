import { EventTypes } from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from 'src/app/enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';

export class WifiSecurityLandingViewModel {
	statusList: Array<any>;
	subject: any;
	type = 'security';
	wifiHistory: Array<phoenix.WifiDetail>;
	imgUrl = '../../../../assets/images/coronet-logo.svg';
	constructor(
		wfModel: phoenix.WifiSecurity,
		commonService: CommonService,
		translate: TranslateService
		) {
		const wfStatus = {
			status: 2,
			detail: 'common.securityAdvisor.loading', // enabled / disabled
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
			commonService.setLocalStorageValue(LocalStorageKey.SecurityLandingWifiSecurityStatus, data);
			subjectStatus.status = (data === 'enabled') ? 0 : 1;
		});
		translate.get(wfStatus.detail).subscribe((res) => {
			wfStatus.detail = res;
		});
		translate.get(wfStatus.title).subscribe((res) => {
			wfStatus.title = res;
		});
		translate.get(subjectStatus.title).subscribe((res) => {
			subjectStatus.title = res;
		});
		this.statusList = new Array(wfStatus);
		this.subject = subjectStatus;
	}
}
