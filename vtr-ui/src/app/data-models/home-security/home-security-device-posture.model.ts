import { WifiSecurity, DevicePosture, DeviceCondition} from '@lenovo/tan-client-bridge';
import { TranslateService } from '@ngx-translate/core';

interface DevicePostureDetail {
	status: number; // 1,2
	title: string; // name
	detail: string; // faied,passed
	path: string;
	type: string;
}

export class HomeSecurityDevicePosture {
	isLocationServiceOn = false;
	homeDevicePosture: DevicePostureDetail[] = [];

	constructor(wifiSecurity?: WifiSecurity, devicePosture?: DevicePosture, public translate?: TranslateService) {
		if (wifiSecurity && wifiSecurity.isLocationServiceOn) {
			this.isLocationServiceOn = true;
		}
		if (devicePosture && devicePosture.value.length > 0) {
			this.createHomeDevicePosture(devicePosture.value);
		}
	}

	createHomeDevicePosture(devicePosture: DeviceCondition[]) {
		let devicePostures = [];
		devicePosture.forEach((item) => {
			const it: DevicePostureDetail = {
				status: 0,
				title: '',
				detail: '',
				path: 'home-security',
				type: 'security'
			};
			it.status = item.vulnerable === true ? 1 : 6;
			it.detail = item.vulnerable === true ? 'security.homeprotection.securityhealth.fail' : 'security.homeprotection.securityhealth.pass';
			this.translate.stream(it.detail).subscribe((res) => {
				it.detail = res;
			});
			this.mappingDevicePosture(it, item.name);
			if (it.title !== 'other') {
				devicePostures.push(it);
			}
		});
		this.homeDevicePosture = devicePostures;
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
