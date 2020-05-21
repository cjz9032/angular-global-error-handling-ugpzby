import * as phoenix from '@lenovo/tan-client-bridge';
import { EventTypes, WifiSecurity, DeviceInfo, WifiDetail } from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from '../../enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { CommsService } from 'src/app/services/comms/comms.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { NgZone } from '@angular/core';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { cloneDeep, isEqual } from 'lodash';

interface DevicePostureDetail {
	status: number; // 1,2
	title: string; // name
	detail: string; // failed,passed
	path: string;
	type: string;
}

interface WifiHistoryDetail {
	ssid: string;
	info: string;
	good: string;
	visible: boolean;
  }

export class WifiHomeViewModel {
	wifiSecurity: WifiSecurity;
	isLWSEnabled: boolean;
	histories: WifiHistoryDetail[] = [];
	hasMore: boolean;
	tryNowUrl: string;
	homeStatus: string;
	tryNowEnable = false;
	private preHistories: WifiHistoryDetail[] = [];

	constructor(
		wifiSecurity: phoenix.WifiSecurity,
		private commonService: CommonService
		) {
		const cacheWifiSecurityState = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState);
		const cacheWifiSecurityHistory = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys);

		wifiSecurity.on(EventTypes.wsWifiHistoryEvent, (value) => {
			if (value) {
				const cacheWifiSecurityHistoryNum = commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum)? JSON.parse(commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum)): 4;
				commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys, value);
				this.histories = this.mappingHistory(wifiSecurity.wifiHistory);
				if (!isEqual(this.preHistories, this.histories)) {
					this.preHistories = cloneDeep(this.histories);
					this.hasMore = this.histories.length > 4;
					this.hideHistories(this.histories, cacheWifiSecurityHistoryNum);
					commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, cacheWifiSecurityHistoryNum);
				}
			}
		});
		this.wifiSecurity = wifiSecurity;
		if (wifiSecurity && wifiSecurity.state) {
			if (wifiSecurity.isLocationServiceOn !== undefined) {
				this.isLWSEnabled = (wifiSecurity.state === 'enabled' && wifiSecurity.isLocationServiceOn);
			}
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, wifiSecurity.state);
		} else if (cacheWifiSecurityState) {
			if (wifiSecurity && wifiSecurity.isLocationServiceOn !== undefined) {
				this.isLWSEnabled = (cacheWifiSecurityState === 'enabled' && wifiSecurity.isLocationServiceOn);
			}
		}
		if (wifiSecurity && wifiSecurity.wifiHistory) {
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys, wifiSecurity.wifiHistory);
			this.initializeHistories(wifiSecurity.wifiHistory, 4);
			this.preHistories = cloneDeep(this.histories);
		} else if (cacheWifiSecurityHistory) {
			this.initializeHistories(cacheWifiSecurityHistory, 4);
		}
	}

	initializeHistories(wifiHistory: phoenix.WifiDetail[], visibleNum: number) {
		this.histories = this.mappingHistory(wifiHistory);
		this.hasMore = this.histories.length > 4;
		this.hideHistories(this.histories, visibleNum);
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, visibleNum);
	}

	mappingHistory (histories: phoenix.WifiDetail[]): WifiHistoryDetail[] {
		const Histories = [];
		histories.forEach((item) => {
			let i = {
				ssid: '',
				info: '',
				good: null,
				visible: true
			};
			i.ssid = item.ssid? item.ssid: '';
			i.info = item.info? item.info: '';
			i.good = item.good? item.good: null;
			if (i.info.indexOf('Connected') === -1) {
				i.info.replace(/T/g, ' ');
			}
			Histories.push(i);
		});
		return Histories;
	}

	hideHistories (histories: WifiHistoryDetail[], visibleNum: number) {
		histories.forEach((item, index) => {
			item.visible = index < visibleNum;
		})
	}
}

export class SecurityHealthViewModel {
	isLWSEnabled: boolean;
	homeDevicePosture: DevicePostureDetail[] = [];

	constructor(wifiSecurity: phoenix.WifiSecurity, private commonService: CommonService, public translate: TranslateService, private ngZone: NgZone) {
		const cacheWifiSecurityState = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState);
		if (wifiSecurity && wifiSecurity.state) {
			if (wifiSecurity.isLocationServiceOn !== undefined) {
				this.isLWSEnabled = (wifiSecurity.state === 'enabled' && wifiSecurity.isLocationServiceOn);
				commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, wifiSecurity.state);
			}
		} else if (cacheWifiSecurityState) {
			if (wifiSecurity && wifiSecurity.isLocationServiceOn !== undefined) {
				this.isLWSEnabled = (cacheWifiSecurityState === 'enabled' && wifiSecurity.isLocationServiceOn);
			}
		}
		wifiSecurity.on(EventTypes.wsStateEvent, (value) => {
			if (value) {
				if (wifiSecurity.isLocationServiceOn !== undefined) {
					this.isLWSEnabled = (value === 'enabled' && wifiSecurity.isLocationServiceOn);
					commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, value);
				}
			}
		});
		wifiSecurity.on(EventTypes.wsIsLocationServiceOnEvent, (value) => {
			this.ngZone.run(() => {
				if (value !== undefined) {
					if (wifiSecurity.state) {
						this.isLWSEnabled = (wifiSecurity.state === 'enabled' && value);
					}
				}
			});
		});
	}
}
