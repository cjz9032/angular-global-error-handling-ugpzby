import {
	EventTypes
} from '@lenovo/tan-client-bridge';
import * as phoenix from '@lenovo/tan-client-bridge';
import {
	CommonService
} from 'src/app/services/common/common.service';
import {
	LocalStorageKey
} from 'src/app/enums/local-storage-key.enum';
import {
	TranslateService
} from '@ngx-translate/core';

export class WifiSecurityLandingViewModel {
	statusList: Array < any > ;
	subject: any;
	type = 'security';
	wifiHistory: Array < phoenix.WifiDetail > ;
	imgUrl = '../../../../assets/images/coronet-logo.svg';
	constructor(
		wfModel: phoenix.WifiSecurity,
		commonService: CommonService,
		translate: TranslateService
	) {
		const wfStatus = {
			status: 2,
			detail: 'common.securityAdvisor.loading',
			path: 'security/wifi-security',
			title: 'common.securityAdvisor.wifi',
			type: 'security',
		};
		const subjectStatus = {
			title: 'security.landing.wifiConnected',
			status: 2,
			type: 'security',
		};

		const setWiFiSecurityState = (state: string, location: any) => {
			if (location) {
				wfStatus.status = state === 'enabled' ? 0 : 1;
				wfStatus.detail = state === 'enabled' ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
				commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, state);
				subjectStatus.status = (state === 'enabled') ? 0 : 1;
			} else {
				wfStatus.status = 1;
				wfStatus.detail = 'common.securityAdvisor.disabled';
				subjectStatus.status = 1;
				commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, state);
			}

			translate.get(wfStatus.detail).subscribe((res) => {
				wfStatus.detail = res;
			});
			translate.get(wfStatus.title).subscribe((res) => {
				wfStatus.title = res;
			});
			translate.get(subjectStatus.title).subscribe((res) => {
				subjectStatus.title = res;
			});
		}

		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState);
		setWiFiSecurityState(cacheStatus, wfModel.isLocationServiceOn);
		const cacheWifiHistory = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys);
		if (cacheWifiHistory) {
			this.wifiHistory = cacheWifiHistory;
		}
		setWiFiSecurityState(wfModel.state, wfModel.isLocationServiceOn);
		if (wfModel.wifiHistory && wfModel.wifiHistory.length > 0) {
			this.wifiHistory = wfModel.wifiHistory;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys, wfModel.wifiHistory);
		}

		wfModel.on(EventTypes.wsWifiHistoryEvent, (data) => {
			this.wifiHistory = data;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys, data);
		});
		wfModel.on(EventTypes.geolocatorPermissionEvent, (data) => {
			console.log(`geolocator event ----- geo: ${data}, wifi state: ${wfModel.state}`);
			setWiFiSecurityState(wfModel.state, data);
		});
		wfModel.on(EventTypes.wsStateEvent, (data) => {
			console.log(`wifi state event ----- geo: ${wfModel.isLocationServiceOn}, wifi state: ${data}`);
			setWiFiSecurityState(data, wfModel.isLocationServiceOn);
		});
		wfModel.on(EventTypes.wsIsLocationServiceOnEvent, (data) => {
			console.log(`isLocationServiceOn event ----- geo: ${data}, wifi state: ${wfModel.state}`);
			setWiFiSecurityState(wfModel.state, data);
		});

		this.statusList = new Array(wfStatus);
		this.subject = subjectStatus;
	}
}
