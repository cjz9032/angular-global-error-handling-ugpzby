import * as phoenix from '@lenovo/tan-client-bridge';
import { EventTypes, WifiSecurity, DeviceInfo } from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from '../../enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { CommsService } from 'src/app/services/comms/comms.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { NgZone } from '@angular/core';
import { DialogService } from 'src/app/services/dialog/dialog.service';


interface DevicePostureDetail {
	status: number; // 1,2
	title: string; // name
	detail: string; // failed,passed
	path: string;
	type: string;
}

export class WifiHomeViewModel {
	wifiSecurity: WifiSecurity;
	isLWSEnabled: boolean;
	allHistories: Array<phoenix.WifiDetail>;
	hasMore: boolean;
	histories: Array<phoenix.WifiDetail>;
	tryNowUrl: string;
	homeStatus: string;
	tryNowEnable = false;

	constructor(
		wifiSecurity: phoenix.WifiSecurity,
		private commonService: CommonService,
		private ngZone: NgZone,
		private dialogService: DialogService
		) {
		const cacheWifiSecurityState = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState);
		const cacheWifiSecurityHistory = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys);
		wifiSecurity.on(EventTypes.wsStateEvent, (value) => {
			if (value) {
				commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, value);
				if (this.wifiSecurity.isLocationServiceOn !== undefined) {
					this.isLWSEnabled = (value === 'enabled' && this.wifiSecurity.isLocationServiceOn);
				}
			}
		});
		wifiSecurity.on(EventTypes.wsIsLocationServiceOnEvent, (value) => {
			this.ngZone.run(() => {
				if (value !== undefined) {
					if (this.wifiSecurity.state) {
						this.isLWSEnabled = (this.wifiSecurity.state === 'enabled' && value);
					}
					if (!value && this.wifiSecurity.state === 'enabled' && this.wifiSecurity.hasSystemPermissionShowed) {
						this.dialogService.wifiSecurityLocationDialog(this.wifiSecurity);
					} else if (value) {
						if (this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityLocationFlag) === 'yes') {
							this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityLocationFlag, 'no');
							this.wifiSecurity.enableWifiSecurity().then((res) => {
								this.isLWSEnabled = res;
							});
						}
					}
				}
			});
		});
		wifiSecurity.on(EventTypes.wsWifiHistoryEvent, (value) => {
			if (value) {
				let cacheWifiSecurityHistoryNum = commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum);
				commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys, value);
				this.allHistories = wifiSecurity.wifiHistory;
				this.allHistories = this.mappingHistory(this.allHistories);
				if (cacheWifiSecurityHistoryNum) {
					cacheWifiSecurityHistoryNum = JSON.parse(cacheWifiSecurityHistoryNum);
					if (this.allHistories.length > 4) {
						this.hasMore = true;
					} else {
						this.hasMore = false;
					}
					this.histories = wifiSecurity.wifiHistory.slice(0, cacheWifiSecurityHistoryNum);
				} else {
					if (this.allHistories.length > 4) {
						this.hasMore = true;
					} else {
						this.hasMore = false;
					}
					this.histories = wifiSecurity.wifiHistory.slice(0, 4);
					commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, 4);
				}
				this.histories = this.mappingHistory(this.histories);
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
			this.allHistories = wifiSecurity.wifiHistory;
			this.allHistories = this.mappingHistory(this.allHistories);
			if (this.allHistories.length > 4) {
					this.hasMore = true;
			} else {
				this.hasMore = false;
			}
			this.histories = wifiSecurity.wifiHistory.slice(0, 4);
			commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, 4);
			this.histories = this.mappingHistory(this.histories);
		} else if (cacheWifiSecurityHistory) {
			this.allHistories = cacheWifiSecurityHistory;
			this.allHistories = this.mappingHistory(this.allHistories);
			if (this.allHistories.length > 4) {
				this.hasMore = true;
			} else {
				this.hasMore = false;
			}
			this.histories = cacheWifiSecurityHistory.slice(0, 4);
			commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, 4);
			this.histories = this.mappingHistory(this.histories);
		}
	}

	mappingHistory(histories: Array<phoenix.WifiDetail>): Array<phoenix.WifiDetail> {
		const Histories = [];
		histories.forEach((item) => {
			let i = {
				ssid: '',
				info: '',
				good: null
			};
			i = item;
			if (i.info.indexOf('Connected') === -1) {
				const info = i.info.replace(/T/g, ' ');
				i.info = info;
			}
			Histories.push(i);
		});
		return Histories;
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
