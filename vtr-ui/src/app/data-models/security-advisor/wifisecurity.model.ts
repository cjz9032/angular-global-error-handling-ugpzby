import * as phoenix from '@lenovo/tan-client-bridge';
import { EventTypes, WifiSecurity, HomeProtection, DeviceInfo } from '@lenovo/tan-client-bridge';
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
	detail: string; // faied,passed
	path: string;
	type: string;
}

export class WifiHomeViewModel {
	wifiSecurity: WifiSecurity;
	homeProtection: HomeProtection;
	isLWSEnabled: boolean;
	allHistorys: Array<phoenix.WifiDetail>;
	hasMore: boolean;
	historys: Array<phoenix.WifiDetail>;
	tryNowUrl: string;
	homeStatus: string;
	tryNowEnable = false;

	constructor(
		wifiSecurity: phoenix.WifiSecurity,
		homeProtection: phoenix.HomeProtection,
		private commonService: CommonService,
		private ngZone: NgZone,
		private dialogService: DialogService
		) {
		const cacheWifiSecurityState = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState);
		const cacheWifiSecurityHistory = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys);
		const cacheWifiSecurityChsConsoleUrl = commonService.getLocalStorageValue(LocalStorageKey.SecurityHomeProtectionChsConsoleUrl);
		const cacheHomeStatus = commonService.getLocalStorageValue(LocalStorageKey.SecurityHomeProtectionStatus);
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
					if (!value && this.wifiSecurity.state === 'enabled') {
						this.dialogService.wifiSecurityLocationDialog(this.wifiSecurity);
					} else if (value) {
						if (this.commonService.getSessionStorageValue(SessionStorageKey.SecurityWifiSecurityLocationFlag) === 'yes') {
							this.commonService.setSessionStorageValue(SessionStorageKey.SecurityWifiSecurityLocationFlag, 'no');
							this.wifiSecurity.enableWifiSecurity().then((res) => {
								if (res === true) {
									this.isLWSEnabled = true;
								} else {
									this.isLWSEnabled = false;
								}
							}, (error) => {
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
		if (homeProtection && homeProtection.chsConsoleUrl && homeProtection.chsConsoleUrl !== '') {
			this.tryNowEnable = true;
			this.tryNowUrl = homeProtection.chsConsoleUrl;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionChsConsoleUrl, homeProtection.chsConsoleUrl);
		} else if (cacheWifiSecurityChsConsoleUrl && cacheWifiSecurityChsConsoleUrl !== '') {
			this.tryNowEnable = true;
			this.tryNowUrl = cacheWifiSecurityChsConsoleUrl;
		}
		if (homeProtection && homeProtection.status) {
			this.homeStatus = homeProtection.status;
			commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionStatus, homeProtection.status);
		} else if (cacheHomeStatus) {
			this.homeStatus = cacheHomeStatus;
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

	constructor(wifiSecurity: phoenix.WifiSecurity, homeProtection: phoenix.HomeProtection, private commonService: CommonService, public translate: TranslateService, private ngZone: NgZone) {
		const cacheWifiSecurityState = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState);
		const cacheHomeDevicePosture = commonService.getLocalStorageValue(LocalStorageKey.SecurityHomeProtectionDevicePosture)
		if (wifiSecurity && wifiSecurity.state) {
			if (wifiSecurity.isLocationServiceOn !== undefined) {
				this.isLWSEnabled = (wifiSecurity.state === 'enabled' && wifiSecurity.isLocationServiceOn);
				commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, wifiSecurity.state);
			}
		} else if (cacheWifiSecurityState) {
			if (wifiSecurity && wifiSecurity.isLocationServiceOn !== undefined) {
				this.isLWSEnabled = (cacheWifiSecurityState === 'enabled' && wifiSecurity.isLocationServiceOn);
			}
			// this.isLWSEnabled = (cacheWifiSecurityState === 'enabled' && wifiSecurity.isLocationServiceOn);
		}
		if (homeProtection && homeProtection.devicePosture) {
			commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionDevicePosture, homeProtection.devicePosture);
			this.createHomeDevicePosture(homeProtection.devicePosture);
		} else if (cacheHomeDevicePosture) {
			this.createHomeDevicePosture(cacheHomeDevicePosture);
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
		homeProtection.on(EventTypes.homeDevicePostureEvent, (value) => {
			this.ngZone.run(() => {
				if (value) {
					commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionDevicePosture, value);
					this.createHomeDevicePosture(value);
				}
			});
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
			it.status = item.vulnerable === 'true' ? 1 : 6;
			it.detail = item.vulnerable === 'true' ? 'security.homeprotection.securityhealth.fail' : 'security.homeprotection.securityhealth.pass';
			this.translate.stream(it.detail).subscribe((res) => {
				it.detail = res;
			});
			this.mappingDevicePosture(it, item.config);
			if (it.title !== 'other') {
				this.homeDevicePosture.push(it);
			}
		});
	}

	mappingDevicePosture(detail: DevicePostureDetail, config: string) {
		const titles = [
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
		let title: string;
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
			detail.title = 'other';
			return;
		}
		this.translate.stream(title).subscribe((res) => {
			detail.title = res;
		});
	}
}
