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
import { NgZone } from '@angular/core';
import { StatusInfo } from './status-info.model';

export class WifiSecurityLandingViewModel {
	statusList: Array < StatusInfo > ;
	// subject: any;
	type = 'security';
	wifiHistory: Array < phoenix.WifiDetail > ;
	imgUrl = '../../../../assets/images/coronet-logo.svg';

	wfStatus = {
		status: 4,
		detail: 'common.securityAdvisor.loading',
		path: 'security/wifi-security',
		title: 'common.securityAdvisor.wifi',
		type: 'security',
		id: 'sa-ov-link-wifiSecurity'
	};
	subject = {
		title: 'common.securityAdvisor.wifi',
		status: 1,
		type: 'security',
	};
	constructor(
		public translate: TranslateService,
		wfModel: phoenix.WifiSecurity,
		public commonService: CommonService,
        ngZone: NgZone
	) {
		const cacheStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState);
		const cacheWifiHistory = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys);
		if (wfModel && wfModel.state) {
			if (wfModel.isLocationServiceOn !== undefined) {
				this.setWiFiSecurityState(wfModel.state, wfModel.isLocationServiceOn);
			}
		} else if (cacheStatus) {
			if (wfModel && wfModel.isLocationServiceOn !== undefined) {
				this.setWiFiSecurityState(cacheStatus, wfModel.isLocationServiceOn);
			}
		}
		if (wfModel.wifiHistory && wfModel.wifiHistory.length > 0) {
			this.wifiHistory = wfModel.wifiHistory;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys, wfModel.wifiHistory);
		} else if (cacheWifiHistory) {
			this.wifiHistory = cacheWifiHistory;
		}

		wfModel.on(EventTypes.wsWifiHistoryEvent, (data) => {
			this.wifiHistory = data;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys, data);
		});
		wfModel.on(EventTypes.wsIsLocationServiceOnEvent, (data) => {
			ngZone.run(() => {
				this.setWiFiSecurityState(wfModel.state, data);
			});
		});
		wfModel.on(EventTypes.wsStateEvent, (data) => {
			this.setWiFiSecurityState(data, wfModel.isLocationServiceOn);
		});
		this.statusList = new Array(this.wfStatus);

		translate.stream(this.wfStatus.detail).subscribe((res) => {
			this.wfStatus.detail = res;
		});
		translate.stream(this.wfStatus.title).subscribe((res) => {
			this.wfStatus.title = res;
		});
		translate.stream(this.subject.title).subscribe((res) => {
			this.subject.title = res;
		});
	}

	setWiFiSecurityState(state: string, location: any) {
		if (location) {
			this.wfStatus.status = state === 'enabled' ? 0 : 1;
			this.wfStatus.detail = state === 'enabled' ? 'common.securityAdvisor.enabled' : 'common.securityAdvisor.disabled';
			this.subject.status = state === 'enabled' ? 0 : 1;
		} else {
			this.wfStatus.status = 1;
			this.wfStatus.detail = 'common.securityAdvisor.disabled';
			this.subject.status = 1;
		}
		if (state) {
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, state);
		}

		this.translate.stream(this.wfStatus.detail).subscribe((res: string) => {
			this.statusList[0].detail = res;
		});
	}

}
