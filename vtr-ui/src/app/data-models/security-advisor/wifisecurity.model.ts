import * as phoenix from '@lenovo/tan-client-bridge';
import { EventTypes, WifiSecurity, HomeProtection, DeviceInfo } from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from '../../enums/local-storage-key.enum';
import { TranslateService } from '@ngx-translate/core';
import { CommsService } from 'src/app/services/comms/comms.service';
import { SessionStorageKey } from 'src/app/enums/session-storage-key-enum';


interface DevicePostureDetail {
	status: number; // 1,2
	title: string; // name
	detail: string; // faied,passed
	path: string;
	type: string;
}

export class WifiHomeViewModel {
	wifiSecurity: WifiSecurity;
	homeProtection: HomeProtection;
	isLWSEnabled: boolean;
	hasWSEverUsed: boolean;
	allHistorys: Array<phoenix.WifiDetail>;
	hasMore: boolean;
	historys: Array<phoenix.WifiDetail>;
	tryNowUrl: string;
	homeStatus: string;
	tryNowEnable = false;

	constructor(wifiSecurity: phoenix.WifiSecurity, homeProtection: phoenix.HomeProtection, private commonService: CommonService) {
		// commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, 'enabled');
		const cacheWifiSecurityState = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState);
		const cacheWifiSecurityHistory = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys);
		const cacheWifiSecurityChsConsoleUrl = commonService.getLocalStorageValue(LocalStorageKey.SecurityHomeProtectionChsConsoleUrl);
		const cacheWifiSecurityHasEverUsed = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHasEverUsed);
		const cacheHomeStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityHomeProtectionStatus);
		wifiSecurity.on(EventTypes.wsStateEvent, (value) => {
			if (value) {
				if (this.wifiSecurity.isLocationServiceOn !== undefined) {
					this.isLWSEnabled = (value === 'enabled' && this.wifiSecurity.isLocationServiceOn);
					commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, value);
				}
			}
		});
		wifiSecurity.on(EventTypes.wsIsLocationServiceOnEvent, (value) => {
			if (value !== undefined) {
				if (this.wifiSecurity.state) {
					this.isLWSEnabled = (value && this.wifiSecurity.state === 'enabled');
				}
			}
		});
		wifiSecurity.on(EventTypes.geolocatorPermissionEvent, (value) => {
			if (value !== undefined) {
				if (this.wifiSecurity.state) {
					this.isLWSEnabled = (this.wifiSecurity.state === 'enabled' && value);
				}
			}
		});
		wifiSecurity.on(EventTypes.wsHasEverUsed, (value) => {
			if (value !== undefined) {
				commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHasEverUsed, value);
				this.hasWSEverUsed = value;
			}
		});
		wifiSecurity.on(EventTypes.wsWifiHistoryEvent, (value) => {
			if (value) {
				let cacheWifiSecurityHistoryNum = commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum);
				commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys, value);
				this.allHistorys = wifiSecurity.wifiHistory;
				this.allHistorys = this.mappingHistory(this.allHistorys);
				if (cacheWifiSecurityHistoryNum) {
					cacheWifiSecurityHistoryNum = JSON.parse(cacheWifiSecurityHistoryNum);
					if (this.allHistorys.length > 4) {
						this.hasMore = true;
					} else {
						this.hasMore = false;
					}
					this.historys = wifiSecurity.wifiHistory.slice(0, cacheWifiSecurityHistoryNum);
				} else {
					if (this.allHistorys.length > 4) {
						this.hasMore = true;
					} else {
						this.hasMore = false;
					}
					this.historys = wifiSecurity.wifiHistory.slice(0, 4); // 显示4个history
					commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, 4);
				}
				this.historys = this.mappingHistory(this.historys);
			}
		});
		homeProtection.on(EventTypes.homeChsConsoleUrlEvent, (value) => {
			if (value && value !== '') {
				commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionChsConsoleUrl, value);
				this.tryNowUrl = value;
				this.tryNowEnable = true;
			}
		});
		homeProtection.on(EventTypes.homeStatusEvent, (value) => {
			if (value) {
				commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionStatus, value);
				this.homeStatus = value;
			}
		});
		try {
			this.wifiSecurity = wifiSecurity;
			if (wifiSecurity.state) {
				if (wifiSecurity.isLocationServiceOn !== undefined) {
					this.isLWSEnabled = (wifiSecurity.state === 'enabled' && wifiSecurity.isLocationServiceOn);
				}
				commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, wifiSecurity.state);
			} else if (cacheWifiSecurityState) {
				if (wifiSecurity.isLocationServiceOn !== undefined) {
					this.isLWSEnabled = (cacheWifiSecurityState === 'enabled' && wifiSecurity.isLocationServiceOn);
				}
			}
			if (wifiSecurity.hasEverUsed !== undefined) {
				this.hasWSEverUsed = wifiSecurity.hasEverUsed;
				commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHasEverUsed, wifiSecurity.hasEverUsed);
			} else if (cacheWifiSecurityHasEverUsed !== undefined) {
				this.hasWSEverUsed = cacheWifiSecurityHasEverUsed;
			}
			if (wifiSecurity.wifiHistory) {
				commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys, wifiSecurity.wifiHistory);
				this.allHistorys = wifiSecurity.wifiHistory;
				this.allHistorys = this.mappingHistory(this.allHistorys);
					if (this.allHistorys.length > 4) {
						this.hasMore = true;
					} else {
						this.hasMore = false;
					}
					this.historys = wifiSecurity.wifiHistory.slice(0, 4); // 显示4个history
					commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, 4);
				this.historys = this.mappingHistory(this.historys);
			} else if (cacheWifiSecurityHistory) {
				this.allHistorys = cacheWifiSecurityHistory;
				this.allHistorys = this.mappingHistory(this.allHistorys);
					if (this.allHistorys.length > 4) {
						this.hasMore = true;
					} else {
						this.hasMore = false;
					}
					this.historys = cacheWifiSecurityHistory.slice(0, 4); // 显示4个history
					commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityShowHistoryNum, 4);
				this.historys = this.mappingHistory(this.historys);
			}
			if (homeProtection.chsConsoleUrl && homeProtection.chsConsoleUrl !== '') {
				this.tryNowEnable = true;
				this.tryNowUrl = homeProtection.chsConsoleUrl;
				commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionChsConsoleUrl, homeProtection.chsConsoleUrl);
			} else if (cacheWifiSecurityChsConsoleUrl && cacheWifiSecurityChsConsoleUrl !== '') {
				this.tryNowEnable = true;
				this.tryNowUrl = cacheWifiSecurityChsConsoleUrl;
			}
			if (homeProtection.status) {
				this.homeStatus = homeProtection.status;
				commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionStatus, homeProtection.status);
			} else if (cacheHomeStatus) {
				this.homeStatus = cacheHomeStatus;
			}
		} catch (err) {
			console.log(`${err}`);
		}
	}

	mappingHistory(historys: Array<phoenix.WifiDetail>): Array<phoenix.WifiDetail> {
		const Historys = [];
		historys.forEach((item) => {
			let i = {
				ssid: '',
				info: '',
				good: null
			};
			i = item;
			if (i.info.indexOf('Connected') === -1) {
				const info = i.info.replace(/T/g, ' ');
				// const connect = 'security.wifisecurity.container.connect';
				// const information = connect + info;
				i.info = info;
			}
			Historys.push(i);
		});
		return Historys;
	}
}

export class SecurityHealthViewModel {
	isLWSEnabled: boolean;
	homeDevicePosture: Array<DevicePostureDetail> = [];

	constructor(wifiSecurity: phoenix.WifiSecurity, homeProtection: phoenix.HomeProtection, private commonService: CommonService, public translate: TranslateService) {
		const cacheWifiSecurityState = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState);
		const cacheHomeDevicePosture = commonService.getLocalStorageValue(LocalStorageKey.SecurityHomeProtectionDevicePosture);
		try {
			if (wifiSecurity.state) {
				if (wifiSecurity.isLocationServiceOn !== undefined) {
					this.isLWSEnabled = (wifiSecurity.state === 'enabled' && wifiSecurity.isLocationServiceOn);
					commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, wifiSecurity.state);
				}
			} else if (cacheWifiSecurityState) {
				if (wifiSecurity.isLocationServiceOn !== undefined) {
					this.isLWSEnabled = (cacheWifiSecurityState === 'enabled' && wifiSecurity.isLocationServiceOn);
				}
				// this.isLWSEnabled = (cacheWifiSecurityState === 'enabled' && wifiSecurity.isLocationServiceOn);
			}
			if (homeProtection.devicePosture) {
				commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionDevicePosture, homeProtection.devicePosture);
				this.createHomeDevicePosture(homeProtection.devicePosture);
			} else if (cacheHomeDevicePosture) {
				this.createHomeDevicePosture(cacheHomeDevicePosture);
			}
		} catch (err) {
			console.log(`${err}`);
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
			if (value !== undefined) {
				if (wifiSecurity.state) {
					this.isLWSEnabled = (value && wifiSecurity.state === 'enabled');
				}
			}
		});
		wifiSecurity.on(EventTypes.geolocatorPermissionEvent, (value) => {
			if (value !== undefined) {
				if (wifiSecurity.state) {
					this.isLWSEnabled = (wifiSecurity.state === 'enabled' && value);
				}
			}
		});
		homeProtection.on(EventTypes.homeDevicePostureEvent, (value) => {
			if (value) {
				commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionDevicePosture, value);
				this.createHomeDevicePosture(value);
			}
		});
	}

	createHomeDevicePosture(devicePosture: Array<DeviceInfo>) {
		this.homeDevicePosture = [];
		devicePosture.forEach((item) => {
			const it: DevicePostureDetail = {
				status: 0,
				title: '',
				detail: '',
				path: 'security/wifi-security',
				type: 'security'
			};
			it.status = item.vulnerable === 'true' ? 1 : 2;
			it.title = this.mappingDevicePosture(item.config);
			it.detail = item.vulnerable === 'true' ? 'security.homeprotection.securityhealth.fail' : 'security.homeprotection.securityhealth.pass';
			this.translate.get(it.detail).subscribe((res) => {
				it.detail = res;
			});
			if (it.title !== 'other') {
				this.homeDevicePosture.push(it);
			}
		});
	}

	mappingDevicePosture(config: string): string {
		let titles: Array<string>;
		let title: string;
		titles = [
			'security.homeprotection.securityhealth.deviceName1',
			'security.homeprotection.securityhealth.deviceName2',
			'security.homeprotection.securityhealth.deviceName3',
			'security.homeprotection.securityhealth.deviceName4',
			'security.homeprotection.securityhealth.deviceName5',
			'security.homeprotection.securityhealth.deviceName6',
			'security.homeprotection.securityhealth.deviceName7',
			'security.homeprotection.securityhealth.deviceName8',
			'security.homeprotection.securityhealth.deviceName9',
			'security.homeprotection.securityhealth.deviceName10'
		];
		config = config.toLowerCase();
		if (config.indexOf('apps') !== -1) {
			title = titles[0];
		} else if (config.indexOf('developer') !== -1) {
			title = titles[1];
		} else if (config.indexOf('uac') !== -1) {
			title = titles[2];
		} else if (config.indexOf('antivirus') !== -1) {
			title = titles[3];
		} else if (config.indexOf('drive') !== -1) {
			title = titles[4];
		} else if (config.indexOf('firewall') !== -1) {
			title = titles[5];
		} else if (config.indexOf('windows') !== -1) {
			title = titles[6];
		} else if (config.indexOf('security') !== -1) {
			title = titles[7];
		} else if ((config.indexOf('pin') !== -1) || (config.indexOf('password') !== -1)) {
			title = titles[8];
		} else if ((config.indexOf('automatic') !== -1)) {
			title = titles[9];
		} else {
			title = 'other';
		}
		this.translate.get(title).subscribe((res) => {
			title = res;
		});
		return title;
	}
}
