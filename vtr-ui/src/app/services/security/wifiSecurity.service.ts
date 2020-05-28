import * as phoenix from '@lenovo/tan-client-bridge';
import { EventTypes, WifiSecurity, DeviceInfo, WifiDetail } from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from '../../enums/local-storage-key.enum';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';
import { Injectable } from '@angular/core';
import { cloneDeep, isEqual } from 'lodash';
import { VantageShellService } from 'src/app/services/vantage-shell/vantage-shell.service';

interface WifiHistoryDetail {
	ssid: string;
	info: string;
	good: string;
	visible: boolean;
  }

@Injectable({
	providedIn: 'root'
})

export class WifiSecurityService {
	wifiSecurity: WifiSecurity;
	isLWSEnabled: boolean;
	histories: WifiHistoryDetail[] = [];
	hasMore: boolean;
	private preHistories: WifiHistoryDetail[] = [];

	constructor(
		private commonService: CommonService,
		private shellService: VantageShellService
		) {
		const cacheWifiSecurityState = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState);
		const cacheWifiSecurityHistory = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys);

		const securityAdvisor = this.shellService.getSecurityAdvisor();
		if (securityAdvisor) {
			this.wifiSecurity = securityAdvisor.wifiSecurity;
		}
		if (this.wifiSecurity && this.wifiSecurity.state) {
			if (this.wifiSecurity.isLocationServiceOn !== undefined) {
				this.isLWSEnabled = (this.wifiSecurity.state === 'enabled' && this.wifiSecurity.isLocationServiceOn);
			}
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, this.wifiSecurity.state);
		} else if (cacheWifiSecurityState) {
			if (this.wifiSecurity && this.wifiSecurity.isLocationServiceOn !== undefined) {
				this.isLWSEnabled = (cacheWifiSecurityState === 'enabled' && this.wifiSecurity.isLocationServiceOn);
			}
		}
		if (this.wifiSecurity && this.wifiSecurity.wifiHistory) {
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys, this.wifiSecurity.wifiHistory);
			this.initializeHistories(this.wifiSecurity.wifiHistory, 4);
			this.preHistories = cloneDeep(this.histories);
		} else if (cacheWifiSecurityHistory) {
			this.initializeHistories(cacheWifiSecurityHistory, 4);
		}
		this.eventListener(this.wifiSecurity);
	}

	eventListener(wifiSecurity: phoenix.WifiSecurity) {
		wifiSecurity.on(EventTypes.wsWifiHistoryEvent, (value) => {
			if (value) {
				const cacheWifiSecurityHistoryNum = this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum)? JSON.parse(this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum)): 4;
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys, value);
				this.histories = this.mappingHistory(wifiSecurity.wifiHistory);
				if (!isEqual(this.preHistories, this.histories)) {
					this.preHistories = cloneDeep(this.histories);
					this.hasMore = this.histories.length > 4;
					this.hideHistories(this.histories, cacheWifiSecurityHistoryNum);
					this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, cacheWifiSecurityHistoryNum);
				}
			}
		});

		wifiSecurity.on(EventTypes.wsStateEvent, (value) => {
			if (value) {
				if (typeof wifiSecurity.isLocationServiceOn === 'boolean') {
					this.isLWSEnabled = (value === 'enabled' && wifiSecurity.isLocationServiceOn);
				}
				this.commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, value);
			}
		});

		wifiSecurity.on(EventTypes.wsIsLocationServiceOnEvent, (value) => {
			if (typeof value === 'boolean' && wifiSecurity.state) {
				this.isLWSEnabled = (wifiSecurity.state === 'enabled' && value);
			}
		});
	}

	initializeHistories(wifiHistory: phoenix.WifiDetail[], visibleNum: number) {
		this.histories = this.mappingHistory(wifiHistory);
		this.hasMore = this.histories.length > 4;
		this.hideHistories(this.histories, visibleNum);
		this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, visibleNum);
	}

	mappingHistory(histories: phoenix.WifiDetail[]): WifiHistoryDetail[] {
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
				i.info = i.info.replace(/T/g, ' ');
			}
			Histories.push(i);
		});
		return Histories;
	}

	hideHistories(histories: WifiHistoryDetail[], visibleNum: number) {
		histories.forEach((item, index) => {
			item.visible = index < visibleNum;
		})
	}
}
