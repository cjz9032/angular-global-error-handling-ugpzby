import * as phoenix from '@lenovo/tan-client-bridge';
import { EventTypes, WifiSecurity, HomeProtection, DeviceInfo } from '@lenovo/tan-client-bridge';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalStorageKey } from '../../enums/local-storage-key.enum';


interface DevicePostureDetail {
	status: number; // 1,2
	title: string; // name
	detail: string; // faied,passed
	path: string;
}

export class WifiHomeViewModel {
	wifiSecurity: WifiSecurity;
	homeProtection: HomeProtection;
	isLWSEnabled: boolean;
	allHistorys: Array<phoenix.WifiDetail>;
	historys: Array<phoenix.WifiDetail>;
	tryNowUrl: string;

	constructor(wifiSecurity: phoenix.WifiSecurity, homeProtection: phoenix.HomeProtection, private commonService: CommonService) {
		const cacheWifiSecurityState = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState);
		const cacheWifiSecurityHistory = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys);
		const cacheWifiSecurityChsConsoleUrl = commonService.getLocalStorageValue(LocalStorageKey.SecurityHomeProtectionChsConsoleUrl);
		try {
			this.wifiSecurity = wifiSecurity;
			if (wifiSecurity.state) {
				this.isLWSEnabled = (wifiSecurity.state === 'enabled');
				commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, wifiSecurity.state);
			} else if (cacheWifiSecurityState) {
				this.isLWSEnabled = (cacheWifiSecurityState === 'enabled');
			}
			if (wifiSecurity.wifiHistory) {
				this.allHistorys = wifiSecurity.wifiHistory;
				this.allHistorys = this.mappingHistory(this.allHistorys);
				this.historys = wifiSecurity.wifiHistory.slice(0, 4); // 显示4个history
				this.historys = this.mappingHistory(this.historys);
				commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys, wifiSecurity.wifiHistory);
			} else if (cacheWifiSecurityHistory) {
				this.allHistorys = cacheWifiSecurityHistory;
				this.allHistorys = this.mappingHistory(this.allHistorys);
				this.historys = cacheWifiSecurityHistory.slice(0, 4); // 显示4个history
				this.historys = this.mappingHistory(this.historys);
			}
			if (homeProtection.chsConsoleUrl) {
				this.tryNowUrl = homeProtection.chsConsoleUrl;
				commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionChsConsoleUrl, homeProtection.chsConsoleUrl);
			} else if (cacheWifiSecurityChsConsoleUrl) {
				this.tryNowUrl = cacheWifiSecurityChsConsoleUrl;
			}
		} catch (err) {
			console.log(`${err}`);
		}
		wifiSecurity.on(EventTypes.wsStateEvent, (value) => {
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, value);
			this.isLWSEnabled = (value === 'enabled');
		});
		wifiSecurity.on(EventTypes.wsWifiHistoryEvent, (value) => {
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityHistorys, value);
			this.allHistorys = wifiSecurity.wifiHistory;
			this.allHistorys = this.mappingHistory(this.allHistorys);
			this.historys = wifiSecurity.wifiHistory.slice(0, 4); // 显示4个history
			this.historys = this.mappingHistory(this.historys);
		});
		homeProtection.on(EventTypes.homeChsConsoleUrlEvent, (value) => {
			commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionChsConsoleUrl, value);
			this.tryNowUrl = value;
		});
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
				const information = 'Connected last' + info;
				i.info = information;
			}
			Historys.push(i);
		});
		return Historys;
	}
}

export class SecurityHealthViewModel {
	isLWSEnabled: boolean;
	homeDevicePosture: Array<DevicePostureDetail> = [];

	constructor(wifiSecurity: phoenix.WifiSecurity, homeProtection: phoenix.HomeProtection, private commonService: CommonService) {
		const cacheWifiSecurityState = commonService.getLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState);
		const cacheHomeDevicePosture = commonService.getLocalStorageValue(LocalStorageKey.SecurityHomeProtectionDevicePosture);
		try {
			if (wifiSecurity.state) {
				this.isLWSEnabled = (wifiSecurity.state === 'enabled');
				commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, wifiSecurity.state);
			} else if (cacheWifiSecurityState) {
				this.isLWSEnabled = (cacheWifiSecurityState === 'enabled');
			}
			if (homeProtection.devicePosture) {
				commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionDevicePosture, homeProtection);
				this.creatHomeDevicePosture(homeProtection.devicePosture);
			} else if (cacheHomeDevicePosture) {
				this.creatHomeDevicePosture(cacheHomeDevicePosture);
			}
		} catch (err) {
			console.log(`${err}`);
		}
		wifiSecurity.on(EventTypes.wsStateEvent, (value) => {
			commonService.setLocalStorageValue(LocalStorageKey.SecurityWifiSecurityState, value);
			this.isLWSEnabled = (value === 'enabled');
		});
		homeProtection.on(EventTypes.homeDevicePostureEvent, (value) => {
			commonService.setLocalStorageValue(LocalStorageKey.SecurityHomeProtectionDevicePosture, value);
			this.creatHomeDevicePosture(value);
		});
	}

	creatHomeDevicePosture(devicePosture: Array<DeviceInfo>) {
		this.homeDevicePosture = [];
		devicePosture.forEach((item) => {
			const it: DevicePostureDetail = {
				status: 0,
				title: '',
				detail: '',
				path: 'security/wifi-security'
			};
			it.status = item.vulnerable === 'true' ? 2 : 1;
			it.title = this.mappingDevicePosture(item.config);
			it.detail = item.vulnerable === 'true' ? 'PASSED' : 'FAILED';
			this.homeDevicePosture.push(it);
		});
	}

	mappingDevicePosture(config: string): string {
		let titles: Array<string>;
		let title: string;
		titles = ['Apps from unknown sources', 'Developer mode', 'UAC Notification', 'Anti-Virus availability', 'Drive encryption',
			'Firewall availability', 'Not Activated Windows', 'Security Updates Availability', 'Pin or Password', 'AutomaticUpdatesServiceAvailability'];
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
		return title;
	}
}
