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
	type = 'security';
	wifiHistory: Array < phoenix.WifiDetail > ;
	imgUrl = '../../../../assets/images/coronet-logo.svg';

	wfStatus = {
		status: 4,
		detail: '',
		path: 'security/wifi-security',
		title: '',
		type: 'security',
		id: 'sa-ov-link-wifiSecurity'
	};
	subject = {
		title: '',
		status: 1,
		type: 'security',
	};
	translateString: any;
	constructor(
		public translate: TranslateService,
		wfModel: phoenix.WifiSecurity,
		public commonService: CommonService,
        ngZone: NgZone
	) {
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

		translate.stream([
			'common.securityAdvisor.loading',
			'common.securityAdvisor.enabled',
			'common.securityAdvisor.disabled',
			'common.securityAdvisor.wifi'
		]).subscribe((res) => {
			this.translateString = res;
			if (!this.wfStatus.detail) {
				this.wfStatus.detail = res['common.securityAdvisor.loading'];
			}
			this.wfStatus.title = res['common.securityAdvisor.wifi'];
			this.subject.title = res['common.securityAdvisor.wifi'];
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
			this.statusList = new Array(this.wfStatus);
		});
	}

	setWiFiSecurityState(state: string, location: any) {
		if (!this.translateString) {
			return;
		}
		if (location) {
			this.wfStatus.status = state === 'enabled' ? 0 : 1;
			this.wfStatus.detail = this.translateString[`common.securityAdvisor.${state === 'enabled' ? 'enabled' : 'disabled'}`];
			this.subject.status = state === 'enabled' ? 0 : 1;
		} else {
			this.wfStatus.status = 1;
			this.wfStatus.detail = this.translateString['common.securityAdvisor.disabled'];
			this.subject.status = 1;
		}
		if (state) {
			this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, state);
		}
	}

}
